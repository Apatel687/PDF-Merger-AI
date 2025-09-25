import { useNavigate } from 'react-router-dom'
import { ArrowLeft, HelpCircle, FileText, Zap, Shield } from 'lucide-react'
import SEO from '../components/SEO'

function Help() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="Help Center - PDF Merger AI Support & Tutorials"
        description="Get help with PDF Merger AI. Find tutorials, troubleshooting guides, and answers to common questions about our PDF tools."
        canonical="https://pdf-merger-app.netlify.app/help"
      />
      
      <header className="app-header futuristic-card">
        <div className="header-content">
          <button className="futuristic-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="content-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="hero-title gradient-text">Help Center</h1>
            
            <div className="help-sections" style={{ marginTop: '40px' }}>
              
              <div className="help-section futuristic-card" style={{ padding: '30px', marginBottom: '20px' }}>
                <FileText size={24} style={{ color: '#3b82f6', marginBottom: '15px' }} />
                <h2>Getting Started</h2>
                <ul style={{ lineHeight: '1.8' }}>
                  <li><a href="/how-to-merge-pdf" style={{ color: '#3b82f6' }}>How to merge PDF files</a></li>
                  <li><a href="#" style={{ color: '#3b82f6' }}>How to split PDF documents</a></li>
                  <li><a href="#" style={{ color: '#3b82f6' }}>How to compress PDF files</a></li>
                  <li><a href="#" style={{ color: '#3b82f6' }}>How to add watermarks</a></li>
                </ul>
              </div>

              <div className="help-section futuristic-card" style={{ padding: '30px', marginBottom: '20px' }}>
                <Zap size={24} style={{ color: '#10b981', marginBottom: '15px' }} />
                <h2>AI Features</h2>
                <ul style={{ lineHeight: '1.8' }}>
                  <li><a href="#" style={{ color: '#10b981' }}>Using AI PDF Summarizer</a></li>
                  <li><a href="#" style={{ color: '#10b981' }}>Chat with your PDF documents</a></li>
                  <li><a href="#" style={{ color: '#10b981' }}>AI-powered content extraction</a></li>
                </ul>
              </div>

              <div className="help-section futuristic-card" style={{ padding: '30px', marginBottom: '20px' }}>
                <Shield size={24} style={{ color: '#8b5cf6', marginBottom: '15px' }} />
                <h2>Privacy & Security</h2>
                <ul style={{ lineHeight: '1.8' }}>
                  <li><a href="/privacy" style={{ color: '#8b5cf6' }}>Privacy Policy</a></li>
                  <li><a href="#" style={{ color: '#8b5cf6' }}>How we protect your data</a></li>
                  <li><a href="#" style={{ color: '#8b5cf6' }}>Local processing explained</a></li>
                </ul>
              </div>

              <div className="help-section futuristic-card" style={{ padding: '30px', marginBottom: '20px' }}>
                <HelpCircle size={24} style={{ color: '#f59e0b', marginBottom: '15px' }} />
                <h2>Troubleshooting</h2>
                <div style={{ lineHeight: '1.8' }}>
                  <h3>Common Issues:</h3>
                  <p><strong>Q: PDF won't upload?</strong><br />
                  A: Check file size (max 500MB) and ensure it's a valid PDF file.</p>
                  
                  <p><strong>Q: Merge button not working?</strong><br />
                  A: Make sure you have at least 2 PDF files selected.</p>
                  
                  <p><strong>Q: Download not starting?</strong><br />
                  A: Check your browser's download settings and popup blockers.</p>
                </div>
              </div>

              <div className="help-section futuristic-card" style={{ padding: '30px', marginBottom: '20px' }}>
                <h2>Browser Compatibility</h2>
                <p>PDF Merger AI works best with:</p>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>Chrome 90+ (Recommended)</li>
                  <li>Firefox 88+</li>
                  <li>Safari 14+</li>
                  <li>Edge 90+</li>
                </ul>
              </div>

              <div className="help-section futuristic-card" style={{ padding: '30px', textAlign: 'center' }}>
                <h2>Still Need Help?</h2>
                <p>Can't find what you're looking for?</p>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
                  <button className="futuristic-btn" onClick={() => navigate('/contact')}>
                    Contact Support
                  </button>
                  <button className="futuristic-btn" onClick={() => navigate('/faq')}>
                    View FAQ
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Help