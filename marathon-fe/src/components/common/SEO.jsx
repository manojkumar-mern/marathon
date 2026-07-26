import { Helmet } from 'react-helmet-async'
import { BRAND } from '../../config/brand'
import { heroMarathonStart } from '../../assets/images/index.js'

const BASE_URL = BRAND.website

function SEO({ title, description, image, url, type = 'website' }) {
  const siteTitle = title ? `${title} | ${BRAND.name} Events` : `${BRAND.name} Events — ${BRAND.tagline}`
  const siteDescription = description || BRAND.description
  const siteImage = image || heroMarathonStart
  const siteUrl = url ? `${BASE_URL}${url}` : BASE_URL
  const absoluteImage = siteImage.startsWith('http') ? siteImage : `${BASE_URL}${siteImage}`

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={siteDescription} />
      <link rel="canonical" href={siteUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={siteDescription} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={siteDescription} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  )
}

export default SEO
