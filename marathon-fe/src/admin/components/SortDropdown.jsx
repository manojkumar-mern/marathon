import { FaArrowUpWideShort, FaArrowDownWideShort } from 'react-icons/fa6'

function SortDropdown({ columns = [], sort, onSort }) {
  if (!columns.length) return null

  const sortedCols = columns.filter((c) => c.sortable)

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-xs text-muted">Sort</span>
      <select
        value={sort?.key || ''}
        onChange={(e) => {
          const col = e.target.value
          if (!col) {
            onSort?.({ key: '', direction: 'asc' })
          } else {
            onSort?.({ key: col, direction: sort?.direction || 'asc' })
          }
        }}
        className="rounded-lg border border-steel bg-carbon px-2 py-1.5 text-xs text-sf-white outline-none transition-colors focus:border-ember/50"
        aria-label="Sort by"
      >
        <option value="">Default</option>
        {sortedCols.map((col) => (
          <option key={col.key} value={col.key}>
            {col.label}
          </option>
        ))}
      </select>
      {sort?.key && (
        <button
          onClick={() =>
            onSort?.({
              key: sort.key,
              direction: sort.direction === 'asc' ? 'desc' : 'asc',
            })
          }
          className="rounded-lg border border-steel p-1.5 text-muted-dim transition-colors hover:bg-steel hover:text-sf-white"
          aria-label={`Sort ${sort.direction === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sort.direction === 'asc' ? (
            <FaArrowUpWideShort size={14} />
          ) : (
            <FaArrowDownWideShort size={14} />
          )}
        </button>
      )}
    </div>
  )
}

export default SortDropdown
