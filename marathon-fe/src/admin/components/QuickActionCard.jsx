import { Link } from 'react-router-dom'

function QuickActionCard({ label, icon, to, description, onClick }) {
  const Icon = icon
  const content = (
    <div className="group flex items-start gap-3 rounded-xl border border-steel/60 bg-carbon p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-ember/30 hover:shadow-lg hover:shadow-ember/5 lg:p-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-ember/10 ring-1 ring-ember/20 transition-all duration-150 group-hover:bg-ember/15 group-hover:ring-ember/30 lg:size-10">
        <Icon className="size-4 text-ember lg:size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-sf-white">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-dim">{description}</p>}
      </div>
    </div>
  )

  if (onClick) {
    return <button type="button" onClick={onClick} className="w-full text-left">{content}</button>
  }

  return <Link to={to} className="block">{content}</Link>
}

export default QuickActionCard
