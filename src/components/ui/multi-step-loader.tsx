import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  onClose?: () => void
  successMessage?: string
  autoCloseDelay?: number
}

export function MultiStepLoader({
  steps,
  currentStep,
  loading,
  success = false,
  error = null,
  className,
  onClose,
  successMessage = 'Success! Redirecting...',
  autoCloseDelay = 3000,
}: MultiStepLoaderProps) {
  const [countdown, setCountdown] = useState<number | null>(null)

  // Auto-close countdown for errors
  useEffect(() => {
    if (error && onClose) {
      const delay = autoCloseDelay / 1000 // Convert to seconds
      setCountdown(delay)

      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(countdownInterval)
            return null
          }
          return prev - 1
        })
      }, 1000)

      const timer = setTimeout(() => {
        onClose()
      }, autoCloseDelay)

      return () => {
        clearTimeout(timer)
        clearInterval(countdownInterval)
      }
    }
  }, [error, onClose, autoCloseDelay])

  if (!loading && !success && !error) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose && (error || success)) {
      onClose()
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
        className,
      )}
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-lg relative">
        {/* Close button - only show when error or success */}
        {onClose && (error || success) && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

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
                {successMessage}
              </p>
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-md border border-destructive/20 bg-destructive/10 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-destructive flex-1">{error}</p>
                {countdown !== null && (
                  <span className="text-xs text-destructive/70 whitespace-nowrap">
                    Closing in {countdown}s
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
