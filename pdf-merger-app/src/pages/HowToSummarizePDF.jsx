import { useNavigate } from 'react-router-dom'
import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher'
import SEO from '../components/SEO'
import { Zap, FileText, Brain, Sparkles, ArrowLeft } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

function HowToSummarizePDF() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="app">
      <SEO 
        title="How to Summarize PDF with AI - Free PDF Summarizer Tutorial | PDF Merger AI"
        description="Learn how to summarize PDF documents using AI. Complete step-by-step guide to extract key points from PDFs quickly and accurately. 100% free and private."
        keywords={['how to summarize pdf', 'ai pdf summarizer tutorial', 'pdf summary tool guide', 'extract pdf content', 'ai document summarizer', 'pdf key points extraction', 'free pdf summarizer', 'local pdf processing']}
        canonical="https://pdf-merger-app.netlify.app/how-to-summarize-pdf"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          'name': 'How to Summarize PDF with AI',
          'description': 'Step-by-step tutorial on using AI to summarize PDF documents quickly and accurately.',
          'image': 'https://pdf-merger-app.netlify.app/pdf-icon-512.png',
          'totalTime': 'PT2M'
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
            <button className="futuristic-btn" onClick={() => navigate('/summarize')}>
              <ArrowLeft size={16} /> Back to Summarizer
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">How to Use AI PDF Summarizer</h2>
            <p className="hero-description">Complete guide to summarizing PDF documents with AI - extract key insights instantly</p>
            
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
                  <Brain size={48} style={{ color: '#3b82f6' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>AI-Powered Analysis</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>Advanced AI analyzes your PDF content and extracts the most important information automatically</p>
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
                  <Zap size={48} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Instant Results</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>Get comprehensive summaries in seconds - perfect for research, business reports, and academic papers</p>
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
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Key Point Extraction</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>Identifies main ideas, conclusions, and important details from any PDF document</p>
              </div>
            </div>

            <div className="about-content futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <h2>How Our AI PDF Summarizer Works</h2>
              <p>Our advanced AI technology processes your PDF documents locally in your browser, ensuring complete privacy while delivering accurate summaries.</p>
              
              <h3>Step-by-Step Process</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', margin: '20px 0' }}>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#3b82f6', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                  <div>
                    <strong>Upload Your PDF:</strong> Click "Choose PDF" or drag and drop your document into the upload area
                  </div>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                  <div>
                    <strong>AI Processing:</strong> Our AI analyzes your document content, identifying key themes and important information
                  </div>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#8b5cf6', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                  <div>
                    <strong>Get Summary:</strong> Receive a concise summary with key points, main ideas, and important conclusions
                  </div>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#f59e0b', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
                  <div>
                    <strong>Copy or Download:</strong> Copy the summary text or download it as a TXT file for future reference
                  </div>
                </div>
              </div>

              <h3>Perfect For These Use Cases</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '20px 0' }}>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>📚 Research Papers</h4>
                  <p>Extract key findings, methodology, and conclusions from academic papers</p>
                </div>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>📊 Business Reports</h4>
                  <p>Get executive summaries and key insights from lengthy business documents</p>
                </div>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>📖 Academic Documents</h4>
                  <p>Understand main concepts and important points from textbooks and papers</p>
                </div>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>⚖️ Legal Documents</h4>
                  <p>Identify important clauses, terms, and legal implications quickly</p>
                </div>
              </div>

              <h3>Tips for Best Results</h3>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                <ul style={{ lineHeight: '1.8', margin: 0 }}>
                  <li>✅ Use clear, well-structured PDFs with proper formatting</li>
                  <li>✅ Ensure text is selectable (not scanned images or photos)</li>
                  <li>✅ Documents with headings and sections work better</li>
                  <li>✅ Keep files under 50MB for optimal processing speed</li>
                  <li>✅ PDFs with tables of contents produce better summaries</li>
                </ul>
              </div>
            </div>

            <div className="stats-section futuristic-card" style={{ padding: '30px', margin: '30px 0', textAlign: 'center' }}>
              <h2>Why Choose Our AI PDF Summarizer?</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', margin: '20px 0' }}>
                <div className="stat-item">
                  <Brain size={30} style={{ color: '#3b82f6' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>100%</div>
                    <div>Local Processing</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Zap size={30} style={{ color: '#10b981' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>0$</div>
                    <div>Always Free</div>
                  </div>
                </div>
                <div className="stat-item">
                  <FileText size={30} style={{ color: '#8b5cf6' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>∞</div>
                    <div>No Limits</div>
                  </div>
                </div>
              </div>

            <div className="contact-section futuristic-card" style={{ padding: '30px', margin: '30px 0', textAlign: 'center' }}>
              <h2>Ready to Summarize Your PDFs?</h2>
              <p>Start using our AI-powered PDF summarizer now - completely free and private!</p>
              <button className="futuristic-btn primary" onClick={() => navigate('/summarize')} style={{ marginTop: '20px', padding: '12px 30px', fontSize: '16px' }}>
                🧠 Try AI PDF Summarizer Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HowToSummarizePDF