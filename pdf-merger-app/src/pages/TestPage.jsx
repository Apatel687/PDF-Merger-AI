import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../hooks/useTranslation'

function TestPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="app">
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
            <button className="futuristic-btn" onClick={() => navigate(-1)}>{t('back')}</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">Test Page</h2>
            <p className="hero-description">This is a test page to check if routing works.</p>
            
            <div className="futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <h3>Test Content</h3>
              <p>If you can see this, the page is working correctly.</p>
              <p>Translation test: {t('home')} | {t('about')} | {t('back')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TestPage