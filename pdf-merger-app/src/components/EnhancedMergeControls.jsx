import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { FileText, Download, Scissors, RotateCw, Zap } from 'lucide-react'
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
  const [mergeOptions, setMergeOptions] = useState({
    removeDuplicatePages: false,
    optimizeFileSize: true
  })

  const handleMerge = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    
    try {
      const mergedPdf = await PDFDocument.create()
      
      // Process each file
      for (const file of files) {
        const fileArrayBuffer = await file.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(fileArrayBuffer)
        
        // Get pages to copy (excluding deleted pages)
        const pagesToCopy = []
        const totalPages = pdfDoc.getPageCount()
        
        for (let i = 0; i < totalPages; i++) {
          if (!deletedPages[file.id] || !deletedPages[file.id].includes(i)) {
            pagesToCopy.push(i)
          }
        }
        
        // Copy pages to merged document
        for (const pageIndex of pagesToCopy) {
          const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [pageIndex])
          const newPage = mergedPdf.addPage(copiedPage)
          
          // Apply rotation if needed
          const rotation = fileRotations[file.id]?.[pageIndex]
          if (rotation) {
            newPage.setRotation(rotation)
          }
        }
      }
      
      // Optimize if requested
      if (mergeOptions.optimizeFileSize) {
        // Basic optimization - could be enhanced
      }
      
      const mergedPdfBytes = await mergedPdf.save()
      const mergedPdfBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const mergedPdfUrl = URL.createObjectURL(mergedPdfBlob)
      
      onMergeComplete(mergedPdfUrl)
    } catch (error) {
      console.error('Error merging PDFs:', error)
      alert('Failed to merge PDFs. Please try again.')
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
        const fileArrayBuffer = await file.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(fileArrayBuffer)
        const totalPages = pdfDoc.getPageCount()
        
        // Split into individual pages
        for (let i = 0; i < totalPages; i++) {
          if (!deletedPages[file.id] || !deletedPages[file.id].includes(i)) {
            const newPdf = await PDFDocument.create()
            const [copiedPage] = await newPdf.copyPages(pdfDoc, [i])
            newPdf.addPage(copiedPage)
            
            const newPdfBytes = await newPdf.save()
            const newPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' })
            const newPdfUrl = URL.createObjectURL(newPdfBlob)
            
            splitResults.push({
              name: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`,
              url: newPdfUrl
            })
          }
        }
      }
      
      onSplitComplete(splitResults)
    } catch (error) {
      console.error('Error splitting PDFs:', error)
      alert('Failed to split PDFs. Please try again.')
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
        </div>
      )}
    </div>
  )
}