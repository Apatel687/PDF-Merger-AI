import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FileUpload } from '../components/FileUpload'
import { EnhancedPDFPreview } from '../components/EnhancedPDFPreview'
import { EnhancedMergeControls } from '../components/EnhancedMergeControls'
import { PDFToolbar } from '../components/PDFToolbar'
import { ShareModal } from '../components/ShareModal'
import { PageIndexModal } from '../components/PageIndexModal'

import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher'
import { FileText, Download, Trash2, Share2, Zap, Sparkles, Rocket, Shield, Bookmark, FileSearch, MessageSquare, Sun, Moon, Hash, Stamp } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useTranslation } from '../hooks/useTranslation'
import SEO from '../components/SEO'

function Home() {
  const { theme, accentColor, toggleDarkMode } = useTheme()
  const { t, getLocalizedKeywords, language } = useTranslation()
  

  const navigate = useNavigate()
  const [pdfFiles, setPdfFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [mergedPdf, setMergedPdf] = useState(null)
  const [splitResults, setSplitResults] = useState([])
  const [fileRotations, setFileRotations] = useState({})
  const [deletedPages, setDeletedPages] = useState({})
  const [shareStats, setShareStats] = useState({ shares: 0, lastShared: null })
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPageIndexModal, setShowPageIndexModal] = useState(false)
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null)

  const handleFilesAdded = (newFiles) => {
    const filesWithId = newFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: file.size,
      pageCount: null
    }))
    setPdfFiles(prev => [...prev, ...filesWithId])
  }

  const handleFileRemove = (fileId) => {
    setPdfFiles(prev => prev.filter(file => file.id !== fileId))
    setFileRotations(prev => {
      const newRotations = { ...prev }
      delete newRotations[fileId]
      return newRotations
    })
    setDeletedPages(prev => {
      const newDeleted = { ...prev }
      delete newDeleted[fileId]
      return newDeleted
    })
  }

  const handleReorder = (newOrderedFiles) => {
    setPdfFiles(newOrderedFiles)
  }

  const handleRotatePage = (fileId, pageIndex, rotation) => {
    setFileRotations(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        [pageIndex]: rotation
      }
    }))
  }

  const handleDeletePage = (fileId, pageIndex) => {
    setDeletedPages(prev => ({
      ...prev,
      [fileId]: [...(prev[fileId] || []), pageIndex]
    }))
  }

  const handleSelectPage = (fileId, pageIndex) => {
    console.log('Selected page:', fileId, pageIndex)
  }

  const handleClearAll = () => {
    setPdfFiles([])
    setMergedPdfUrl(null)
    setSplitResults([])
    setFileRotations({})
    setDeletedPages({})
  }

  const handleShare = (platform) => {
    setShareStats(prev => ({
      shares: prev.shares + 1,
      lastShared: new Date().toLocaleString()
    }))
    console.log(`Shared via ${platform}`)
  }

  const handleSplitComplete = (results) => {
    setSplitResults(results)
  }

  // Handle title click to go to home page (reset app state)
  const handleTitleClick = useCallback(() => {
    console.log('Title clicked - resetting app state')
    // Use requestAnimationFrame to prevent visual glitches
    requestAnimationFrame(() => {
      setPdfFiles([])
      setMergedPdfUrl(null)
      setSplitResults([])
      setFileRotations({})
      setDeletedPages({})
      setIsLoading(false)
    })
  }, [])

  // Feature card click handlers with real functionality
  const handleFeatureClick = (featureType) => {
    switch (featureType) {
      case 'merge':
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) {
          fileInput.click()
        } else {
          const tempInput = document.createElement('input')
          tempInput.type = 'file'
          tempInput.multiple = true
          tempInput.accept = '.pdf'
          tempInput.onchange = (e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFilesAdded(Array.from(e.target.files))
            }
          }
          tempInput.click()
        }
        break
      case 'summarize':
        navigate('/summarize')
        break
      case 'ask':
        navigate('/ask')
        break
      case 'share':
        setShowShareModal(true)
        break
      default:
        break
    }
  }

  // Handle annotation features (page numbers)
  const handleAnnotationFeature = async (feature) => {
    console.log('handleAnnotationFeature called with:', feature)
    console.log('pdfFiles:', pdfFiles)
    
    if (pdfFiles.length === 0) {
      alert('Please upload a PDF file first')
      return
    }
    
    setIsLoading(true)
    try {
      console.log('Importing pdfAnnotations...')
      const { addPageNumbers } = await import('../utils/pdfAnnotations')
      console.log('Import successful')
      
      if (feature === 'pageNumbers') {
        console.log('Adding page numbers...')
        const result = await addPageNumbers(pdfFiles[0].file)
        const url = URL.createObjectURL(result)
        setMergedPdfUrl({ url, name: `${pdfFiles[0].name.replace('.pdf', '')}_numbered.pdf` })
        console.log('Page numbers added successfully')
      }
    } catch (error) {
      console.error('Annotation error:', error)
      alert(`Failed to add page numbers: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <SEO 
        title={language === 'en' ? "Free PDF Tools Online – Merge, Split, Compress | AI & Privacy‑First" : `${t('heroTitle')} | PDF Merger AI`}
        description={t('heroDescription')}
        keywords={getLocalizedKeywords()}
        canonical="https://pdf-merger-app.netlify.app/"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          'name': 'PDF Merger AI',
          'applicationCategory': 'Productivity',
          'operatingSystem': 'Web Browser',
          'browserRequirements': 'Requires JavaScript. Requires HTML5.',
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
          'url': 'https://pdf-merger-app.netlify.app/',
          'description': 'Advanced AI-powered PDF tools: merge, split, compress, convert, summarize, and chat with PDFs. 100% local processing for privacy.',
          'featureList': [
            'PDF Merging and Splitting',
            'AI PDF Summarization',
            'Interactive PDF Chat',
            'Office Document Conversion',
            'Image to PDF Conversion',
            'PDF Annotation Tools',
            'Local Processing for Privacy'
          ]
        }}
      />

      
      <header className="app-header futuristic-card">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon-container" onClick={(e) => { e.preventDefault(); navigate('/'); }} style={{ cursor: 'pointer' }}>
              <div className="logo-icon-wrapper">
                <Sparkles size={40} className="logo-icon" />
                <Zap size={20} className="logo-accent" />
              </div>
            </div>
            <div className="logo-text">
              <h1 className="logo-title clickable-title" onClick={(e) => { e.preventDefault(); handleTitleClick(); }}>
                <span className="logo-main">{t('appTitle').split(' ')[0]} {t('appTitle').split(' ')[1]}</span>
                <span className="logo-ai">{t('appTitle').split(' ')[2]}</span>
              </h1>
              <p className="subtitle">{t('subtitle')}</p>
            </div>
          </div>
          
          <div className="header-controls" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="futuristic-btn" 
              onClick={toggleDarkMode}
              title="Toggle dark/light mode"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <SimpleLanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="features-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <button 
              className="futuristic-btn" 
              onClick={(e) => {
                e.preventDefault()
                console.log('Merge button clicked')
                handleFeatureClick('merge')
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              {t('merge')}
            </button>
            <button 
              className="futuristic-btn" 
              onClick={(e) => {
                e.preventDefault()
                console.log('Summarize button clicked')
                handleFeatureClick('summarize')
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              {t('summarize')}
            </button>
            <button 
              className="futuristic-btn" 
              onClick={(e) => {
                e.preventDefault()
                console.log('Ask PDF button clicked')
                handleFeatureClick('ask')
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              {t('askPdf')}
            </button>
            <button 
              className="futuristic-btn" 
              onClick={(e) => {
                e.preventDefault()
                console.log('Images button clicked')
                navigate('/images')
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              {t('imageTools')}
            </button>
            <button 
              className="futuristic-btn" 
              onClick={(e) => {
                e.preventDefault()
                console.log('Office button clicked')
                navigate('/office')
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              {t('officeTools')}
            </button>
            <button 
              className="futuristic-btn" 
              onClick={(e) => {
                e.preventDefault()
                console.log('Annotation button clicked')
                navigate('/annotate')
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              {t('annotation')}
            </button>
            <button 
              className="futuristic-btn" 
              onClick={(e) => {
                e.preventDefault()
                console.log('Share button clicked')
                handleFeatureClick('share')
              }}
              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
            >
              {t('share')}
            </button>

          </div>
          {pdfFiles.length === 0 ? (
            <div className="welcome-section">
              {/* Top Banner Ad */}
              <div className="ad-banner-top" style={{ textAlign: 'center', margin: '20px 0' }}>
                <ins
                  className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-YOUR_ADSENSE_ID"
                  data-ad-slot="YOUR_TOP_BANNER_SLOT"
                  data-ad-format="auto"
                  data-full-width-responsive="true"
                />
              </div>
              
              <div className="hero-section">
                <div className="hero-content">
                  <h2 className="hero-title gradient-text">{t('heroTitle')}</h2>
                  <p className="hero-description">{t('heroDescription')}</p>
                </div>
                
                <div className="ai-features">
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <Zap size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>{t('lightningFast')}</h3>
                      <p>{t('lightningFastDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <FileText size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>{t('aiIntelligence')}</h3>
                      <p>{t('aiIntelligenceDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <Share2 size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>{t('seamlessSecure')}</h3>
                      <p>{t('seamlessSecureDesc')}</p>
                    </div>
                  </div>
                  
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <Shield size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>{t('localOffline')}</h3>
                      <p>{t('localOfflineDesc')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <FileUpload onFilesAdded={handleFilesAdded} />
              
              {/* Middle Content Ad */}
              <div className="ad-content-middle" style={{ textAlign: 'center', margin: '30px 0' }}>
                <ins
                  className="adsbygoogle"
                  style={{ display: 'block' }}
                  data-ad-client="ca-pub-YOUR_ADSENSE_ID"
                  data-ad-slot="YOUR_CONTENT_SLOT"
                  data-ad-format="rectangle"
                  data-full-width-responsive="true"
                />
              </div>
              
              <div className="features-showcase">
                <h3>{t('powerfullPdfTools')}</h3>
                <div className="tool-grid">
                  <button className="tool-button" onClick={() => handleFeatureClick('merge')}>
                    <FileText size={18} /> {t('merge')} PDF
                  </button>
                  <button 
                    className="tool-button" 
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Page numbers button clicked')
                      handleAnnotationFeature('pageNumbers')
                    }}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  >
                    <Bookmark size={18} /> {t('addPageNumbers')}
                  </button>

                  <button className="tool-button" onClick={() => handleFeatureClick('summarize')}>
                    <FileSearch size={18} /> {t('summarize')} PDF (AI)
                  </button>
                  <button className="tool-button" onClick={() => handleFeatureClick('ask')}>
                    <MessageSquare size={18} /> {t('askPdf')} (AI)
                  </button>
                  <button className="tool-button" onClick={() => navigate('/images')}>
                    <FileText size={18} /> JPG → PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/images')}>
                    <FileText size={18} /> PNG → PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/images')}>
                    <FileText size={18} /> PDF → {t('images')}
                  </button>
                  <button className="tool-button" onClick={() => navigate('/office')}>
                    <FileText size={18} /> Word → PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/office')}>
                    <FileText size={18} /> Excel → PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/office')}>
                    <FileText size={18} /> PPT → PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/annotate')}>
                    <Shield size={18} /> {t('addWatermark')}
                  </button>
                  <button className="tool-button" onClick={() => setShowShareModal(true)}>
                    <Share2 size={18} /> {t('share')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="workspace">
              <div className="pdf-toolbar simplified-toolbar futuristic-card">
                <div className="toolbar-section file-info-section">
                  <div className="logo-section">
                    <div className="logo-icon-container">
                      <div className="logo-icon-wrapper">
                        <FileText size={24} className="logo-icon" />
                        <Zap size={14} className="logo-accent" />
                      </div>
                    </div>
                    <div className="logo-text">
                      <h1 className="logo-main clickable-title" onClick={(e) => { e.preventDefault(); handleTitleClick(); }}>{t('appTitle').split(' ')[0]} {t('appTitle').split(' ')[1]}<span className="logo-ai">{t('appTitle').split(' ')[2]}</span></h1>
                      <p className="subtitle">{t('subtitle')}</p>
                    </div>
                  </div>
                  
                  <div className="file-stats">
                    <div className="stat-item">
                      <FileText size={16} />
                      <span className="stat-value">{pdfFiles.length}</span>
                      <span className="stat-label">{t('files')}</span>
                    </div>
                    <div className="stat-item">
                      <Rocket size={16} />
                      <span className="stat-value">{shareStats.shares}</span>
                      <span className="stat-label">{t('shares')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="toolbar-section action-section">
                  
                  <button 
                    onClick={handleClearAll}
                    className="clear-btn futuristic-btn"
                    title="Clear all files"
                  >
                    <Trash2 size={18} />
                    {t('clearAll')}
                  </button>
                </div>
              </div>

              <div className="content-sections">
                <div className="files-section">
                  <div className="section-header">
                    <h2>{t('selectedFiles')} ({pdfFiles.length})</h2>
                  </div>
                  
                  <FileUpload 
                    onFilesAdded={handleFilesAdded} 
                    isCompact={true}
                  />
                  
                  <EnhancedPDFPreview 
                    files={pdfFiles}
                    onFileRemove={handleFileRemove}
                    onReorder={handleReorder}
                    onRotatePage={handleRotatePage}
                    onDeletePage={handleDeletePage}
                    onSelectPage={handleSelectPage}
                  />
                </div>

                <div className="merge-section">
                  <EnhancedMergeControls 
                    files={pdfFiles}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    onMergeComplete={setMergedPdf}
                    onSplitComplete={handleSplitComplete}
                    fileRotations={fileRotations}
                    deletedPages={deletedPages}
                  />
                  
                  {(mergedPdf || mergedPdfUrl) && (
                    <div className="download-section futuristic-card">
                      <h3>{t('downloadMergedPdf')}</h3>
                      <div className="download-info">
                        <p>{t('mergedPdfInfo')}</p>
                        <div className="bookmark-tip">
                          <Bookmark size={16} />
                          <span>{t('bookmarkTip')}</span>
                        </div>
                      </div>
                      <div className="download-actions">
                        <button 
                          className="view-index-btn futuristic-btn"
                          onClick={() => setShowPageIndexModal(true)}
                        >
                          <FileSearch size={20} />
                          {t('viewPageIndex')}
                        </button>
                        <a 
                          href={(mergedPdf || mergedPdfUrl)?.url} 
                          download={(mergedPdf || mergedPdfUrl)?.name || 'processed-document.pdf'}
                          className="download-btn futuristic-btn primary"
                        >
                          <Download size={20} />
                          {t('downloadPdf')}
                        </a>
                      </div>
                    </div>
                  )}

                  {splitResults.length > 0 && (
                    <div className="split-results">
                      <h3>{t('splitResults')} ({splitResults.length} {t('files')})</h3>
                      <div className="split-files">
                        {splitResults.map((result, index) => (
                          <div key={index} className="split-file-item futuristic-card">
                            <div className="split-file-info">
                              <FileText size={18} />
                              <span className="split-file-name">{result.name}</span>
                            </div>
                            <a 
                              href={result.url}
                              download={result.name}
                              className="download-split-btn futuristic-btn"
                            >
                              <Download size={16} />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <ShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onShare={handleShare}
        pdfUrl={window.location.href}
        fileName="PDF Merger AI"
      />
      
      <PageIndexModal 
        isOpen={showPageIndexModal}
        onClose={() => setShowPageIndexModal(false)}
        files={pdfFiles}
      />
      {/* Footer with SEO links */}
      <footer className="seo-footer">
        <nav aria-label="Helpful links">
          <ul>
            <li><Link to="/summarize">How to summarize PDF with AI online</Link></li>
            <li><Link to="/ask">Chat with research paper PDF online</Link></li>
            <li><Link to="/images">Convert JPG to PDF online free</Link></li>
            <li><Link to="/office">Convert docx to PDF free tool</Link></li>
            <li><Link to="/annotate">Add watermark to PDF online</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/backup">Backup</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </nav>
      </footer>
    </div>
  )
}

export default Home
