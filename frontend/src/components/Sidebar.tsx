import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Hammer,
  DollarSign,
  Clock,
  Radar,
  FileText,
  Bot,
  Zap
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', emoji: '🏠' },
  { to: '/workshop', icon: Hammer, label: 'Workshop', emoji: '🔨' },
  { to: '/costs', icon: DollarSign, label: 'Cost Tracker', emoji: '💰' },
  { to: '/cron', icon: Clock, label: 'Cron Monitor', emoji: '⏰' },
  { to: '/scout', icon: Radar, label: 'Twitter Scout', emoji: '🐦' },
  { to: '/docs', icon: FileText, label: 'Doc Digest', emoji: '📄' },
  { to: '/agents', icon: Bot, label: 'Agent Hub', emoji: '🤖' },
]

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen flex flex-col sidebar-glass shrink-0">
      {/* Logo Section */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-glass tracking-tight">Mission Control</h1>
            <p className="text-[10px] text-glass-muted font-semibold tracking-[0.15em] uppercase">Zinbot HQ</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'nav-glass nav-glass-active text-glass'
                    : 'nav-glass text-glass-secondary hover:text-glass'
                }`
              }
            >
              <item.icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Footer */}
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-emerald-500/10 border border-white/10 flex items-center justify-center text-base shadow-inner">
            🤖
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-glass truncate">Zinbot</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 glow-green" />
              <span className="text-[10px] text-emerald-300 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
