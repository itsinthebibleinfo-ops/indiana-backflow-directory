interface AlertBannerProps {
  type: 'warning' | 'info' | 'success'
  children: React.ReactNode
}

const styles = {
  warning: 'bg-amber-50 border-amber-300 text-amber-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
  success: 'bg-green-50 border-green-200 text-green-900',
}

export default function AlertBanner({ type, children }: AlertBannerProps) {
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`} role="alert">
      {children}
    </div>
  )
}
