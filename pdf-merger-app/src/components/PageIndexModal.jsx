import { useState, useEffect } from 'react'
import { X, FileText, Bookmark } from 'lucide-react'
import './PageIndexModal.css'

export function PageIndexModal({ isOpen, onClose, files }) {
  const [pageIndex, setPageIndex] = useState(null)

  useEffect(() => {
    if (isOpen) {
      const savedIndex = localStorage.getItem('pdfPageIndex')
      if (savedIndex) {
        setPageIndex(JSON.parse(savedIndex))
      }
    }
  }, [isOpen])

  if (!isOpen || !pageIndex) return null

  return (
    <div className="page-index-modal-overlay" onClick={onClose}>
      <div className="page-index-modal futuristic-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <FileText size={24} />
            PDF Page Index
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="index-info">
            <p>This index shows which pages in your merged PDF came from which original documents.</p>
            <div className="tip">
              <Bookmark size={16} />
              <span>Tip: Use Ctrl+F or Cmd+F in your PDF viewer to search for file names</span>
            </div>
          </div>
          
          <div className="page-index-list">
            <h3>Page Origin Reference</h3>
            <pre className="index-content">{pageIndex.content}</pre>
          </div>
          
          <div className="file-summary">
            <h3>Original Files</h3>
            <div className="file-list">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <FileText size={16} />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="futuristic-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}