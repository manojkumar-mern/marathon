import { FaCircleExclamation } from 'react-icons/fa6'
import LoadingSkeleton from './LoadingSkeleton'
import EmptyState from './EmptyState'

function DashboardWidget({ title, loading, error, emptyMessage, isEmpty, children }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-steel bg-carbon p-5">
        <div className="mb-4 h-5 w-1/3 animate-pulse rounded bg-steel" />
        <LoadingSkeleton rows={3} cols={2} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center">
        <FaCircleExclamation className="mx-auto mb-2 size-6 text-red-400" />
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-steel bg-carbon p-5">
        <h4 className="mb-4 font-display text-lg font-black italic text-sf-white">{title}</h4>
        <EmptyState message={emptyMessage || 'No data available'} />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-steel bg-carbon p-5">
      <h4 className="mb-4 font-display text-lg font-black italic text-sf-white">{title}</h4>
      {children}
    </div>
  )
}

export default DashboardWidget
