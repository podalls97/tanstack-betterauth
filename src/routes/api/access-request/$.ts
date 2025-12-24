import { createFileRoute } from '@tanstack/react-router'
import { db } from '@/lib/db'
import { accessRequest } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sendAccessRequestNotification } from '@/lib/email'

export const Route = createFileRoute('/api/access-request/$')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const body = await request.json()
          const { username, displayUsername, name, email, reason } = body

          // Validation
          if (!username || !name || !email || !reason) {
            return new Response(
              JSON.stringify({ error: 'Missing required fields' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Username validation (3-30 chars, alphanumeric, dots, underscores)
          if (username.length < 3 || username.length > 30) {
            return new Response(
              JSON.stringify({ error: 'Username must be between 3 and 30 characters' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            return new Response(
              JSON.stringify({ error: 'Username can only contain letters, numbers, dots, and underscores' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(email)) {
            return new Response(
              JSON.stringify({ error: 'Invalid email address' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Reason validation (min 20 chars)
          if (reason.length < 20) {
            return new Response(
              JSON.stringify({ error: 'Reason must be at least 20 characters' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Check if username already requested
          const existing = await db
            .select()
            .from(accessRequest)
            .where(eq(accessRequest.username, username.toLowerCase()))
            .limit(1)

          if (existing.length > 0) {
            return new Response(
              JSON.stringify({ error: 'An access request with this username already exists' }),
              { status: 409, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Check if email already requested
          const existingEmail = await db
            .select()
            .from(accessRequest)
            .where(eq(accessRequest.email, email.toLowerCase()))
            .limit(1)

          if (existingEmail.length > 0) {
            return new Response(
              JSON.stringify({ error: 'An access request with this email already exists' }),
              { status: 409, headers: { 'Content-Type': 'application/json' } },
            )
          }

          // Create access request
          const id = crypto.randomUUID()
          await db.insert(accessRequest).values({
            id,
            username: username.toLowerCase(),
            displayUsername: displayUsername || username,
            name,
            email: email.toLowerCase(),
            reason,
            status: 'pending',
          })

          // Send notification to admin (non-blocking)
          sendAccessRequestNotification({
            requestorName: name,
            requestorEmail: email.toLowerCase(),
            requestorUsername: username,
            reason,
          }).catch((error) => {
            console.error('Failed to send admin notification:', error)
            // Don't fail the request if notification fails
          })

          return new Response(
            JSON.stringify({
              success: true,
              message: 'Access request submitted successfully'
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } },
          )
        } catch (error) {
          console.error('Access request error:', error)
          return new Response(
            JSON.stringify({ error: 'Failed to submit access request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          )
        }
      },
    },
  },
})
