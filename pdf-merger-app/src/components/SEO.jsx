import { useEffect } from 'react'
import { createPortal } from 'react-dom'

// Secure SEO component using React portals
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  jsonLd
}) {
  useEffect(() => {
    if (title && typeof title === 'string') {
      document.title = title.slice(0, 60)
    }
  }, [title])

  const sanitizeString = (str) => {
    if (typeof str !== 'string') return ''
    return str.replace(/[<>"'&]/g, '')
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const metaTags = []
  
  if (description) {
    metaTags.push(
      <meta key="description" name="description" content={sanitizeString(description).slice(0, 160)} />
    )
  }
  
  if (keywords) {
    const keywordString = Array.isArray(keywords) ? keywords.join(', ') : String(keywords)
    metaTags.push(
      <meta key="keywords" name="keywords" content={sanitizeString(keywordString).slice(0, 200)} />
    )
  }
  
  if (canonical && isValidUrl(canonical)) {
    metaTags.push(
      <link key="canonical" rel="canonical" href={canonical} />
    )
  }
  
  if (title) {
    metaTags.push(
      <meta key="og:title" property="og:title" content={sanitizeString(title).slice(0, 60)} />
    )
  }
  
  if (description) {
    metaTags.push(
      <meta key="og:description" property="og:description" content={sanitizeString(description).slice(0, 160)} />
    )
  }
  
  metaTags.push(
    <meta key="og:type" property="og:type" content="website" />
  )
  
  if (ogImage && isValidUrl(ogImage)) {
    metaTags.push(
      <meta key="og:image" property="og:image" content={ogImage} />
    )
  }
  
  if (title) {
    metaTags.push(
      <meta key="twitter:title" name="twitter:title" content={sanitizeString(title).slice(0, 60)} />
    )
  }
  
  if (description) {
    metaTags.push(
      <meta key="twitter:description" name="twitter:description" content={sanitizeString(description).slice(0, 160)} />
    )
  }
  
  if (ogImage && isValidUrl(ogImage)) {
    metaTags.push(
      <meta key="twitter:image" name="twitter:image" content={ogImage} />
    )
  }
  
  metaTags.push(
    <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
  )
  
  if (jsonLd && typeof jsonLd === 'object') {
    try {
      const jsonString = JSON.stringify(jsonLd)
      if (jsonString && jsonString.length < 10000) {
        metaTags.push(
          <script
            key="json-ld"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonString }}
          />
        )
      }
    } catch (error) {
      console.warn('Invalid JSON-LD data:', error)
    }
  }

  return createPortal(metaTags, document.head)
}


