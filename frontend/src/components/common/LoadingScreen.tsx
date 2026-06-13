interface LoadingScreenProps { message?: string }

export default function LoadingScreen({ message = 'INITIALIZING...' }: LoadingScreenProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px', background: 'var(--bg)' }}>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--neon-cyan)', letterSpacing: '0.2em' }}>
        CLUTCH<span className="blink">_</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>{message}</div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ width: '6px', height: '6px', background: 'var(--neon-cyan)', animation: `blink 1s step-end ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}
