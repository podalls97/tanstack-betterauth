import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { MultiStepLoader } from '@/components/ui/multi-step-loader'

export const Route = createFileRoute('/(demo)/sign-in-demo/')({
  component: SignInDemoPage,
})

const SIGN_IN_STEPS = [
  { text: 'Verifying credentials' },
  { text: 'Authenticating user' },
  { text: 'Loading session' },
]

function SignInDemoPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [success, setSuccess] = useState(false)

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

      // Step 2: Authenticating (Mock)
       await new Promise((resolve) => setTimeout(resolve, 300))
      
      setCurrentStep(2)
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Step 3: Success
      setSuccess(true)

      // Wait a bit before redirecting
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Show demo message
      toast.info("This is a demo setup. Please remove the (demo) folder to use real auth.")

      // Redirect to admin-demo
      navigate({ to: '/admin-demo' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid username or password')
      setIsLoading(false)
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
      />

      <div className="flex min-h-screen flex-col items-center justify-center p-4 gap-4">
        <div className="w-full max-w-md">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </Button>
        </div>
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In (Demo)</CardTitle>
          <CardDescription>
            Enter your username and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-200 p-4 mb-4" role="alert">
            <p className="font-bold">Demo Mode</p>
            <p>This page is for demonstration purposes only. Functional logic is disabled.</p>
          </div>
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
              <a href="/sign-up-demo" className="text-primary hover:underline">
                Sign up
              </a>
              <span className="mx-2 text-muted-foreground/50">|</span>
              <a href="/request-access-demo" className="text-primary hover:underline">
                Request access
              </a>
              <span className="mx-2 text-muted-foreground/50">|</span>
              <a href="/forgot-password-demo" className="text-primary hover:underline">
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
