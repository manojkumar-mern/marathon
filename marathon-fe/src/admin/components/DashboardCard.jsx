import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa6'

function DashboardCard({ label, value, icon: Icon, format, loading, error, trend }) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">{label}</p>
          {Icon && <Icon className="size-4 text-red-400" />}
        </div>
        <p className="mt-3 text-sm text-red-400">Failed to load</p>
      </div>
    )
  }

  return (
    <div className="group rounded-xl border border-steel/60 bg-carbon p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-ember/30 hover:shadow-lg hover:shadow-ember/5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">{label}</p>
        {Icon && (
          <div className="flex size-8 items-center justify-center rounded-lg bg-ember/10 ring-1 ring-ember/20 transition-all duration-150 group-hover:bg-ember/15 group-hover:ring-ember/30">
            <Icon className="size-4 text-ember" />
          </div>
        )}
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-24 animate-pulse rounded-md bg-steel/60" />
      ) : (
        <p className="mt-2 truncate font-display text-2xl font-black tracking-tight text-sf-white lg:text-3xl">
          {value != null && format ? format(value) : value ?? '—'}
        </p>
      )}
      {trend && !loading && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend.direction === 'up' ? (
            <FaArrowUp className="size-2.5 text-emerald-400" />
          ) : trend.direction === 'down' ? (
            <FaArrowDown className="size-2.5 text-red-400" />
          ) : (
            <FaMinus className="size-2.5 text-muted-dim" />
          )}
          <span
            className={`text-xs font-medium ${
              trend.direction === 'up'
                ? 'text-emerald-400'
                : trend.direction === 'down'
                  ? 'text-red-400'
                  : 'text-muted-dim'
            }`}
          >
            {trend.value != null ? `${Math.abs(trend.value)}%` : ''}
          </span>
          {trend.label && <span className="text-xs text-muted-dim">{trend.label}</span>}
        </div>
      )}
    </div>
  )
}

export default DashboardCard
