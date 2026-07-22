import { FaArrowRight } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { galleryImages } from '../../../data/platform'

function Gallery() {
  return (
    <section className="bg-obsidian py-24 sm:py-32" aria-label="Community gallery">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Header row */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
              Race Gallery
            </p>
            <h2 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              MOMENTS THAT
              <br />
              <span className="ember-gradient-text">DEFINE THE RACE.</span>
            </h2>
          </div>

          <Link
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-sf-white"
            to="/gallery"
          >
            View all moments <FaArrowRight aria-hidden="true" />
          </Link>
        </div>

        {/* Masonry-style photo grid */}
        <div className="mt-10 grid auto-rows-[200px] gap-4 md:grid-cols-4">
          {galleryImages.map((image) => (
            <figure
              key={image.alt}
              className={`group relative overflow-hidden rounded-2xl border border-steel/40 ${
                image.large ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img
                alt={image.alt}
                className="size-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                loading="lazy"
                src={image.src}
              />
              {/* Caption overlay */}
              {image.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-obsidian/90 to-transparent px-4 pb-4 pt-8 text-xs font-semibold uppercase tracking-widest text-sf-white/80 transition-transform duration-300 group-hover:translate-y-0">
                  {image.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery

