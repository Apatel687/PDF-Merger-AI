import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import SEO from '../components/SEO'
import { FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

function Terms() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="Terms of Service – Usage Guidelines | PDF Merger AI"
        description="PDF Merger AI Terms of Service: Usage guidelines, acceptable use policy, and service terms for our free PDF tools. Local processing, no account required."
        keywords={[ 'PDF Merger AI Terms of Service','Free PDF tools terms','Local PDF processing terms','Privacy-first PDF editor terms','PDF tool usage policy','Online PDF terms' ]}
        canonical="https://pdf-merger-app.netlify.app/terms"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': 'Terms of Service',
          'description': 'Terms of Service for PDF Merger AI - usage guidelines and service terms.',
          'url': 'https://pdf-merger-app.netlify.app/terms'
        }}
      />
      <ThemeSwitcher />

      <header className="app-header futuristic-card">
        <div className="header-content">
          <div className="logo">
            <div className="logo-text">
              <h1 className="logo-title clickable-title" onClick={() => navigate('/') }>
                <span className="logo-main">PDF Merger</span>
                <span className="logo-ai">AI</span>
              </h1>
              <p className="subtitle">Next-Gen PDF Processing powered by AI</p>
            </div>
          </div>
          <div>
            <button className="futuristic-btn" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">Terms of Service</h2>
            <p className="hero-description">Simple, fair terms for using our free PDF tools.</p>

            <div className="terms-highlight futuristic-card" style={{ padding: '30px', margin: '30px 0', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', textAlign: 'center' }}>
              <FileText size={60} style={{ marginBottom: '20px' }} />
              <h2>Free & Simple</h2>
              <p style={{ fontSize: '1.2em', margin: '15px 0' }}>No accounts, no subscriptions, no complex terms. Just use our tools responsibly.</p>
            </div>

            <div className="terms-content futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <p><strong>Last updated:</strong> January 13, 2025</p>
              <p><strong>Effective date:</strong> January 13, 2025</p>

              <h2>Agreement to Terms</h2>
              <p>By using PDF Merger AI, you agree to these terms. If you don't agree, please don't use our service.</p>

              <h2>Our Service</h2>
              <p>PDF Merger AI provides free, browser-based PDF tools including:</p>
              <ul style={{ lineHeight: '1.8' }}>
                <li>PDF merging and splitting</li>
                <li>AI-powered PDF summarization</li>
                <li>Document chat and Q&A</li>
                <li>Format conversion tools</li>
                <li>PDF annotation features</li>
                <li>Image and office document conversion</li>
              </ul>

              <h2>What You Can Do</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0' }}>
                <div className="terms-do futuristic-card" style={{ padding: '20px', border: '2px solid #10b981' }}>
                  <CheckCircle size={30} style={{ color: '#10b981', marginBottom: '15px' }} />
                  <h4>✅ Allowed Use</h4>
                  <ul>
                    <li>Personal document processing</li>
                    <li>Business and commercial use</li>
                    <li>Educational purposes</li>
                    <li>Process any legal documents</li>
                    <li>Use all features unlimited</li>
                    <li>Share the service with others</li>
                  </ul>
                </div>
                <div className="terms-dont futuristic-card" style={{ padding: '20px', border: '2px solid #ef4444' }}>
                  <XCircle size={30} style={{ color: '#ef4444', marginBottom: '15px' }} />
                  <h4>❌ Prohibited Use</h4>
                  <ul>
                    <li>Illegal or harmful content</li>
                    <li>Copyrighted material you don't own</li>
                    <li>Malware or malicious files</li>
                    <li>Attempts to hack or break the service</li>
                    <li>Automated abuse or excessive usage</li>
                    <li>Reselling or rebranding our service</li>
                  </ul>
                </div>
              </div>

              <h2>Your Responsibilities</h2>
              <h3>Legal Compliance</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>You must comply with all applicable laws</li>
                <li>You're responsible for the content you process</li>
                <li>Respect intellectual property rights</li>
                <li>Don't process documents you're not authorized to handle</li>
              </ul>

              <h3>Appropriate Use</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Use the service for its intended purpose</li>
                <li>Don't attempt to overwhelm our servers</li>
                <li>Report any bugs or security issues responsibly</li>
                <li>Be respectful to other users and our service</li>
              </ul>

              <h2>Service Availability</h2>
              <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '8px', margin: '20px 0', border: '1px solid #f59e0b' }}>
                <AlertCircle size={24} style={{ color: '#d97706', marginRight: '10px' }} />
                <strong>Service "As Is":</strong> We provide PDF Merger AI for free and strive for 99.9% uptime, but we can't guarantee the service will always be available or error-free.
              </div>

              <p>We may:</p>
              <ul>
                <li>Update, modify, or discontinue features</li>
                <li>Perform maintenance that temporarily affects availability</li>
                <li>Make improvements to enhance user experience</li>
                <li>Add new tools and features</li>
              </ul>

              <h2>Privacy & Data</h2>
              <p>Your privacy is paramount:</p>
              <ul style={{ lineHeight: '1.8' }}>
                <li><strong>Local Processing:</strong> Your documents stay on your device</li>
                <li><strong>No Data Collection:</strong> We don't collect or store your files</li>
                <li><strong>No Tracking:</strong> We don't track your document content</li>
                <li><strong>Complete Privacy:</strong> See our <button onClick={() => navigate('/privacy')} style={{ color: '#3b82f6', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Privacy Policy</button></li>
              </ul>

              <h2>Intellectual Property</h2>
              <h3>Our Rights</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>PDF Merger AI name, logo, and branding are our trademarks</li>
                <li>The service design and software are our intellectual property</li>
                <li>We retain rights to our technology and innovations</li>
              </ul>

              <h3>Your Rights</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>You keep all rights to your documents</li>
                <li>We claim no ownership of your content</li>
                <li>You can use our service for any legal purpose</li>
              </ul>

              <h2>Disclaimers</h2>
              <h3>No Warranties</h3>
              <p>PDF Merger AI is provided "as is" without warranties of any kind. We don't guarantee:</p>
              <ul>
                <li>Perfect accuracy of all processing</li>
                <li>Compatibility with all document formats</li>
                <li>Uninterrupted service availability</li>
                <li>Freedom from all bugs or errors</li>
              </ul>

              <h3>Limitation of Liability</h3>
              <p>Since our service is free and processes documents locally:</p>
              <ul style={{ lineHeight: '1.8' }}>
                <li>We're not liable for any damages from using the service</li>
                <li>We're not responsible for document content or legality</li>
                <li>Use the service at your own risk</li>
                <li>Maximum liability is limited to $0 (the cost of our service)</li>
              </ul>

              <h2>Termination</h2>
              <p>Either party can terminate this agreement:</p>
              <ul>
                <li><strong>You:</strong> Stop using the service anytime</li>
                <li><strong>Us:</strong> We may restrict access for violations of these terms</li>
                <li><strong>Effect:</strong> These terms survive termination where applicable</li>
              </ul>

              <h2>Changes to Terms</h2>
              <p>We may update these terms:</p>
              <ul>
                <li>Updates will be posted on this page</li>
                <li>Continued use means acceptance of new terms</li>
                <li>Material changes will be highlighted</li>
                <li>We'll update the "Last updated" date</li>
              </ul>

              <h2>Governing Law</h2>
              <p>These terms are governed by applicable law where you use the service. Disputes will be resolved in appropriate courts.</p>

              <h2>Contact Information</h2>
              <p>Questions about these terms?</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:legal@pdfmerger.ai">legal@pdfmerger.ai</a></li>
                <li><strong>Support:</strong> <a href="mailto:support@pdfmerger.ai">support@pdfmerger.ai</a></li>
                <li><strong>Website:</strong> <a href="https://pdf-merger-app.netlify.app">PDF Merger AI</a></li>
              </ul>

              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', margin: '30px 0', border: '1px solid #0ea5e9' }}>
                <h3 style={{ color: '#0369a1', marginTop: '0' }}>Terms Summary</h3>
                <p><strong>Keep it simple:</strong> Use our free PDF tools for any legal purpose, respect others, and enjoy complete privacy. We built this service to be useful and trustworthy – that's our commitment to you.</p>
              </div>
            </div>

            <div className="cta-section" style={{ textAlign: 'center', margin: '40px 0' }}>
              <button 
                className="futuristic-btn primary" 
                style={{ padding: '15px 30px', fontSize: '1.1em' }}
                onClick={() => navigate('/')}
              >
                Start Using PDF Tools →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Terms
