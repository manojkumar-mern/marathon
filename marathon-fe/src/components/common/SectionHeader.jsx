/**
 * Reusable section header.
 * tone="dark"  → white headline, muted body  (default — for dark sections)
 * tone="light" → obsidian headline, muted-dim body (for light-bg sections)
 * align="center" → centres the block and text
 */
function SectionHeader({ eyebrow, title, description, tone = 'dark', align = 'left' }) {
  const titleClass = tone === 'light' ? 'text-obsidian' : 'text-sf-white'
  const descClass  = tone === 'light' ? 'text-muted-dim' : 'text-muted'
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {/* Eyebrow with ember pulse dot */}
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
        <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-ember" />
        {eyebrow}
      </p>

      <h2
        className={`mt-4 font-display text-4xl font-black italic leading-none tracking-tight sm:text-5xl ${titleClass}`}
      >
        {title}
      </h2>

      {description ? (
        <p className={`mt-5 text-base leading-7 ${descClass}`}>{description}</p>
      ) : null}
    </div>
  )
}

export default SectionHeader
