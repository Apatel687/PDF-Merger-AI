import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import SEO from '../components/SEO'
import { Shield, Lock, Eye, Database } from 'lucide-react'

function Privacy() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="Privacy Policy – Your Data Protection | PDF Merger AI"
        description="PDF Merger AI Privacy Policy: Learn how we protect your privacy with 100% local processing. No data collection, no uploads, complete privacy guarantee."
        keywords={[ 'PDF Merger AI Privacy Policy','Local PDF processing privacy','No upload PDF tools','Privacy-first PDF editor','GDPR compliant PDF tools','Data protection PDF' ]}
        canonical="https://pdf-merger-app.netlify.app/privacy"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': 'Privacy Policy',
          'description': 'Privacy Policy for PDF Merger AI - explaining our commitment to user privacy and local processing.',
          'url': 'https://pdf-merger-app.netlify.app/privacy'
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
            <h2 className="hero-title gradient-text">Privacy Policy</h2>
            <p className="hero-description">Your privacy is our priority. Learn how we protect your data with local processing.</p>

            <div className="privacy-highlight futuristic-card" style={{ padding: '30px', margin: '30px 0', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', textAlign: 'center' }}>
              <Shield size={60} style={{ marginBottom: '20px' }} />
              <h2>100% Local Processing</h2>
              <p style={{ fontSize: '1.2em', margin: '15px 0' }}>Your documents never leave your browser. No uploads, no servers, no data collection.</p>
            </div>

            <div className="privacy-content futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <p><strong>Last updated:</strong> January 13, 2025</p>
              <p><strong>Effective date:</strong> January 13, 2025</p>

              <h2>Our Privacy Commitment</h2>
              <p>PDF Merger AI is designed with privacy as the foundation. Unlike other online PDF tools, we don't collect, store, or process your documents on our servers. Everything happens locally in your browser.</p>

              <h2>What Data We Do NOT Collect</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0' }}>
                <div className="privacy-item">
                  <Database size={30} style={{ color: '#ef4444' }} />
                  <h4>Your Documents</h4>
                  <p>We never receive, store, or have access to your PDF files or any document content.</p>
                </div>
                <div className="privacy-item">
                  <Eye size={30} style={{ color: '#ef4444' }} />
                  <h4>Personal Information</h4>
                  <p>We don't collect names, emails, phone numbers, or any personally identifiable information.</p>
                </div>
                <div className="privacy-item">
                  <Lock size={30} style={{ color: '#ef4444' }} />
                  <h4>File Metadata</h4>
                  <p>No file names, sizes, creation dates, or other metadata is collected or transmitted.</p>
                </div>
              </div>

              <h2>How Our Local Processing Works</h2>
              <ol style={{ lineHeight: '1.8' }}>
                <li><strong>File Selection:</strong> You choose files directly from your device</li>
                <li><strong>Browser Processing:</strong> All operations happen in your browser's memory</li>
                <li><strong>Local Results:</strong> Processed files are created locally on your device</li>
                <li><strong>No Transmission:</strong> Nothing is sent to our servers or any third party</li>
                <li><strong>Memory Clearing:</strong> Data is cleared when you close the browser tab</li>
              </ol>

              <h2>What We Do Collect (Minimal)</h2>
              <h3>Basic Website Analytics</h3>
              <p>We may collect basic, anonymized usage statistics to improve our service:</p>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Page views and general usage patterns</li>
                <li>Browser type and version (for compatibility)</li>
                <li>General geographic location (country level only)</li>
                <li>Performance metrics to optimize the service</li>
              </ul>
              <p><em>Important: This data is completely anonymous and cannot be linked to you personally.</em></p>

              <h3>Local Storage</h3>
              <p>We use your browser's local storage to save your preferences:</p>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Theme settings (light/dark mode)</li>
                <li>Accent color preferences</li>
                <li>Tool settings and configurations</li>
              </ul>
              <p><em>This data stays on your device and can be cleared at any time.</em></p>

              <h2>Third-Party Services</h2>
              <h3>Hosting</h3>
              <p>Our website is hosted on Netlify. They may collect basic server logs as part of their hosting service. See <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">Netlify's Privacy Policy</a>.</p>

              <h3>No Tracking</h3>
              <p>We do not use:</p>
              <ul>
                <li>Google Analytics or similar tracking tools</li>
                <li>Social media pixels</li>
                <li>Advertising networks</li>
                <li>Cross-site tracking cookies</li>
              </ul>

              <h2>Data Security</h2>
              <p>Since your documents never leave your device:</p>
              <ul style={{ lineHeight: '1.8' }}>
                <li><strong>No data breaches possible:</strong> We don't store your data</li>
                <li><strong>No server vulnerabilities:</strong> Processing is local</li>
                <li><strong>Complete control:</strong> You control all your data</li>
                <li><strong>Offline capable:</strong> Works even without internet after loading</li>
              </ul>

              <h2>Your Rights</h2>
              <p>Since we don't collect personal data:</p>
              <ul style={{ lineHeight: '1.8' }}>
                <li>No data to access, correct, or delete</li>
                <li>No accounts or profiles to manage</li>
                <li>Complete anonymity by design</li>
                <li>Right to use service without any data sharing</li>
              </ul>

              <h2>Children's Privacy</h2>
              <p>Our service is safe for all ages. Since we don't collect any personal information, there are no special considerations for children's privacy. Parents can be confident their children's documents remain completely private.</p>

              <h2>International Users</h2>
              <p>PDF Merger AI works the same way globally:</p>
              <ul>
                <li><strong>GDPR Compliant:</strong> No personal data processing</li>
                <li><strong>CCPA Compliant:</strong> No data collection or selling</li>
                <li><strong>Universal Privacy:</strong> Same privacy protection worldwide</li>
              </ul>

              <h2>Changes to Privacy Policy</h2>
              <p>If we update this privacy policy, we will:</p>
              <ul>
                <li>Post the updated policy on this page</li>
                <li>Update the "Last updated" date</li>
                <li>Maintain our core commitment to local processing</li>
              </ul>

              <h2>Contact Us</h2>
              <p>Questions about privacy?</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:privacy@pdfmerger.ai">privacy@pdfmerger.ai</a></li>
                <li><strong>Website:</strong> <a href="https://pdf-merger-app.netlify.app">PDF Merger AI</a></li>
              </ul>

              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', margin: '30px 0', border: '1px solid #0ea5e9' }}>
                <h3 style={{ color: '#0369a1', marginTop: '0' }}>Privacy Summary</h3>
                <p><strong>Your documents = Your business.</strong> We built PDF Merger AI to give you professional PDF tools while keeping your documents completely private. No uploads, no accounts, no tracking – just powerful tools that respect your privacy.</p>
              </div>
            </div>

            <div className="cta-section" style={{ textAlign: 'center', margin: '40px 0' }}>
              <button 
                className="futuristic-btn primary" 
                style={{ padding: '15px 30px', fontSize: '1.1em' }}
                onClick={() => navigate('/')}
              >
                Start Using Private PDF Tools →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Privacy
