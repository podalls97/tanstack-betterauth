# Podalls demo

![TanStack Start](https://img.shields.io/badge/TanStack-Start-000?style=for-the-badge&logo=react)
![BetterAuth](https://img.shields.io/badge/BetterAuth-Success-green?style=for-the-badge)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=000)
![Neon](https://img.shields.io/badge/Neon-Database-00E599?style=for-the-badge&logo=neon&logoColor=000)

Comprehensive starter template featuring the best of the modern web ecosystem. Built for performance, type-safety, and developer experience.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start)
- **Authentication**: [BetterAuth](https://better-auth.com/)
- **Database**: [Neon](https://neon.tech/) (PostgreSQL)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)

## Features

- 🔐 **Authentication**: Complete auth flows (Email/Password, OAuth, etc.) powered by BetterAuth.
- 🗄️ **Database**: Serverless PostgreSQL with Neon.
- ⚡ **Type-Safety**: End-to-end type safety with Drizzle ORM and TanStack Router.
- 🚀 **Performance**: Optimized for speed with TanStack Start.
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS.
- 🎨 **Toast Notifications**: Beautiful notifications powered by Sonner.

## Project Structure

This project uses TanStack Router's file-based routing with organized route groups:

### Route Groups

```
src/routes/
├── (auth)/          # 🔒 Protected routes - requires authentication
│   └── admin/       # Admin dashboard for managing access requests
├── (unauth)/        # 🔓 Public authentication routes
│   ├── sign-in/     # User sign-in page
│   ├── sign-up/     # User registration page
│   ├── forgot-password/
│   ├── reset-password/
│   └── request-access/
├── (demo)/          # 🎭 Demo pages - for UI/UX preview only
│   ├── sign-in-demo/
│   ├── sign-up-demo/
│   ├── admin-demo/
│   ├── forgot-password-demo/
│   └── request-access-demo/
└── api/             # 🔌 API endpoints
```

### Understanding Route Groups

**Route groups** use parentheses `()` for organization without affecting the URL structure:

- **`(auth)/`** - Protected routes that require user authentication. Access is restricted to logged-in users.
- **`(unauth)/`** - Public routes for authentication flows (sign in, sign up, password reset, etc.).
- **`(demo)/`** - **Demo pages for UI/UX preview only.** These pages showcase the interface without functional backend logic. Perfect for testing the user experience or sharing design previews.

> **💡 Tip**: When moving to production, you can safely delete the entire `(demo)` folder as it contains only non-functional preview pages.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/podalls/podalls-demo.git
    cd podalls-demo
    ```

2.  **Install dependencies**

    ```bash
    bun install
    ```

3.  **Environment Setup**

    Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

    Fill in your `.env` file with your database credentials and auth secrets.

4.  **Database Setup**

    Generate and push your schema:

    ```bash
    bunx drizzle-kit generate
    bunx drizzle-kit push
    ```

5.  **Run Locally**

    Start the development server:

    ```bash
    bun dev
    ```

    The app will be available at `http://localhost:3000`.

## Available Scripts

### Development
- `bun dev` - Start development server on port 3000
- `bun build` - Build for production
- `bun preview` - Preview production build

### Code Quality
- `bun test` - Run tests with Vitest
- `bun lint` - Run ESLint
- `bun format` - Run Prettier
- `bun check` - Format and lint with auto-fix

### Database (using Drizzle Kit)
- `bunx drizzle-kit generate` - Generate migrations from schema
- `bunx drizzle-kit push` - Push schema changes to database
- `bunx drizzle-kit studio` - Open Drizzle Studio to manage data
