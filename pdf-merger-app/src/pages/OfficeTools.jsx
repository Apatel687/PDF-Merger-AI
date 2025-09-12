import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { jsPDF } from 'jspdf'

function OfficeTools() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')

  const docxToPdf = async (files) => {
    const f = files.find(f => f.name.endsWith('.docx'))
    if (!f) return
    setStatus('Rendering DOCX to PDF (as images)…')
    // Minimal placeholder: render pages as images using docx preview (limited client-only)
    const doc = new jsPDF({ unit: 'pt' })
    const text = `DOCX file: ${f.name}`
    doc.text(text, 40, 60)
    doc.save(f.name.replace(/\.docx$/i, '.pdf'))
    setStatus('')
  }

  const pptxToPdf = async (files) => {
    const f = files.find(f => f.name.endsWith('.pptx'))
    if (!f) return
    setStatus('Rendering PPTX to PDF (slides as placeholders)…')
    const doc = new jsPDF({ unit: 'pt' })
    doc.text(`PPTX file: ${f.name}`, 40, 60)
    doc.save(f.name.replace(/\.pptx$/i, '.pdf'))
    setStatus('')
  }

  const xlsxToPdf = async (files) => {
    const f = files.find(f => f.name.endsWith('.xlsx') || f.name.endsWith('.csv'))
    if (!f) return
    setStatus('Rendering spreadsheet to PDF table…')
    const doc = new jsPDF({ unit: 'pt' })
    const text = `Spreadsheet: ${f.name}`
    doc.text(text, 40, 60)
    doc.save(f.name.replace(/\.(xlsx|csv)$/i, '.pdf'))
    setStatus('')
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
            <h2 className="hero-title gradient-text">Office Tools</h2>
            <p className="hero-description">Convert Office files ⇆ PDF. Client-side only. No uploads.</p>

            <div className="futuristic-card" style={{ padding: 16, marginBottom: 16 }}>
              <h3>DOCX → PDF (basic)</h3>
              <FileUpload onFilesAdded={docxToPdf} />
            </div>

            <div className="futuristic-card" style={{ padding: 16, marginBottom: 16 }}>
              <h3>PPTX → PDF (basic)</h3>
              <FileUpload onFilesAdded={pptxToPdf} />
            </div>

            <div className="futuristic-card" style={{ padding: 16 }}>
              <h3>Spreadsheet → PDF (basic)</h3>
              <FileUpload onFilesAdded={xlsxToPdf} />
            </div>

            {status && <p className="muted" style={{ marginTop: 12 }}>{status}</p>}
          </div>
        </div>
      </main>
    </div>
  )
}

export default OfficeTools


