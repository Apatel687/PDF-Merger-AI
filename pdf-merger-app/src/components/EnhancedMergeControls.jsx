import { useState } from 'react'
import { useToast } from './Toast'
import '../utils/pdfWorker'
import { mergePDFs, splitPDF } from '../utils/simplePdfMerger'
import { FileText, Download, Scissors, RotateCw, Zap, Bookmark } from 'lucide-react'
import './EnhancedMergeControls.css'

export function EnhancedMergeControls({ 
  files, 
  isLoading, 
  setIsLoading, 
  onMergeComplete, 
  onSplitComplete,
  fileRotations,
  deletedPages
}) {
  const { notify } = useToast()
  const [mergeOptions, setMergeOptions] = useState({
    removeDuplicatePages: false,
    optimizeFileSize: true,
    addBookmarks: true,
    addPageIndex: true // New option for adding page index
  })
  const [outputName, setOutputName] = useState('merged-document.pdf')
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' })
  const [splitMode, setSplitMode] = useState('pages') // pages | ranges | every
  const [splitRanges, setSplitRanges] = useState('1-3,5')
  const [splitEvery, setSplitEvery] = useState(1)

  const handleMerge = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    
    try {
      setProgress({ current: 0, total: files.length, label: 'Merging PDFs…' })
      
      const fileObjects = files.map(f => f.file)
      const mergedBlob = await mergePDFs(fileObjects)
      const mergedPdfUrl = URL.createObjectURL(mergedBlob)
      
      onMergeComplete({ 
        url: mergedPdfUrl, 
        name: (outputName && outputName.trim()) || 'merged-document.pdf' 
      })
      notify('Merge successful. Your PDF is ready to download.', 'success')
    } catch (error) {
      console.error('Error merging PDFs:', error)
      notify('Failed to merge PDFs. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSplit = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    
    try {
      const splitResults = []
      
      for (const file of files) {
        const results = await splitPDF(file.file)
        results.forEach((result, index) => {
          const url = URL.createObjectURL(result.blob)
          splitResults.push({ 
            name: `${file.name.replace('.pdf', '')}_${result.name}`, 
            url 
          })
        })
      }
      
      onSplitComplete(splitResults)
      notify(`Split complete. Generated ${splitResults.length} files.`, 'success')
    } catch (error) {
      console.error('Error splitting PDFs:', error)
      notify('Failed to split PDFs. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleOption = (option) => {
    setMergeOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }))
  }

  return (
    <div className="enhanced-merge-controls">
      <div className="controls-header">
        <h2>Processing Options</h2>
        <div className="ai-badge">
          <Zap size={16} />
          <span>AI Enhanced</span>
        </div>
      </div>
      
      <div className="merge-options futuristic-card">
        <div className="option-item">
          <label className="option-label">Output filename</label>
          <input type="text" value={outputName} onChange={(e) => setOutputName(e.target.value)} placeholder="merged-document.pdf" />
          <p className="option-description">Set the final filename before download</p>
        </div>

        <div className="option-item">
          <label className="option-label">
            <input
              type="checkbox"
              checked={mergeOptions.removeDuplicatePages}
              onChange={() => toggleOption('removeDuplicatePages')}
            />
            <span className="checkmark"></span>
            Remove Duplicate Pages
          </label>
          <p className="option-description">Automatically detect and remove duplicate pages</p>
        </div>
        
        <div className="option-item">
          <label className="option-label">
            <input
              type="checkbox"
              checked={mergeOptions.optimizeFileSize}
              onChange={() => toggleOption('optimizeFileSize')}
            />
            <span className="checkmark"></span>
            Optimize File Size
          </label>
          <p className="option-description">Compress images and optimize content for smaller files</p>
        </div>
        
        <div className="option-item">
          <label className="option-label">
            <input
              type="checkbox"
              checked={mergeOptions.addBookmarks}
              onChange={() => toggleOption('addBookmarks')}
            />
            <span className="checkmark"></span>
            Add File Bookmarks
          </label>
          <p className="option-description">Add bookmarks to navigate between original PDFs</p>
        </div>
        
        <div className="option-item">
          <label className="option-label">
            <input
              type="checkbox"
              checked={mergeOptions.addPageIndex}
              onChange={() => toggleOption('addPageIndex')}
            />
            <span className="checkmark"></span>
            Add Page Index
          </label>
          <p className="option-description">Insert a page showing which pages came from which files</p>
          <div className="feature-highlight">
            <Bookmark size={12} />
            <span>New</span>
          </div>
        </div>
      </div>
      <div className="merge-options futuristic-card" style={{ marginTop: 12 }}>
        <div className="option-item">
          <label className="option-label">Split mode</label>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <label><input type="radio" name="splitmode" checked={splitMode==='pages'} onChange={() => setSplitMode('pages')} /> Each page</label>
            <label><input type="radio" name="splitmode" checked={splitMode==='ranges'} onChange={() => setSplitMode('ranges')} /> Ranges</label>
            <label><input type="radio" name="splitmode" checked={splitMode==='every'} onChange={() => setSplitMode('every')} /> Every N pages</label>
            {splitMode==='ranges' && (
              <input type="text" value={splitRanges} onChange={(e)=>setSplitRanges(e.target.value)} placeholder="e.g. 1-3,5,8-10" />
            )}
            {splitMode==='every' && (
              <input type="number" min={1} value={splitEvery} onChange={(e)=>setSplitEvery(e.target.value)} style={{ width: 80 }} />
            )}
          </div>
          <p className="option-description">Choose how to split the PDF into parts</p>
        </div>
      </div>
      
      <div className="action-buttons">
        <button
          className="merge-btn futuristic-btn"
          onClick={handleMerge}
          disabled={isLoading || files.length === 0}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <FileText size={20} />
              Merge PDFs
            </>
          )}
        </button>
        
        <button
          className="split-btn futuristic-btn"
          onClick={handleSplit}
          disabled={isLoading || files.length === 0}
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <Scissors size={20} />
              Split to Pages
            </>
          )}
        </button>
      </div>
      
      {isLoading && (
        <div className="processing-info">
          <div className="processing-animation">
            <div className="pulse-ring"></div>
            <Zap size={24} className="processing-icon" />
          </div>
          <p>AI processing your documents...</p>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
            <progress max={progress.total || 1} value={progress.current} style={{ width:'100%' }}></progress>
            <span className="muted" style={{ minWidth: 140 }}>{progress.label}</span>
          </div>
        </div>
      )}
    </div>
  )
}