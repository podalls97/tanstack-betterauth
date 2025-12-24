import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccessRequestTable, type AccessRequest } from '@/components/access-request-table'
import { ApproveDialog, RejectDialog } from '@/components/access-request-dialogs'

export const Route = createFileRoute('/(demo)/admin-demo/')({
  component: AdminDemoPage,
})

// Mock data
const MOCK_REQUESTS: AccessRequest[] = [
  {
    id: '1',
    username: 'demo_user',
    displayUsername: 'demo_user',
    name: 'Demo User',
    email: 'demo@example.com',
    reason: 'To test the demo system',
    status: 'pending',
    requestedAt: new Date(),
    reviewedAt: null,
    reviewedBy: null,
    reviewerNotes: null
  },
  {
    id: '2',
    username: 'another_user',
    displayUsername: 'another_user',
    name: 'Another User',
    email: 'another@example.com',
    reason: 'Need access for project X',
    status: 'pending',
    requestedAt: new Date(Date.now() - 86400000),
    reviewedAt: null,
    reviewedBy: null,
    reviewerNotes: null
  }
]

function AdminDemoPage() {
  const navigate = useNavigate()
  const [requests, setRequests] = useState<AccessRequest[]>(MOCK_REQUESTS)
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const handleSignOut = () => {
    toast.info("This is a demo setup. Please remove the (demo) folder to use real auth.")
    navigate({ to: '/sign-in-demo' })
  }

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
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast.info("This is a demo setup. Please remove the (demo) folder to use real auth.")

    setRequests(requests.filter(r => r.id !== selectedRequest.id))
    setActionLoading(false)
    setApproveDialogOpen(false)
    setSelectedRequest(null)
  }

  const confirmReject = async (notes: string) => {
    if (!selectedRequest) return
    console.log('Rejecting with notes:', notes)
    setActionLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 800))

    toast.info("This is a demo setup. Please remove the (demo) folder to use real auth.")

    setRequests(requests.filter(r => r.id !== selectedRequest.id))
    setActionLoading(false)
    setRejectDialogOpen(false)
    setSelectedRequest(null)
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard (Demo)</CardTitle>
            <CardDescription>
              Welcome back, Demo Admin!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-4" role="alert">
                <p className="font-bold">Demo Mode</p>
                <p>This page is for demonstration purposes only. Functional logic is disabled.</p>
             </div>
            <div>
              <h3 className="text-sm font-medium">Account Details</h3>
              <dl className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div>
                  <dt className="inline font-medium">Username: </dt>
                  <dd className="inline">demo_admin</dd>
                </div>
                <div>
                    <dt className="inline font-medium">Name: </dt>
                    <dd className="inline">Demo Administrator</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Role: </dt>
                  <dd className="inline capitalize">admin</dd>
                </div>
                <div>
                  <dt className="inline font-medium">User ID: </dt>
                  <dd className="inline">demo-123</dd>
                </div>
              </dl>
            </div>

            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* Access Requests Section - Only for Admins */}
          <Card>
            <CardHeader>
              <CardTitle>Access Requests</CardTitle>
              <CardDescription>
                Review and manage user access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
                <AccessRequestTable
                  requests={requests}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isLoading={actionLoading}
                />
            </CardContent>
          </Card>

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
