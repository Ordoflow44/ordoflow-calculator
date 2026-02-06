import LayoutWrapper from '@/components/layout/LayoutWrapper'
import { Toaster } from 'sonner'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen">
      <LayoutWrapper>{children}</LayoutWrapper>
      <Toaster
        theme="dark"
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#1f2937',
            border: '1px solid #374151',
            color: '#f3f4f6',
          },
          classNames: {
            success: 'border-green-500/30',
            error: 'border-red-500/30',
            info: 'border-purple-500/30',
          },
        }}
        richColors
      />
    </main>
  )
}
