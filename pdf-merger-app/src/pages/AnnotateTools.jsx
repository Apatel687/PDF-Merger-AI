import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import SEO from '../components/SEO'
import { useToast } from '../components/Toast'

function AnnotateTools() {
  const navigate = useNavigate()
  const { notify } = useToast()
  const [pdfFile, setPdfFile] = useState(null)
  const [isBusy, setIsBusy] = useState(false)
  const [wmText, setWmText] = useState('CONFIDENTIAL')
  const [wmFontSize, setWmFontSize] = useState(48)
  const [wmColor, setWmColor] = useState('#cc1f1f')
  const [wmOpacity, setWmOpacity] = useState(0.2)
  const [wmPosition, setWmPosition] = useState('center') // tl, tr, bl, br, center
  const [pageNumPos, setPageNumPos] = useState('br')
  const [pageNumFormat, setPageNumFormat] = useState('page-of') // page-of | roman
  const [pageNumSize, setPageNumSize] = useState(10)
  const [pageNumColor, setPageNumColor] = useState('#4c4c4c')
  const [pageNumBold, setPageNumBold] = useState(false)
  const [pageRange, setPageRange] = useState('all') // e.g., all or 1-3,5
  const [previewPages, setPreviewPages] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' })
  const [downloadUrl, setDownloadUrl] = useState('')

  const onPdfFiles = (files) => {
    console.log('Files received:', files)
    const f = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    console.log('PDF file found:', f)
    if (f) {
      setPdfFile(f)
      console.log('PDF file set:', f.name)
    } else {
      console.log('No PDF file found in:', files)
    }
  }

  const fileSizeMB = pdfFile ? (pdfFile.size / (1024 * 1024)).toFixed(1) : null

  const parseRanges = (rangeStr, total) => {
    if (!rangeStr || rangeStr === 'all') return (i) => true
    const parts = rangeStr.split(',').map(p => p.trim()).filter(Boolean)
    const ranges = parts.map(p => {
      const [a, b] = p.split('-')
      const start = Math.max(1, parseInt(a, 10) || 1)
      const end = Math.min(total, parseInt(b || a, 10) || start)
      return [start, end]
    })
    return (i) => {
      const pageNum = i + 1
      return ranges.some(([s, e]) => pageNum >= s && pageNum <= e)
    }
  }

  const toRoman = (num) => {
    if (num <= 0) return ''
    const romans = [
      [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
      [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
      [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']
    ]
    let res = ''
    let n = num
    for (const [v, s] of romans) {
      while (n >= v) { res += s; n -= v }
    }
    return res
  }

  const generatePreview = async () => {
    if (!pdfFile) return
    setIsBusy(true)
    setShowConfirm(false)
    try {
      // Wait for PDF.js to load
      let attempts = 0
      while (!window.pdfjsLib && attempts < 50) {
        await new Promise(resolve => setTimeout(resolve, 100))
        attempts++
      }
      
      if (!window.pdfjsLib) {
        throw new Error('PDF.js library not loaded')
      }
      
      const pdfjsLib = window.pdfjsLib
      const ab = await pdfFile.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: ab })
      const doc = await loadingTask.promise
      const previews = []
      const maxPages = Math.min(3, doc.numPages)
      for (let n = 1; n <= maxPages; n++) {
        const page = await doc.getPage(n)
        const viewport = page.getViewport({ scale: 1.5 })
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport }).promise
        // Overlay watermark preview
        ctx.save()
        ctx.globalAlpha = wmOpacity
        ctx.fillStyle = wmColor
        ctx.font = `${wmFontSize}px Helvetica`
        let x = canvas.width / 2, y = canvas.height / 2
        if (wmPosition === 'tl') { x = 40; y = 60 }
        if (wmPosition === 'tr') { x = canvas.width - 40; y = 60; ctx.textAlign = 'right' }
        if (wmPosition === 'bl') { x = 40; y = canvas.height - 40 }
        if (wmPosition === 'br') { x = canvas.width - 40; y = canvas.height - 40; ctx.textAlign = 'right' }
        if (wmPosition === 'center') { ctx.textAlign = 'center' }
        ctx.translate(x, y)
        ctx.rotate(30 * Math.PI / 180)
        ctx.fillText(wmText, 0, 0)
        ctx.restore()
        // Overlay page numbers preview
        ctx.save()
        ctx.globalAlpha = 1
        ctx.fillStyle = pageNumColor
        ctx.font = `${pageNumBold ? 'bold ' : ''}${pageNumSize}px Helvetica`
        const totalPages = doc.numPages
        const label = pageNumFormat === 'roman' ? toRoman(n) : `Page ${n} of ${totalPages}`
        let px = canvas.width - 80, py = canvas.height - 24, align = 'right'
        if (pageNumPos === 'bl') { px = 24; py = canvas.height - 24; align = 'left' }
        if (pageNumPos === 'tr') { px = canvas.width - 80; py = 36; align = 'right' }
        if (pageNumPos === 'tl') { px = 24; py = 36; align = 'left' }
        if (pageNumPos === 'center') { px = canvas.width / 2; py = canvas.height - 24; align = 'center' }
        ctx.textAlign = align
        ctx.fillText(label, px, py)
        ctx.restore()
        previews.push(canvas.toDataURL('image/png'))
      }
      setPreviewPages(previews)
      setShowConfirm(true)
    } finally {
      setIsBusy(false)
    }
  }

  const addPageNumbers = async () => {
    if (!pdfFile) return
    setIsBusy(true)
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(ab)
      const font = await pdfDoc.embedFont(pageNumBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica)
      const pages = pdfDoc.getPages()
      const include = parseRanges(pageRange, pages.length)
      pages.forEach((page, i) => {
        if (!include(i)) return
        const { width, height } = page.getSize()
        let x = width - 80, y = 24
        if (pageNumPos === 'bl') { x = 24; y = 24 }
        if (pageNumPos === 'tr') { x = width - 80; y = height - 36 }
        if (pageNumPos === 'tl') { x = 24; y = height - 36 }
        if (pageNumPos === 'center') { x = width/2; y = 24 }
        const label = pageNumFormat === 'roman' ? toRoman(i + 1) : `Page ${i + 1} of ${pages.length}`
        const col = hexToRgb(pageNumColor)
        page.drawText(label , { x, y, size: pageNumSize, font, color: rgb(col.r, col.g, col.b) })
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
    if (!pdfFile) {
      alert('Please select a PDF file first')
      return
    }
    
    setIsBusy(true)
    try {
      console.log('Starting watermark process...')
      const ab = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(ab)
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const pages = pdfDoc.getPages()
      const col = hexToRgb(wmColor)
      
      console.log(`Processing ${pages.length} pages...`)
      
      pages.forEach((page, index) => {
        const { width, height } = page.getSize()
        let x = width/2, y = height/2
        
        if (wmPosition === 'tl') { x = 40; y = height - 60 }
        if (wmPosition === 'tr') { x = width - 40; y = height - 60 }
        if (wmPosition === 'bl') { x = 40; y = 40 }
        if (wmPosition === 'br') { x = width - 40; y = 40 }
        
        // Simplified watermark without rotation for now
        page.drawText(text, { 
          x, 
          y, 
          size: wmFontSize, 
          font, 
          color: rgb(col.r, col.g, col.b), 
          opacity: wmOpacity 
        })
        
        console.log(`Watermark added to page ${index + 1}`)
      })
      
      console.log('Saving PDF...')
      const bytes = await pdfDoc.save()
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${pdfFile.name.replace('.pdf', '')}_watermarked.pdf`
      a.click()
      URL.revokeObjectURL(url)
      
      notify('Watermark added successfully!', 'success')
      console.log('Watermark process completed')
    } catch (error) {
      console.error('Watermark error:', error)
      notify(`Failed to add watermark: ${error.message}`, 'error')
    } finally {
      setIsBusy(false)
    }
  }

  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (!m) return { r: 0, g: 0, b: 0 }
    return { r: parseInt(m[1], 16)/255, g: parseInt(m[2], 16)/255, b: parseInt(m[3], 16)/255 }
  }

  const confirmAndApply = async () => {
    if (!pdfFile) return
    setShowConfirm(false)
    setIsBusy(true)
    setProgress({ current: 0, total: 1, label: 'Applying watermark and page numbers… Please wait.' })
    try {
      const ab = await pdfFile.arrayBuffer()
      const pdfDoc = await PDFDocument.load(ab)
      const wmFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const numFont = await pdfDoc.embedFont(pageNumBold ? StandardFonts.HelveticaBold : StandardFonts.Helvetica)
      const pages = pdfDoc.getPages()
      const include = parseRanges(pageRange, pages.length)
      const wmCol = hexToRgb(wmColor)
      const numCol = hexToRgb(pageNumColor)
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i]
        const { width, height } = page.getSize()
        // Watermark
        if (wmText) {
          let x = width/2, y = height/2
          if (wmPosition === 'tl') { x = 40; y = height - 60 }
          if (wmPosition === 'tr') { x = width - 40; y = height - 60 }
          if (wmPosition === 'bl') { x = 40; y = 40 }
          if (wmPosition === 'br') { x = width - 40; y = 40 }
          const angle = wmPosition === 'center' ? 30 : 0
          page.drawText(wmText, { x, y, rotate: { type: 'degrees', angle }, size: wmFontSize, font: wmFont, color: rgb(wmCol.r, wmCol.g, wmCol.b), opacity: wmOpacity })
        }
        // Page numbers
        if (include(i)) {
          let x = width - 80, y = 24
          if (pageNumPos === 'bl') { x = 24; y = 24 }
          if (pageNumPos === 'tr') { x = width - 80; y = height - 36 }
          if (pageNumPos === 'tl') { x = 24; y = height - 36 }
          if (pageNumPos === 'center') { x = width/2; y = 24 }
          const label = pageNumFormat === 'roman' ? toRoman(i + 1) : `Page ${i + 1} of ${pages.length}`
          page.drawText(label, { x, y, size: pageNumSize, font: numFont, color: rgb(numCol.r, numCol.g, numCol.b) })
        }
        if (i % 5 === 0) setProgress({ current: i + 1, total: pages.length, label: `Processing page ${i + 1} of ${pages.length}` })
      }
      const bytes = await pdfDoc.save()
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }))
      setDownloadUrl(url)
      notify('Changes applied. Your PDF is ready to download.', 'success')
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
              {pdfFile ? (
                <div className="futuristic-card" style={{ padding: 12, marginTop: 8, background: '#10b981', color: 'white' }}>
                  <strong>✓ PDF Selected:</strong> {pdfFile.name} ({fileSizeMB} MB)
                </div>
              ) : (
                <div className="futuristic-card" style={{ padding: 12, marginTop: 8, background: '#ef4444', color: 'white' }}>
                  <strong>⚠ No PDF Selected</strong> - Please choose a PDF file to continue
                </div>
              )}
              {pdfFile && pdfFile.size > 500 * 1024 * 1024 && (
                <div className="futuristic-card" style={{ padding: 10, marginTop: 8, borderColor: '#ef4444' }}>
                  Warning: This file exceeds 500 MB and may be slow to process in the browser.
                </div>
              )}
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', marginTop:8 }}>
                <button className="futuristic-btn" onClick={() => document.getElementById('annotate-input').click()}>Choose PDF</button>
                <input 
                  id="annotate-input" 
                  type="file" 
                  accept="application/pdf,.pdf" 
                  style={{ display:'none' }} 
                  onChange={(e) => {
                    console.log('File input changed:', e.target.files)
                    if (e.target.files && e.target.files.length > 0) {
                      onPdfFiles(Array.from(e.target.files))
                    }
                  }} 
                />
                <label>Watermark text <input type="text" value={wmText} onChange={(e) => setWmText(e.target.value)} /></label>
                <label>Watermark position
                  <select value={wmPosition} onChange={(e) => setWmPosition(e.target.value)} style={{ marginLeft: 6 }}>
                    <option value="center">Center (diagonal)</option>
                    <option value="tl">Top Left</option>
                    <option value="tr">Top Right</option>
                    <option value="bl">Bottom Left</option>
                    <option value="br">Bottom Right</option>
                  </select>
                </label>
                <label>Size <input type="number" min={8} max={200} value={wmFontSize} onChange={(e)=>setWmFontSize(parseInt(e.target.value||'0',10))} style={{ width: 80 }} /></label>
                <label>Color <input type="color" value={wmColor} onChange={(e)=>setWmColor(e.target.value)} /></label>
                <label>Opacity <input type="range" min={0.05} max={1} step={0.05} value={wmOpacity} onChange={(e)=>setWmOpacity(parseFloat(e.target.value))} /></label>
                <label>Page number format
                  <select value={pageNumFormat} onChange={(e)=>setPageNumFormat(e.target.value)} style={{ marginLeft: 6 }}>
                    <option value="page-of">Page X of Y</option>
                    <option value="roman">Roman (i, ii, iii)</option>
                  </select>
                </label>
                <label>Page number position
                  <select value={pageNumPos} onChange={(e) => setPageNumPos(e.target.value)} style={{ marginLeft: 6 }}>
                    <option value="br">Bottom Right</option>
                    <option value="bl">Bottom Left</option>
                    <option value="tr">Top Right</option>
                    <option value="tl">Top Left</option>
                    <option value="center">Bottom Center</option>
                  </select>
                </label>
                <label>Page # size <input type="number" min={6} max={36} value={pageNumSize} onChange={(e)=>setPageNumSize(parseInt(e.target.value||'0',10))} style={{ width: 80 }} /></label>
                <label>Bold <input type="checkbox" checked={pageNumBold} onChange={(e)=>setPageNumBold(e.target.checked)} /></label>
                <label>Color <input type="color" value={pageNumColor} onChange={(e)=>setPageNumColor(e.target.value)} /></label>
                <label>Pages <input type="text" placeholder="all or 1-3,5" value={pageRange} onChange={(e)=>setPageRange(e.target.value)} style={{ width: 120 }} /></label>
              </div>
              <div className="features-actions" style={{ marginTop: 12 }}>
                <button className="action-card futuristic-card" onClick={generatePreview} disabled={!pdfFile || isBusy}>
                  <div className="action-content"><div className="action-text"><h4>{isBusy ? 'Preparing…' : 'Preview Changes'}</h4><p>See the first pages with overlay</p></div></div>
                  <span className="action-indicator">Open preview →</span>
                </button>
                <button 
                  className="futuristic-btn" 
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Watermark button clicked')
                    console.log('pdfFile:', pdfFile)
                    console.log('wmText:', wmText)
                    if (!pdfFile) {
                      alert('Please upload a PDF file first!')
                      return
                    }
                    if (!wmText) {
                      alert('Please enter watermark text!')
                      return
                    }
                    addWatermark(wmText)
                  }} 
                  disabled={isBusy}
                  style={{ 
                    marginLeft: 12,
                    opacity: (!pdfFile || !wmText) ? 0.5 : 1,
                    cursor: (!pdfFile || !wmText) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {!pdfFile ? 'Upload PDF First' : !wmText ? 'Enter Text' : 'Add Watermark Only'}
                </button>
                <button 
                  className="futuristic-btn" 
                  onClick={addPageNumbers} 
                  disabled={!pdfFile || isBusy}
                  style={{ marginLeft: 12 }}
                >
                  Add Page Numbers Only
                </button>
              </div>
            </div>
            {showConfirm && (
              <div className="futuristic-card" style={{ padding: 16, marginTop: 12 }}>
                <h3>Confirm Changes</h3>
                <p className="muted">Review the preview below. Confirm to apply to the entire document.</p>
                <div style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8, marginTop: 8 }}>
                  {previewPages.map((src, idx) => (
                    <img key={idx} src={src} alt={`Preview page ${idx+1}`} style={{ width: '100%', borderRadius: 8, border: '1px solid var(--glass-border)' }} />
                  ))}
                </div>
                <div className="features-actions" style={{ marginTop: 12 }}>
                  <button className="futuristic-btn" onClick={() => setShowConfirm(false)}>Cancel</button>
                  <button className="futuristic-btn primary" onClick={confirmAndApply}>Confirm & Apply</button>
                </div>
              </div>
            )}
            {isBusy && (
              <div className="futuristic-card" style={{ padding: 16, marginTop: 12 }}>
                <div className="spinner" />
                <p>Applying watermark and page numbers… Please wait.</p>
                <progress max={progress.total || 1} value={progress.current} style={{ width:'100%' }} />
                <div className="muted" style={{ marginTop: 6 }}>{progress.label}</div>
              </div>
            )}
            {downloadUrl && !isBusy && (
              <div className="futuristic-card" style={{ padding: 16, marginTop: 12 }}>
                <h3>Your PDF is ready!</h3>
                <div className="features-actions" style={{ marginTop: 8 }}>
                  <a className="download-btn futuristic-btn primary" href={downloadUrl} download="annotated.pdf">Download PDF</a>
                  <button className="clear-btn futuristic-btn" onClick={() => { URL.revokeObjectURL(downloadUrl); setDownloadUrl(''); }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AnnotateTools


