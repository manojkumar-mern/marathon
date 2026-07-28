import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { FaEllipsisVertical } from 'react-icons/fa6'

function ActionMenu({ items = [], align = 'right' }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const updatePosition = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const menuWidth = 160
    let left = align === 'right' ? rect.right - menuWidth : rect.left
    left = Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8))
    setCoords({ top: rect.bottom + 4, left })
  }, [align])

  useEffect(() => {
    if (!open) return
    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, updatePosition])

  useEffect(() => {
    function handleMousedown(e) {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', handleMousedown)
      document.addEventListener('keydown', handleKey)
    }
    return () => {
      document.removeEventListener('mousedown', handleMousedown)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  if (!items.length) return null

  return (
    <>
      <button
        ref={btnRef}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        className="rounded-lg p-1.5 text-muted-dim/50 transition-colors hover:bg-steel/40 hover:text-sf-white"
        aria-label="Actions"
        aria-expanded={open}
      >
        <FaEllipsisVertical size={14} />
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[999] w-40 rounded-xl border border-steel/60 bg-carbon p-1 shadow-2xl shadow-black/30"
          style={{ top: coords.top, left: coords.left }}
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
        </div>,
        document.body
      )}
    </>
  )
}

export default ActionMenu
