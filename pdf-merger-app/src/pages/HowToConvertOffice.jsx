import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Download, Settings } from 'lucide-react'
import SEO from '../components/SEO'

function HowToConvertOffice() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="How to Convert Office Documents to PDF - Word Excel PowerPoint"
        description="Learn how to convert Word, Excel, PowerPoint documents to PDF. Step-by-step guide for Office to PDF conversion."
        keywords={['convert word to pdf', 'excel to pdf', 'powerpoint to pdf', 'office to pdf']}
        canonical="https://pdf-merger-app.netlify.app/how-to-convert-office"
      />
      
      <header className="app-header futuristic-card">
        <div className="header-content">
          <button className="futuristic-btn" onClick={() => navigate('/office')}>
            <ArrowLeft size={16} /> Back to Office Tools
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <article className="content-page futuristic-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>How to Convert Office Documents to PDF</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <FileText size={24} style={{ color: '#2563eb' }} />
              <span style={{ color: '#666' }}>Professional Document Conversion</span>
            </div>

            <h2>Word to PDF Conversion</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>Upload Word Document:</strong> Select .docx or .doc files</li>
              <li><strong>Choose Settings:</strong> Set page layout and formatting options</li>
              <li><strong>Convert:</strong> Process your document to PDF format</li>
              <li><strong>Download:</strong> Get your PDF with preserved formatting</li>
            </ol>

            <h2>Excel to PDF Conversion</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>Select Excel File:</strong> Upload .xlsx or .xls spreadsheets</li>
              <li><strong>Choose Worksheets:</strong> Select specific sheets or convert all</li>
              <li><strong>Set Page Options:</strong> Configure page breaks and scaling</li>
              <li><strong>Generate PDF:</strong> Create PDF with proper table formatting</li>
            </ol>

            <h2>PowerPoint to PDF</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>Upload Presentation:</strong> Select .pptx or .ppt files</li>
              <li><strong>Slide Options:</strong> Choose slides to include</li>
              <li><strong>Layout Settings:</strong> Set slide layout and notes options</li>
              <li><strong>Convert & Download:</strong> Get PDF presentation</li>
            </ol>

            <h2>Supported Office Formats</h2>
            <div className="format-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div className="format-item futuristic-card" style={{ padding: '20px', textAlign: 'center' }}>
                <h3>📝 Word Documents</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>.docx (Word 2007+)</li>
                  <li>.doc (Word 97-2003)</li>
                  <li>.rtf (Rich Text)</li>
                </ul>
              </div>
              <div className="format-item futuristic-card" style={{ padding: '20px', textAlign: 'center' }}>
                <h3>📊 Excel Spreadsheets</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>.xlsx (Excel 2007+)</li>
                  <li>.xls (Excel 97-2003)</li>
                  <li>.csv (Comma Separated)</li>
                </ul>
              </div>
              <div className="format-item futuristic-card" style={{ padding: '20px', textAlign: 'center' }}>
                <h3>📊 PowerPoint Presentations</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>.pptx (PowerPoint 2007+)</li>
                  <li>.ppt (PowerPoint 97-2003)</li>
                  <li>.odp (OpenDocument)</li>
                </ul>
              </div>
            </div>

            <h2>Conversion Features</h2>
            <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div className="feature-item futuristic-card" style={{ padding: '20px' }}>
                <Settings size={20} style={{ color: '#8b5cf6', marginBottom: '10px' }} />
                <h3>Format Preservation</h3>
                <p>Maintains original formatting, fonts, and layout in PDF output</p>
              </div>
              <div className="feature-item futuristic-card" style={{ padding: '20px' }}>
                <Download size={20} style={{ color: '#10b981', marginBottom: '10px' }} />
                <h3>Batch Processing</h3>
                <p>Convert multiple Office documents to PDF simultaneously</p>
              </div>
            </div>

            <h2>Why Convert to PDF?</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Universal Compatibility:</strong> PDFs work on any device or platform</li>
              <li><strong>Preserve Formatting:</strong> Maintain exact layout and appearance</li>
              <li><strong>Professional Sharing:</strong> Send documents that look the same everywhere</li>
              <li><strong>Print Ready:</strong> Consistent printing results</li>
              <li><strong>Security:</strong> Add password protection and restrictions</li>
            </ul>

            <h2>Best Practices</h2>
            <div className="tips-section futuristic-card" style={{ padding: '20px', margin: '20px 0' }}>
              <h3>For Word Documents:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Use standard fonts for better compatibility</li>
                <li>Check page breaks and margins before conversion</li>
                <li>Ensure images are properly embedded</li>
                <li>Review headers and footers</li>
              </ul>
              
              <h3>For Excel Spreadsheets:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Set print areas for better PDF layout</li>
                <li>Adjust column widths for readability</li>
                <li>Consider page orientation (portrait/landscape)</li>
                <li>Hide unnecessary rows/columns</li>
              </ul>

              <h3>For PowerPoint Presentations:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Choose appropriate slide layout</li>
                <li>Include or exclude speaker notes</li>
                <li>Consider handout formats</li>
                <li>Check slide transitions and animations</li>
              </ul>
            </div>

            <h2>Common Use Cases</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Business Reports:</strong> Convert Word reports to professional PDFs</li>
              <li><strong>Financial Documents:</strong> Share Excel spreadsheets as PDFs</li>
              <li><strong>Presentations:</strong> Distribute PowerPoint slides as PDFs</li>
              <li><strong>Documentation:</strong> Create PDF manuals from Word documents</li>
              <li><strong>Archiving:</strong> Store Office documents in PDF format</li>
            </ul>

            <div className="cta-section futuristic-card" style={{ padding: '30px', textAlign: 'center', marginTop: '40px' }}>
              <h2>Convert Your Office Documents</h2>
              <button className="futuristic-btn primary" onClick={() => navigate('/office')}>
                Try Office Converter Now
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}

export default HowToConvertOffice