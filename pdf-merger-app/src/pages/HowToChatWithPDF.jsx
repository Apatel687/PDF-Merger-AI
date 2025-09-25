import { useNavigate } from 'react-router-dom'
import SimpleLanguageSwitcher from '../components/SimpleLanguageSwitcher'
import SEO from '../components/SEO'
import { MessageSquare, Bot, Search, Sparkles, Zap, ArrowLeft } from 'lucide-react'
import { useTranslation } from '../hooks/useTranslation'

function HowToChatWithPDF() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="app">
      <SEO 
        title="How to Chat with PDF - AI PDF Question & Answer Tutorial | PDF Merger AI"
        description="Learn how to chat with your PDF documents using AI. Ask questions and get instant answers from your PDF content. Complete tutorial guide."
        keywords={['chat with pdf', 'pdf ai chat tutorial', 'ask pdf questions', 'pdf question answer', 'ai pdf chatbot', 'interactive pdf', 'pdf conversation', 'document qa system']}
        canonical="https://pdf-merger-app.netlify.app/how-to-chat-with-pdf"
        ogImage="https://pdf-merger-app.netlify.app/pdf-icon-512.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          'name': 'How to Chat with PDF Documents',
          'description': 'Tutorial on using AI to chat with PDF documents and get instant answers.',
          'image': 'https://pdf-merger-app.netlify.app/pdf-icon-512.png',
          'totalTime': 'PT3M'
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
            <button className="futuristic-btn" onClick={() => navigate('/ask')}>
              <ArrowLeft size={16} /> Back to PDF Chat
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="welcome-section">
            <h2 className="hero-title gradient-text">How to Chat with Your PDFs</h2>
            <p className="hero-description">Interactive AI conversations with your documents - ask questions and get instant answers</p>
            
            <div className="features-grid">
              <div className="feature-card futuristic-card" style={{
                padding: '30px 20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="feature-icon" style={{ marginBottom: '20px' }}>
                  <MessageSquare size={48} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Interactive Chat</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>Have natural conversations with your PDF documents using advanced AI technology</p>
              </div>

              <div className="feature-card futuristic-card" style={{
                padding: '30px 20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="feature-icon" style={{ marginBottom: '20px' }}>
                  <Bot size={48} style={{ color: '#3b82f6' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Smart Understanding</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>AI understands context and provides relevant answers with page references</p>
              </div>

              <div className="feature-card futuristic-card" style={{
                padding: '30px 20px',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div className="feature-icon" style={{ marginBottom: '20px' }}>
                  <Search size={48} style={{ color: '#f59e0b' }} />
                </div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Instant Search</h3>
                <p style={{ lineHeight: '1.6', flex: 1 }}>Find specific information quickly without reading the entire document</p>
              </div>
            </div>

            <div className="about-content futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <h2>How PDF Chat Works</h2>
              <p>Our AI-powered chat system analyzes your PDF content and creates an intelligent conversation interface, allowing you to ask questions and get precise answers instantly.</p>
              
              <h3>Simple 4-Step Process</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', margin: '20px 0' }}>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#10b981', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                  <div>
                    <strong>Upload Your PDF:</strong> Choose the document you want to chat with - research papers, reports, manuals, or any PDF
                  </div>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#3b82f6', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                  <div>
                    <strong>AI Analysis:</strong> Our AI processes and understands your document structure, content, and context
                  </div>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#f59e0b', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                  <div>
                    <strong>Ask Questions:</strong> Type any question about the PDF content in natural language
                  </div>
                </div>
                <div className="step-item" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px' }}>
                  <div style={{ background: '#8b5cf6', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
                  <div>
                    <strong>Get Instant Answers:</strong> Receive accurate responses with specific page references and relevant excerpts
                  </div>
                </div>
              </div>

              <h3>Example Questions You Can Ask</h3>
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                  <div>
                    <h4>📊 Research & Analysis</h4>
                    <ul style={{ lineHeight: '1.6', fontSize: '14px' }}>
                      <li>"What are the main conclusions?"</li>
                      <li>"Summarize the methodology"</li>
                      <li>"What are the key findings?"</li>
                    </ul>
                  </div>
                  <div>
                    <h4>💼 Business Documents</h4>
                    <ul style={{ lineHeight: '1.6', fontSize: '14px' }}>
                      <li>"What does it say about pricing?"</li>
                      <li>"Find the revenue projections"</li>
                      <li>"What are the recommendations?"</li>
                    </ul>
                  </div>
                  <div>
                    <h4>🔍 Specific Information</h4>
                    <ul style={{ lineHeight: '1.6', fontSize: '14px' }}>
                      <li>"Find mentions of AI"</li>
                      <li>"What's in chapter 3?"</li>
                      <li>"Explain this concept"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3>Perfect For These Scenarios</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '20px 0' }}>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>🎓 Students & Researchers</h4>
                  <p>Quick research assistance and study help for academic papers and textbooks</p>
                </div>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>💼 Business Professionals</h4>
                  <p>Extract insights from reports, contracts, and business documents efficiently</p>
                </div>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>⚖️ Legal Teams</h4>
                  <p>Navigate complex legal documents and find specific clauses quickly</p>
                </div>
                <div style={{ padding: '15px', border: '1px solid var(--glass-border)', borderRadius: '8px' }}>
                  <h4>📚 Content Creators</h4>
                  <p>Research and fact-check information from multiple PDF sources</p>
                </div>
              </div>
            </div>

            <div className="stats-section futuristic-card" style={{ padding: '30px', margin: '30px 0', textAlign: 'center' }}>
              <h2>Why Our PDF Chat is Different</h2>
              <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', margin: '20px 0' }}>
                <div className="stat-item">
                  <MessageSquare size={30} style={{ color: '#10b981' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>100%</div>
                    <div>Private & Local</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Bot size={30} style={{ color: '#3b82f6' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>0$</div>
                    <div>Always Free</div>
                  </div>
                </div>
                <div className="stat-item">
                  <Search size={30} style={{ color: '#f59e0b' }} />
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '2em', fontWeight: 'bold' }}>∞</div>
                    <div>Unlimited Questions</div>
                  </div>
                </div>
              </div>

            <div className="about-content futuristic-card" style={{ padding: '30px', margin: '30px 0' }}>
              <h3>Pro Tips for Better Chat Results</h3>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
                <ul style={{ lineHeight: '1.8', margin: 0 }}>
                  <li>✅ Ask specific questions for more accurate answers</li>
                  <li>✅ Use clear, simple language in your questions</li>
                  <li>✅ Reference specific sections or chapters if needed</li>
                  <li>✅ Follow up with related questions for deeper insights</li>
                  <li>✅ Try different phrasings if you don't get the expected answer</li>
                  <li>✅ Use the export feature to save important conversations</li>
                </ul>
              </div>
            </div>

            <div className="contact-section futuristic-card" style={{ padding: '30px', margin: '30px 0', textAlign: 'center' }}>
              <h2>Ready to Chat with Your PDFs?</h2>
              <p>Start having intelligent conversations with your documents - completely free and private!</p>
              <button className="futuristic-btn primary" onClick={() => navigate('/ask')} style={{ marginTop: '20px', padding: '12px 30px', fontSize: '16px' }}>
                💬 Try PDF Chat Now
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HowToChatWithPDF