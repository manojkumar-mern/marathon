import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'

/**
 * Brand logo mark + wordmark.
 * The brand name is sourced from BRAND.name — never hardcoded here.
 */
function BrandMark() {
  return (
    <Link
      className="inline-flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      to="/"
    >
      {/* Geometric triangle flame logomark */}
      <span aria-hidden="true" className="flex size-8 flex-shrink-0 items-center justify-center">
        <svg
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
        >
          <defs>
            <linearGradient
              id="sfGrad"
              gradientUnits="userSpaceOnUse"
              x1="16"
              x2="16"
              y1="2"
              y2="30"
            >
              <stop offset="0%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <polygon fill="url(#sfGrad)" points="16,2 30,28 2,28" />
          <polygon fill="#080C10" fillOpacity="0.45" points="16,11 24,27 8,27" />
        </svg>
      </span>

      <span
        className="font-display text-lg font-black italic tracking-[0.06em] text-sf-white"
        style={{ letterSpacing: '0.05em' }}
      >
        {BRAND.name}
      </span>
    </Link>
  )
}

export default BrandMark
