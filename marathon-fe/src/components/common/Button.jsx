import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember active:scale-95'

const variants = {
  primary:
    'bg-ember text-white shadow-lg shadow-ember/20 hover:bg-ember-deep hover:-translate-y-0.5 hover:shadow-ember/35',
  dark:
    'bg-carbon border border-steel text-sf-white hover:bg-steel hover:-translate-y-0.5',
  outline:
    'border border-steel text-muted hover:border-ember hover:text-ember',
  light:
    'bg-sf-white text-obsidian hover:bg-ice hover:-translate-y-0.5',
  ghost:
    'border border-steel/60 text-muted hover:border-steel hover:text-sf-white',
}

function Button({ children, className = '', to, variant = 'primary', ...props }) {
  const cls = `${base} ${variants[variant] ?? variants.primary} ${className}`

  if (to) {
    return (
      <Link className={cls} to={to} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button className={cls} type="button" {...props}>
      {children}
    </button>
  )
}

export default Button
