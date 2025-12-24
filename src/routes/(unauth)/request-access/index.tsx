import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { MultiStepLoader } from '@/components/ui/multi-step-loader'

export const Route = createFileRoute('/(unauth)/request-access/')({
  component: RequestAccessPage,
})

const REQUEST_STEPS = [
  { text: 'Validating information' },
  { text: 'Submitting request' },
  { text: 'Request submitted' },
]

function RequestAccessPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [displayUsername, setDisplayUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (reason.length < 20) {
      setError('Please provide a reason for access (minimum 20 characters)')
      return
    }

    setIsLoading(true)
    setCurrentStep(0)

    try {
      // Step 1: Validating information
      await new Promise((resolve) => setTimeout(resolve, 500))
      setCurrentStep(1)

      // Step 2: Submitting request
      const response = await fetch('/api/access-request/$', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          displayUsername: displayUsername || username,
          name,
          email,
          reason,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      setCurrentStep(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Step 3: Success
      setSuccess(true)

      // Wait a bit before redirecting
      await new Promise((resolve) => setTimeout(resolve, 2000))

      navigate({ to: '/sign-in' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit access request')
      setIsLoading(false)
    }
  }

  return (
    <>
      <MultiStepLoader
        steps={REQUEST_STEPS}
        currentStep={currentStep}
        loading={isLoading}
        success={success}
        error={error}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Request Access</CardTitle>
            <CardDescription>
              Fill out the form below to request access to the system. We'll review your request and send you an email when it's approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  disabled={isLoading}
                  placeholder="johndoe"
                  minLength={3}
                  maxLength={30}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  3-30 characters, letters, numbers, dots, and underscores
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="displayUsername">Display Username (Optional)</FieldLabel>
                <Input
                  id="displayUsername"
                  type="text"
                  value={displayUsername}
                  onChange={(e) => setDisplayUsername(e.target.value)}
                  autoComplete="off"
                  disabled={isLoading}
                  placeholder="JohnDoe"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  How your username will be displayed
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  disabled={isLoading}
                  placeholder="John Doe"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  placeholder="john@example.com"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send you a password reset link here when approved
                </p>
              </Field>

              <Field>
                <FieldLabel htmlFor="reason">Reason for Access</FieldLabel>
                <Textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  disabled={isLoading}
                  placeholder="Please explain why you need access to this system..."
                  rows={4}
                  minLength={20}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 20 characters ({reason.length}/20)
                </p>
              </Field>

              {error && !isLoading && (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {success && (
                <div className="rounded-md border border-green-500/20 bg-green-500/10 p-3">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Request submitted successfully! We'll review your request and send you an email when it's approved.
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <a href="/sign-in" className="text-primary hover:underline">
                  Sign in
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
