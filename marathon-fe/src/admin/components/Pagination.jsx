import { useMemo } from 'react'
import { FaChevronLeft, FaChevronRight, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = []
  if (current <= 3) {
    for (let i = 1; i <= Math.min(4, total); i++) pages.push(i)
    if (total > 5) {
      pages.push('...')
      pages.push(total)
    }
  } else if (current >= total - 2) {
    pages.push(1)
    pages.push('...')
    for (let i = Math.max(total - 3, 2); i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push('...')
    pages.push(current - 1)
    pages.push(current)
    pages.push(current + 1)
    pages.push('...')
    pages.push(total)
  }
  return pages
}

function Pagination({ page, total, rowsPerPage = 10, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))

  const pages = useMemo(() => getPageNumbers(page, totalPages), [page, totalPages])

  if (totalPages <= 1) return null

  const btn =
    'flex items-center justify-center rounded-lg border border-steel/60 px-2.5 py-1.5 text-xs font-medium text-muted-dim transition-colors hover:bg-steel/40 hover:text-sf-white disabled:opacity-30 disabled:pointer-events-none'

  return (
    <nav className="flex items-center gap-1" aria-label="Pagination">
      <button className={btn} disabled={page <= 1} onClick={() => onPageChange?.(1)} aria-label="First page">
        <FaAnglesLeft size={11} />
      </button>
      <button className={btn} disabled={page <= 1} onClick={() => onPageChange?.(page - 1)} aria-label="Previous page">
        <FaChevronLeft size={11} />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted-dim/50">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange?.(p)}
            className={`flex items-center justify-center rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              p === page
                ? 'border-ember/40 bg-ember/10 text-ember'
                : 'border-steel/60 text-muted-dim hover:bg-steel/40 hover:text-sf-white'
            }`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        ),
      )}

      <button className={btn} disabled={page >= totalPages} onClick={() => onPageChange?.(page + 1)} aria-label="Next page">
        <FaChevronRight size={11} />
      </button>
      <button className={btn} disabled={page >= totalPages} onClick={() => onPageChange?.(totalPages)} aria-label="Last page">
        <FaAnglesRight size={11} />
      </button>
    </nav>
  )
}

export default Pagination
