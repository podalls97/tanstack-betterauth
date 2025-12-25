import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Github,
  Terminal,
  Database,
  ShieldCheck,
  Zap,
  Layout,
  Server,
  Code2,
  Box,
  Fingerprint,
  Lock,
  UserCheck,
  FileCheck,
  ShieldAlert,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mb-8 flex justify-center">
          <Badge variant="outline" className="px-4 py-2 text-base">
            🚀 v1.0.0 Now Available
          </Badge>
        </div>
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
          Podalls <span className="text-primary">Demo</span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground sm:text-2xl">
          The ultimate full-stack starter template. Auth, Database, Type-safety,
          and Performance — all pre-configured.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="h-12 px-8 text-lg" asChild>
            <a href="#getting-started">Get Started</a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-8 text-lg"
            asChild
          >
            <a
              href="https://github.com/podalls97/tanstack-betterauth"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </a>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 px-8 text-lg"
            asChild
          >
            <Link to="/admin-demo">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Admin Dashboard
            </Link>
          </Button>
        </div>
        
        {/* Demo Instructions */}
        <div className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-6 text-left max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Demo Instructions
          </h3>
          <ul className="space-y-3 list-disc pl-5 text-muted-foreground">
            <li>
              Click the <span className="font-semibold text-foreground">Admin Dashboard</span> button above to see the protected admin demo page.
            </li>
            <li>
              Click <span className="font-semibold text-foreground">Sign Out</span> (if logged in) to see the Sign In page.
            </li>
            <li>
               Test all authentication flows: <span className="font-semibold text-foreground">Sign Up</span>, <span className="font-semibold text-foreground">Request Access</span>, and <span className="font-semibold text-foreground">Forgot Password</span>.
            </li>
            <li className="italic text-sm">
               All of these features are currently in <strong>Demo Mode</strong>.
            </li>
          </ul>
        </div>
      </section>

      <Separator />

      {/* Tech Stack */}
      <section className="container mx-auto px-4 py-20" id="tech-stack">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Powered by the Best
          </h2>
          <p className="text-lg text-muted-foreground">
            Built on a foundation of modern, battle-tested technologies.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <TechCard
            icon={<Layout className="h-10 w-10 text-blue-500" />}
            title="TanStack Start"
            description="Full-stack React framework with top-tier routing and data loading."
          />
          <TechCard
            icon={<Fingerprint className="h-10 w-10 text-green-500" />}
            title="BetterAuth"
            description="Comprehensive authentication solution for secure user flows."
          />
          <TechCard
            icon={<Server className="h-10 w-10 text-teal-500" />}
            title="Neon Database"
            description="Serverless PostgreSQL built for the cloud. Fast and scalable."
          />
          <TechCard
            icon={<Database className="h-10 w-10 text-yellow-500" />}
            title="Drizzle ORM"
            description="TypeScript ORM that lets you sleep at night. 100% type-safe."
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to build production-ready applications.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureItem
              icon={<ShieldCheck />}
              title="Secure Authentication"
              description="Pre-configured email/password and social login flows."
            />
            <FeatureItem
              icon={<Zap />}
              title="Lightning Fast"
              description="Optimized build and runtime performance with Vite and Bun."
            />
            <FeatureItem
              icon={<Code2 />}
              title="End-to-End Type Safety"
              description="From database to frontend, your types are always in sync."
            />
            <FeatureItem
              icon={<Terminal />}
              title="Developer Experience"
              description="Hot module replacement, great tooling, and simple configuration."
            />
            <FeatureItem
              icon={<Box />}
              title="UI Components"
              description="Beautiful, accessible components built with Shadcn UI."
            />
            <FeatureItem
              icon={<Server />}
              title="Server Functions"
              description="Seamless server-side logic integration with TanStack Start."
            />
          </div>
        </div>
      </section>

      {/* Admin & Access Control */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">
            Enterprise Ready
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Admin & Access Control
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A complete invite-only workflow is built-in. Define who gets access to your application.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Workflow Diagram/Steps */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold">Access Request Lifecycle</h3>
            <div className="relative border-l-2 border-muted pl-8 ml-4 space-y-12">
              <div className="relative">
                <div className="absolute -left-[41px] flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary">
                   <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-xl font-medium mb-2">1. User Request</h4>
                <p className="text-muted-foreground">
                  Potential users submit a request via the public <code>/request-access</code> form, providing their email, desired username, and a reason for access.
                </p>
              </div>
              <div className="relative">
                 <div className="absolute -left-[41px] flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary">
                   <ShieldAlert className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-xl font-medium mb-2">2. Admin Review</h4>
                <p className="text-muted-foreground">
                  Admins view pending requests in the protected Dashboard. They can review user details and reasons before making a decision.
                </p>
              </div>
              <div className="relative">
                 <div className="absolute -left-[41px] flex h-10 w-10 items-center justify-center rounded-full bg-background border-2 border-primary">
                   <FileCheck className="h-5 w-5 text-primary" />
                </div>
                <h4 className="text-xl font-medium mb-2">3. Approval & Onboarding</h4>
                <p className="text-muted-foreground">
                  Upon approval, an account is automatically created. The user receives an email notification (configurable) and can sign in immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid gap-6">
             <Card>
              <CardHeader>
                <Lock className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Role-Based Protection</CardTitle>
                <CardDescription>
                  Secure admin routes are protected by middleware and client-side checks, ensuring only users with the `admin` role can access sensitive controls.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Fingerprint className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Detailed Audit</CardTitle>
                <CardDescription>
                   Capture detailed information during the request process, including user justification. Admins can provide rejection notes for feedback.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="container mx-auto px-4 py-20" id="getting-started">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight">
              Getting Started
            </h2>
            <p className="text-lg text-muted-foreground">
              Follow these steps to get your project up and running.
            </p>
          </div>

          <div className="mb-10 rounded-lg border border-amber-500/50 bg-amber-500/10 p-6 text-amber-600 dark:text-amber-400">
             <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
                <div>
                   <h3 className="mb-2 font-bold text-lg">Prerequisites</h3>
                   <p className="mb-4 text-sm font-medium opacity-90">
                      Before proceeding, ensure you have the following ready:
                   </p>
                   <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>
                         <strong>Neon Database</strong>: You will need a PostgreSQL connection string from <a href="https://neon.tech" target="_blank" rel="noreferrer" className="underline underline-offset-4">Neon</a>.
                      </li>
                      <li>
                         <strong>Resend API</strong>: Obtain an API key and verify your domain at <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline underline-offset-4">Resend</a>.
                      </li>
                   </ul>
                </div>
             </div>
          </div>

          <Steps />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Podalls Demo. MIT License.</p>
        </div>
      </footer>
    </div>
  );
}

function TechCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="h-full border-2 transition-all hover:border-primary/50">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-lg border p-6 transition-colors hover:bg-background">
      <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <h3 className="mb-2 font-semibold leading-none tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Steps() {
  return (
    <div className="space-y-8">
      <Step number={1} title="Clone the repository">
        <CodeBlock>
          git clone https://github.com/podalls/podalls-demo.git{"\n"}
          cd podalls-demo
        </CodeBlock>
      </Step>
      <Step number={2} title="Install dependencies">
        <CodeBlock>bun install</CodeBlock>
      </Step>
      <Step number={3} title="Setup Environment">
        <p className="mb-4 text-sm text-muted-foreground">
          Copy the example env file and update your credentials.
        </p>
        <CodeBlock>cp .env.example .env</CodeBlock>
      </Step>
      <Step number={4} title="Setup Database">
         <CodeBlock>
          bun db:generate{"\n"}
          bun db:push
         </CodeBlock>
      </Step>
       <Step number={5} title="Run Development Server">
        <CodeBlock>bun dev</CodeBlock>
      </Step>
    </div>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary text-lg font-bold text-primary">
        {number}
      </div>
      <div className="flex-1 pt-1">
        <h3 className="mb-4 text-xl font-semibold">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-slate-950 p-4 text-sm text-slate-50">
      <code>{children}</code>
    </pre>
  );
}