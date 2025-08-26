import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { Merge, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import './MergeControls.css'

export function MergeControls({ files, isLoading, setIsLoading, onMergeComplete }) {
  const [mergeStatus, setMergeStatus] = useState(null) // 'success', 'error', null

  const mergePDFs = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files to merge.')
      return
    }

    setIsLoading(true)
    setMergeStatus(null)

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create()

      // Process each file
      for (const fileData of files) {
        try {
          // Read the file as array buffer
          const fileBuffer = await fileData.file.arrayBuffer()
          
          // Load the PDF
          const pdf = await PDFDocument.load(fileBuffer)
          
          // Get all pages from the PDF
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
          
          // Add pages to the merged document
          pages.forEach((page) => mergedPdf.addPage(page))
        } catch (error) {
          console.error(`Error processing file ${fileData.name}:`, error)
          throw new Error(`Failed to process ${fileData.name}. Please ensure it's a valid PDF file.`)
        }
      }

      // Serialize the merged PDF
      const mergedPdfBytes = await mergedPdf.save()

      // Create a blob and URL for download
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      
      onMergeComplete(url)
      setMergeStatus('success')
      
    } catch (error) {
      console.error('Error merging PDFs:', error)
      setMergeStatus('error')
      alert(error.message || 'Failed to merge PDFs. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonContent = () => {
    if (isLoading) {
      return (
        <>
          <Loader2 size={20} className="animate-spin" />
          Merging PDFs...
        </>
      )
    }
    
    if (mergeStatus === 'success') {
      return (
        <>
          <CheckCircle size={20} />
          Merged Successfully!
        </>
      )
    }
    
    if (mergeStatus === 'error') {
      return (
        <>
          <AlertCircle size={20} />
          Try Again
        </>
      )
    }
    
    return (
      <>
        <Merge size={20} />
        Merge PDFs
      </>
    )
  }

  const getButtonClass = () => {
    let baseClass = 'merge-btn'
    
    if (files.length < 2) baseClass += ' disabled'
    if (isLoading) baseClass += ' loading'
    if (mergeStatus === 'success') baseClass += ' success'
    if (mergeStatus === 'error') baseClass += ' error'
    
    return baseClass
  }

  return (
    <div className="merge-controls">
      <div className="merge-info">
        <h3>Ready to Merge</h3>
        <p>
          {files.length === 0 && 'No files selected'}
          {files.length === 1 && 'Add at least one more PDF to merge'}
          {files.length >= 2 && `${files.length} files ready to be merged`}
        </p>
      </div>

      <button 
        onClick={mergePDFs}
        disabled={files.length < 2 || isLoading}
        className={getButtonClass()}
      >
        {getButtonContent()}
      </button>

      {mergeStatus === 'success' && (
        <div className="success-message">
          <CheckCircle size={16} />
          <span>PDFs merged successfully! You can now download the merged file.</span>
        </div>
      )}

      {mergeStatus === 'error' && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>Failed to merge PDFs. Please check your files and try again.</span>
        </div>
      )}
    </div>
  )
}