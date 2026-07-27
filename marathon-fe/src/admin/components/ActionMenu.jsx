import { useState, useRef, useEffect } from 'react'
import { FaEllipsisVertical } from 'react-icons/fa6'

function ActionMenu({ items = [], align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  if (!items.length) return null

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-1.5 text-muted-dim/50 transition-colors hover:bg-steel/40 hover:text-sf-white"
        aria-label="Actions"
        aria-expanded={open}
      >
        <FaEllipsisVertical size={14} />
      </button>
      {open && (
        <div
          className={`absolute top-full z-20 mt-1 w-40 rounded-xl border border-steel/60 bg-carbon p-1 shadow-2xl shadow-black/30 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick?.()
                setOpen(false)
              }}
              disabled={item.disabled}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                item.danger
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-muted-dim hover:bg-steel/40 hover:text-sf-white'
              } disabled:opacity-50`}
            >
              {item.icon && <item.icon className="size-4 shrink-0" />}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
