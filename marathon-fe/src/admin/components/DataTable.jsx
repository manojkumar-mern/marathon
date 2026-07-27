import { useMemo } from 'react'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa6'
import TableToolbar from './TableToolbar'
import Pagination from './Pagination'
import RowsPerPageSelector from './RowsPerPageSelector'
import ActionMenu from './ActionMenu'
import ErrorState from './ErrorState'
import EmptyState from './EmptyState'
import NoResultsState from './NoResultsState'
import LoadingSkeleton from './LoadingSkeleton'

function DataTable({
  columns = [],
  data,
  loading,
  error,
  errorMessage = 'Failed to load data',
  emptyMessage = 'No data available',
  noResultsMessage = 'No results match your search or filters',
  rowKey = '_id',

  searchable,
  searchValue,
  onSearch,
  searchPlaceholder,

  filterable,
  filters,
  filterConfig,
  onFilter,

  sortable,
  sort,
  onSort,

  paginated,
  page,
  rowsPerPage,
  totalRecords,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions,

  selectable,
  selected,
  onSelectionChange,
  bulkActions,

  actions,

  className = '',
  headerActions,
}) {
  const hasActiveFilters = useMemo(
    () => searchValue || Object.values(filters || {}).some(Boolean),
    [searchValue, filters],
  )
  const isEmpty = !loading && !error && (!data || data.length === 0)
  const isNoResults = isEmpty && hasActiveFilters
  const isTableEmpty = isEmpty && !hasActiveFilters
  const allIds = useMemo(() => data?.map((r) => r[rowKey]) || [], [data, rowKey])
  const allSelected = data?.length > 0 && selected?.size === data?.length

  function handleSortClick(colKey) {
    if (!onSort) return
    if (sort?.key === colKey) {
      if (sort.direction === 'asc') {
        onSort({ key: colKey, direction: 'desc' })
      } else {
        onSort({ key: '', direction: 'asc' })
      }
    } else {
      onSort({ key: colKey, direction: 'asc' })
    }
  }

  function renderSortIcon(colKey) {
    if (sort?.key !== colKey) return <FaSort className="size-3 text-muted-dim/50" />
    return sort.direction === 'asc' ? (
      <FaSortUp className="size-3 text-ember" />
    ) : (
      <FaSortDown className="size-3 text-ember" />
    )
  }

  function handleSelectAll() {
    if (!onSelectionChange) return
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(allIds))
    }
  }

  function handleSelectRow(id) {
    if (!onSelectionChange) return
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onSelectionChange(next)
  }

  return (
    <div className={className}>
      <TableToolbar
        searchable={searchable}
        searchValue={searchValue}
        onSearch={onSearch}
        searchPlaceholder={searchPlaceholder}
        filterable={filterable}
        filters={filters}
        filterConfig={filterConfig}
        onFilter={onFilter}
        selectable={selectable}
        selectedCount={selected?.size || 0}
        bulkActions={bulkActions}
        onClearSelection={() => onSelectionChange?.(new Set())}
        headerActions={headerActions}
      />

      {loading ? (
        <div className="rounded-xl border border-steel/60 bg-carbon p-4">
          <LoadingSkeleton rows={5} cols={columns.length} />
        </div>
      ) : error ? (
        <ErrorState message={errorMessage} />
      ) : isNoResults ? (
        <NoResultsState message={noResultsMessage} onClear={() => { onSearch?.(''); onFilter?.({}) }} />
      ) : isTableEmpty ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-steel/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-steel/60 bg-carbon/80">
                {selectable && (
                  <th className="w-10 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="rounded border-steel/60 bg-obsidian text-ember outline-none focus:ring-2 focus:ring-ember/30 focus:ring-offset-0"
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`whitespace-nowrap px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-dim ${
                      col.sortable && sortable
                        ? 'cursor-pointer select-none hover:text-sf-white'
                        : ''
                    } ${col.className || ''}`}
                    onClick={() => col.sortable && sortable && handleSortClick(col.key)}
                    aria-sort={
                      sort?.key === col.key
                        ? sort.direction === 'asc' ? 'ascending' : 'descending'
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && sortable && renderSortIcon(col.key)}
                    </div>
                  </th>
                ))}
                {actions?.length > 0 && <th className="w-12 px-4 py-3.5" />}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr
                  key={row[rowKey] || i}
                  className="border-b border-steel/30 transition-colors last:border-0 hover:bg-steel/10"
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected?.has(row[rowKey])}
                        onChange={() => handleSelectRow(row[rowKey])}
                        className="rounded border-steel/60 bg-obsidian text-ember outline-none focus:ring-2 focus:ring-ember/30 focus:ring-offset-0"
                        aria-label="Select row"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`whitespace-nowrap px-4 py-3 text-sf-white ${col.cellClassName || ''}`}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] ?? '—'}
                    </td>
                  ))}
                  {actions?.length > 0 && (
                    <td className="px-4 py-3">
                      <ActionMenu
                        items={actions.map((a) => ({
                          ...a,
                          onClick: () => a.onClick(row),
                          disabled: typeof a.disabled === 'function' ? a.disabled(row) : a.disabled,
                        }))}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {paginated && !loading && !error && data?.length > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <RowsPerPageSelector
            value={rowsPerPage || 10}
            options={rowsPerPageOptions}
            onChange={onRowsPerPageChange}
          />
          <Pagination
            page={page || 1}
            rowsPerPage={rowsPerPage || 10}
            total={totalRecords || data.length}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default DataTable
