import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Image, FileText, Zap } from 'lucide-react'
import SEO from '../components/SEO'

function HowToConvertImages() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="How to Convert Images to PDF - JPG PNG to PDF Tutorial"
        description="Learn how to convert images to PDF and PDF to images. Step-by-step guide for JPG, PNG, and other image formats."
        keywords={['convert images to pdf', 'jpg to pdf', 'png to pdf', 'image converter']}
        canonical="https://pdf-merger-app.netlify.app/how-to-convert-images"
      />
      
      <header className="app-header futuristic-card">
        <div className="header-content">
          <button className="futuristic-btn" onClick={() => navigate('/images')}>
            <ArrowLeft size={16} /> Back to Image Tools
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <article className="content-page futuristic-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>How to Convert Images to PDF & PDF to Images</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <Image size={24} style={{ color: '#f59e0b' }} />
              <span style={{ color: '#666' }}>Professional Image Conversion</span>
            </div>

            <h2>Images to PDF Conversion</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>Select Images:</strong> Choose JPG, PNG, GIF, or other image files</li>
              <li><strong>Arrange Order:</strong> Drag and drop to reorder images</li>
              <li><strong>Set Options:</strong> Choose page size, orientation, and margins</li>
              <li><strong>Convert:</strong> Click "Convert to PDF" to process</li>
              <li><strong>Download:</strong> Get your PDF with all images combined</li>
            </ol>

            <h2>PDF to Images Conversion</h2>
            <ol style={{ lineHeight: '1.8' }}>
              <li><strong>Upload PDF:</strong> Select the PDF you want to convert</li>
              <li><strong>Choose Format:</strong> Select output format (JPG, PNG, etc.)</li>
              <li><strong>Set Quality:</strong> Choose image resolution and quality</li>
              <li><strong>Convert Pages:</strong> Process all pages or select specific ones</li>
              <li><strong>Download Images:</strong> Get individual image files</li>
            </ol>

            <h2>Supported Formats</h2>
            <div className="format-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div className="format-item futuristic-card" style={{ padding: '20px', textAlign: 'center' }}>
                <h3>Input Formats</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>📷 JPG/JPEG</li>
                  <li>🖼️ PNG</li>
                  <li>🎨 GIF</li>
                  <li>📸 BMP</li>
                  <li>🖥️ TIFF</li>
                </ul>
              </div>
              <div className="format-item futuristic-card" style={{ padding: '20px', textAlign: 'center' }}>
                <h3>Output Formats</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li>📄 PDF</li>
                  <li>📷 JPG</li>
                  <li>🖼️ PNG</li>
                  <li>📸 BMP</li>
                  <li>🖥️ TIFF</li>
                </ul>
              </div>
            </div>

            <h2>Conversion Features</h2>
            <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div className="feature-item futuristic-card" style={{ padding: '20px' }}>
                <FileText size={20} style={{ color: '#3b82f6', marginBottom: '10px' }} />
                <h3>Batch Processing</h3>
                <p>Convert multiple images to PDF or extract all PDF pages at once</p>
              </div>
              <div className="feature-item futuristic-card" style={{ padding: '20px' }}>
                <Zap size={20} style={{ color: '#10b981', marginBottom: '10px' }} />
                <h3>Quality Control</h3>
                <p>Maintain image quality with customizable resolution settings</p>
              </div>
            </div>

            <h2>Common Use Cases</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>Document Scanning:</strong> Convert phone photos to PDF documents</li>
              <li><strong>Portfolio Creation:</strong> Combine artwork or photos into PDF</li>
              <li><strong>Report Generation:</strong> Include charts and graphs in PDF reports</li>
              <li><strong>Archive Creation:</strong> Convert old photos to searchable PDFs</li>
              <li><strong>Presentation Materials:</strong> Extract slides as individual images</li>
            </ul>

            <h2>Quality Tips</h2>
            <div className="tips-section futuristic-card" style={{ padding: '20px', margin: '20px 0' }}>
              <h3>For Best Results:</h3>
              <ul style={{ lineHeight: '1.8' }}>
                <li>Use high-resolution images (300 DPI or higher)</li>
                <li>Ensure good lighting and contrast</li>
                <li>Keep images in landscape or portrait consistently</li>
                <li>Compress large files before conversion if needed</li>
                <li>Choose appropriate page sizes (A4, Letter, etc.)</li>
              </ul>
            </div>

            <h2>File Size Optimization</h2>
            <ul style={{ lineHeight: '1.8' }}>
              <li><strong>JPG:</strong> Best for photos with many colors</li>
              <li><strong>PNG:</strong> Best for images with transparency or text</li>
              <li><strong>Compression:</strong> Balance quality vs file size</li>
              <li><strong>Resolution:</strong> Match intended use (web vs print)</li>
            </ul>

            <div className="cta-section futuristic-card" style={{ padding: '30px', textAlign: 'center', marginTop: '40px' }}>
              <h2>Start Converting Your Images</h2>
              <button className="futuristic-btn primary" onClick={() => navigate('/images')}>
                Try Image Converter Now
              </button>
            </div>
          </article>
        </div>
      </main>
    </div>
  )
}

export default HowToConvertImages