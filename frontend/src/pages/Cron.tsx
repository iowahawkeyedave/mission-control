import { Clock, Play, Pause, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import StatusBadge from '../components/StatusBadge'
import { useApi, timeAgo, formatDate } from '../lib/hooks'

const statusIcons: Record<string, any> = {
  success: CheckCircle,
  failed: XCircle,
}

export default function Cron() {
  const { data, loading } = useApi<any>('/api/cron', 30000)

  if (loading || !data) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    )
  }

  const { jobs } = data

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-glass tracking-tight flex items-center gap-3">
            <Clock size={24} className="text-blue-300/60" strokeWidth={1.5} />
            Cron Monitor
          </h1>
          <p className="text-sm text-glass-muted mt-1">Scheduled jobs and automation status</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <GlassCard className="p-5" delay={0.05}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-400/15 border border-emerald-400/20 flex items-center justify-center">
                <Play size={14} className="text-emerald-400" />
              </div>
              <span className="text-xs text-glass-muted font-semibold">Active</span>
            </div>
            <p className="text-3xl font-light text-glass">
              {jobs.filter((j: any) => j.status === 'active').length}
            </p>
          </GlassCard>
          <GlassCard className="p-5" delay={0.1}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/20 flex items-center justify-center">
                <Pause size={14} className="text-amber-400" />
              </div>
              <span className="text-xs text-glass-muted font-semibold">Paused</span>
            </div>
            <p className="text-3xl font-light text-glass">
              {jobs.filter((j: any) => j.status === 'paused').length}
            </p>
          </GlassCard>
          <GlassCard className="p-5" delay={0.15}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-red-400/15 border border-red-400/20 flex items-center justify-center">
                <AlertTriangle size={14} className="text-red-400" />
              </div>
              <span className="text-xs text-glass-muted font-semibold">Failed</span>
            </div>
            <p className="text-3xl font-light text-glass">
              {jobs.filter((j: any) => j.status === 'failed').length}
            </p>
          </GlassCard>
        </div>

        {/* Jobs List */}
        <GlassCard className="overflow-hidden" delay={0.2} hover={false}>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/[0.08] text-[10px] text-glass-muted font-semibold uppercase tracking-[0.15em]">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Schedule</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Last Run</div>
            <div className="col-span-2">Next Run</div>
            <div className="col-span-1">Duration</div>
            <div className="col-span-1">History</div>
          </div>

          {/* Rows */}
          {jobs.map((job: any, i: number) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              className="grid grid-cols-12 gap-4 px-6 py-4 glass-row items-center"
            >
              <div className="col-span-3">
                <p className="text-sm font-semibold text-glass">{job.name}</p>
                <p className="text-[10px] text-glass-muted font-mono">{job.id}</p>
              </div>
              <div className="col-span-2">
                <code className="text-xs text-purple-300 bg-white/[0.06] border border-white/[0.08] px-2 py-1 rounded-lg font-mono">
                  {job.schedule}
                </code>
              </div>
              <div className="col-span-1">
                <StatusBadge status={job.status} />
              </div>
              <div className="col-span-2">
                <p className="text-xs text-glass-secondary">{timeAgo(job.lastRun)}</p>
                <p className="text-[10px] text-glass-muted">{formatDate(job.lastRun)}</p>
              </div>
              <div className="col-span-2">
                {job.nextRun ? (
                  <>
                    <p className="text-xs text-glass-secondary">{timeAgo(job.nextRun).replace('ago', 'from now')}</p>
                    <p className="text-[10px] text-glass-muted">{formatDate(job.nextRun)}</p>
                  </>
                ) : (
                  <span className="text-xs text-glass-muted">—</span>
                )}
              </div>
              <div className="col-span-1">
                <span className="text-xs text-glass-secondary font-medium">{job.duration}</span>
              </div>
              <div className="col-span-1 flex gap-1.5">
                {job.history?.slice(0, 3).map((h: any, hi: number) => {
                  const Icon = statusIcons[h.status] || CheckCircle
                  return (
                    <Icon
                      key={hi}
                      size={13}
                      className={h.status === 'success' ? 'text-emerald-400/70' : 'text-red-400/70'}
                    />
                  )
                })}
              </div>
            </motion.div>
          ))}
        </GlassCard>
      </div>
    </PageTransition>
  )
}
