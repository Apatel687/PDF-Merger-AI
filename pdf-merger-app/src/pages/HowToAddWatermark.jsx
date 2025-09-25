import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shield, Type, Settings } from 'lucide-react'
import SEO from '../components/SEO'

function HowToAddWatermark() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="How to Add Watermark to PDF - Free PDF Watermark Tutorial"
        description="Learn how to add watermarks and page numbers to PDF documents. Step-by-step guide for PDF annotation and document protection."
        keywords={['add watermark to pdf', 'pdf watermark tool', 'pdf page numbers', 'pdf annotation']}
        canonical="https://pdf-merger-app.netlify.app/how-to-add-watermark"
      />
      
      <header className="app-header futuristic-card">
        <div className="header-content">
          <button className="futuristic-btn" onClick={() => navigate('/annotate')}>
            <ArrowLeft size={16} /> Back to Annotation Tools
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <article className="content-page futuristic-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>How to Add Watermarks & Page Numbers to PDF</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <Shield size={24} style={{ color: '#8b5cf6' }} />
              <span style={{ color: '#666' }}>Professional PDF Annotation</span>
            </div>

            <h2>Adding Watermarks - Step by Step</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>Upload PDF:</strong> Choose the document you want to watermark</li>
              <li><strong>Enter Watermark Text:</strong> Type your watermark (e.g., "CONFIDENTIAL", "DRAFT")</li>
              <li><strong>Customize Settings:</strong> Adjust position, size, opacity, and color</li>
              <li><strong>Preview & Apply:</strong> See preview and apply watermark to all pages</li>
              <li><strong>Download:</strong> Get your watermarked PDF file</li>
            </ol>

            <h2>Adding Page Numbers</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>Select PDF:</strong> Upload your document</li>
              <li><strong>Choose Position:</strong> Select where to place page numbers</li>
              <li><strong>Set Format:</strong> Choose numbering style (1, 2, 3 or Page 1, Page 2)</li>
              <li><strong>Apply & Download:</strong> Process and download numbered PDF</li>
            </ol>

            <h2>Watermark Options</h2>
            <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div className="feature-item futuristic-card" style={{ padding: '20px' }}>
                <Type size={20} style={{ color: '#3b82f6', marginBottom: '10px' }} />
                <h3>Text Watermarks</h3>
                <p>Add custom text like "CONFIDENTIAL", "DRAFT", or company names</p>
              </div>
              <div className="feature-item futuristic-card" style={{ padding: '20px' }}>
                <Settings size={20} style={{ color: '#10b981', marginBottom: '10px' }} />
                <h3>Customization</h3>
                <p>Control position, size, opacity, color, and rotation of watermarks</p>
              </div>
            </div>

            <h2>Common Watermark Uses</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Document Security:</strong> "CONFIDENTIAL", "INTERNAL USE ONLY"</li>
              <li><strong>Draft Protection:</strong> "DRAFT", "PRELIMINARY", "NOT FINAL"</li>
              <li><strong>Copyright Protection:</strong> Company names, copyright notices</li>
              <li><strong>Status Indication:</strong> "APPROVED", "REVIEWED", "PENDING"</li>
            </ul>

            <h2>Best Practices</h2>
            <div className="tips-section futuristic-card" style={{ padding: '20px', margin: '20px 0' }}>
              <h3>Watermark Tips:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Use 20-30% opacity for subtle watermarks</li>
                <li>Choose light colors that don't interfere with text</li>
                <li>Position diagonally for better visibility</li>
                <li>Keep text short and clear</li>
              </ul>
              
              <h3>Page Number Tips:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Place in consistent locations (bottom center/right)</li>
                <li>Use readable font sizes (10-12pt)</li>
                <li>Consider document margins</li>
                <li>Test on different page sizes</li>
              </ul>
            </div>

            <h2>Security Benefits</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Document Tracking:</strong> Identify document versions and status</li>
              <li><strong>Copyright Protection:</strong> Prevent unauthorized use</li>
              <li><strong>Professional Appearance:</strong> Add branding and organization</li>
              <li><strong>Legal Protection:</strong> Clear ownership and usage rights</li>
            </ul>

            <div className="cta-section futuristic-card" style={{ padding: '30px', textAlign: 'center', marginTop: '40px' }}>
              <h2>Ready to Protect Your PDFs?</h2>
              <button className="futuristic-btn primary" onClick={() => navigate('/annotate')}>
                Add Watermarks Now
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}

export default HowToAddWatermark