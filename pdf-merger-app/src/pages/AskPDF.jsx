import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeSwitcher from '../components/ThemeSwitcher'
import { FileUpload } from '../components/FileUpload'
import { extractPdfTextWithPages, chunkTextByPages, retrieveRelevantChunks } from '../utils/pdfText'

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
            <h2 className="hero-title gradient-text">Ask your PDF</h2>
            <p className="hero-description">Private and local: text is extracted and queried in your browser.</p>

            <FileUpload onFilesAdded={onFilesAdded} />

            <div className="features-actions" style={{ marginTop: 16 }}>
              <button 
                className="action-card futuristic-card"
                disabled={!pdfFile || isLoading}
                onClick={() => {}}
              >
                <div className="action-content">
                  <div className="action-text">
                    <h4>{isLoading ? 'Loading…' : 'Ready'}</h4>
                    <p>Upload a PDF to start asking questions</p>
                  </div>
                </div>
                <span className="action-indicator">{isLoading ? 'Please wait' : 'Upload to start →'}</span>
              </button>
            </div>

            {chunks.length > 0 && (
              <div className="download-section futuristic-card" style={{ marginTop: 20 }}>
                <h3>Chat</h3>
                <div ref={chatRef} style={{ maxHeight: 300, overflowY: 'auto', padding: 12, background: 'rgba(0,0,0,0.02)', borderRadius: 8 }}>
                  {messages.map((m, idx) => (
                    <div key={idx} style={{ marginBottom: 12 }}>
                      <strong>{m.role === 'user' ? 'You' : 'AI'}</strong>
                      <p style={{ margin: '6px 0', whiteSpace: 'pre-wrap' }}>{m.text}</p>
                    </div>
                  ))}
                  {messages.length === 0 && <p className="muted">Ask something about the PDF content.</p>}
                </div>
                <div className="download-actions" style={{ gap: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Type your question…" 
                    className="futuristic-input" 
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        ask(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                    disabled={isLoading}
                    style={{ flex: 1, minWidth: 220 }}
                  />
                  <button className="download-btn futuristic-btn primary" onClick={handleExportChat} disabled={messages.length === 0}>Export chat as TXT</button>
                  <button className="clear-btn futuristic-btn" onClick={() => setMessages([])} disabled={messages.length === 0}>Clear Chat</button>
                  <button className="view-index-btn futuristic-btn" onClick={() => navigate('/')}>Back to Home</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AskPDF


