function StatCard({ label, value, icon: Icon, loading, error, format }) {
  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">{label}</p>
          {Icon && <Icon className="size-4 text-muted-dim" />}
        </div>
        <p className="mt-3 text-sm text-red-400">Failed to load</p>
      </div>
    )
  }

  const displayValue = format && value != null ? format(value) : value

  return (
    <div className="rounded-xl border border-steel bg-carbon p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">{label}</p>
        {Icon && <Icon className="size-4 text-muted-dim" />}
      </div>
      {loading ? (
        <div className="mt-3 h-8 w-20 animate-pulse rounded bg-steel" />
      ) : (
        <p className="mt-2 font-display text-3xl font-black text-sf-white">
          {displayValue ?? '—'}
        </p>
      )}
    </div>
  )
}

export default StatCard
