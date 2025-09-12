import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import SEO from '../components/SEO'

function AnnotateTools() {
  const navigate = useNavigate()
  const [pdfFile, setPdfFile] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [wmText, setWmText] = useState('CONFIDENTIAL')
  const [pageNumPos, setPageNumPos] = useState('br')

  const onPdfFiles = (files) => {
    const f = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    if (f) setPdfFile(f)
  }

  const addPageNumbers = async () => {
    if (!pdfFile) return
    setIsBusy(true)
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(ab)
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pages = pdfDoc.getPages()
      pages.forEach((page, i) => {
        const { width, height } = page.getSize()
        let x = width - 80, y = 24
        if (pageNumPos === 'bl') { x = 24; y = 24 }
        if (pageNumPos === 'tr') { x = width - 80; y = height - 36 }
        if (pageNumPos === 'tl') { x = 24; y = height - 36 }
        page.drawText(`${i + 1} / ${pages.length}` , { x, y, size: 10, font, color: rgb(0.3,0.3,0.3) })
      })
      const bytes = await pdfDoc.save()
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'numbered.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsBusy(false)
    }
  }

  const addWatermark = async (text = 'CONFIDENTIAL') => {
    if (!pdfFile) return
    setIsBusy(true)
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(ab)
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const pages = pdfDoc.getPages()
      pages.forEach((page) => {
        const { width, height } = page.getSize()
        page.drawText(text, { x: width/4, y: height/2, rotate: { type: 'degrees', angle: 30 }, size: 48, font, color: rgb(0.8,0.1,0.1), opacity: 0.2 })
      })
      const bytes = await pdfDoc.save()
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'watermarked.pdf'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="app">
      <SEO 
        title="Annotate PDF – Add Watermark & Page Numbers (Free, Local)"
        description="Add watermark to PDF online and add page numbers to PDF free. 100% local browser processing."
        keywords={[ 'Add watermark to PDF online','Add page numbers to PDF free','Annotate PDF free tool' ]}
        canonical={window.location.origin + '/annotate'}
        ogImage={window.location.origin + '/pdf-icon-512.png'}
        jsonLd={{ '@context':'https://schema.org','@type':'WebPage','name':'Annotate PDF','url':window.location.origin + '/annotate' }}
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
            <h2 className="hero-title gradient-text">Annotation Tools</h2>
            <p className="hero-description">Add page numbers and watermarks client‑side. Highlight/notes roadmap.</p>

            <div className="futuristic-card" style={{ padding: 16 }}>
              <h3>Upload PDF</h3>
              <FileUpload onFilesAdded={onPdfFiles} />
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginTop:8 }}>
                <button className="futuristic-btn" onClick={() => document.getElementById('annotate-input').click()}>Choose PDF</button>
                <input id="annotate-input" type="file" accept="application/pdf" style={{ display:'none' }} onChange={(e) => onPdfFiles(Array.from(e.target.files || []))} />
                <label>Watermark text <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value)} /></label>
                <label>Page number position
                  <select value={pageNumPos} onChange={(e) => setPageNumPos(e.target.value)} style={{ marginLeft: 6 }}>
                    <option value="br">Bottom Right</option>
                    <option value="bl">Bottom Left</option>
                    <option value="tr">Top Right</option>
                    <option value="tl">Top Left</option>
                  </select>
                </label>
              </div>
              <div className="features-actions" style={{ marginTop: 12 }}>
                <button className="action-card futuristic-card" onClick={addPageNumbers} disabled={!pdfFile || isBusy}>
                  <div className="action-content"><div className="action-text"><h4>{isBusy ? 'Working…' : 'Add Page Numbers'}</h4><p>Numbers added in the selected corner</p></div></div>
                  <span className="action-indicator">Download →</span>
                </button>
                <button className="action-card futuristic-card" onClick={() => addWatermark(wmText)} disabled={!pdfFile || isBusy}>
                  <div className="action-content"><div className="action-text"><h4>Add Watermark</h4><p>Diagonal semi-transparent text</p></div></div>
                  <span className="action-indicator">Download →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AnnotateTools


