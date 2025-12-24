import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel } from '@/components/ui/field'
import { Check, X } from 'lucide-react'

interface ApproveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: {
    username: string
    name: string
    email: string
    reason: string
  } | null
  onConfirm: () => void
  isLoading?: boolean
}

export function ApproveDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isLoading = false,
}: ApproveDialogProps) {
  if (!request) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-green-500/10">
            <Check className="h-6 w-6 text-green-600" />
          </AlertDialogMedia>
          <AlertDialogTitle>Approve Access Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve this access request? The user will receive an
            email with a password reset link to set up their account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 bg-muted p-3 rounded-md text-sm">
          <div>
            <span className="font-medium">Name:</span> {request.name}
          </div>
          <div>
            <span className="font-medium">Username:</span> {request.username}
          </div>
          <div>
            <span className="font-medium">Email:</span> {request.email}
          </div>
          <div>
            <span className="font-medium">Reason:</span>
            <p className="mt-1 text-muted-foreground whitespace-pre-wrap">
              {request.reason}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Approving...' : 'Approve & Send Email'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface RejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: {
    username: string
    name: string
    email: string
    reason: string
  } | null
  onConfirm: (notes: string) => void
  isLoading?: boolean
}

export function RejectDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  isLoading = false,
}: RejectDialogProps) {
  const [notes, setNotes] = useState('')

  if (!request) return null

  const handleConfirm = () => {
    onConfirm(notes)
    setNotes('') // Reset notes after confirmation
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-red-500/10">
            <X className="h-6 w-6 text-red-600" />
          </AlertDialogMedia>
          <AlertDialogTitle>Reject Access Request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reject this access request? This action cannot be
            undone, but the request will be kept for audit purposes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-2 bg-muted p-3 rounded-md text-sm">
          <div>
            <span className="font-medium">Name:</span> {request.name}
          </div>
          <div>
            <span className="font-medium">Username:</span> {request.username}
          </div>
          <div>
            <span className="font-medium">Email:</span> {request.email}
          </div>
        </div>

        <Field>
          <FieldLabel htmlFor="rejection-notes">
            Rejection Notes (Optional)
          </FieldLabel>
          <Textarea
            id="rejection-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide a reason for rejection (optional)..."
            rows={3}
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            These notes will be saved for audit purposes
          </p>
        </Field>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Rejecting...' : 'Reject Request'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
