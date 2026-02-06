import { Button } from '@react-email/components'

interface EmailButtonProps {
  href: string
  children: React.ReactNode
}

export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Button
      href={href}
      style={{
        display: 'inline-block',
        padding: '14px 28px',
        backgroundColor: '#7C3AED',
        color: '#ffffff',
        fontSize: '16px',
        fontWeight: 600,
        textDecoration: 'none',
        borderRadius: '8px',
        textAlign: 'center' as const,
      }}
    >
      {children}
    </Button>
  )
}
