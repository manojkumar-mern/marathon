function RowsPerPageSelector({ value = 10, options = [10, 25, 50, 100], onChange }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span className="text-xs">Rows</span>
      <select
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="rounded-lg border border-steel bg-carbon px-2 py-1.5 text-xs text-sf-white outline-none transition-colors focus:border-ember/50"
        aria-label="Rows per page"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}

export default RowsPerPageSelector
