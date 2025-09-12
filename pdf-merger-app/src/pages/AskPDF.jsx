import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { extractPdfTextWithPages, chunkTextByPages, retrieveRelevantChunks } from '../utils/pdfText'
import SEO from '../components/SEO'

function AskPDF() {
  const navigate = useNavigate()
  const [pdfFile, setPdfFile] = useState(null)
  const [chunks, setChunks] = useState([])
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef(null)

  const onFilesAdded = async (files) => {
    if (!files || files.length === 0) return
    const file = files[0]
    setPdfFile(file)
    setIsLoading(true)
    try {
      const { pages } = await extractPdfTextWithPages(file)
      const c = chunkTextByPages(pages)
      setChunks(c)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const ask = async (question) => {
    if (!question) return
    const qMsg = { role: 'user', text: question }
    setMessages(prev => [...prev, qMsg])
    setIsLoading(true)
    try {
      const top = retrieveRelevantChunks(question, chunks, 3)
      const answer = top.length === 0
        ? 'I could not find relevant information in the document.'
        : `Based on the document:
${top.map(t => `- [Page ${t.page}] ${t.text.slice(0, 300)}…`).join('\n')}

Answer: ${question}`
      const aMsg = { role: 'assistant', text: answer }
      setMessages(prev => [...prev, aMsg])
      setTimeout(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, 0)
    } finally {
      setIsLoading(false)
    }
  }

  const [pendingQuestion, setPendingQuestion] = useState('')
  const handleSearch = () => {
    if (chunks.length === 0 || !pendingQuestion.trim()) return
    ask(pendingQuestion)
    setPendingQuestion('')
  }

  const handleExportChat = () => {
    const content = messages.map(m => (m.role === 'user' ? 'You: ' : 'AI: ') + m.text).join('\n\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <SEO 
        title="Ask Your PDF – Chat with PDF Online | Free AI PDF Chatbot"
        description="Ask questions to PDF with an AI-powered, private, local chatbot. Free AI PDF chatbot for research and document Q&A in your browser."
        keywords={[ 'Chat with PDF online','Ask questions to PDF (AI Q&A)','Free AI PDF chatbot','Smart PDF analysis tool' ]}
        canonical={window.location.origin + '/ask'}
        ogImage={window.location.origin + '/pdf-icon-512.png'}
        jsonLd={{ '@context':'https://schema.org','@type':'WebPage','name':'Ask Your PDF','url':window.location.origin + '/ask' }}
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
            <h2 className="hero-title gradient-text">Chat with PDF Online</h2>
            <p className="hero-description">Free AI PDF chatbot: private and local. Ask anything about your PDF content.</p>

            <FileUpload onFilesAdded={onFilesAdded} />

            <div className="features-actions" style={{ marginTop: 16 }}>
              <div className="action-card futuristic-card" style={{ width: '100%' }}>
                <div className="action-content">
                  <div className="action-text">
                    <h4>{chunks.length === 0 ? (isLoading ? 'Loading…' : 'Upload to start') : 'Ask a question'}</h4>
                    <p>Private and local: Q&A runs entirely in your browser</p>
                  </div>
                </div>
                <span className="action-indicator">{chunks.length === 0 ? 'Upload a PDF →' : 'Type a question below'}</span>
              </div>
            </div>

            <div className="download-section futuristic-card" style={{ marginTop: 20 }}>
              <h3>Chat</h3>
              <div ref={chatRef} style={{ maxHeight: 300, overflowY: 'auto', padding: 12, background: 'rgba(0,0,0,0.02)', borderRadius: 8 }}>
                {messages.map((m, idx) => (
                  <div key={idx} style={{ marginBottom: 12 }}>
                    <strong>{m.role === 'user' ? 'You' : 'AI'}</strong>
                    <p style={{ margin: '6px 0', whiteSpace: 'pre-wrap' }}>{m.text}</p>
                  </div>
                ))}
                {messages.length === 0 && <p className="muted">{chunks.length === 0 ? 'Upload a PDF first.' : 'Ask something about the PDF content.'}</p>}
              </div>
              <div className="download-actions" style={{ gap: 8 }}>
                <input 
                  type="text" 
                  placeholder={chunks.length === 0 ? 'Upload a PDF to enable chat…' : 'Type your question…'} 
                  className="futuristic-input" 
                  value={pendingQuestion}
                  onChange={(e) => setPendingQuestion(e.currentTarget.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && chunks.length > 0) handleSearch() }}
                  disabled={isLoading || chunks.length === 0}
                  style={{ flex: 1, minWidth: 220 }}
                />
                <button className="download-btn futuristic-btn primary" onClick={handleSearch} disabled={isLoading || chunks.length === 0 || !pendingQuestion.trim()}>Ask</button>
                <button className="download-btn futuristic-btn primary" onClick={handleExportChat} disabled={messages.length === 0}>Export chat as TXT</button>
                <button className="clear-btn futuristic-btn" onClick={() => setMessages([])} disabled={messages.length === 0}>Clear Chat</button>
                <button className="view-index-btn futuristic-btn" onClick={() => navigate('/')}>Back to Home</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AskPDF


