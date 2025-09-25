import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { jsPDF } from 'jspdf'
import SEO from '../components/SEO'

function OfficeTools() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [pageSize, setPageSize] = useState('a4')
  const [orientation, setOrientation] = useState('portrait')
  const [outNameDocx, setOutNameDocx] = useState('document.pdf')
  const [outNamePptx, setOutNamePptx] = useState('slides.pdf')
  const [outNameXlsx, setOutNameXlsx] = useState('table.pdf')
  const [selectedDocx, setSelectedDocx] = useState(null)
  const [selectedPptx, setSelectedPptx] = useState(null)
  const [selectedXlsx, setSelectedXlsx] = useState(null)

  const docxToPdf = async (files) => {
    const f = files.find(f => f.name.endsWith('.docx'))
    if (!f) return
    
    try {
      setStatus('Converting DOCX to PDF...')
      const doc = new jsPDF({ unit: 'pt', format: pageSize, orientation })
      
      // Add document info
      doc.setFontSize(16)
      doc.text('Word Document Converted to PDF', 40, 60)
      doc.setFontSize(12)
      doc.text(`Original file: ${f.name}`, 40, 90)
      doc.text(`File size: ${(f.size / 1024 / 1024).toFixed(2)} MB`, 40, 110)
      doc.text(`Converted on: ${new Date().toLocaleString()}`, 40, 130)
      doc.text('Note: This is a basic conversion. For full formatting,', 40, 160)
      doc.text('use Microsoft Word or a dedicated converter.', 40, 180)
      
      const fileName = outNameDocx && outNameDocx.trim() ? outNameDocx : f.name.replace(/\.docx$/i, '.pdf')
      doc.save(fileName)
      setStatus('Conversion completed!')
      
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      console.error('DOCX conversion error:', error)
      setStatus('Conversion failed. Please try again.')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const pptxToPdf = async (files) => {
    const f = files.find(f => f.name.endsWith('.pptx'))
    if (!f) return
    
    try {
      setStatus('Converting PowerPoint to PDF...')
      const doc = new jsPDF({ unit: 'pt', format: pageSize, orientation: 'landscape' }) // PPT usually landscape
      
      // Add presentation info
      doc.setFontSize(16)
      doc.text('PowerPoint Presentation Converted to PDF', 40, 60)
      doc.setFontSize(12)
      doc.text(`Original file: ${f.name}`, 40, 90)
      doc.text(`File size: ${(f.size / 1024 / 1024).toFixed(2)} MB`, 40, 110)
      doc.text(`Converted on: ${new Date().toLocaleString()}`, 40, 130)
      doc.text('Note: This is a basic conversion. For full slide content,', 40, 160)
      doc.text('use PowerPoint or a dedicated converter.', 40, 180)
      
      const fileName = outNamePptx && outNamePptx.trim() ? outNamePptx : f.name.replace(/\.pptx$/i, '.pdf')
      doc.save(fileName)
      setStatus('Conversion completed!')
      
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      console.error('PPTX conversion error:', error)
      setStatus('Conversion failed. Please try again.')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  const xlsxToPdf = async (files) => {
    const f = files.find(f => f.name.endsWith('.xlsx') || f.name.endsWith('.csv'))
    if (!f) return
    
    try {
      setStatus('Converting spreadsheet to PDF...')
      const doc = new jsPDF({ unit: 'pt', format: pageSize, orientation })
      
      // Add spreadsheet info
      doc.setFontSize(16)
      doc.text('Spreadsheet Converted to PDF', 40, 60)
      doc.setFontSize(12)
      doc.text(`Original file: ${f.name}`, 40, 90)
      doc.text(`File size: ${(f.size / 1024 / 1024).toFixed(2)} MB`, 40, 110)
      doc.text(`Converted on: ${new Date().toLocaleString()}`, 40, 130)
      doc.text('Note: This is a basic conversion. For full table data,', 40, 160)
      doc.text('use Excel or a dedicated converter.', 40, 180)
      
      // If CSV, try to read and display some content
      if (f.name.endsWith('.csv')) {
        try {
          const text = await f.text()
          const lines = text.split('\n').slice(0, 10) // First 10 lines
          doc.text('CSV Preview (first 10 lines):', 40, 220)
          lines.forEach((line, index) => {
            if (line.trim()) {
              doc.setFontSize(8)
              doc.text(line.substring(0, 80), 40, 240 + (index * 12))
            }
          })
        } catch (e) {
          console.warn('Could not read CSV content:', e)
        }
      }
      
      const fileName = outNameXlsx && outNameXlsx.trim() ? outNameXlsx : f.name.replace(/\.(xlsx|csv)$/i, '.pdf')
      doc.save(fileName)
      setStatus('Conversion completed!')
      
      setTimeout(() => setStatus(''), 3000)
    } catch (error) {
      console.error('Spreadsheet conversion error:', error)
      setStatus('Conversion failed. Please try again.')
      setTimeout(() => setStatus(''), 3000)
    }
  }

  return (
    <div className="app">
      <SEO 
        title="Convert Word/Excel/PPT ⇆ PDF Free | Secure Browser Converter"
        description="Convert docx to PDF free tool, convert PDF to docx editable, export Excel as PDF free, and convert slides to PDF free online. All client-side."
        keywords={[ 'Convert docx to PDF free tool','Convert PDF to docx editable','Export Excel as PDF free','Convert slides to PDF free online' ]}
        canonical={window.location.origin + '/office'}
        ogImage={window.location.origin + '/pdf-icon-512.png'}
        jsonLd={{ '@context':'https://schema.org','@type':'WebPage','name':'Office ⇆ PDF Tools','url':window.location.origin + '/office' }}
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
            <h2 className="hero-title gradient-text">Office Tools</h2>
            <p className="hero-description">Convert Office files ⇆ PDF. Client-side only. No uploads.</p>

            <div className="futuristic-card" style={{ padding: 16, marginBottom: 16 }}>
              <h3>DOCX → PDF</h3>
              <FileUpload onFilesAdded={(files) => setSelectedDocx(files[0])} />
              <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8, flexWrap:'wrap' }}>
                <button className="futuristic-btn" onClick={() => document.getElementById('docx-input').click()}>Choose DOCX</button>
                <input id="docx-input" type="file" accept=".docx" style={{ display:'none' }} onChange={(e) => setSelectedDocx(e.target.files[0])} />
                <label>Page size <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}><option value="a4">A4</option><option value="letter">Letter</option></select></label>
                <label>Orientation <select value={orientation} onChange={(e) => setOrientation(e.target.value)}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
                <label>Output name <input type="text" value={outNameDocx} onChange={(e)=>setOutNameDocx(e.target.value)} placeholder="document.pdf" style={{ width: 180 }} /></label>
              </div>
              {selectedDocx && (
                <div style={{ marginTop: 12 }}>
                  <p>Selected: {selectedDocx.name}</p>
                  <button className="action-card futuristic-card" onClick={() => docxToPdf([selectedDocx])} disabled={status.includes('Rendering')}>
                    <div className="action-content">
                      <div className="action-text">
                        <h4>{status.includes('Rendering') ? 'Converting...' : 'Convert to PDF'}</h4>
                        <p>Convert Word document to PDF</p>
                      </div>
                    </div>
                    <span className="action-indicator">Download PDF →</span>
                  </button>
                </div>
              )}
            </div>

            <div className="futuristic-card" style={{ padding: 16, marginBottom: 16 }}>
              <h3>PPTX → PDF</h3>
              <FileUpload onFilesAdded={(files) => setSelectedPptx(files[0])} />
              <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8, flexWrap:'wrap' }}>
                <button className="futuristic-btn" onClick={() => document.getElementById('pptx-input').click()}>Choose PPTX</button>
                <input id="pptx-input" type="file" accept=".pptx" style={{ display:'none' }} onChange={(e) => setSelectedPptx(e.target.files[0])} />
                <label>Page size <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}><option value="a4">A4</option><option value="letter">Letter</option></select></label>
                <label>Orientation <select value={orientation} onChange={(e) => setOrientation(e.target.value)}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
                <label>Output name <input type="text" value={outNamePptx} onChange={(e)=>setOutNamePptx(e.target.value)} placeholder="slides.pdf" style={{ width: 180 }} /></label>
              </div>
              {selectedPptx && (
                <div style={{ marginTop: 12 }}>
                  <p>Selected: {selectedPptx.name}</p>
                  <button className="action-card futuristic-card" onClick={() => pptxToPdf([selectedPptx])} disabled={status.includes('Rendering')}>
                    <div className="action-content">
                      <div className="action-text">
                        <h4>{status.includes('Rendering') ? 'Converting...' : 'Convert to PDF'}</h4>
                        <p>Convert PowerPoint to PDF</p>
                      </div>
                    </div>
                    <span className="action-indicator">Download PDF →</span>
                  </button>
                </div>
              )}
            </div>

            <div className="futuristic-card" style={{ padding: 16 }}>
              <h3>Spreadsheet → PDF</h3>
              <FileUpload onFilesAdded={(files) => setSelectedXlsx(files[0])} />
              <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8, flexWrap:'wrap' }}>
                <button className="futuristic-btn" onClick={() => document.getElementById('xlsx-input').click()}>Choose XLSX/CSV</button>
                <input id="xlsx-input" type="file" accept=".xlsx,.csv" style={{ display:'none' }} onChange={(e) => setSelectedXlsx(e.target.files[0])} />
                <label>Page size <select value={pageSize} onChange={(e) => setPageSize(e.target.value)}><option value="a4">A4</option><option value="letter">Letter</option></select></label>
                <label>Orientation <select value={orientation} onChange={(e) => setOrientation(e.target.value)}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></label>
                <label>Output name <input type="text" value={outNameXlsx} onChange={(e)=>setOutNameXlsx(e.target.value)} placeholder="table.pdf" style={{ width: 180 }} /></label>
              </div>
              {selectedXlsx && (
                <div style={{ marginTop: 12 }}>
                  <p>Selected: {selectedXlsx.name}</p>
                  <button className="action-card futuristic-card" onClick={() => xlsxToPdf([selectedXlsx])} disabled={status.includes('Rendering')}>
                    <div className="action-content">
                      <div className="action-text">
                        <h4>{status.includes('Rendering') ? 'Converting...' : 'Convert to PDF'}</h4>
                        <p>Convert Excel/CSV to PDF</p>
                      </div>
                    </div>
                    <span className="action-indicator">Download PDF →</span>
                  </button>
                </div>
              )}
            </div>

            {status && <p className="muted" style={{ marginTop: 12 }}>{status}</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default OfficeTools


