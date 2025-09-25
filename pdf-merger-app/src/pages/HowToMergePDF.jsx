import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import SEO from '../components/SEO'

function HowToMergePDF() {
  const navigate = useNavigate()

  return (
    <div className="app">
      <SEO 
        title="How to Merge PDF Files Online Free - Step by Step Guide"
        description="Learn how to merge PDF files online for free. Complete step-by-step guide to combine multiple PDFs into one document quickly and securely."
        keywords={['how to merge pdf', 'combine pdf files', 'pdf merger tutorial', 'merge pdf online free']}
        canonical="https://pdf-merger-app.netlify.app/how-to-merge-pdf"
      />
      
      <header className="app-header futuristic-card">
        <div className="header-content">
          <button className="futuristic-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <article className="content-page futuristic-card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>How to Merge PDF Files Online Free</h1>
            
            <h2>Step-by-Step Guide</h2>
            <ol>
              <li><strong>Upload Your PDFs:</strong> Click "Browse Files" or drag and drop your PDF files</li>
              <li><strong>Arrange Order:</strong> Drag files to reorder them as needed</li>
              <li><strong>Merge Files:</strong> Click "Merge PDFs" button</li>
              <li><strong>Download:</strong> Download your merged PDF file</li>
            </ol>

            <h2>Why Choose Our PDF Merger?</h2>
            <ul>
              <li>100% free with no registration required</li>
              <li>Secure browser-based processing</li>
              <li>No file size limits</li>
              <li>Works on all devices</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            <h3>Is it safe to merge PDFs online?</h3>
            <p>Yes, our tool processes files locally in your browser. Your documents never leave your device.</p>

            <h3>Can I merge password-protected PDFs?</h3>
            <p>Currently, we support merging non-password-protected PDFs for security reasons.</p>
          </article>
        </div>
      </main>
    </div>
  )
}

export default HowToMergePDF