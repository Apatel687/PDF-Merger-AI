import ThemeSwitcher from '../components/ThemeSwitcher'
import SEO from '../components/SEO'
import { Link, useNavigate } from 'react-router-dom'

function FAQ() {
  const navigate = useNavigate()
  const faqs = [
    {
      q: 'Is this a free unlimited PDF tool (no signup)?',
      a: 'Yes. All tools are free and unlimited. No account needed. Everything runs locally in your browser for a privacy-first experience.'
    },
    {
      q: 'How to summarize PDF with AI online?',
      a: 'Open Summarize, upload a PDF, then click Summarize. Our AI PDF summarizer is free and runs locally for privacy.'
    },
    {
      q: 'Can I chat with my PDF (research papers)?',
      a: 'Yes. Use Ask Your PDF to chat with research paper PDFs. The free AI PDF chatbot indexes text locally and answers your questions.'
    },
    {
      q: 'Where do conversions happen? Are files uploaded?',
      a: 'All processing is local. We are a browser-based PDF tool with offline support. Files are not uploaded to a server.'
    },
    {
      q: 'What PDF tools are included?',
      a: 'Merge, Split, Compress, JPG/PNG ⇆ PDF, PDF ⇆ Word/Excel/PPT (basic), Extract images, Add watermark, Add page numbers, Annotate, AI summarizer, Ask PDF.'
    }
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  }

  return (
    <div className="app">
      <SEO
        title="PDF Tools FAQ – Free, Unlimited, Local & AI Features"
        description="Answers about free unlimited PDF tools, AI PDF summarizer, Chat with PDF, privacy-first local processing, and offline PWA support."
        keywords={[ 'Free unlimited PDF tools (no signup)','Privacy-first PDF editor','Offline PDF tools for browser','AI document helper free' ]}
        canonical={window.location.origin + '/faq'}
        ogImage={window.location.origin + '/pdf-icon-512.png'}
        jsonLd={faqLd}
      />
      <ThemeSwitcher />
      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">FAQ</h2>
            <p className="hero-description">Everything about our free, local, privacy-first PDF and AI tools.</p>
            <div className="futuristic-card" style={{ padding: 16 }}>
              {faqs.map((f, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <h3 style={{ marginBottom: 6 }}>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
              <div style={{ marginTop: 12 }}>
                <Link className="futuristic-btn" to="/">Home</Link>
                <button className="futuristic-btn" style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>← Back</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default FAQ


