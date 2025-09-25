import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Zap, Shield, Smartphone, Globe, Cpu } from 'lucide-react'
import SEO from '../components/SEO'

function Features() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="PDF Merger AI Features - Complete PDF Toolkit"
        description="Discover all features of PDF Merger AI: merge, split, compress, convert, AI summarization, and more. 100% free PDF tools."
        canonical="https://pdf-merger-app.netlify.app/features"
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
          <div className="content-page" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="hero-title gradient-text">Complete PDF Toolkit Features</h1>
            
            <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '40px' }}>
              
              <div className="feature-card futuristic-card" style={{ padding: '30px' }}>
                <FileText size={32} style={{ color: '#3b82f6', marginBottom: '15px' }} />
                <h3>PDF Management</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>Merge multiple PDFs</li>
                  <li>Split PDF by pages</li>
                  <li>Compress file sizes</li>
                  <li>Rotate pages</li>
                  <li>Delete unwanted pages</li>
                </ul>
              </div>

              <div className="feature-card futuristic-card" style={{ padding: '30px' }}>
                <Zap size={32} style={{ color: '#10b981', marginBottom: '15px' }} />
                <h3>AI-Powered Tools</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>AI PDF Summarization</li>
                  <li>Chat with your PDFs</li>
                  <li>Smart content extraction</li>
                  <li>Intelligent document analysis</li>
                  <li>Auto-optimization</li>
                </ul>
              </div>

              <div className="feature-card futuristic-card" style={{ padding: '30px' }}>
                <Shield size={32} style={{ color: '#8b5cf6', marginBottom: '15px' }} />
                <h3>Privacy & Security</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>100% local processing</li>
                  <li>No file uploads to servers</li>
                  <li>GDPR compliant</li>
                  <li>No registration required</li>
                  <li>Secure browser encryption</li>
                </ul>
              </div>

              <div className="feature-card futuristic-card" style={{ padding: '30px' }}>
                <Smartphone size={32} style={{ color: '#f59e0b', marginBottom: '15px' }} />
                <h3>Cross-Platform</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>Works on all devices</li>
                  <li>Mobile-optimized interface</li>
                  <li>No software installation</li>
                  <li>Browser-based processing</li>
                  <li>Offline capability</li>
                </ul>
              </div>

              <div className="feature-card futuristic-card" style={{ padding: '30px' }}>
                <Globe size={32} style={{ color: '#ef4444', marginBottom: '15px' }} />
                <h3>Format Support</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>PDF to Word conversion</li>
                  <li>Excel to PDF</li>
                  <li>PowerPoint to PDF</li>
                  <li>Image to PDF</li>
                  <li>Multiple file formats</li>
                </ul>
              </div>

              <div className="feature-card futuristic-card" style={{ padding: '30px' }}>
                <Cpu size={32} style={{ color: '#06b6d4', marginBottom: '15px' }} />
                <h3>Performance</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>Lightning-fast processing</li>
                  <li>No file size limits</li>
                  <li>Batch operations</li>
                  <li>Real-time preview</li>
                  <li>Optimized algorithms</li>
                </ul>
              </div>

            </div>

            <div className="cta-section futuristic-card" style={{ padding: '40px', textAlign: 'center', marginTop: '40px' }}>
              <h2>Ready to Get Started?</h2>
              <p>Experience all these features for free. No registration required.</p>
              <button className="futuristic-btn primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
                Try PDF Merger AI Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Features