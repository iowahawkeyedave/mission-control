import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
  CartesianGrid
} from 'recharts'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import AnimatedCounter from '../components/AnimatedCounter'
import { useApi } from '../lib/hooks'

const COLORS = ['#818cf8', '#c084fc', '#34d399', '#fbbf24', '#f87171', '#60a5fa']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-tooltip">
      <p className="text-glass-muted text-[11px] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-glass text-sm font-semibold">${p.value?.toFixed(2)}</p>
      ))}
    </div>
  )
}

export default function Costs() {
  const { data, loading } = useApi<any>('/api/costs', 60000)

  if (loading || !data) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    )
  }

  const { daily, summary, byService } = data
  const budgetPct = ((summary.thisMonth / summary.budget.monthly) * 100).toFixed(1)

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-glass tracking-tight flex items-center gap-3">
            <DollarSign size={24} className="text-emerald-300/60" strokeWidth={1.5} />
            Cost Tracker
          </h1>
          <p className="text-sm text-glass-muted mt-1">Monitor spending across all services</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Today', value: summary.today, icon: DollarSign, prefix: '$', gradient: 'from-emerald-400/20 to-emerald-600/10' },
            { label: 'This Week', value: summary.thisWeek, icon: TrendingUp, prefix: '$', gradient: 'from-blue-400/20 to-blue-600/10' },
            { label: 'This Month', value: summary.thisMonth, icon: TrendingDown, prefix: '$', gradient: 'from-purple-400/20 to-purple-600/10' },
            { label: 'Budget Used', value: parseFloat(budgetPct), icon: Target, suffix: '%', gradient: 'from-amber-400/20 to-amber-600/10' },
          ].map((m, i) => (
            <GlassCard key={m.label} className="p-5" delay={i * 0.05}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${m.gradient} border border-white/10 flex items-center justify-center`}>
                  <m.icon size={16} className="text-white/70" strokeWidth={1.5} />
                </div>
                <span className="text-[10px] text-glass-muted font-semibold uppercase tracking-wider">{m.label}</span>
              </div>
              <p className="text-2xl font-light text-glass">
                <AnimatedCounter end={m.value} decimals={2} prefix={m.prefix || ''} suffix={m.suffix || ''} />
              </p>
            </GlassCard>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spend Chart */}
          <GlassCard className="p-6 lg:col-span-2" delay={0.15} hover={false}>
            <h3 className="text-sm font-semibold text-glass-secondary mb-5">Monthly Spend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={daily}>
                  <defs>
                    <linearGradient id="costGradientLG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="50%" stopColor="#c084fc" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                    tickFormatter={(v) => v.slice(5)}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                    tickFormatter={(v) => `$${v}`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#a78bfa"
                    strokeWidth={2.5}
                    fill="url(#costGradientLG)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Service Breakdown */}
          <GlassCard className="p-6" delay={0.2} hover={false}>
            <h3 className="text-sm font-semibold text-glass-secondary mb-5">By Service</h3>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byService}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    dataKey="cost"
                    nameKey="name"
                    strokeWidth={0}
                  >
                    {byService.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.8} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2.5">
              {byService.map((s: any, i: number) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-glass-secondary truncate">{s.name}</span>
                  </div>
                  <span className="text-glass font-semibold">${s.cost.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Budget Progress */}
        <GlassCard className="p-6" delay={0.25} hover={false}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-glass-secondary">Budget Utilization</h3>
            <span className="text-xs text-glass-muted font-medium">
              ${summary.thisMonth.toFixed(2)} / ${summary.budget.monthly}
            </span>
          </div>
          <div className="glass-progress h-3.5">
            <div
              className={`glass-progress-fill h-full ${
                parseFloat(budgetPct) > 75
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
              }`}
              style={{ width: `${Math.min(parseFloat(budgetPct), 100)}%` }}
            />
          </div>
          {summary.thisMonth >= summary.budget.warning && (
            <p className="text-xs text-amber-300 mt-2.5 font-medium">⚠️ Approaching budget warning threshold</p>
          )}
        </GlassCard>

        {/* Daily Cost Bars */}
        <GlassCard className="p-6" delay={0.3} hover={false}>
          <h3 className="text-sm font-semibold text-glass-secondary mb-5">Daily Breakdown</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily.slice(-14)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                  tickFormatter={(v) => v.slice(8)}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }}
                  tickFormatter={(v) => `$${v}`}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" fill="#818cf8" radius={[8, 8, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </PageTransition>
  )
}
