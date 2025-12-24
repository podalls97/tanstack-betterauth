import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/lib/auth-context'
import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccessRequestTable, type AccessRequest } from '@/components/access-request-table'
import { ApproveDialog, RejectDialog } from '@/components/access-request-dialogs'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/(auth)/admin/')({
  component: AdminPage,
})

function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [isLoadingRequests, setIsLoadingRequests] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Client-side protection
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: '/sign-in' })
    }
  }, [user, isLoading, navigate])

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/sign-in'
  }

  const fetchRequests = async () => {
    if (!isAdmin) return

    setIsLoadingRequests(true)
    try {
      const response = await fetch('/api/admin/access-requests/$')
      const data = await response.json()

      if (response.ok) {
        setRequests(data.requests)
      } else {
        console.error('Failed to fetch requests:', data.error)
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
    } finally {
      setIsLoadingRequests(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [isAdmin])

  const handleApprove = (id: string) => {
    const request = requests.find((r) => r.id === id)
    if (request) {
      setSelectedRequest(request)
      setApproveDialogOpen(true)
    }
  }

  const handleReject = (id: string) => {
    const request = requests.find((r) => r.id === id)
    if (request) {
      setSelectedRequest(request)
      setRejectDialogOpen(true)
    }
  }

  const confirmApprove = async () => {
    if (!selectedRequest) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/access-requests/$', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedRequest.id,
          action: 'approve',
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setApproveDialogOpen(false)
        setSelectedRequest(null)
        await fetchRequests() // Refresh the list
      } else {
        alert(`Failed to approve: ${data.error}`)
      }
    } catch (error) {
      console.error('Error approving request:', error)
      alert('Failed to approve request')
    } finally {
      setActionLoading(false)
    }
  }

  const confirmReject = async (notes: string) => {
    if (!selectedRequest) return

    setActionLoading(true)
    try {
      const response = await fetch('/api/admin/access-requests/$', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: selectedRequest.id,
          action: 'reject',
          reviewerNotes: notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setRejectDialogOpen(false)
        setSelectedRequest(null)
        await fetchRequests() // Refresh the list
      } else {
        alert(`Failed to reject: ${data.error}`)
      }
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    } finally {
      setActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  // Cast user to include username field from better-auth username plugin
  const userData = user as typeof user & { username?: string }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              Welcome back, {userData?.name || userData?.username}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">Account Details</h3>
              <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div>
                  <dt className="inline font-medium">Username: </dt>
                  <dd className="inline">{userData?.username}</dd>
                </div>
                {userData?.name && (
                  <div>
                    <dt className="inline font-medium">Name: </dt>
                    <dd className="inline">{userData.name}</dd>
                  </div>
                )}
                <div>
                  <dt className="inline font-medium">Role: </dt>
                  <dd className="inline capitalize">{userData?.role || 'user'}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">User ID: </dt>
                  <dd className="inline">{userData?.id}</dd>
                </div>
              </dl>
            </div>

            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Access Requests Section - Only for Admins */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Access Requests</CardTitle>
              <CardDescription>
                Review and manage user access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Loading requests...</p>
                </div>
              ) : (
                <AccessRequestTable
                  requests={requests}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isLoading={actionLoading}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Dialogs */}
        <ApproveDialog
          open={approveDialogOpen}
          onOpenChange={setApproveDialogOpen}
          request={selectedRequest}
          onConfirm={confirmApprove}
          isLoading={actionLoading}
        />

        <RejectDialog
          open={rejectDialogOpen}
          onOpenChange={setRejectDialogOpen}
          request={selectedRequest}
          onConfirm={confirmReject}
          isLoading={actionLoading}
        />
      </div>
    </div>
  )
}
