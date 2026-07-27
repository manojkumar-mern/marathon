import { useEffect, useRef, useState } from 'react'
import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6'
import useDebounce from '../hooks/useDebounce'

function SearchInput({ value = '', onChange, placeholder = 'Search...', debounceMs = 300 }) {
  const [local, setLocal] = useState(value)
  const debounced = useDebounce(local, debounceMs)
  const inputRef = useRef(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onChange?.(debounced)
  }, [debounced, onChange])

  useEffect(() => {
    setLocal(value)
  }, [value])

  function handleClear() {
    setLocal('')
    onChange?.('')
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <FaMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-dim/50" />
      <input
        ref={inputRef}
        type="text"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-steel/60 bg-carbon py-2 pl-9 pr-8 text-sm text-sf-white placeholder-muted-dim/60 outline-none transition-all duration-150 focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
        aria-label={placeholder}
      />
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-dim/50 hover:text-sf-white transition-colors"
          aria-label="Clear search"
        >
          <FaXmark size={14} />
        </button>
      )}
    </div>
  )
}

export default SearchInput
