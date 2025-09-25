import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, MessageSquare } from 'lucide-react'
import SEO from '../components/SEO'

function Contact() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="Contact Us - PDF Merger AI Support"
        description="Get in touch with PDF Merger AI support team. Contact us for help, feedback, or business inquiries."
        canonical="https://pdf-merger-app.netlify.app/contact"
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
          <div className="content-page futuristic-card" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Contact Us</h1>
            
            <div style={{ display: 'grid', gap: '30px', marginTop: '30px' }}>
              <div className="contact-method futuristic-card" style={{ padding: '20px' }}>
                <Mail size={24} style={{ color: '#3b82f6', marginBottom: '10px' }} />
                <h3>Email Support</h3>
                <p>For technical support and general inquiries:</p>
                <a href="mailto:support@pdfmerger.ai" style={{ color: '#3b82f6' }}>support@pdfmerger.ai</a>
              </div>

              <div className="contact-method futuristic-card" style={{ padding: '20px' }}>
                <MessageSquare size={24} style={{ color: '#10b981', marginBottom: '10px' }} />
                <h3>Business Inquiries</h3>
                <p>For partnerships and business opportunities:</p>
                <a href="mailto:business@pdfmerger.ai" style={{ color: '#10b981' }}>business@pdfmerger.ai</a>
              </div>
            </div>

            <div style={{ marginTop: '40px' }}>
              <h2>Frequently Asked Questions</h2>
              <p>Before contacting us, check our <a href="/faq" style={{ color: '#3b82f6' }}>FAQ page</a> for quick answers to common questions.</p>
            </div>

            <div style={{ marginTop: '30px' }}>
              <h2>Response Time</h2>
              <p>We typically respond to all inquiries within 24-48 hours during business days.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Contact