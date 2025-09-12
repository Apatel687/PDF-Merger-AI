import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { jsPDF } from 'jspdf'

function ImageTools() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [pdfPages, setPdfPages] = useState([])
  const [isBusy, setIsBusy] = useState(false)

  const onImageFiles = (files) => {
    const imgs = files.filter(f => /image\//.test(f.type))
    setImages(imgs)
  }

  const readFileAsImage = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const compressImageToCanvas = async (img, maxW = 1600, quality = 0.85) => {
    const scale = Math.min(1, maxW / img.width)
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL('image/jpeg', quality)
  }

  const handleImagesToPdf = async () => {
    if (images.length === 0) return
    setIsBusy(true)
    try {
      const doc = new jsPDF({ unit: 'pt', compress: true })
      for (let i = 0; i < images.length; i++) {
        const img = await readFileAsImage(images[i])
        const dataUrl = await compressImageToCanvas(img)
        const pageW = doc.internal.pageSize.getWidth()
        const pageH = doc.internal.pageSize.getHeight()
        // Fit image to page while preserving aspect
        const imgRatio = img.width / img.height
        let drawW = pageW, drawH = pageW / imgRatio
        if (drawH > pageH) { drawH = pageH; drawW = pageH * imgRatio }
        const x = (pageW - drawW) / 2
        const y = (pageH - drawH) / 2
        if (i > 0) doc.addPage()
        doc.addImage(dataUrl, 'JPEG', x, y, drawW, drawH)
      }
      doc.save('images-to-pdf.pdf')
    } finally {
      setIsBusy(false)
    }
  }

  // PDF -> images via PDF.js
  const onPdfFiles = async (files) => {
    const pdf = files.find(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'))
    if (!pdf) return
    setIsBusy(true)
    try {
      const { pdfjsLib } = await import('../utils/pdfSetup.js')
      const ab = await pdf.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: ab })
      const doc = await loadingTask.promise
      const pages = []
      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n)
        const viewport = page.getViewport({ scale: 2 })
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport }).promise
        pages.push({ index: n, url: canvas.toDataURL('image/png') })
      }
      setPdfPages(pages)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="app">
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
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">Image Tools</h2>
            <p className="hero-description">Convert JPG/PNG ⇆ PDF with local compression. Extract PDF pages as images.</p>

            <div className="futuristic-card" style={{ padding: 16, marginBottom: 16 }}>
              <h3>Images → PDF</h3>
              <FileUpload onFilesAdded={onImageFiles} />
              <div className="features-actions" style={{ marginTop: 12 }}>
                <button className="action-card futuristic-card" onClick={handleImagesToPdf} disabled={isBusy || images.length === 0}>
                  <div className="action-content"><div className="action-text"><h4>{isBusy ? 'Processing…' : 'Create PDF'}</h4><p>Compress and fit images into a PDF</p></div></div>
                  <span className="action-indicator">Download PDF →</span>
                </button>
              </div>
            </div>

            <div className="futuristic-card" style={{ padding: 16 }}>
              <h3>PDF → Images</h3>
              <FileUpload onFilesAdded={onPdfFiles} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginTop: 12 }}>
                {pdfPages.map(p => (
                  <div key={p.index} className="futuristic-card" style={{ padding: 8 }}>
                    <img src={p.url} alt={`Page ${p.index}`} style={{ width: '100%', height: 'auto' }} />
                    <a className="futuristic-btn" href={p.url} download={`page-${p.index}.png`} style={{ marginTop: 6, display: 'inline-block' }}>Download</a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ImageTools


