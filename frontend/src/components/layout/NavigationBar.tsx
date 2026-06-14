import type { ReactNode } from 'react'

interface NavigationBarProps { rightContent?: ReactNode }

export default function NavigationBar({ rightContent }: NavigationBarProps) {
  return (
    <nav className="brut-nav">
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Clutch</span>
        <span className="tag tag-green">ONLINE</span>
      </a>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{rightContent}</div>
    </nav>
  )
}
