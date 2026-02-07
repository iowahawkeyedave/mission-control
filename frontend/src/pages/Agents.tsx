import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, MessageSquare, Activity, BarChart3 } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import GlassCard from '../components/GlassCard'
import StatusBadge from '../components/StatusBadge'
import AnimatedCounter from '../components/AnimatedCounter'
import { useApi, timeAgo } from '../lib/hooks'

export default function Agents() {
  const { data, loading } = useApi<any>('/api/agents', 30000)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  if (loading || !data) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    )
  }

  const { agents, conversations } = data
  const selected = agents.find((a: any) => a.id === selectedAgent)

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-glass tracking-tight flex items-center gap-3">
            <Bot size={24} className="text-violet-300/60" strokeWidth={1.5} />
            Agent Hub
          </h1>
          <p className="text-sm text-glass-muted mt-1">Multi-agent orchestration & communication</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agent Grid */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent: any, i: number) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                  className={`liquid-glass p-5 cursor-pointer transition-all duration-300 ${
                    selectedAgent === agent.id
                      ? '!border-purple-400/40 !bg-purple-500/[0.08]'
                      : ''
                  }`}
                  style={{ borderRadius: '20px' }}
                >
                  <div className="relative z-10">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xl shadow-inner">
                        {agent.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-glass">{agent.name}</h3>
                          <StatusBadge status={agent.status} pulse={agent.status === 'active'} />
                        </div>
                        <p className="text-[11px] text-glass-muted">{agent.role} · {agent.model}</p>
                      </div>
                    </div>
                    <p className="text-xs text-glass-muted mb-4 line-clamp-2">{agent.description}</p>
                    <div className="flex items-center gap-4 text-[11px] text-glass-muted">
                      <span className="flex items-center gap-1">
                        <BarChart3 size={11} className="text-white/40" /> {agent.tasksCompleted} tasks
                      </span>
                      <span className="flex items-center gap-1">
                        <Activity size={11} className="text-white/40" /> {agent.uptime} uptime
                      </span>
                      <span className="ml-auto">
                        {timeAgo(agent.lastActive)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detail Panel */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.98 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <GlassCard className="p-6" hover={false}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl">
                          {selected.avatar}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-glass">{selected.name}</h3>
                          <p className="text-xs text-glass-muted">{selected.description}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedAgent(null)}
                        className="glass-button p-2"
                      >
                        <X size={16} className="text-white/60" />
                      </motion.button>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { label: 'Tasks Done', value: <AnimatedCounter end={selected.tasksCompleted} />, },
                        { label: 'Uptime', value: selected.uptime },
                        { label: 'Model', value: selected.model },
                        { label: 'Status', value: <StatusBadge status={selected.status} size="md" /> },
                      ].map((item, idx) => (
                        <div key={idx} className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                          <p className="text-xl font-light text-glass">{item.value}</p>
                          <p className="text-[10px] text-glass-muted font-semibold mt-1 uppercase tracking-wider">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Feed */}
          <GlassCard className="p-6 lg:col-span-1" delay={0.15} hover={false}>
            <h3 className="text-sm font-semibold text-glass-secondary mb-5 flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-300/60" /> Inter-Agent Chat
            </h3>
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {conversations.map((msg: any, i: number) => {
                const fromAgent = agents.find((a: any) => a.id === msg.from)
                const isLeft = i % 2 === 0
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.04 }}
                    className={`flex gap-2.5 ${isLeft ? '' : 'flex-row-reverse'}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-xs shrink-0">
                      {fromAgent?.avatar || '🤖'}
                    </div>
                    <div className={`max-w-[80%] ${isLeft ? '' : 'text-right'}`}>
                      <div className={`flex items-center gap-1.5 mb-1 ${isLeft ? '' : 'justify-end'}`}>
                        <span className="text-[10px] font-semibold text-glass-secondary">{fromAgent?.name || msg.from}</span>
                        <span className="text-[10px] text-glass-muted">→ {msg.to}</span>
                      </div>
                      <div className={`px-3.5 py-2.5 text-xs text-glass-secondary ${
                        isLeft ? 'glass-bubble-left' : 'glass-bubble-right'
                      }`}>
                        {msg.message}
                      </div>
                      <span className="text-[9px] text-glass-muted mt-1 block">{timeAgo(msg.time)}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </PageTransition>
  )
}
