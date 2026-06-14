import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  color?: 'cyan' | 'pink' | 'yellow' | 'green'
}

const accentMap = { cyan: 'var(--neon-cyan)', pink: 'var(--neon-pink)', yellow: 'var(--neon-yellow)', green: 'var(--neon-green)' }

export default function StatCard({ label, value, icon, color = 'cyan' }: StatCardProps) {
  const accent = accentMap[color]
  return (
    <div className="brut-card" style={{ padding: '18px 16px', borderColor: accent, boxShadow: `4px 4px 0px ${accent}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <span style={{ color: accent }}>{icon}</span>
        <span className="stat-label">{label}</span>
      </div>
      <div className="stat-value" style={{ color: accent }}>{value}</div>
    </div>
  )
}
