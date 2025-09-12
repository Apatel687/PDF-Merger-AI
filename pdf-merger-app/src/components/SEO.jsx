import { useEffect } from 'react'

function setMetaTag(name, content, attr = 'name') {
  if (!content) return
  let tag = document.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setLinkTag(rel, href) {
  if (!href) return
  let link = document.querySelector(`link[rel="${rel}"]`)
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  jsonLd
}) {
  useEffect(() => {
    if (title) document.title = title
    setMetaTag('description', description)
    if (keywords && keywords.length) setMetaTag('keywords', Array.isArray(keywords) ? keywords.join(', ') : String(keywords))
    if (canonical) setLinkTag('canonical', canonical)

    // Open Graph / Twitter basic
    if (title) setMetaTag('og:title', title, 'property')
    if (description) setMetaTag('og:description', description, 'property')
    setMetaTag('og:type', 'website', 'property')
    if (ogImage) setMetaTag('og:image', ogImage, 'property')

    if (title) setMetaTag('twitter:title', title, 'property')
    if (description) setMetaTag('twitter:description', description, 'property')
    if (ogImage) setMetaTag('twitter:image', ogImage, 'property')
    setMetaTag('twitter:card', 'summary_large_image', 'property')

    // JSON-LD structured data
    const existing = document.getElementById('seo-jsonld')
    if (existing) existing.remove()
    if (jsonLd) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = 'seo-jsonld'
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
  }, [title, description, canonical, ogImage, JSON.stringify(jsonLd)])

  return null
}


