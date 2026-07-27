import { useState } from 'react'
import { FaFilter, FaXmark } from 'react-icons/fa6'

const filterTypeMap = {
  select: 'select',
  status: 'select',
  text: 'text',
  date: 'date',
}

function FilterControl({ config, value, onChange }) {
  const type = filterTypeMap[config.type] || 'text'

  if (type === 'select' && config.options) {
    return (
      <select
        value={value || ''}
        onChange={(e) => onChange(config.key, e.target.value || undefined)}
        className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-xs text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
        aria-label={`Filter by ${config.label}`}
      >
        <option value="">All {config.label}</option>
        {config.options.map((opt) => {
          const optVal = typeof opt === 'object' ? opt.value : opt
          const optLabel = typeof opt === 'object' ? opt.label : opt
          return (
            <option key={optVal} value={optVal}>
              {optLabel}
            </option>
          )
        })}
      </select>
    )
  }

  return (
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(config.key, e.target.value || undefined)}
      placeholder={`Filter ${config.label.toLowerCase()}...`}
      className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-xs text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20 placeholder-muted-dim/60"
      aria-label={`Filter by ${config.label}`}
    />
  )
}

function FilterPanel({ config = [], filters = {}, onChange, onReset }) {
  const [open, setOpen] = useState(false)

  const activeCount = Object.values(filters).filter(Boolean).length

  function handleChange(key, value) {
    onChange?.({ ...filters, [key]: value || undefined })
  }

  function handleReset() {
    onChange?.({})
    onReset?.()
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
          activeCount > 0
            ? 'border-ember/40 bg-ember/10 text-ember'
            : 'border-steel/60 text-muted-dim hover:bg-steel/40 hover:text-sf-white'
        }`}
        aria-expanded={open}
      >
        <FaFilter size={11} />
        Filters
        {activeCount > 0 && (
          <span className="flex size-4 items-center justify-center rounded-full bg-ember text-[10px] font-bold text-obsidian">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1.5 w-72 rounded-xl border border-steel/60 bg-carbon p-4 shadow-2xl shadow-black/30">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-sf-white">Filters</span>
            <button
              onClick={() => { setOpen(false); handleReset() }}
              className="text-xs text-muted-dim hover:text-sf-white transition-colors"
            >
              Reset all
            </button>
          </div>
          <div className="space-y-3">
            {config.map((cfg) => (
              <div key={cfg.key}>
                <label className="mb-1 block text-xs text-muted-dim">{cfg.label}</label>
                <FilterControl config={cfg} value={filters[cfg.key]} onChange={handleChange} />
              </div>
            ))}
          </div>
          <button
            onClick={() => setOpen(false)}
            className="mt-4 w-full rounded-lg bg-ember py-2 text-xs font-semibold text-obsidian transition-colors hover:bg-amber-600"
          >
            Apply
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
      )}
    </div>
  )
}

export default FilterPanel
