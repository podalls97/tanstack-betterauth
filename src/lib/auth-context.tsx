import { createContext, useContext } from 'react'
import { useSession } from './auth-client'
import type { Session, User } from 'better-auth/types'

// Extend User type to include role
interface UserWithRole extends User {
  role?: 'user' | 'admin'
}

interface AuthContextType {
  session: Session | null
  user: UserWithRole | null
  role: 'user' | 'admin' | null
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()

  const user = session?.user as UserWithRole | null
  const role = user?.role ?? null
  const isAdmin = role === 'admin'

  return (
    <AuthContext.Provider
      value={{
        session: session ?? null,
        user: user ?? null,
        role,
        isAdmin,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
