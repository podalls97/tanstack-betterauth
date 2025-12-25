import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { resetPassword } from '@/lib/auth-client'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldLabel } from '@/components/ui/field'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export const Route = createFileRoute('/(unauth)/reset-password/')({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>): { token?: string } => {
    return {
      token: search.token as string,
    }
  },
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()
  const search = useSearch({ from: '/(unauth)/reset-password/' })
  const token = search.token || '' 
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: '/admin' })
    }
  }, [user, authLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (!token) {
        setError('Missing reset token. Please request a new link.')
        setIsLoading(false)
        return
    }

    try {
      const { error } = await resetPassword({
        newPassword: password,
        token: token,
      })

      if (error) {
        throw new Error(error.message)
      }

      setSuccess(true)
      
      // Redirect after short delay
      setTimeout(() => {
        navigate({ to: '/sign-in' })
      }, 3000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Password Reset Successful</CardTitle>
              <CardDescription>
                Your password has been updated. Redirecting to sign in...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 rounded-lg border border-green-500/50 bg-green-500/10 p-4 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <div className="space-y-1">
                  <h5 className="font-medium leading-none tracking-tight">Success</h5>
                  <div className="opacity-90">
                    You can now log in with your new password.
                  </div>
                </div>
              </div>
              <Button asChild className="w-full mt-4">
                <Link to="/sign-in">Sign In Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
                <FieldLabel htmlFor="password">New Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
            </Field>

            <Field>
                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
            </Field>

            {error && (
               <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                   <AlertCircle className="h-4 w-4" />
                   <span>{error}</span>
               </div>
            )}

            {!token && (
               <div className="mb-4 flex items-center gap-2 rounded-md bg-yellow-500/15 p-3 text-sm text-yellow-600 dark:text-yellow-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>This password reset link appears to be invalid or missing a token.</span>
               </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading || !token}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
