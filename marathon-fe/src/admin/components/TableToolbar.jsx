import { FaXmark, FaTrashCan, FaFileExport } from 'react-icons/fa6'
import SearchInput from './SearchInput'
import FilterPanel from './FilterPanel'

function TableToolbar({
  searchable,
  searchValue,
  onSearch,
  searchPlaceholder,
  filterable,
  filters,
  filterConfig,
  onFilter,
  selectable,
  selectedCount,
  bulkActions,
  onClearSelection,
  headerActions,
}) {
  const showSearch = searchable
  const showFilter = filterable
  const showBulk = selectable && selectedCount > 0

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {showSearch && (
        <div className="min-w-[200px] flex-1 lg:max-w-xs">
          <SearchInput value={searchValue} onChange={onSearch} placeholder={searchPlaceholder} />
        </div>
      )}

      {showFilter && (
        <FilterPanel config={filterConfig} filters={filters} onChange={onFilter} />
      )}

      {headerActions && (
        <div className="ml-auto flex items-center gap-2">
          {headerActions}
        </div>
      )}

      {showBulk && (
        <div className="flex items-center gap-2 rounded-lg border border-ember/30 bg-ember/5 px-3 py-1.5">
          <span className="text-xs font-medium text-ember">{selectedCount} selected</span>
          {bulkActions?.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="rounded-md px-2 py-1 text-xs text-muted-dim transition-colors hover:bg-steel/40 hover:text-sf-white"
              title={action.label}
            >
              {action.icon === 'delete' && <FaTrashCan size={11} />}
              {action.icon === 'export' && <FaFileExport size={11} />}
              {!action.icon && action.label}
            </button>
          ))}
          <button
            onClick={onClearSelection}
            className="ml-2 rounded-md p-1 text-muted-dim transition-colors hover:text-sf-white"
            aria-label="Clear selection"
          >
            <FaXmark size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

export default TableToolbar
