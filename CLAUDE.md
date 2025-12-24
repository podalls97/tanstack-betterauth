# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack TypeScript application built with TanStack Start (React-based meta-framework), featuring a complete authentication system with access request workflows. The project uses Neon PostgreSQL with Drizzle ORM, BetterAuth for authentication, and shadcn/ui components styled with Tailwind CSS.

## Key Commands

### Development
```bash
bun dev              # Start development server on port 3000
bun build            # Build for production
bun preview          # Preview production build
```

### Testing and Code Quality
```bash
bun test             # Run all tests with Vitest
bun lint             # Run ESLint
bun format           # Run Prettier
bun check            # Format and lint with auto-fix
```

### Database Operations
Database commands are not in package.json. Use Drizzle Kit directly:
```bash
bunx drizzle-kit generate  # Generate migrations from schema
bunx drizzle-kit push      # Push schema to database
bunx drizzle-kit studio    # Open Drizzle Studio
```

## Architecture

### Tech Stack
- **Framework**: TanStack Start (file-based routing, SSR/SSG)
- **Runtime**: Bun (preferred) or Node.js
- **Database**: Neon PostgreSQL (serverless)
- **ORM**: Drizzle ORM with HTTP client (`drizzle-orm/neon-http`)
- **Auth**: BetterAuth with username plugin
- **Styling**: Tailwind CSS v4 + shadcn/ui (radix-lyra style)
- **Email**: Resend
- **Icons**: Lucide React

### Route Structure

TanStack Router uses file-based routing with route groups:

- **`src/routes/__root.tsx`**: Root layout with AuthProvider wrapper
- **`src/routes/index.tsx`**: Landing page
- **`src/routes/(auth)/`**: Protected routes requiring authentication
  - `admin/index.tsx`: Admin dashboard for access request management
- **`src/routes/(unauth)/`**: Public auth flow routes
  - `sign-in/index.tsx`, `sign-up/index.tsx`
  - `forgot-password/index.tsx`, `reset-password/index.tsx`
  - `request-access/index.tsx`: User access request form
- **`src/routes/(demo)/`**: Demo pages showing UI components
- **`src/routes/api/`**: API endpoints using TanStack Start server handlers
  - `auth/$.ts`: BetterAuth handler (catch-all route)
  - `access-request/$.ts`: Access request submission
  - `admin/access-requests/$.ts`: Admin API for request management

Route groups `(auth)` and `(unauth)` are organizational only and don't affect URLs.

### Authentication System

**BetterAuth Configuration** (`src/lib/auth.ts`):
- Drizzle adapter with PostgreSQL
- Email/password authentication (no email verification required)
- Username plugin (3-30 characters)
- Custom `role` field on users ('user' | 'admin')
- Password reset via Resend emails
- 7-day session expiration, 24-hour update age

**Client-Side** (`src/lib/auth-client.ts`):
- Exports BetterAuth client functions: `signIn`, `signUp`, `signOut`, `useSession`

**Context** (`src/lib/auth-context.tsx`):
- `AuthProvider`: Wraps app in `__root.tsx`
- `useAuth()`: Provides `{ session, user, role, isAdmin, isLoading }`

### Database Schema

Schema defined in `src/lib/db/schema.ts` using Drizzle ORM:

**BetterAuth tables**:
- `user`: Core user table with `role` field (default: 'user')
- `session`: Session management with tokens
- `account`: OAuth/password provider accounts
- `verification`: Email verification tokens

**Custom tables**:
- `accessRequest`: Access request workflow
  - Fields: username, displayUsername, name, email, reason
  - Status: 'pending' | 'approved' | 'rejected'
  - Tracks reviewer, review date, and reviewer notes

**Database Connection** (`src/lib/db/index.ts`):
- Uses Neon HTTP client for serverless compatibility
- Requires `DATABASE_URL` environment variable

### Email System

Email functions in `src/lib/email.ts` using Resend:

- `sendPasswordResetEmail()`: Sent when access approved (BetterAuth password reset flow)
- `sendAccessRequestNotification()`: Notifies admin of new requests
- `sendRejectionEmail()`: Notifies user when request rejected

Requires environment variables:
- `RESEND_API_KEY`
- `ADMIN_EMAIL`: Receives access request notifications
- `EMAIL_FROM`: "Display Name <verified@domain.com>" format

### UI Components

**shadcn/ui Configuration** (`components.json`):
- Style: radix-lyra
- Base color: neutral
- Components in `src/components/ui/`
- Path aliases configured: `@/*` → `./src/*`

**Toast Notifications**:
- Uses Sonner for toast notifications
- Toaster component mounted in `__root.tsx`
- Import and use: `import { toast } from 'sonner'`
- Available methods: `toast.info()`, `toast.success()`, `toast.error()`, `toast.warning()`

**Custom Components**:
- `access-request-table.tsx`: Admin table for managing requests
- `access-request-dialogs.tsx`: Approve/reject modals

### Path Aliases

Configured in `tsconfig.json` and `vite.config.ts`:
- `@/*` maps to `src/*`
- Enabled via `vite-tsconfig-paths` plugin

### Environment Variables

Required in `.env`:
```bash
DATABASE_URL                # Neon PostgreSQL connection string
BETTER_AUTH_SECRET          # Min 32 characters
BETTER_AUTH_URL             # App URL (http://localhost:3000 in dev)
RESEND_API_KEY              # Resend API key
ADMIN_EMAIL                 # Admin notification recipient
EMAIL_FROM                  # Verified sender address
```

## Development Patterns

### Adding New Routes

1. Create file in `src/routes/` following TanStack Router conventions
2. Use `createFileRoute()` for type-safe routes
3. Add to route group `(auth)` or `(unauth)` as needed
4. Route tree auto-generated in `src/routeTree.gen.ts`

### Adding API Endpoints

1. Create `$.ts` file in `src/routes/api/your-endpoint/`
2. Export Route with server handlers:
```typescript
export const Route = createFileRoute('/api/your-endpoint/$')({
  server: {
    handlers: {
      GET: async ({ request }) => { /* ... */ },
      POST: async ({ request }) => { /* ... */ },
    },
  },
})
```

### Database Changes

1. Update schema in `src/lib/db/schema.ts`
2. Generate migration: `bunx drizzle-kit generate`
3. Push to database: `bunx drizzle-kit push`
4. Migrations stored in `drizzle/` directory

### Adding shadcn/ui Components

Use the shadcn CLI (already configured):
```bash
bunx shadcn add [component-name]
```

### Role-Based Access

Check user role via `useAuth()`:
```typescript
const { isAdmin } = useAuth()
if (!isAdmin) return <Redirect to="/sign-in" />
```

Server-side role checks should query the user table.

## Important Notes

- The app uses Bun as the preferred runtime but is Node.js compatible
- TanStack Start provides both SSR and SSG capabilities
- Auth route (`/api/auth/$`) is a catch-all that handles all BetterAuth endpoints
- Client-side protection in auth routes redirects via `useEffect` + `useNavigate`
- Access request flow: User requests → Admin receives email → Admin approves → User receives password reset email
- Drizzle uses HTTP client for Neon compatibility (not WebSockets)
- All timestamps use PostgreSQL's `timestamp` type with `defaultNow()`
