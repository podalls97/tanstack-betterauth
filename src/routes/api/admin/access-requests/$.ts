import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { accessRequest, user, account } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { authClient } from '@/lib/auth-client'
import { sendRejectionEmail } from '@/lib/email'

export const Route = createFileRoute('/api/admin/access-requests/$')({
  server: {
    handlers: {
      // Get all access requests
      GET: async ({ request }: { request: Request }) => {
        try {
          // Check admin auth
          const session = await authClient.getSession({ fetchOptions: { headers: request.headers } })

          if (!session?.data?.user) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Get user role
          const currentUser = await db
            .select()
            .from(user)
            .where(eq(user.id, session.data.user.id))
            .limit(1)

          if (!currentUser[0] || currentUser[0].role !== 'admin') {
            return new Response(
              JSON.stringify({ error: 'Forbidden: Admin access required' }),
              { status: 403, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Get all access requests, sorted by status (pending first) then by date
          const requests = await db
            .select()
            .from(accessRequest)
            .orderBy(
              desc(accessRequest.status), // pending > rejected > approved alphabetically
              desc(accessRequest.requestedAt)
            )

          // Sort manually to ensure pending comes first
          const sortedRequests = requests.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1
            if (a.status !== 'pending' && b.status === 'pending') return 1
            return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
          })

          return new Response(
            JSON.stringify({ requests: sortedRequests }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          )
        } catch (error) {
          console.error('Get access requests error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to fetch access requests' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },

      // Approve or reject request
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json()
          const { id, action, reviewerNotes } = body

          if (!id || !action) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          if (action !== 'approve' && action !== 'reject') {
            return new Response(
              JSON.stringify({ error: 'Invalid action' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Check admin auth
          const session = await authClient.getSession({ fetchOptions: { headers: request.headers } })

          if (!session?.data?.user) {
            return new Response(
              JSON.stringify({ error: 'Unauthorized' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Get user role
          const currentUser = await db
            .select()
            .from(user)
            .where(eq(user.id, session.data.user.id))
            .limit(1)

          if (!currentUser[0] || currentUser[0].role !== 'admin') {
            return new Response(
              JSON.stringify({ error: 'Forbidden: Admin access required' }),
              { status: 403, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Get the access request
          const requestData = await db
            .select()
            .from(accessRequest)
            .where(eq(accessRequest.id, id))
            .limit(1)

          if (!requestData[0]) {
            return new Response(
              JSON.stringify({ error: 'Access request not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } },
            )
          }

          if (requestData[0].status !== 'pending') {
            return new Response(
              JSON.stringify({ error: 'This request has already been reviewed' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          if (action === 'approve') {
            // Create user account
            const userId = crypto.randomUUID()
            await db.insert(user).values({
              id: userId,
              username: requestData[0].username,
              displayUsername: requestData[0].displayUsername,
              name: requestData[0].name,
              email: requestData[0].email,
              emailVerified: false,
              role: 'user',
            })

            // Create a placeholder account entry (user will set password via reset link)
            const accountId = crypto.randomUUID()
            await db.insert(account).values({
              id: accountId,
              accountId: requestData[0].email,
              providerId: 'credential',
              userId: userId,
            })

            // Update request status
            await db
              .update(accessRequest)
              .set({
                status: 'approved',
                reviewedAt: new Date(),
                reviewedBy: session.data.user.id,
                reviewerNotes: reviewerNotes || null,
                updatedAt: new Date(),
              })
              .where(eq(accessRequest.id, id))

            // Trigger password reset flow via Better Auth
            try {
              // Call Better Auth's forget-password endpoint internally
              const result = await auth.api.requestPasswordReset({
                body: {
                  email: requestData[0].email,
                  redirectTo: '/reset-password',
                },
              })

              if (!result?.status) {
                 throw new Error(`Failed to trigger password reset: ${result?.message || 'Unknown error'}`)
              }

              console.log('Password reset email triggered successfully:', result.message)

            } catch (emailError) {
              console.error('Failed to send password reset email:', emailError)
              // Don't fail the approval if email fails - log it and continue
            }

            return new Response(
              JSON.stringify({
                success: true,
                message: 'Access request approved, user created, and password reset email sent',
                email: requestData[0].email
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            )
          } else {
            // Reject request
            await db
              .update(accessRequest)
              .set({
                status: 'rejected',
                reviewedAt: new Date(),
                reviewedBy: session.data.user.id,
                reviewerNotes: reviewerNotes || null,
                updatedAt: new Date(),
              })
              .where(eq(accessRequest.id, id))

            // Send rejection notification email
            try {
              await sendRejectionEmail({
                to: requestData[0].email,
                name: requestData[0].name,
                username: requestData[0].username,
                reviewerNotes: reviewerNotes,
              })
            } catch (emailError) {
              console.error('Failed to send rejection email:', emailError)
              // Don't fail the rejection if email fails - log it and continue
            }

            return new Response(
              JSON.stringify({
                success: true,
                message: 'Access request rejected and notification email sent',
                email: requestData[0].email
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } },
            )
          }
        } catch (error) {
          console.error('Review access request error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to review access request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
