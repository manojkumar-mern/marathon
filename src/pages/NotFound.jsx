import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main
      aria-label="Page not found"
      className="grid min-h-[80vh] place-items-center bg-obsidian px-5 text-center"
    >
      <div>
        {/* Giant 404 number */}
        <p
          className="font-display font-black italic leading-none ember-gradient-text"
          style={{ fontSize: 'clamp(6rem, 22vw, 14rem)' }}
        >
          404
        </p>

        <h1 className="mt-4 font-display text-3xl font-black italic text-sf-white sm:text-4xl">
          THE COURSE ENDS HERE.
        </h1>
        <p className="mt-3 text-base text-muted">
          But the race doesn't. Let's get you back to the starting line.
        </p>

        <Link
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ember px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95"
          to="/"
        >
          Return home
        </Link>
      </div>
    </main>
  )
}

export default NotFound
