import { createAuthClient } from 'better-auth/react'
import { usernameClient } from 'better-auth/client/plugins'

const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  plugins: [usernameClient()],
})

export { authClient }

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  requestPasswordReset: forgetPassword,
  resetPassword,
} = authClient
