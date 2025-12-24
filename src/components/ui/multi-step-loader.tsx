import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export interface LoadingStep {
  text: string
}

export interface MultiStepLoaderProps {
  steps: LoadingStep[]
  currentStep: number
  loading: boolean
  success?: boolean
  error?: string | null
  className?: string
}

export function MultiStepLoader({
  steps,
  currentStep,
  loading,
  success = false,
  error = null,
  className,
}: MultiStepLoaderProps) {
  if (!loading && !success && !error) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className,
      )}
    >
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg">
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = index === currentStep && loading
            const isComplete = index < currentStep || success
            const isFailed = error && index === currentStep

            return (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 transition-all duration-300',
                  {
                    'opacity-50': !isActive && !isComplete && !isFailed,
                    'opacity-100': isActive || isComplete || isFailed,
                  },
                )}
              >
                <div className="flex-shrink-0">
                  {isComplete && !error ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : isFailed ? (
                    <XCircle className="h-5 w-5 text-destructive" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted" />
                  )}
                </div>
                <p
                  className={cn('text-sm', {
                    'text-foreground font-medium': isActive || isComplete,
                    'text-muted-foreground': !isActive && !isComplete,
                    'text-destructive': isFailed,
                  })}
                >
                  {step.text}
                </p>
              </div>
            )
          })}

          {success && (
            <div className="mt-6 rounded-md border border-green-500/20 bg-green-500/10 p-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Account created successfully! Redirecting...
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-md border border-destructive/20 bg-destructive/10 p-4">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
