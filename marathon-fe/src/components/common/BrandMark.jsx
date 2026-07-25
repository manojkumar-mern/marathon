import { Link } from 'react-router-dom'
import { BRAND } from '../../config/brand'
import logoSvg from "../../assets/images/logos/marathon-logo.webp";

/**
 * Brand logo mark + wordmark.
 * The brand name is sourced from BRAND.name — never hardcoded here.
 * Logo uses the production SVG runner mark (logo.svg).
 */
function BrandMark() {
  return (
    <Link
      className="inline-flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ember"
      to="/"
    >
      {/* Marathon runner logomark */}
      <span aria-hidden="true" className="flex h-10 w-auto flex-shrink-0 items-center justify-center">
        <img
          src={logoSvg}
          alt="Kauvery Marathon runner logo"
          className="h-full w-auto object-contain"
        />
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
