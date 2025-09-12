import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { extractPdfTextWithPages, simpleSummarize } from '../utils/pdfText'

function Summarize() {
  const navigate = useNavigate()
  const [pdfFile, setPdfFile] = useState(null)
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const onFilesAdded = async (files) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setPdfFile(file)
  }

  const handleSummarize = async () => {
    if (!pdfFile) return
    setIsLoading(true)
    try {
      const { fullText } = await extractPdfTextWithPages(pdfFile)
      const sum = simpleSummarize(fullText, 5)
      setSummary(sum)
    } catch (e) {
      console.error(e)
      setSummary('Failed to summarize. Please try another PDF.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!summary) return
    try { await navigator.clipboard.writeText(summary) } catch {}
  }

  const handleDownloadTxt = () => {
    if (!summary) return
    const blob = new Blob([summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'summary.txt'
    a.click()
    URL.revokeObjectURL(url)
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
          <div>
            <button className="futuristic-btn" onClick={() => navigate(-1)}>← Back</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">Summarize PDF</h2>
            <p className="hero-description">All processing happens locally in your browser. Your files never leave your device.</p>

            <FileUpload onFilesAdded={onFilesAdded} />

            <div className="features-actions" style={{ marginTop: 16 }}>
              <button 
                className="action-card futuristic-card"
                onClick={handleSummarize}
                disabled={!pdfFile || isLoading}
              >
                <div className="action-content">
                  <div className="action-text">
                    <h4>{isLoading ? 'Summarizing…' : 'Summarize'}</h4>
                    <p>Generate a concise summary of your PDF</p>
                  </div>
                </div>
                <span className="action-indicator">{isLoading ? 'Please wait' : 'Click to summarize →'}</span>
              </button>
            </div>

            {summary && (
              <div className="download-section futuristic-card" style={{ marginTop: 20 }}>
                <h3>Summary</h3>
                <div className="download-info">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
                </div>
                <div className="download-actions">
                  <button className="view-index-btn futuristic-btn" onClick={handleCopy}>Copy Text</button>
                  <button className="download-btn futuristic-btn primary" onClick={handleDownloadTxt}>Download as TXT</button>
                  <button className="clear-btn futuristic-btn" onClick={() => navigate('/')}>Back to Home</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Summarize


