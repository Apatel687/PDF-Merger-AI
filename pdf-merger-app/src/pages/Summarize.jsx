import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher'
import { FileUpload } from '../components/FileUpload'
import '../utils/pdfWorker'
import { extractPdfTextWithPages, simpleSummarize } from '../utils/pdfText'
import { useTranslation } from '../hooks/useTranslation'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Sparkles, Zap } from 'lucide-react'
import SEO from '../components/SEO'

function Summarize() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { theme, toggleDarkMode } = useTheme()
  const [pdfFile, setPdfFile] = useState(null)
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const onFilesAdded = async (files) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setPdfFile(file)
  }

  const handleSummarize = async () => {
    if (!pdfFile) return
    setIsLoading(true)
    setError('')
    setSummary('')
    
    try {
      // Check if PDF.js is loaded
      if (!window.pdfjsLib) {
        throw new Error('PDF.js library not loaded')
      }
      
      const { fullText } = await extractPdfTextWithPages(pdfFile)
      if (!fullText || fullText.trim().length === 0) {
        throw new Error('No text found in PDF')
      }
      
      const sum = simpleSummarize(fullText, 5)
      if (!sum || sum.trim().length === 0) {
        throw new Error('Could not generate summary')
      }
      
      setSummary(sum)
    } catch (e) {
      console.error('Summarization error:', e)
      setError(t('summarizeFailed') || 'Failed to summarize. Please try another PDF.')
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
      <SEO 
        title="AI PDF Summarizer Free – Summarize PDF Online (Local, Private)"
        description="Summarize long documents with AI locally in your browser. Free AI document summarizer for PDFs. Privacy-first: no uploads."
        keywords={[ 'AI PDF summarizer free','Summarize long documents AI tool','Document intelligence AI tool','Local AI PDF tool (privacy-first)','PDF text summarizer','AI document analysis' ]}
        canonical="https://pdf-merger-app.netlify.app/summarize"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'AI PDF Summarizer',
          'applicationCategory': 'Productivity',
          'operatingSystem': 'Web Browser',
          'softwareVersion': '1.0',
          'creator': {
            '@type': 'Organization',
            'name': 'PDF Merger AI'
          },
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD'
          },
          'description': 'Free AI-powered PDF summarizer that works locally in your browser for privacy and security.',
          'url': 'https://pdf-merger-app.netlify.app/summarize'
        }}
      />


      <header className="app-header futuristic-card">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-wrapper">
                <Sparkles size={40} className="logo-icon" />
                <Zap size={20} className="logo-accent" />
              </div>
            </div>
            <div className="logo-text">
              <h1 className="logo-title clickable-title" onClick={() => navigate('/')}>
                <span className="logo-main">{t('appTitle').split(' ')[0]} {t('appTitle').split(' ')[1]}</span>
                <span className="logo-ai">{t('appTitle').split(' ')[2]}</span>
              </h1>
              <p className="subtitle">{t('subtitle')}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="futuristic-btn" 
              onClick={toggleDarkMode}
              title="Toggle dark/light mode"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <SimpleLanguageSwitcher />
            <button className="futuristic-btn" onClick={() => navigate(-1)}>{t('back')}</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">{t('summarize')} PDF</h2>
            <p className="hero-description">{t('summarizeDescription') || 'Generate a concise summary of your PDF using AI'}</p>

            <FileUpload onFilesAdded={onFilesAdded} />

            <div className="features-actions" style={{ marginTop: 16 }}>
              <button 
                className="action-card futuristic-card"
                onClick={handleSummarize}
                disabled={!pdfFile || isLoading}
              >
                <div className="action-content">
                  <div className="action-text">
                    <h4>{isLoading ? t('summarizing') || 'Summarizing…' : t('summarize')}</h4>
                    <p>{t('summarizeDesc') || 'Generate a concise summary of your PDF'}</p>
                  </div>
                </div>
                <span className="action-indicator">{isLoading ? t('pleaseWait') || 'Please wait' : t('clickToSummarize') || 'Click to summarize →'}</span>
              </button>
            </div>

            {error && (
              <div className="download-section futuristic-card" style={{ marginTop: 20, borderColor: '#ef4444' }}>
                <h3 style={{ color: '#ef4444' }}>{t('error') || 'Error'}</h3>
                <div className="download-info">
                  <p>{error}</p>
                </div>
                <div className="download-actions">
                  <button className="clear-btn futuristic-btn" onClick={() => setError('')}>{t('tryAgain') || 'Try Again'}</button>
                </div>
              </div>
            )}
            
            {summary && !error && (
              <div className="download-section futuristic-card" style={{ marginTop: 20 }}>
                <h3>{t('summary') || 'Summary'}</h3>
                <div className="download-info">
                  <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
                </div>
                <div className="download-actions">
                  <button className="view-index-btn futuristic-btn" onClick={handleCopy}>{t('copyText') || 'Copy Text'}</button>
                  <button className="download-btn futuristic-btn primary" onClick={handleDownloadTxt}>{t('downloadTxt') || 'Download as TXT'}</button>
                  <button className="clear-btn futuristic-btn" onClick={() => navigate('/')}>{t('backToHome') || 'Back to Home'}</button>
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


