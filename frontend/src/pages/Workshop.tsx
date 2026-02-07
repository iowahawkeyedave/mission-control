import { motion } from 'framer-motion'
import { Hammer, Plus, GripVertical } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import { useApi, timeAgo } from '../lib/hooks'

const priorityColors: Record<string, { dot: string; glow: string }> = {
  high: { dot: 'bg-red-400', glow: 'shadow-[0_0_6px_rgba(248,113,113,0.4)]' },
  medium: { dot: 'bg-amber-400', glow: 'shadow-[0_0_6px_rgba(251,191,36,0.3)]' },
  low: { dot: 'bg-blue-400', glow: '' },
}

const columnMeta: Record<string, { title: string; accent: string; icon: string }> = {
  queue: { title: 'Queue', accent: 'from-white/20 to-white/5', icon: '📋' },
  inProgress: { title: 'In Progress', accent: 'from-blue-400/20 to-blue-600/5', icon: '⚡' },
  done: { title: 'Done', accent: 'from-emerald-400/20 to-emerald-600/5', icon: '✅' },
}

interface Task {
  id: string
  title: string
  description: string
  priority: string
  created?: string
  completed?: string
  tags: string[]
  assignee?: string
}

export default function Workshop() {
  const { data, loading } = useApi<any>('/api/tasks', 60000)

  if (loading || !data) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageTransition>
    )
  }

  const columns = data.columns

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-glass tracking-tight flex items-center gap-3">
              <Hammer size={24} className="text-amber-300/60" strokeWidth={1.5} />
              Workshop
            </h1>
            <p className="text-sm text-glass-muted mt-1">Task management & project tracking</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="glass-button glass-button-primary flex items-center gap-2 px-5 py-2.5 text-sm font-medium"
          >
            <Plus size={16} /> Add Task
          </motion.button>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {(['queue', 'inProgress', 'done'] as const).map((col, ci) => {
            const tasks: Task[] = columns[col] || []
            const meta = columnMeta[col]
            return (
              <div key={col} className="space-y-3">
                {/* Column Header */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.1 }}
                  className="flex items-center justify-between px-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{meta.icon}</span>
                    <h3 className="text-sm font-semibold text-glass">{meta.title}</h3>
                    <span className="pill-badge text-[11px] text-glass-muted px-2 py-0.5 font-semibold">
                      {tasks.length}
                    </span>
                  </div>
                </motion.div>

                {/* Cards */}
                <div className="space-y-3">
                  {tasks.map((task, i) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + ci * 0.1 + i * 0.05 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className="liquid-glass p-4 cursor-pointer group"
                      style={{ borderRadius: '18px' }}
                    >
                      <div className="relative z-10 flex items-start gap-2">
                        <GripVertical size={14} className="text-white/20 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]?.dot || 'bg-white/30'} ${priorityColors[task.priority]?.glow || ''}`} />
                            <h4 className="text-sm font-semibold text-glass truncate">{task.title}</h4>
                          </div>
                          <p className="text-xs text-glass-muted line-clamp-2 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1.5 flex-wrap">
                              {task.tags.map(tag => (
                                <span key={tag} className="pill-badge text-[10px] px-2 py-0.5 text-glass-muted font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <span className="text-[10px] text-glass-muted shrink-0">
                              {task.completed ? timeAgo(task.completed) : task.created ? timeAgo(task.created) : ''}
                            </span>
                          </div>
                          {task.assignee && (
                            <div className="mt-2.5 pt-2.5 border-t border-white/[0.08]">
                              <span className="text-[10px] text-glass-muted">
                                Assigned to <span className="text-glass-secondary font-medium">{task.assignee}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}
