import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { GitCommit, GitPullRequest, Flame, Brain, RefreshCw, LogOut, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface ActivityData {
  total_commits: number
  total_prs: number
  total_issues: number
  active_days: number
  daily_activity: Array<{
    date: string
    commits: number
    prs: number
  }>
}

interface StreakData {
  current_streak: number
  longest_streak: number
  total_active_days: number
}

interface InsightData {
  week_start: string
  stats: {
    total_commits: number
    total_prs: number
    active_days: number
    best_day: string
  }
  ai_summary: string
  generated_by: string
  message?: string
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activity, setActivity] = useState<ActivityData | null>(null)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [insight, setInsight] = useState<InsightData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [activityRes, streakRes] = await Promise.all([
        api.get('/github/activity?days=30'),
        api.get('/github/streak'),
      ])
      setActivity(activityRes.data)
      setStreak(streakRes.data)
      api.get('/insights/weekly')
        .then(res => setInsight(res.data))
        .catch(() => {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    await api.post('/github/sync').catch(() => {})
    await fetchData()
    setSyncing(false)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <span style={{ fontSize: '24px' }}>⚡</span>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
        }}>
          Loading your activity...
        </p>
      </div>
    )
  }

  const chartData = activity?.daily_activity
    ?.sort((a, b) => a.date.localeCompare(b.date))
    ?.slice(-14)
    ?.map(d => ({
      date: d.date.slice(5),
      commits: d.commits,
    })) || []

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid var(--color-border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        backgroundColor: 'var(--color-bg)',
        zIndex: 10,
      }}>
        <span style={{ fontSize: '16px', fontWeight: '600' }}>⚡ Clutch</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-ghost"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={13} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Syncing...' : 'Sync'}
          </button>
          <img
            src={user?.avatar_url || ''}
            alt={user?.username}
            style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--color-border)' }}
          />
          <button onClick={logout} className="btn-ghost">
            <LogOut size={13} />
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
            Hey, {user?.name || user?.username} 👋
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
            @{user?.username} · Last 30 days
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {[
            {
              label: 'Total Commits',
              value: activity?.total_commits ?? '—',
              icon: <GitCommit size={14} color="var(--color-accent)" />,
            },
            {
              label: 'Pull Requests',
              value: activity?.total_prs ?? '—',
              icon: <GitPullRequest size={14} color="var(--color-accent)" />,
            },
            {
              label: 'Current Streak',
              value: streak ? `${streak.current_streak}d` : '—',
              icon: <Flame size={14} color="#e3b341" />,
            },
            {
              label: 'Longest Streak',
              value: streak ? `${streak.longest_streak}d` : '—',
              icon: <BarChart3 size={14} color="var(--color-text-secondary)" />,
            },
          ].map((s) => (
            <div key={s.label} className="card">
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                color: 'var(--color-text-secondary)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {s.icon}
                {s.label}
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: '600',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-text-primary)',
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--color-text-primary)',
          }}>
            Commit Activity — Last 14 Days
          </h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData} barSize={12}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontFamily: 'JetBrains Mono' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'var(--color-text-secondary)' }}
                  itemStyle={{ color: 'var(--color-accent)' }}
                />
                <Bar dataKey="commits" fill="var(--color-accent)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{
              color: 'var(--color-text-muted)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              textAlign: 'center',
              padding: '32px 0',
            }}>
              No activity yet. Click Sync to load your data.
            </p>
          )}
        </div>

        {/* AI Insight */}
        <div className="card" style={{ borderColor: 'rgba(45, 164, 78, 0.3)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <Brain size={15} color="var(--color-accent)" />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>Weekly AI Insight</span>
            <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
              Groq AI
            </span>
          </div>
          <p style={{
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            lineHeight: '1.7',
          }}>
            {insight?.ai_summary || insight?.message || 'Sync your activity first to generate AI insights.'}
          </p>
        </div>

      </div>
    </div>
  )
}