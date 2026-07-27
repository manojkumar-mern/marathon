function EmptyState({ icon: Icon, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-steel/50 bg-carbon/50 py-12 text-center">
      {Icon && <Icon className="mb-3 size-8 text-muted-dim/40" />}
      <p className="text-sm text-muted-dim">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
