import type { ReactNode } from 'react'

interface NavigationBarProps {
  rightContent?: ReactNode
}

export default function NavigationBar({ rightContent }: NavigationBarProps) {
  return (
    <nav className="cyber-nav" style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-cyan)', letterSpacing: '0.1em' }}>CLUTCH</span>
        <span className="status-pill status-online">ONLINE</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{rightContent}</div>
    </nav>
  )
}
