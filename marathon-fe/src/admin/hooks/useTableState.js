import { useState, useCallback } from 'react'

function useTableState(initialState = {}) {
  const [search, setSearch] = useState(initialState.search || '')
  const [filters, setFilters] = useState(initialState.filters || {})
  const [sort, setSort] = useState(initialState.sort || { key: '', direction: 'asc' })
  const [page, setPage] = useState(initialState.page || 1)
  const [rowsPerPage, setRowsPerPage] = useState(initialState.rowsPerPage || 50)

  const reset = useCallback(() => {
    setSearch('')
    setFilters({})
    setSort({ key: '', direction: 'asc' })
    setPage(1)
  }, [])

  return {
    search,
    setSearch,
    filters,
    setFilters,
    sort,
    setSort,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    reset,
  }
}

export default useTableState
