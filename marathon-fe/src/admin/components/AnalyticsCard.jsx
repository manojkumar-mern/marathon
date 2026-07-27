import { FaCircleExclamation } from 'react-icons/fa6'

function AnalyticsCard({ title, subtitle, loading, error, isEmpty, emptyMessage, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-steel/60 bg-carbon p-4 lg:p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h4 className="font-display text-sm font-black italic text-sf-white lg:text-base">{title}</h4>
          {subtitle && <p className="mt-0.5 text-xs text-muted-dim">{subtitle}</p>}
        </div>
      </div>
      {loading ? (
        <div className="h-[250px] animate-pulse rounded-lg bg-steel/30" />
      ) : error ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-red-900/50">
          <div className="text-center">
            <FaCircleExclamation className="mx-auto mb-2 size-5 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        </div>
      ) : isEmpty ? (
        <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed border-steel/50">
          <p className="text-sm text-muted-dim">{emptyMessage || 'No data available'}</p>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

export default AnalyticsCard
