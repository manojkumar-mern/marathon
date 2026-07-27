import { useLocation, Link } from 'react-router-dom'
import { FaChevronRight } from 'react-icons/fa6'
import { getPageTitleForPath } from '../utils/constants'

function Breadcrumbs() {
  const { pathname } = useLocation()

  const rawSegments = pathname.split('/').filter(Boolean)

  const crumbs = rawSegments.reduce((acc, segment, index) => {
    const cumulativePath = '/' + rawSegments.slice(0, index + 1).join('/')
    const isLast = index === rawSegments.length - 1
    const label = getPageTitleForPath(cumulativePath) || segment.replace(/-/g, ' ')
    acc.push({ path: cumulativePath, label: label.charAt(0).toUpperCase() + label.slice(1), isLast })
    return acc
  }, [])

  if (crumbs.length === 0) return null

  return (
    <nav className="hidden items-center gap-1 text-xs text-muted-dim sm:flex" aria-label="Breadcrumb">
      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1">
          <FaChevronRight className="size-2.5 text-muted-dim/40" />
          {crumb.isLast ? (
            <span className="font-medium text-sf-white">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="transition-colors hover:text-sf-white">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}

export default Breadcrumbs
