import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Check, X, ChevronDown, ChevronUp, Filter } from 'lucide-react'

export interface AccessRequest {
  id: string
  username: string
  displayUsername: string | null
  name: string
  email: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: Date
  reviewedAt: Date | null
  reviewedBy: string | null
  reviewerNotes: string | null
}

interface AccessRequestTableProps {
  requests: AccessRequest[]
  onApprove: (id: string) => void
  onReject: (id: string, notes?: string) => void
  isLoading?: boolean
}

export function AccessRequestTable({
  requests,
  onApprove,
  onReject,
  isLoading = false,
}: AccessRequestTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true
    return req.status === filter
  })

  const pendingCount = requests.filter((r) => r.status === 'pending').length
  const approvedCount = requests.filter((r) => r.status === 'approved').length
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'pending'
      case 'approved':
        return 'approved'
      case 'rejected':
        return 'rejected'
      default:
        return 'default'
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          All ({requests.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'pending'
              ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'approved'
              ? 'bg-green-500/10 text-green-700 dark:text-green-400'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Approved ({approvedCount})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            filter === 'rejected'
              ? 'bg-red-500/10 text-red-700 dark:text-red-400'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Rejected ({rejectedCount})
        </button>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card className="p-8 text-center">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="mt-4 text-sm text-muted-foreground">
            No {filter !== 'all' ? filter : ''} requests found
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredRequests.map((request) => {
            const isExpanded = expandedId === request.id
            const isPending = request.status === 'pending'

            return (
              <Card
                key={request.id}
                className={`p-4 transition-all ${
                  isPending ? 'border-yellow-500/20 bg-yellow-500/5' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm truncate">
                        {request.name}
                      </h3>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="text-muted-foreground">
                        <span className="font-medium">Username:</span> {request.username}
                      </div>
                      <div className="text-muted-foreground">
                        <span className="font-medium">Email:</span>{' '}
                        <a
                          href={`mailto:${request.email}`}
                          className="text-primary hover:underline"
                        >
                          {request.email}
                        </a>
                      </div>
                      <div className="text-muted-foreground col-span-2">
                        <span className="font-medium">Requested:</span>{' '}
                        {formatDate(request.requestedAt)}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-3 border-t pt-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            REASON FOR ACCESS
                          </p>
                          <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                            {request.reason}
                          </p>
                        </div>

                        {request.reviewedAt && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              REVIEWED
                            </p>
                            <p className="text-sm">{formatDate(request.reviewedAt)}</p>
                          </div>
                        )}

                        {request.reviewerNotes && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              REVIEWER NOTES
                            </p>
                            <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                              {request.reviewerNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onApprove(request.id)}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(request.id)}
                          disabled={isLoading}
                          className="border-red-500/20 text-red-600 hover:bg-red-500/10"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setExpandedId(isExpanded ? null : request.id)}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
