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
      q: 'How to merge PDF files online for free without watermark?',
      a: 'Upload your PDFs, arrange them in order, and click Merge. No watermarks, no limits, completely free. Files are processed locally in your browser.'
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
      q: 'Is this a SmallPDF alternative?',
      a: 'Yes, PDF Merger AI is a free SmallPDF alternative with no file limits, no watermarks, AI features, and complete privacy protection.'
    },
    {
      q: 'How is this different from ILovePDF?',
      a: 'Unlike ILovePDF, we offer unlimited free usage, AI-powered features, local processing for privacy, and no registration requirements.'
    },
    {
      q: 'Are PDF tools good for students?',
      a: 'Perfect for students! Merge research papers, summarize PDFs with AI, chat with academic documents, convert thesis files - all free and unlimited.'
    },
    {
      q: 'Can businesses use these PDF tools?',
      a: 'Absolutely! Merge contracts, add watermarks to documents, compress files for email, convert Office files to PDF - ideal for business use.'
    },
    {
      q: 'Where do conversions happen? Are files uploaded?',
      a: 'All processing is local. We are a browser-based PDF tool with offline support. Files are not uploaded to a server.'
    },
    {
      q: 'What PDF tools are included?',
      a: 'Merge, Split, Compress, JPG/PNG ⇆ PDF, PDF ⇆ Word/Excel/PPT (basic), Extract images, Add watermark, Add page numbers, Annotate, AI summarizer, Ask PDF.'
    },
    {
      q: 'How to compress PDF online free without losing quality?',
      a: 'Use our compress tool with smart optimization that reduces file size while maintaining document quality. No limits, completely free.'
    },
    {
      q: 'Can I convert PDF to Word for free?',
      a: 'Yes, use our Office Tools to convert PDF to Word, Excel, or PowerPoint. Basic conversion is free with local processing for privacy.'
    },
    {
      q: 'Are these PDF tools safe for legal documents?',
      a: 'Very safe! All processing happens locally in your browser. Legal documents never leave your device, ensuring complete confidentiality.'
    },
    {
      q: 'How to add watermark to PDF online free?',
      a: 'Use our Annotation tools to add custom watermarks, page numbers, or text overlays to your PDFs. Free and unlimited usage.'
    },
    {
      q: 'Does this work offline?',
      a: 'Yes! Once loaded, many features work offline. It\'s a PWA (Progressive Web App) that caches resources for offline use.'
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
        keywords={[ 
          'Free unlimited PDF tools (no signup)','Privacy-first PDF editor','Offline PDF tools for browser','AI document helper free',
          'PDF tools FAQ','How to merge PDF free','SmallPDF alternative','ILovePDF alternative free',
          'PDF merger without watermark','Student PDF tools','Business PDF editor','Academic PDF tools',
          'PDF tools for lawyers','Legal document merger','Thesis PDF tools','Research paper PDF editor'
        ]}
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


