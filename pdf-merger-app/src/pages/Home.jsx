import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FileUpload } from '../components/FileUpload'
import { EnhancedPDFPreview } from '../components/EnhancedPDFPreview'
import { EnhancedMergeControls } from '../components/EnhancedMergeControls'
import { PDFToolbar } from '../components/PDFToolbar'
import { ShareModal } from '../components/ShareModal'
import { PageIndexModal } from '../components/PageIndexModal'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileText, Download, Trash2, Share2, Zap, Sparkles, Rocket, Shield, Bookmark, FileSearch, MessageSquare } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import SEO from '../components/SEO'

function Home() {
  const { theme, accentColor } = useTheme()
  const navigate = useNavigate()
  const [pdfFiles, setPdfFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null)
  const [splitResults, setSplitResults] = useState([])
  const [fileRotations, setFileRotations] = useState({})
  const [deletedPages, setDeletedPages] = useState({})
  const [shareStats, setShareStats] = useState({ shares: 0, lastShared: null })
  const [showShareModal, setShowShareModal] = useState(false)
  const [showPageIndexModal, setShowPageIndexModal] = useState(false)

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
  const handleTitleClick = () => {
    setPdfFiles([])
    setMergedPdfUrl(null)
    setSplitResults([])
    setFileRotations({})
    setDeletedPages({})
    setIsLoading(false)
  }

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

  return (
    <div className="app">
      <SEO 
        title="Free PDF Tools Online – Merge, Split, Compress | AI & Privacy‑First"
        description="Free unlimited PDF tools (no signup). Merge PDF free online, split, compress, convert PDF ⇆ Word/Excel/PPT, images ⇆ PDF, AI PDF summarizer, Ask your PDF (chat). Local, secure, browser-based."
        keywords={[
          'Free PDF tools online','Merge PDF free online','Split PDF instantly','Compress PDF online free',
          'Convert PDF to Word free','Convert Word to PDF online','Convert Excel to PDF free','Convert PowerPoint to PDF free',
          'AI PDF summarizer free','Chat with PDF online','Privacy-first PDF editor','Local PDF tools (no server upload)'
        ]}
        canonical={window.location.origin + '/'}
        ogImage={window.location.origin + '/pdf-icon-512.png'}
        jsonLd={{
          '@context':'https://schema.org',
          '@type':'WebApplication',
          'name':'PDF Merger AI',
          'url':window.location.origin + '/',
          'applicationCategory':'Utility',
          'operatingSystem':'Web',
          'offers':{ '@type':'Offer', price:'0', priceCurrency:'USD' },
          'featureList':[ 'Merge PDF','Split PDF','Compress PDF','PDF to Word','Word to PDF','Excel to PDF','PPT to PDF','Images to PDF','PDF to images','AI PDF summarizer','Ask PDF','Annotate','Add Watermark','Add Page Numbers' ]
        }}
      />
      <ThemeSwitcher />
      
      <header className="app-header futuristic-card">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon-container">
              <div className="logo-icon-wrapper">
                <FileText size={40} className="logo-icon" />
                <Zap size={20} className="logo-accent" />
              </div>
            </div>
            <div className="logo-text">
              <h1 className="logo-title clickable-title" onClick={handleTitleClick}>
                <span className="logo-main">PDF Merger</span>
                <span className="logo-ai">AI</span>
              </h1>
              <p className="subtitle">Next-Gen PDF Processing powered by AI</p>
            </div>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <Sparkles size={20} />
              <span className="stat-value">{pdfFiles.length}</span>
              <span className="stat-label">Files</span>
            </div>
            <div className="stat-item">
              <Rocket size={20} />
              <span className="stat-value">{shareStats.shares}</span>
              <span className="stat-label">Shares</span>
            </div>
            {/* Share quick action in header via mini toolbar below */}
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="features-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
            <button className="futuristic-btn" onClick={() => handleFeatureClick('merge')}>Merge PDFs</button>
            <button className="futuristic-btn" onClick={() => handleFeatureClick('summarize')}>Summarize PDF</button>
            <button className="futuristic-btn" onClick={() => handleFeatureClick('ask')}>Ask your PDF</button>
            <button className="futuristic-btn" onClick={() => navigate('/images')}>Image Tools</button>
            <button className="futuristic-btn" onClick={() => navigate('/office')}>Office Tools</button>
            <button className="futuristic-btn" onClick={() => navigate('/annotate')}>Annotation</button>
            <button className="futuristic-btn" onClick={() => handleFeatureClick('share')}>Share</button>
          </div>
          {pdfFiles.length === 0 ? (
            <div className="welcome-section">
              <div className="hero-section">
                <div className="hero-content">
                  <h2 className="hero-title gradient-text">Best Free PDF Merger with AI</h2>
                  <p className="hero-description">Browser-based PDF tool (offline support): merge, split, compress, convert Office ⇆ PDF, and summarize with AI. Free unlimited PDF tools, privacy-first, no uploads.</p>
                </div>
                
                <div className="ai-features">
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <Zap size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>Lightning Fast PDF Tools</h3>
                      <p>Split PDF instantly and compress PDF online free in your browser</p>
                    </div>
                  </div>
                  
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <FileText size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>AI PDF Intelligence</h3>
                      <p>AI PDF summarizer free and Ask questions to PDF (AI Q&A)</p>
                    </div>
                  </div>
                  
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <Share2 size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>Seamless & Secure</h3>
                      <p>Free unlimited PDF tools (no signup) with privacy-first design</p>
                    </div>
                  </div>
                  
                  <div className="feature-card futuristic-card">
                    <div className="feature-icon">
                      <Shield size={24} />
                    </div>
                    <div className="feature-content">
                      <h3>Local & Offline</h3>
                      <p>Local PDF tools (no server upload). Offline PDF tools for browser</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <FileUpload onFilesAdded={handleFilesAdded} />
              
              <div className="features-showcase">
                <h3>Powerful PDF Tools</h3>
                <div className="tool-grid">
                  <button className="tool-button" onClick={() => handleFeatureClick('merge')}>
                    <FileText size={18} /> Merge PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/annotate')}>
                    <Bookmark size={18} /> Add Page Numbers
                  </button>
                  <button className="tool-button" onClick={() => navigate('/annotate')}>
                    <Shield size={18} /> Add Watermark
                  </button>
                  <button className="tool-button" onClick={() => handleFeatureClick('summarize')}>
                    <FileSearch size={18} /> Summarize PDF (AI)
                  </button>
                  <button className="tool-button" onClick={() => handleFeatureClick('ask')}>
                    <MessageSquare size={18} /> Ask your PDF (AI)
                  </button>
                  <button className="tool-button" onClick={() => navigate('/images')}>
                    <FileText size={18} /> JPG → PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/images')}>
                    <FileText size={18} /> PNG → PDF
                  </button>
                  <button className="tool-button" onClick={() => navigate('/images')}>
                    <FileText size={18} /> PDF → Images
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
                  <button className="tool-button" onClick={() => setShowShareModal(true)}>
                    <Share2 size={18} /> Share
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
                      <h1 className="logo-main clickable-title" onClick={handleTitleClick}>PDF Merger<span className="logo-ai">AI</span></h1>
                      <p className="subtitle">Next-Gen PDF Processing powered by AI</p>
                    </div>
                  </div>
                  
                  <div className="file-stats">
                    <div className="stat-item">
                      <FileText size={16} />
                      <span className="stat-value">{pdfFiles.length}</span>
                      <span className="stat-label">Files</span>
                    </div>
                    <div className="stat-item">
                      <Rocket size={16} />
                      <span className="stat-value">{shareStats.shares}</span>
                      <span className="stat-label">Shares</span>
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
                    Clear All
                  </button>
                </div>
              </div>

              <div className="content-sections">
                <div className="files-section">
                  <div className="section-header">
                    <h2>Selected Files ({pdfFiles.length})</h2>
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
                    onMergeComplete={setMergedPdfUrl}
                    onSplitComplete={handleSplitComplete}
                    fileRotations={fileRotations}
                    deletedPages={deletedPages}
                  />
                  
                  {mergedPdfUrl && (
                    <div className="download-section futuristic-card">
                      <h3>Download Merged PDF</h3>
                      <div className="download-info">
                        <p>Your merged PDF contains bookmarks for easy navigation between original documents.</p>
                        <div className="bookmark-tip">
                          <Bookmark size={16} />
                          <span>Tip: Use your PDF viewer's bookmark panel to jump between documents</span>
                        </div>
                      </div>
                      <div className="download-actions">
                        <button 
                          className="view-index-btn futuristic-btn"
                          onClick={() => setShowPageIndexModal(true)}
                        >
                          <FileSearch size={20} />
                          View Page Index
                        </button>
                        <a 
                          href={mergedPdfUrl} 
                          download="merged-document.pdf"
                          className="download-btn futuristic-btn primary"
                        >
                          <Download size={20} />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  )}

                  {splitResults.length > 0 && (
                    <div className="split-results">
                      <h3>Split Results ({splitResults.length} files)</h3>
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
      {/* Internal SEO links */}
      <div className="container" style={{ padding: 16 }}>
        <nav className="muted" aria-label="Helpful links">
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 12, listStyle: 'none', padding: 0, margin: 0 }}>
            <li><Link to="/summarize">How to summarize PDF with AI online</Link></li>
            <li><Link to="/ask">Chat with research paper PDF online</Link></li>
            <li><Link to="/images">Convert JPG to PDF online free</Link></li>
            <li><Link to="/office">Convert docx to PDF free tool</Link></li>
            <li><Link to="/annotate">Add watermark to PDF online</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

export default Home
