import ThemeSwitcher from '../components/ThemeSwitcher'
import SEO from '../components/SEO'
import { Link } from 'react-router-dom'

function Blog() {
  const posts = [
    {
      slug: 'best-free-pdf-merger-with-ai',
      title: 'Best Free PDF Merger with AI: Local, Private, and Unlimited',
      description: 'Merge PDF free online, then use AI to summarize or chat with your document — all locally in the browser.',
      keywords: ['Best free PDF merger with AI','Free PWA PDF tools','Local PDF tools (no server upload)'],
      date: '2025-09-12'
    },
    {
      slug: 'how-to-summarize-pdf-with-ai-online',
      title: 'How to Summarize PDF with AI Online (Free & Private)',
      description: 'Use our AI PDF summarizer free to quickly summarize long documents — no signup, privacy-first.',
      keywords: ['How to summarize PDF with AI online','AI tools to extract text from PDF free','Free AI research summarizer'],
      date: '2025-09-12'
    }
  ]

  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'PDF Tools & AI Blog',
    url: window.location.origin + '/blog',
    blogPost: posts.map(p => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      description: p.description,
      url: window.location.origin + '/blog#' + p.slug
    }))
  }

  return (
    <div className="app">
      <SEO 
        title="Blog – Free PDF Tools & AI Tips (Local, Private)"
        description="Guides for PDF tools, AI document summarization, and privacy-first local processing."
        keywords={[ 'AI tools for office productivity','AI file converter online','Document automation AI free' ]}
        canonical={window.location.origin + '/blog'}
        ogImage={window.location.origin + '/pdf-icon-512.png'}
        jsonLd={blogLd}
      />
      <ThemeSwitcher />
      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">Blog</h2>
            <p className="hero-description">Tips for AI PDF tools and secure, offline-friendly document workflows.</p>
            <div className="futuristic-card" style={{ padding: 16 }}>
              {posts.map(p => (
                <article key={p.slug} id={p.slug} style={{ marginBottom: 16 }}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                  <p className="muted" style={{ fontSize: 12 }}>Keywords: {p.keywords.join(', ')}</p>
                  <Link className="futuristic-btn" to="/">Try the tool →</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Blog


