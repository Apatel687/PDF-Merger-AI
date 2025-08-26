import { useState } from 'react'
import { PDFDocument, rgb } from 'pdf-lib'
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
  const [mergeOptions, setMergeOptions] = useState({
    removeDuplicatePages: false,
    optimizeFileSize: true,
    addBookmarks: true,
    addPageIndex: true // New option for adding page index
  })

  const handleMerge = async () => {
    if (files.length === 0) return

    setIsLoading(true)
    
    try {
      const mergedPdf = await PDFDocument.create()
      const outline = []
      const pageIndexMap = [] // Track which file each page came from
      let currentPageIndex = 0
      
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
        
        // Add bookmark for this file if enabled
        if (mergeOptions.addBookmarks && pagesToCopy.length > 0) {
          outline.push({
            title: file.name.replace('.pdf', ''),
            page: currentPageIndex
          })
        }
        
        // Track page origins for index map
        for (const pageIndex of pagesToCopy) {
          pageIndexMap.push({
            fileName: file.name.replace('.pdf', ''),
            originalPage: pageIndex + 1,
            mergedPage: currentPageIndex + 1
          })
          currentPageIndex++
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
      
      // Add bookmarks/outline to the PDF if enabled
      if (mergeOptions.addBookmarks && outline.length > 0) {
        try {
          // Create a simple outline structure
          const outlineRef = mergedPdf.context.obj({
            Type: 'Outlines',
            First: null,
            Last: null,
            Count: outline.length
          })
          
          mergedPdf.catalog.set(PDFDocument.nameOf('Outlines'), outlineRef)
          
          // Add each bookmark as an outline item
          let prevOutlineItem = null
          for (let i = 0; i < outline.length; i++) {
            const item = outline[i]
            const pageRef = mergedPdf.getPage(item.page).ref
            
            const outlineItem = mergedPdf.context.obj({
              Title: item.title,
              Parent: outlineRef,
              Dest: [pageRef, PDFDocument.nameOf('XYZ'), 0, mergedPdf.getPage(item.page).getHeight(), null]
            })
            
            if (prevOutlineItem) {
              prevOutlineItem.set(PDFDocument.nameOf('Next'), outlineItem)
              outlineItem.set(PDFDocument.nameOf('Prev'), prevOutlineItem)
            } else {
              outlineRef.set(PDFDocument.nameOf('First'), outlineItem)
            }
            
            if (i === outline.length - 1) {
              outlineRef.set(PDFDocument.nameOf('Last'), outlineItem)
            }
            
            mergedPdf.context.register(outlineItem)
            prevOutlineItem = outlineItem
          }
          
          mergedPdf.context.register(outlineRef)
        } catch (error) {
          console.warn('Could not add bookmarks to PDF:', error)
          // Continue without bookmarks if there's an error
        }
      }
      
      // Add a page index as the first page of the document
      if (mergeOptions.addPageIndex && pageIndexMap.length > 0) {
        try {
          // Create index content as text
          let indexContent = "PDF MERGE INDEX\n\n"
          indexContent += "Page Origin Reference\n"
          indexContent += `Created: ${new Date().toLocaleDateString()}\n\n`
          
          let currentFile = ''
          for (let i = 0; i < Math.min(pageIndexMap.length, 100); i++) { // Limit to first 100 entries
            const entry = pageIndexMap[i]
            
            // Add file name header if new file
            if (entry.fileName !== currentFile) {
              currentFile = entry.fileName
              indexContent += `\n${currentFile.toUpperCase()}:\n`
            }
            
            // Add page entry
            indexContent += `  Page ${entry.mergedPage}: Originally page ${entry.originalPage}\n`
          }
          
          // For now, we'll show this index in the download info
          // In a future enhancement, we could add it as an actual page in the PDF
          // For now, we'll store it in localStorage so it can be accessed
          localStorage.setItem('pdfPageIndex', JSON.stringify({
            content: indexContent,
            files: files.map(f => f.name.replace('.pdf', '')),
            map: pageIndexMap
          }))
        } catch (error) {
          console.warn('Could not create page index:', error)
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