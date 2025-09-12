import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { jsPDF } from 'jspdf'
import SEO from '../components/SEO'

function ImageTools() {
  const navigate = useNavigate()
  const [images, setImages] = useState([])
  const [pdfPages, setPdfPages] = useState([])
  const [isBusy, setIsBusy] = useState(false)
  const [imgOutFormat, setImgOutFormat] = useState('image/jpeg')
  const [imgQuality, setImgQuality] = useState(0.9)
  const [pdfImgFormat, setPdfImgFormat] = useState('image/png')
  const [pdfImgQuality, setPdfImgQuality] = useState(0.92)
  const [pdfImgScale, setPdfImgScale] = useState(2)
  const hiddenImageInputRef = useRef(null)
  const hiddenPdfInputRef = useRef(null)

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

  const compressImageToCanvas = async (img, maxW = 1600, quality = 0.85, mime = 'image/jpeg') => {
    const scale = Math.min(1, maxW / img.width)
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL(mime, quality)
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

  // Image -> Image converter
  const handleConvertImages = async () => {
    if (images.length === 0) return
    setIsBusy(true)
    try {
      for (let i = 0; i < images.length; i++) {
        const img = await readFileAsImage(images[i])
        const url = await compressImageToCanvas(img, 1800, imgQuality, imgOutFormat)
        const a = document.createElement('a')
        const ext = imgOutFormat === 'image/png' ? 'png' : imgOutFormat === 'image/webp' ? 'webp' : 'jpg'
        a.href = url
        a.download = images[i].name.replace(/\.[^.]+$/, `.${ext}`)
        a.click()
      }
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
        const viewport = page.getViewport({ scale: pdfImgScale })
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = viewport.width
        canvas.height = viewport.height
        await page.render({ canvasContext: ctx, viewport }).promise
        const mime = pdfImgFormat
        const quality = pdfImgFormat === 'image/jpeg' || pdfImgFormat === 'image/webp' ? pdfImgQuality : undefined
        pages.push({ index: n, url: canvas.toDataURL(mime, quality) })
      }
      setPdfPages(pages)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <div className="app">
      <SEO 
        title="Convert JPG/PNG ⇆ PDF Online Free | PDF to Images Extractor"
        description="Convert JPG to PDF online free, convert PNG to PDF instantly, and extract images from PDF free. Compress images for PDF locally."
        keywords={[ 'Convert JPG to PDF online free','Convert PNG to PDF instantly','Convert PDF to image extractor','Compress images for PDF free' ]}
        canonical={window.location.origin + '/images'}
        ogImage={window.location.origin + '/pdf-icon-512.png'}
        jsonLd={{ '@context':'https://schema.org','@type':'WebPage','name':'Image ⇆ PDF Tools','url':window.location.origin + '/images' }}
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
            <h2 className="hero-title gradient-text">Image Tools</h2>
            <p className="hero-description">Convert JPG/PNG ⇆ PDF with local compression. Extract PDF pages as images.</p>

            <div className="futuristic-card" style={{ padding: 16, marginBottom: 16 }}>
              <h3>Images → PDF</h3>
              <FileUpload onFilesAdded={onImageFiles} />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <button className="futuristic-btn" onClick={() => hiddenImageInputRef.current && hiddenImageInputRef.current.click()}>Choose Images</button>
                <input ref={hiddenImageInputRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={(e) => onImageFiles(Array.from(e.target.files || []))} />
                <span className="muted">Quality</span>
                <input type="range" min={0.5} max={1} step={0.05} value={imgQuality} onChange={(e) => setImgQuality(parseFloat(e.target.value))} />
              </div>
              {images.length > 0 && (
                <div className="muted" style={{ marginTop: 8 }}>
                  <strong>Selected:</strong> {images.map(f => `${f.name} (${(f.size/1024/1024).toFixed(1)} MB)`).slice(0,3).join(', ')}{images.length>3?` and ${images.length-3} more`:''}
                </div>
              )}
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
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                <button className="futuristic-btn" onClick={() => hiddenPdfInputRef.current && hiddenPdfInputRef.current.click()}>Choose PDF</button>
                <input ref={hiddenPdfInputRef} type="file" accept="application/pdf" style={{ display:'none' }} onChange={(e) => onPdfFiles(Array.from(e.target.files || []))} />
                <label>
                  Output format:
                  <select value={pdfImgFormat} onChange={(e) => setPdfImgFormat(e.target.value)} style={{ marginLeft: 6 }}>
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </label>
                <label style={{ marginLeft: 8 }}>
                  Scale
                  <input type="range" min={1} max={3} step={0.25} value={pdfImgScale} onChange={(e) => setPdfImgScale(parseFloat(e.target.value))} />
                </label>
                {(pdfImgFormat === 'image/jpeg' || pdfImgFormat === 'image/webp') && (
                  <label style={{ marginLeft: 8 }}>
                    Quality
                    <input type="range" min={0.5} max={1} step={0.05} value={pdfImgQuality} onChange={(e) => setPdfImgQuality(parseFloat(e.target.value))} />
                  </label>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8, marginTop: 12 }}>
                {pdfPages.map(p => (
                  <div key={p.index} className="futuristic-card" style={{ padding: 8 }}>
                    <img src={p.url} alt={`Converted PDF page ${p.index} as image`} style={{ width: '100%', height: 'auto' }} />
                    <a className="futuristic-btn" href={p.url} download={`page-${p.index}.png`} style={{ marginTop: 6, display: 'inline-block' }}>Download</a>
                  </div>
                ))}
              </div>
              {pdfPages.length > 0 && (
                <div className="features-actions" style={{ marginTop: 12 }}>
                  <button className="download-btn futuristic-btn primary" onClick={() => {
                    pdfPages.forEach(p => {
                      const a = document.createElement('a')
                      a.href = p.url
                      a.download = `page-${p.index}.png`
                      a.click()
                    })
                  }}>Download All</button>
                </div>
              )}
            </div>

            <div className="futuristic-card" style={{ padding: 16, marginTop: 16 }}>
              <h3>Convert Image Format</h3>
              <p className="muted">Convert JPG ⇆ PNG ⇆ WEBP locally.</p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <label>
                  Output format:
                  <select value={imgOutFormat} onChange={(e) => setImgOutFormat(e.target.value)} style={{ marginLeft: 6 }}>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WEBP</option>
                  </select>
                </label>
                {(imgOutFormat === 'image/jpeg' || imgOutFormat === 'image/webp') && (
                  <label style={{ marginLeft: 8 }}>
                    Quality
                    <input type="range" min={0.5} max={1} step={0.05} value={imgQuality} onChange={(e) => setImgQuality(parseFloat(e.target.value))} />
                  </label>
                )}
                <button className="futuristic-btn" onClick={() => hiddenImageInputRef.current && hiddenImageInputRef.current.click()}>Choose Images</button>
                <button className="action-card futuristic-card" onClick={handleConvertImages} disabled={isBusy || images.length === 0}>
                  <div className="action-content"><div className="action-text"><h4>{isBusy ? 'Converting…' : 'Convert & Download'}</h4><p>Batch convert selected images</p></div></div>
                  <span className="action-indicator">Download files →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ImageTools


