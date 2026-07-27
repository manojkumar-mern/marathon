import { FaCircleExclamation } from 'react-icons/fa6'
import LoadingSkeleton from './LoadingSkeleton'
import EmptyState from './EmptyState'

const statusColors = {
  paid: 'text-emerald-400',
  completed: 'text-emerald-400',
  pending: 'text-amber-400',
  failed: 'text-red-400',
  cancelled: 'text-muted-dim',
  confirmed: 'text-emerald-400',
  withdrawn: 'text-muted-dim',
  refunded: 'text-purple-400',
}

function DashboardTable({ columns, data, loading, error, emptyMessage = 'No data available' }) {
  if (loading) {
    return (
      <div className="rounded-xl border border-steel/60 bg-carbon p-4">
        <LoadingSkeleton rows={5} cols={columns.length} />
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

  if (!data || data.length === 0) {
    return <EmptyState message={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-steel/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-steel/60 bg-carbon/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className="whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-dim"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row._id || i}
              className="border-b border-steel/30 transition-colors last:border-0 hover:bg-steel/10"
            >
              {columns.map((col) => {
                const raw = row[col.key]
                const isStatus = col.key === 'paymentStatus' || col.key === 'registrationStatus'
                return (
                  <td key={col.key} className="whitespace-nowrap px-4 py-3 text-sf-white">
                    {col.render ? (
                      col.render(raw, row)
                    ) : isStatus ? (
                      <span className={`capitalize ${statusColors[raw] || 'text-muted'}`}>
                        {raw}
                      </span>
                    ) : (
                      raw ?? '—'
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DashboardTable
