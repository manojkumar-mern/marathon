const dotMap = {
  paid: 'bg-emerald-400',
  completed: 'bg-emerald-400',
  confirmed: 'bg-emerald-400',
  published: 'bg-emerald-400',
  active: 'bg-emerald-400',
  registrationopen: 'bg-emerald-400',
  success: 'bg-emerald-400',
  pending: 'bg-amber-400',
  authorized: 'bg-blue-400',
  registrationclosed: 'bg-blue-400',
  info: 'bg-blue-400',
  failed: 'bg-red-400',
  error: 'bg-red-400',
  cancelled: 'bg-gray-400',
  withdrawn: 'bg-gray-400',
  draft: 'bg-gray-400',
  inactive: 'bg-gray-400',
  warning: 'bg-amber-400',
  refunded: 'bg-purple-400',
}

const textMap = {
  paid: 'text-emerald-400',
  completed: 'text-emerald-400',
  confirmed: 'text-emerald-400',
  published: 'text-emerald-400',
  active: 'text-emerald-400',
  registrationopen: 'text-emerald-400',
  success: 'text-emerald-400',
  pending: 'text-amber-400',
  authorized: 'text-blue-400',
  registrationclosed: 'text-blue-400',
  info: 'text-blue-400',
  failed: 'text-red-400',
  error: 'text-red-400',
  cancelled: 'text-muted-dim',
  withdrawn: 'text-muted-dim',
  draft: 'text-muted-dim',
  inactive: 'text-muted-dim',
  warning: 'text-amber-400',
  refunded: 'text-purple-400',
}

const bgMap = {
  paid: 'bg-emerald-500/10',
  completed: 'bg-emerald-500/10',
  confirmed: 'bg-emerald-500/10',
  published: 'bg-emerald-500/10',
  active: 'bg-emerald-500/10',
  registrationopen: 'bg-emerald-500/10',
  success: 'bg-emerald-500/10',
  pending: 'bg-amber-500/10',
  authorized: 'bg-blue-500/10',
  registrationclosed: 'bg-blue-500/10',
  info: 'bg-blue-500/10',
  failed: 'bg-red-500/10',
  error: 'bg-red-500/10',
  cancelled: 'bg-gray-500/10',
  withdrawn: 'bg-gray-500/10',
  draft: 'bg-gray-500/10',
  inactive: 'bg-gray-500/10',
  warning: 'bg-amber-500/10',
  refunded: 'bg-purple-500/10',
}

function StatusBadge({ status, className = '' }) {
  const key = String(status ?? '').toLowerCase().replace(/\s+/g, '')
  const dot = dotMap[key] || 'bg-gray-400'
  const text = textMap[key] || 'text-muted-dim'
  const bg = bgMap[key] || 'bg-gray-500/10'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${dot}`} />
      {status ?? '—'}
    </span>
  )
}

export default StatusBadge
