import { useNavigate, Link } from 'react-router-dom'
import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher'
import SEO from '../components/SEO'
import { HardDrive, Download, Upload, Shield, Zap, Sparkles, FileText, Cloud } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

function Backup() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="app">
      <SEO 
        title="Backup & Restore – Local PDF Data Management | PDF Merger AI"
        description="Backup and restore your PDF processing settings and preferences with PDF Merger AI. Local storage management for privacy-first PDF tools."
        keywords={['PDF Merger AI Backup', 'Local PDF backup', 'PDF settings backup', 'Privacy-first backup', 'Local storage PDF', 'PDF data management']}
        canonical="https://pdf-merger-app.netlify.app/backup"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': 'Backup & Restore',
          'description': 'Backup and restore settings for PDF Merger AI - local data management.',
          'url': 'https://pdf-merger-app.netlify.app/backup'
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
              <h1 className="logo-title clickable-title" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <span className="logo-main">PDF Merger</span>
                <span className="logo-ai">AI</span>
              </h1>
              <p className="subtitle">Next-Gen PDF Processing powered by AI</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <SimpleLanguageSwitcher />
            <button className="futuristic-btn" onClick={() => navigate(-1)}>{t('back')}</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">Backup & Restore</h2>
            <p className="hero-description">Manage your local settings and preferences with complete privacy.</p>

            <div className="backup-highlight futuristic-card" style={{ padding: '30px', margin: '30px 0', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: 'white', textAlign: 'center' }}>
              <HardDrive size={60} style={{ marginBottom: '20px' }} />
              <h2>Local Storage Only</h2>
              <p style={{ fontSize: '1.2em', margin: '15px 0' }}>Your settings stay on your device. No cloud storage, complete privacy.</p>
            </div>

            <div className="backup-content futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <h2>What Gets Backed Up</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', margin: '20px 0' }}>
                <div className="backup-item">
                  <Shield size={30} style={{ color: '#10b981' }} />
                  <h4>Theme Settings</h4>
                  <p>Your preferred theme (light/dark) and accent color choices.</p>
                </div>
                <div className="backup-item">
                  <FileText size={30} style={{ color: '#3b82f6' }} />
                  <h4>Tool Preferences</h4>
                  <p>Default settings for PDF merging, splitting, and processing options.</p>
                </div>
                <div className="backup-item">
                  <Cloud size={30} style={{ color: '#8b5cf6' }} />
                  <h4>Language Settings</h4>
                  <p>Your preferred language and regional settings.</p>
                </div>
              </div>

              <h2>Backup Actions</h2>
              <div className="backup-actions" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', margin: '20px 0' }}>
                <button 
                  className="futuristic-btn primary"
                  onClick={() => {
                    const settings = {
                      theme: localStorage.getItem('theme') || 'light',
                      accentColor: localStorage.getItem('accentColor') || '#3b82f6',
                      language: localStorage.getItem('language') || 'en',
                      timestamp: new Date().toISOString()
                    }
                    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `pdf-merger-ai-backup-${new Date().toISOString().split('T')[0]}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  <Download size={20} />
                  Export Settings
                </button>
                
                <button 
                  className="futuristic-btn"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.json'
                    input.onchange = (e) => {
                      const file = e.target.files[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          try {
                            const settings = JSON.parse(e.target.result)
                            if (settings.theme) localStorage.setItem('theme', settings.theme)
                            if (settings.accentColor) localStorage.setItem('accentColor', settings.accentColor)
                            if (settings.language) localStorage.setItem('language', settings.language)
                            alert('Settings restored successfully! Please refresh the page.')
                          } catch (error) {
                            alert('Invalid backup file format.')
                          }
                        }
                        reader.readAsText(file)
                      }
                    }
                    input.click()
                  }}
                >
                  <Upload size={20} />
                  Import Settings
                </button>
                
                <button 
                  className="futuristic-btn clear-btn"
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all settings? This cannot be undone.')) {
                      localStorage.removeItem('theme')
                      localStorage.removeItem('accentColor')
                      localStorage.removeItem('language')
                      alert('All settings cleared! Please refresh the page.')
                    }
                  }}
                >
                  Clear All Settings
                </button>
              </div>

              <h2>Privacy Notice</h2>
              <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '8px', margin: '20px 0', border: '1px solid #0ea5e9' }}>
                <h3 style={{ color: '#0369a1', marginTop: '0' }}>Local Storage Only</h3>
                <ul style={{ lineHeight: '1.8' }}>
                  <li>All settings are stored locally in your browser</li>
                  <li>No data is sent to our servers or any third party</li>
                  <li>Backup files are created and stored on your device</li>
                  <li>You have complete control over your data</li>
                </ul>
              </div>

              <h2>How It Works</h2>
              <ol style={{ lineHeight: '1.8' }}>
                <li><strong>Export:</strong> Download your current settings as a JSON file</li>
                <li><strong>Import:</strong> Upload a previously exported settings file</li>
                <li><strong>Clear:</strong> Reset all settings to defaults</li>
                <li><strong>Automatic:</strong> Settings are automatically saved as you use the app</li>
              </ol>
            </div>

            <div className="cta-section" style={{ textAlign: 'center', margin: '40px 0' }}>
              <button 
                className="futuristic-btn primary" 
                style={{ padding: '15px 30px', fontSize: '1.1em' }}
                onClick={() => navigate('/')}
              >
                Back to PDF Tools →
              </button>
            </div>
          </div>
        </div>
      </main>

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
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </nav>
      </footer>
    </div>
  )
}

export default Backup