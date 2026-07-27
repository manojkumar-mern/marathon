import { useState, useCallback } from 'react'

function useBulkSelect() {
  const [selected, setSelected] = useState(new Set())

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const togglePage = useCallback((ids) => {
    setSelected((prev) => {
      const next = new Set(prev)
      const allSelected = ids.every((id) => next.has(id))
      ids.forEach((id) => (allSelected ? next.delete(id) : next.add(id)))
      return next
    })
  }, [])

  const toggleAll = useCallback((allIds) => {
    setSelected((prev) => (prev.size === allIds.length ? new Set() : new Set(allIds)))
  }, [])

  const clear = useCallback(() => setSelected(new Set()), [])

  const replace = useCallback((newSet) => setSelected(new Set(newSet)), [])

  return { selected, toggle, togglePage, toggleAll, clear, replace, count: selected.size }
}

export default useBulkSelect
