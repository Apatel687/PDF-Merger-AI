import { useNavigate, Link } from 'react-router-dom'
import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher'
import SEO from '../components/SEO'
import { FileText, Zap, Shield, Users, Award, Globe, Sparkles } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'


function About() {
  const navigate = useNavigate()
  const { t, getLocalizedKeywords, language } = useTranslation()

  return (
    <div className="app">
      <SEO 
        title="About – Free PDF Tools (AI, Local, Privacy‑First) | PDF Merger AI"
        description="About PDF Merger AI: Free unlimited PDF tools online. Merge, split, compress, convert Office ⇆ PDF, AI PDF summarizer, Chat with PDF. 100% local, privacy‑first."
        keywords={getLocalizedKeywords()}
        canonical="https://pdf-merger-app.netlify.app/about"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          'name': 'About PDF Merger AI',
          'description': 'Learn about PDF Merger AI - the privacy-first, AI-powered PDF toolkit that works entirely in your browser.',
          'url': 'https://pdf-merger-app.netlify.app/about',
          'mainEntity': {
            '@type': 'Organization',
            'name': 'PDF Merger AI',
            'description': 'Advanced PDF tools with AI capabilities for local, secure document processing.',
            'url': 'https://pdf-merger-app.netlify.app'
          }
        }}
      />


      <header className="app-header futuristic-card">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon-container" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-wrapper">
                <Sparkles size={40} className="logo-icon" />
                <Zap size={20} className="logo-accent" />
              </div>
            </div>
            <div className="logo-text">
              <h1 className="logo-title clickable-title" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <span className="logo-main">PDF Merger</span>
                <span className="logo-ai">AI</span>
              </h1>
              <p className="subtitle">Next-Gen PDF Processing powered by AI</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SimpleLanguageSwitcher />
            <button className="futuristic-btn" onClick={() => navigate(-1)}>{t('back')}</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">{t('about')} PDF Merger AI</h2>
            <p className="hero-description">{t('heroDescription')}</p>

            <div className="features-grid">
              <div className="feature-card futuristic-card" style={{
                padding: '30px 20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="feature-icon" style={{ marginBottom: '20px' }}>
                  <Shield size={48} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>{t('privacyFirst')}</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>{t('privacyFirstDesc')}</p>
              </div>

              <div className="feature-card futuristic-card" style={{
                padding: '30px 20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="feature-icon" style={{ marginBottom: '20px' }}>
                  <Zap size={48} style={{ color: '#3b82f6' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>{t('aiPowered')}</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>{t('aiPoweredDesc')}</p>
              </div>

              <div className="feature-card futuristic-card" style={{
                padding: '30px 20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="feature-icon" style={{ marginBottom: '20px' }}>
                  <FileText size={48} style={{ color: '#8b5cf6' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>{t('completeToolkit')}</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>{t('completeToolkitDesc')}</p>
              </div>
            </div>

            <div className="about-content futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <h2>Our Mission</h2>
              <p>PDF Merger AI is designed to provide powerful, professional-grade PDF tools that respect your privacy. We believe document processing should be fast, secure, and accessible to everyone.</p>
              
              <h3>What Makes Us Different</h3>
              <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                <li><strong>100% Local Processing:</strong> Your documents never leave your browser</li>
                <li><strong>No Registration Required:</strong> Start using tools immediately</li>
                <li><strong>AI Integration:</strong> Smart features like summarization and document chat</li>
                <li><strong>Professional Quality:</strong> Enterprise-grade tools for everyone</li>
                <li><strong>Mobile Friendly:</strong> Works seamlessly on all devices</li>
                <li><strong>Open Source Spirit:</strong> Transparent and community-focused</li>
              </ul>

              <h3>Key Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
                <div>
                  <h4>📄 PDF Management</h4>
                  <ul>
                    <li>Merge multiple PDFs</li>
                    <li>Split by pages or ranges</li>
                    <li>Compress file sizes</li>
                    <li>Rotate and organize pages</li>
                  </ul>
                </div>
                <div>
                  <h4>🤖 AI Features</h4>
                  <ul>
                    <li>AI PDF Summarization</li>
                    <li>Chat with your documents</li>
                    <li>Smart content extraction</li>
                    <li>Intelligent analysis</li>
                  </ul>
                </div>
                <div>
                  <h4>🔄 Format Conversion</h4>
                  <ul>
                    <li>Office documents ⇆ PDF</li>
                    <li>Images ⇆ PDF</li>
                    <li>Batch processing</li>
                    <li>Quality optimization</li>
                  </ul>
                </div>
                <div>
                  <h4>✏️ Annotation Tools</h4>
                  <ul>
                    <li>Add watermarks</li>
                    <li>Insert page numbers</li>
                    <li>Custom text overlays</li>
                    <li>Professional formatting</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="stats-section futuristic-card" style={{ padding: '30px', margin: '30px 0', textAlign: 'center' }}>
              <h2>Trusted by Users Worldwide</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', margin: '20px 0' }}>
                <div className="stat-item">
                  <Globe size={30} style={{ color: '#3b82f6' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>100%</div>
                    <div>Privacy Guaranteed</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Users size={30} style={{ color: '#10b981' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>0$</div>
                    <div>Always Free</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Award size={30} style={{ color: '#f59e0b' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>∞</div>
                    <div>No Limits</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-section futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <h2>Get in Touch</h2>
              <p>Have questions, feedback, or suggestions? We'd love to hear from you!</p>
              <p><strong>Email:</strong> <a href="mailto:support@pdfmerger.ai">support@pdfmerger.ai</a></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default About
