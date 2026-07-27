import {
  FaCircleCheck,
  FaUserPlus,
  FaBell,
  FaCalendarDays,
  FaCircleExclamation,
} from 'react-icons/fa6'

const typeConfig = {
  payment: { icon: FaCircleCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  registration: { icon: FaUserPlus, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  reminder: { icon: FaCalendarDays, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  alert: { icon: FaCircleExclamation, color: 'text-red-400', bg: 'bg-red-500/10' },
  default: { icon: FaBell, color: 'text-muted', bg: 'bg-steel/30' },
}

function formatNotificationTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function NotificationPanel({ notifications = [], loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="size-8 shrink-0 animate-pulse rounded-full bg-steel/40" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-3/4 animate-pulse rounded bg-steel/40" />
              <div className="h-2.5 w-1/4 animate-pulse rounded bg-steel/20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-sm text-muted-dim">No notifications</p>
      </div>
    )
  }

  return (
    <div className="space-y-0.5">
      {notifications.map((n) => {
        const cfg = typeConfig[n.type] || typeConfig.default
        const Icon = cfg.icon
        return (
          <div
            key={n.id}
            className={`flex items-start gap-3 rounded-lg p-2.5 transition-all duration-150 hover:bg-steel/20 ${
              n.read ? 'opacity-50' : ''
            }`}
          >
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${cfg.bg} ring-1 ring-inset ring-white/5`}>
              <Icon className={`size-4 ${cfg.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-relaxed text-sf-white">{n.message}</p>
              <p className="mt-0.5 text-[11px] text-muted-dim">
                {formatNotificationTime(n.timestamp)}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NotificationPanel
