import { Toaster as SonnerToaster } from 'sonner'

interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

function Toaster({ position = 'bottom-right' }: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      toastOptions={{
        classNames: {
          toast: 'bg-background text-foreground border-border shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
    />
  )
}

export { Toaster }
export { toast } from 'sonner'
