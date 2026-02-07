interface Props {
  status: 'active' | 'idle' | 'paused' | 'failed' | 'ok' | 'error' | 'off' | string
  size?: 'sm' | 'md'
  pulse?: boolean
  label?: string
}

const statusColors: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  active: {
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-300',
    border: 'border-emerald-400/20'
  },
  ok: {
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-400/10',
    text: 'text-emerald-300',
    border: 'border-emerald-400/20'
  },
  idle: {
    dot: 'bg-blue-400',
    bg: 'bg-blue-400/10',
    text: 'text-blue-300',
    border: 'border-blue-400/20'
  },
  paused: {
    dot: 'bg-amber-400',
    bg: 'bg-amber-400/10',
    text: 'text-amber-300',
    border: 'border-amber-400/20'
  },
  failed: {
    dot: 'bg-red-400',
    bg: 'bg-red-400/10',
    text: 'text-red-300',
    border: 'border-red-400/20'
  },
  error: {
    dot: 'bg-red-400',
    bg: 'bg-red-400/10',
    text: 'text-red-300',
    border: 'border-red-400/20'
  },
  off: {
    dot: 'bg-white/30',
    bg: 'bg-white/5',
    text: 'text-white/40',
    border: 'border-white/10'
  },
}

export default function StatusBadge({ status, size = 'sm', pulse = false, label }: Props) {
  const s = statusColors[status.toLowerCase()] || statusColors.off
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'

  return (
    <span className={`pill-badge inline-flex items-center gap-1.5 px-2.5 py-1 ${s.bg} border ${s.border}`}>
      <span className={`${dotSize} rounded-full ${s.dot} ${pulse ? 'animate-pulse' : ''}`} />
      <span className={`text-[11px] font-medium ${s.text} capitalize`}>{label || status}</span>
    </span>
  )
}
