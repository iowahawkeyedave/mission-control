import { useState, useEffect } from 'react'
import {
  Activity,
  Cpu,
  MessageSquare,
  Database,
  Radio,
  Heart,
  BarChart3,
  Zap,
  Mail,
  Calendar,
  Code,
  Sparkles
} from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import StatusBadge from '../components/StatusBadge'
import { useApi, timeAgo } from '../lib/hooks'

const activityIcons: Record<string, any> = {
  heartbeat: Heart,
  development: Code,
  email: Mail,
  memory: Database,
  calendar: Calendar,
  business: BarChart3,
  chat: MessageSquare,
}

export default function Dashboard() {
  const { data, loading } = useApi<any>('/api/status', 30000)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!data?.heartbeat?.lastChecks) return
    const interval = setInterval(() => {
      const last = data.heartbeat.lastHeartbeat || Date.now() / 1000
      const next = last + 3600
      const remaining = Math.max(0, next - Date.now() / 1000)
      const mins = Math.floor(remaining / 60)
      const secs = Math.floor(remaining % 60)
      setCountdown(`${mins}m ${secs}s`)
    }, 1000)
    return () => clearInterval(interval)
  }, [data])

  if (loading || !data) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-full">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    )
  }

  const { agent, heartbeat, recentActivity, tokenUsage } = data

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-5 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-glass tracking-tight flex items-center gap-2">
              Dashboard
              <Sparkles size={20} className="text-purple-300/60" />
            </h1>
            <p className="text-sm text-glass-muted mt-1">System overview and agent status</p>
          </div>
          <div className="pill-badge flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 glow-green" />
            Live
          </div>
        </div>

        {/* Hero Status Card */}
        <GlassCard className="p-6" delay={0.05}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/20 border border-white/15 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/10">
                🤖
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-glass">{agent.name}</h2>
                  <StatusBadge status="active" pulse />
                </div>
                <p className="text-sm text-glass-muted mt-0.5">
                  {agent.model} · {agent.heartbeatInterval} heartbeat · {agent.totalAgents} agent{agent.totalAgents > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] text-glass-muted uppercase tracking-[0.15em] font-semibold">Sessions</p>
                <p className="text-3xl font-light text-glass mt-1">
                  <AnimatedCounter end={agent.activeSessions} />
                </p>
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
              <div className="text-right">
                <p className="text-[10px] text-glass-muted uppercase tracking-[0.15em] font-semibold">Memory</p>
                <p className="text-3xl font-light text-glass mt-1">
                  <AnimatedCounter end={agent.memoryChunks} /> <span className="text-sm text-glass-muted">chunks</span>
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Sessions', value: agent.activeSessions, icon: Activity, gradient: 'from-blue-400/20 to-blue-600/10' },
            { label: 'Memory Files', value: agent.memoryFiles, icon: Database, gradient: 'from-purple-400/20 to-purple-600/10' },
            { label: 'Memory Chunks', value: agent.memoryChunks, icon: Cpu, gradient: 'from-emerald-400/20 to-emerald-600/10' },
            { label: 'Channels', value: agent.channels?.length || 0, icon: Radio, gradient: 'from-amber-400/20 to-amber-600/10' },
          ].map((stat, i) => (
            <GlassCard key={stat.label} className="p-5" delay={0.1 + i * 0.05}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} border border-white/10 flex items-center justify-center`}>
                  <stat.icon size={16} className="text-white/70" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-glass-muted font-semibold uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-3xl font-light text-glass">
                <AnimatedCounter end={stat.value} />
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Two-column: Left (Channels + Token) | Right (Heartbeat + Activity) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-5">
            {/* Channels */}
            <GlassCard className="p-6" delay={0.2} hover={false}>
              <h3 className="text-sm font-semibold text-glass-secondary mb-4 flex items-center gap-2">
                <Radio size={14} className="text-purple-300/60" /> Channels
              </h3>
              <div className="space-y-1">
                {agent.channels?.length > 0 ? agent.channels.map((ch: any) => (
                  <div key={ch.name} className="flex items-center justify-between py-3 glass-row">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {ch.name === 'Discord' ? '💬' : ch.name === 'WhatsApp' ? '📱' : '✈️'}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-glass">{ch.name}</p>
                        <p className="text-[11px] text-glass-muted">{ch.detail}</p>
                      </div>
                    </div>
                    <StatusBadge status={ch.state === 'OK' ? 'active' : ch.state === 'OFF' ? 'off' : 'error'} />
                  </div>
                )) : (
                  <p className="text-xs text-glass-muted">No channel data available</p>
                )}
              </div>
            </GlassCard>

            {/* Token Usage */}
            <GlassCard className="p-6" delay={0.25} hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-glass-secondary flex items-center gap-2">
                  <BarChart3 size={14} className="text-cyan-300/60" /> Token Usage
                </h3>
                <span className="text-2xl font-light text-glass">{tokenUsage.percentage}%</span>
              </div>
              <div className="glass-progress h-3 mb-3">
                <div
                  className="glass-progress-fill h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${tokenUsage.percentage}%`, transition: 'width 1s ease' }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-glass-muted">
                  {(tokenUsage.used / 1000).toFixed(0)}k used
                </span>
                <span className="text-xs text-glass-muted">
                  {(tokenUsage.limit / 1000).toFixed(0)}k limit
                </span>
              </div>
            </GlassCard>

            {/* Heartbeat */}
            <GlassCard className="p-6" delay={0.3} hover={false}>
              <h3 className="text-sm font-semibold text-glass-secondary mb-4 flex items-center gap-2">
                <Heart size={14} className="text-pink-300/60" /> Heartbeat
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-glass-muted uppercase tracking-wider mb-1">Last</p>
                  <p className="text-sm font-medium text-glass">
                    {heartbeat.lastHeartbeat
                      ? timeAgo(new Date(heartbeat.lastHeartbeat * 1000).toISOString())
                      : '—'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-glass-muted uppercase tracking-wider mb-1">Next</p>
                  <p className="text-sm font-mono text-purple-300">{countdown || '—'}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-glass-muted uppercase tracking-wider mb-1">Interval</p>
                  <p className="text-sm font-medium text-glass">{agent.heartbeatInterval}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column — Activity Feed (taller) */}
          <GlassCard className="p-6" delay={0.2} hover={false}>
            <h3 className="text-sm font-semibold text-glass-secondary mb-4 flex items-center gap-2">
              <Zap size={14} className="text-amber-300/60" /> Recent Activity
            </h3>
            <div className="space-y-1 overflow-y-auto scrollbar-thin" style={{ maxHeight: 'calc(100% - 40px)' }}>
              {recentActivity.map((a: any, i: number) => {
                const Icon = activityIcons[a.type] || Activity
                return (
                  <div key={i} className="flex items-start gap-3 py-3 glass-row">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={15} className="text-white/50" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-glass">{a.action}</p>
                      <p className="text-xs text-glass-muted mt-0.5 line-clamp-2">{a.detail}</p>
                    </div>
                    <span className="text-[10px] text-glass-muted shrink-0 ml-auto pt-1">{timeAgo(a.time)}</span>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  )
}
