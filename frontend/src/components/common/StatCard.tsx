import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  color?: 'cyan' | 'pink' | 'yellow' | 'green'
}

const colorMap = {
  cyan: 'var(--neon-cyan)',
  pink: 'var(--neon-pink)',
  yellow: 'var(--neon-yellow)',
  green: 'var(--neon-green)',
}

export default function StatCard({ label, value, icon, color = 'cyan' }: StatCardProps) {
  const accent = colorMap[color]
  return (
    <div className="stat-chip" style={{ borderLeft: `2px solid ${accent}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--text-muted)' }}>
        {icon}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{label}</span>
      </div>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: accent, letterSpacing: '0.05em' }}>{value}</div>
    </div>
  )
}
