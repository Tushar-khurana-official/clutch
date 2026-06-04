import { GitBranch, GitCommit, BarChart3, Brain } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Landing() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px', fontWeight: '600' }}>⚡ Clutch</span>
        </div>
        <a href={`${API_URL}/auth/github`} className="btn-primary">
          <GitBranch size={15} />
          Sign in with GitHub
        </a>
      </nav>

      {/* Hero */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        textAlign: 'center',
        maxWidth: '720px',
        margin: '0 auto',
        width: '100%',
      }}>
        <div className="badge badge-green" style={{ marginBottom: '24px' }}>
          Open Source · Free Forever
        </div>

        <h1 style={{
          fontSize: '48px',
          fontWeight: '600',
          lineHeight: '1.2',
          marginBottom: '16px',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.5px',
        }}>
          GitHub tracks your work.
          <br />
          <span style={{ color: 'var(--color-accent)' }}>Clutch tracks you.</span>
        </h1>

        <p style={{
          fontSize: '16px',
          color: 'var(--color-text-secondary)',
          maxWidth: '480px',
          marginBottom: '32px',
          lineHeight: '1.7',
        }}>
          Commit streaks, activity patterns, language breakdowns,
          and AI-powered weekly insights — all in one place.
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <a href={`${API_URL}/auth/github`} className="btn-primary" style={{ fontSize: '15px', padding: '10px 20px' }}>
            <GitBranch size={16} />
            Get Started Free
          </a>
          <a href="https://github.com/laypatel13/clutch" target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: '15px', padding: '10px 20px' }}>
            View on GitHub
          </a>
        </div>

        <p style={{
          marginTop: '16px',
          fontSize: '12px',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          No credit card. No email required.
        </p>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginTop: '64px',
          width: '100%',
        }}>
          {[
            {
              icon: <GitCommit size={18} color="var(--color-accent)" />,
              title: 'Commit Streaks',
              desc: 'Track your daily consistency and never lose your streak.',
            },
            {
              icon: <BarChart3 size={18} color="var(--color-accent)" />,
              title: 'Activity Patterns',
              desc: 'Discover your most productive days, repos and languages.',
            },
            {
              icon: <Brain size={18} color="var(--color-accent)" />,
              title: 'AI Insights',
              desc: 'Weekly summaries that actually tell you something useful.',
            },
          ].map((f) => (
            <div key={f.title} className="card" style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '10px' }}>{f.icon}</div>
              <h3 style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '6px',
                color: 'var(--color-text-primary)',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.6',
              }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'var(--color-text-muted)',
        fontSize: '12px',
        fontFamily: 'var(--font-mono)',
      }}>
        <span>© 2026 Clutch — Open Source</span>
        <a href="https://github.com/laypatel13/clutch" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>
          Star on GitHub ⭐
        </a>
      </footer>
    </div>
  )
}