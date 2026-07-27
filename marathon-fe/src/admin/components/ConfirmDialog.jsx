import { useEffect, useRef } from 'react'
import { FaTriangleExclamation, FaXmark } from 'react-icons/fa6'

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message = 'Are you sure?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const confirmRef = useRef(null)

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const confirmStyles =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-500 text-white'
      : 'bg-ember hover:bg-amber-600 text-obsidian'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md rounded-xl border border-steel/60 bg-carbon p-6 shadow-2xl shadow-black/40"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-dim hover:text-sf-white transition-colors"
          aria-label="Close"
        >
          <FaXmark size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/20">
            <FaTriangleExclamation className="size-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-sf-white">{title}</h3>
            <p className="mt-1 text-sm text-muted-dim">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-steel/60 px-4 py-2 text-sm font-medium text-muted-dim transition-colors hover:bg-steel/40 hover:text-sf-white disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${confirmStyles}`}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
