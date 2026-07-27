import { FaCircleExclamation } from 'react-icons/fa6'

function ChartContainer({ title, subtitle, loading, error, isEmpty, emptyMessage, children }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-steel bg-carbon p-5">
        <div className="mb-4 h-5 w-1/3 animate-pulse rounded bg-steel" />
        <div className="h-[250px] animate-pulse rounded-lg bg-steel/50" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-red-900/50 bg-red-950/20 p-8">
        <div className="text-center">
          <FaCircleExclamation className="mx-auto mb-2 size-6 text-red-400" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-steel bg-carbon p-5">
        <h4 className="mb-1 font-display text-base font-black italic text-sf-white">{title}</h4>
        {subtitle && <p className="mb-4 text-xs text-muted-dim">{subtitle}</p>}
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-steel">
          <p className="text-sm text-muted-dim">{emptyMessage || 'No data available'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-steel bg-carbon p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="font-display text-base font-black italic text-sf-white">{title}</h4>
          {subtitle && <p className="mt-0.5 text-xs text-muted-dim">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default ChartContainer
