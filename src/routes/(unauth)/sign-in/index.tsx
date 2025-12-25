import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { signIn } from '@/lib/auth-client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { MultiStepLoader } from '@/components/ui/multi-step-loader'

export const Route = createFileRoute('/(unauth)/sign-in/')({
  component: SignInPage,
})

const SIGN_IN_STEPS = [
  { text: 'Verifying credentials' },
  { text: 'Authenticating user' },
  { text: 'Loading session' },
]

function SignInPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [success, setSuccess] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: '/admin' })
    }
  }, [user, authLoading, navigate])

  const handleCloseLoader = () => {
    setError('')
    setIsLoading(false)
    setSuccess(false)
    setCurrentStep(0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)
    setCurrentStep(0)

    try {
      // Step 1: Verifying credentials
      await new Promise((resolve) => setTimeout(resolve, 300))
      setCurrentStep(1)

      // Step 2: Authenticating
      const result = await signIn.username({
        username,
        password,
      })

      // Check if authentication failed
      if (result.error) {
        throw new Error(result.error.message || 'Invalid username or password')
      }

      setCurrentStep(2)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Step 3: Success
      setSuccess(true)

      // Wait a bit before redirecting
      await new Promise((resolve) => setTimeout(resolve, 800))

      navigate({ to: '/admin' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password')
      setIsLoading(false)
      setSuccess(false)
      setCurrentStep(0)
    }
  }

  return (
    <>
      <MultiStepLoader
        steps={SIGN_IN_STEPS}
        currentStep={currentStep}
        loading={isLoading}
        success={success}
        error={error}
        onClose={handleCloseLoader}
        successMessage="Sign in successful! Redirecting..."
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your username and password to access your account
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
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
            </Field>

            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Need access?{' '}
              <a href="/sign-up" className="text-primary hover:underline">
                Sign up
              </a>
              <span className="mx-2 text-muted-foreground/50">|</span>
              <a href="/request-access" className="text-primary hover:underline">
                Request access
              </a>
              <span className="mx-2 text-muted-foreground/50">|</span>
              <a href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  )
}
