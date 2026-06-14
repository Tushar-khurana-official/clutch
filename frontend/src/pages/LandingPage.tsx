import { GitBranch, Terminal, Zap, Activity, ArrowRight } from 'lucide-react'
import { useAuthentication } from '../hooks/useAuthentication'
import { Navigate } from 'react-router-dom'
import NavigationBar from '../components/layout/NavigationBar'
import { API_BASE_URL, GITHUB_REPOSITORY_URL } from '../constants/config.constants'

export default function LandingPage() {
  const { user } = useAuthentication()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <NavigationBar rightContent={
        <>
          <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-brut btn-ghost" style={{ fontSize: '12px', padding: '7px 16px' }}>GitHub</a>
          <a href={`${API_BASE_URL}/auth/github`} className="btn-brut btn-cyan">
            <GitBranch size={13} /> Connect GitHub
          </a>
        </>
      } />

      {/* HERO */}
      <main style={{ flex: 1, maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '80px 32px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>

        {/* LEFT */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <span className="tag tag-cyan" style={{ marginRight: '8px' }}>Open Source</span>
            <span className="tag tag-outline">Free Forever</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '52px', lineHeight: '1.15', letterSpacing: '-1px', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Track Your<br />
            Developer<br />
            <span style={{ color: 'var(--neon-pink)' }}>Momentum.</span>
          </h1>

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '32px', maxWidth: '420px' }}>
            Commit streaks, activity patterns, and AI-powered weekly insights — all in one place. Know exactly how productive you've been.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            <a href={`${API_BASE_URL}/auth/github`} className="btn-brut btn-cyan">
              <GitBranch size={14} /> Get Started Free <ArrowRight size={13} />
            </a>
            <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="btn-brut btn-ghost">
              View on GitHub
            </a>
          </div>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>
            $ pip install clutch-dev
          </p>
        </div>

        {/* RIGHT — terminal */}
        <div className="terminal">
          <div className="terminal-bar">
            <div className="terminal-dot" style={{ background: 'var(--neon-pink)' }} />
            <div className="terminal-dot" style={{ background: 'var(--neon-yellow)' }} />
            <div className="terminal-dot" style={{ background: 'var(--neon-green)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>clutch — terminal</span>
          </div>
          {[
            { type: 'cmd', text: '$ clutch streak' },
            { type: 'out', text: '◆ Current Streak: 12 days' },
            { type: 'out', text: '◆ Longest Streak: 24 days' },
            { type: 'cmd', text: '$ clutch insight' },
            { type: 'out', text: '◆ Strong week — 47 commits' },
            { type: 'comment', text: '  Most active: Tuesday' },
            { type: 'comment', text: '  Top repo: clutch' },
            { type: 'cmd', text: '$ clutch stats --days 30' },
            { type: 'out', text: '◆ 183 commits · 12 PRs' },
            { type: 'out', text: '◆ 28 active days / 30' },
          ].map((line, i) => (
            <div key={i} className="terminal-line">
              <span className={line.type}>{line.text}</span>
            </div>
          ))}
          <div className="terminal-line"><span className="cmd">$ <span className="blink">_</span></span></div>
        </div>
      </main>

      {/* FEATURES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', padding: '0 32px 80px' }}>
        <div className="section-label">Features</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: <Activity size={18} />, label: 'STREAKS', title: 'Commit Streaks', desc: 'Track daily consistency. Never lose your streak again.', color: 'cyan' as const },
            { icon: <Zap size={18} />, label: 'PATTERNS', title: 'Activity Patterns', desc: 'Discover your most productive days, repos and languages.', color: 'pink' as const },
            { icon: <Terminal size={18} />, label: 'AI', title: 'Weekly Insights', desc: 'Groq-powered summaries that actually tell you something useful.', color: 'yellow' as const },
          ].map((f) => {
            const accentMap = { cyan: 'var(--neon-cyan)', pink: 'var(--neon-pink)', yellow: 'var(--neon-yellow)' }
            const accent = accentMap[f.color]
            return (
              <div key={f.label} className="brut-card" style={{ padding: '24px', borderColor: accent, boxShadow: `6px 6px 0px ${accent}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ color: accent }}>{f.icon}</span>
                  <span className="tag" style={{ background: accent, color: '#0c0c0e', fontSize: '10px', padding: '2px 8px' }}>{f.label}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <footer style={{ borderTop: '2px solid var(--border-dim)', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)' }}>© 2026 Clutch — Open Source</span>
        <a href={GITHUB_REPOSITORY_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--neon-cyan)', textDecoration: 'none' }}>Star on GitHub ★</a>
      </footer>
    </div>
  )
}
