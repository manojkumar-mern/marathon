import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const stats = [
  { endValue: 18000, suffix: '+', label: 'Runners',      sub: 'across all events' },
  { endValue: 6,     suffix: '',  label: 'Cities',       sub: 'and expanding' },
  { endValue: 12,    suffix: '',  label: 'Events',       sub: 'and counting' },
  { endValue: 95,    suffix: '%', label: 'Satisfaction', sub: 'from post-race surveys' },
]

function Statistics() {
  const statRefs = useRef([])

  useEffect(() => {
    const observers = statRefs.current.map((el, i) => {
      if (!el) return null
      const stat = stats[i]
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          obs.disconnect()
          const proxy = { val: 0 }
          gsap.to(proxy, {
            val: stat.endValue,
            duration: 2.4,
            ease: 'power2.out',
            delay: i * 0.1,
            onUpdate() {
              if (el) el.textContent =
                Math.round(proxy.val).toLocaleString() + stat.suffix
            },
          })
        },
        { threshold: 0.5 },
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-obsidian py-20"
      aria-label="Event statistics"
    >
      {/* Ambient ember glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid divide-y divide-steel sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <article
              key={stat.label}
              className="py-12 text-center sm:px-8 lg:py-16"
            >
              <p
                ref={(el) => (statRefs.current[i] = el)}
                className="font-display text-6xl font-black italic text-volt lg:text-7xl"
                style={{ textShadow: '0 0 40px rgba(250, 204, 21, 0.3)' }}
              >
                0
              </p>
              {/* Accent underline */}
              <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-ember/40" />
              <p className="mt-4 text-lg font-semibold text-sf-white">
                {stat.label}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.sub}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Statistics

