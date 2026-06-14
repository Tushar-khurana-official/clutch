interface LoadingScreenProps { message?: string }

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px', background: 'var(--bg)' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--text-primary)' }}>
        Clutch<span className="blink" style={{ color: 'var(--neon-cyan)' }}>_</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{message}</div>
    </div>
  )
}
