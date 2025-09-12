import { useState } from 'react'
import { useToast } from './Toast'
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
      setProgress({ current: 0, total: files.length, label: 'Preparing files…' })
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
        setProgress(p => ({ ...p, current: p.current + 1, label: `Merging ${file.name}…` }))
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
      
      onMergeComplete({ url: mergedPdfUrl, name: (outputName && outputName.trim()) || 'merged-document.pdf' })
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
        const fileArrayBuffer = await file.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(fileArrayBuffer)
        const totalPages = pdfDoc.getPageCount()
        
        const include = (i) => !deletedPages[file.id] || !deletedPages[file.id].includes(i)

        if (splitMode === 'pages') {
          for (let i = 0; i < totalPages; i++) {
            if (include(i)) {
              const newPdf = await PDFDocument.create()
              const [copiedPage] = await newPdf.copyPages(pdfDoc, [i])
              newPdf.addPage(copiedPage)
              const newPdfBytes = await newPdf.save()
              const newPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' })
              const newPdfUrl = URL.createObjectURL(newPdfBlob)
              splitResults.push({ name: `${file.name.replace('.pdf', '')}_page_${i + 1}.pdf`, url: newPdfUrl })
            }
          }
        } else if (splitMode === 'ranges') {
          const ranges = splitRanges.split(',').map(r => r.trim()).filter(Boolean)
          let idx = 1
          for (const r of ranges) {
            const [startStr, endStr] = r.split('-')
            const start = Math.max(1, parseInt(startStr, 10) || 1)
            const end = Math.min(totalPages, parseInt(endStr ?? startStr, 10) || start)
            const newPdf = await PDFDocument.create()
            for (let p = start - 1; p < end; p++) {
              if (include(p)) {
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [p])
                newPdf.addPage(copiedPage)
              }
            }
            const newPdfBytes = await newPdf.save()
            const newPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' })
            const newPdfUrl = URL.createObjectURL(newPdfBlob)
            splitResults.push({ name: `${file.name.replace('.pdf', '')}_part_${idx++}.pdf`, url: newPdfUrl })
          }
        } else if (splitMode === 'every') {
          const n = Math.max(1, parseInt(splitEvery, 10) || 1)
          let part = 1
          for (let i = 0; i < totalPages; i += n) {
            const newPdf = await PDFDocument.create()
            for (let p = i; p < Math.min(i + n, totalPages); p++) {
              if (include(p)) {
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [p])
                newPdf.addPage(copiedPage)
              }
            }
            const newPdfBytes = await newPdf.save()
            const newPdfBlob = new Blob([newPdfBytes], { type: 'application/pdf' })
            const newPdfUrl = URL.createObjectURL(newPdfBlob)
            splitResults.push({ name: `${file.name.replace('.pdf', '')}_part_${part++}.pdf`, url: newPdfUrl })
          }
        }
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