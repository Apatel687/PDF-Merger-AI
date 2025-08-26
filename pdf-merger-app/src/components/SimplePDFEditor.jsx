import React, { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { FileText, Upload, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import './PDFEditorModal.css'

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const SimplePDFEditor = () => {
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfFileUrl, setPdfFileUrl] = useState(null)
  const [pdfError, setPdfError] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  
  // Tool states
  const [activeTool, setActiveTool] = useState('select')
  const [brushColor, setBrushColor] = useState('#ff0000')
  const [brushSize, setBrushSize] = useState(3)
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 })

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // Accept all PDF files
    const isValidPDF = file.type === 'application/pdf' || 
                      file.name.toLowerCase().endsWith('.pdf')
    
    if (isValidPDF) {
      setPdfError(null)
      setPdfFile(file)
      
      // Clean up previous URL if it exists
      if (pdfFileUrl) {
        URL.revokeObjectURL(pdfFileUrl)
      }
      
      try {
        // Create URL for the PDF file
        const fileUrl = URL.createObjectURL(file)
        setPdfFileUrl(fileUrl)
        
        // Reset page to first page
        setCurrentPage(1)
        setNumPages(null)
        
        console.log('PDF file loaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      } catch (error) {
        console.error('Error creating PDF URL:', error)
        setPdfError('Failed to process PDF file. Please try another file.')
      }
    } else {
      setPdfError('Please select a valid PDF file (.pdf)')
    }
    
    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully. Pages:', numPages)
    setNumPages(numPages)
    setPdfError(null)
  }

  const onDocumentLoadError = (error) => {
    console.error('PDF loading error:', error)
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to load PDF. '
    if (error?.message) {
      if (error.message.includes('Invalid PDF structure')) {
        errorMessage += 'The PDF file appears to be corrupted or invalid. Please try a different file.'
      } else if (error.message.includes('password')) {
        errorMessage += 'This PDF is password protected. Please use an unprotected PDF file.'
      } else {
        errorMessage += 'Please try another file.'
      }
    } else {
      errorMessage += 'Please try another file.'
    }
    
    setPdfError(errorMessage)
  }

  // Drawing functions
  const getCanvasPoint = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    return { x, y }
  }

  const startDrawing = (e) => {
    if (activeTool !== 'pen') return
    
    const point = getCanvasPoint(e)
    setLastPoint(point)
    setIsDrawing(true)
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    ctx.beginPath()
    ctx.moveTo(point.x, point.y)
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  const draw = (e) => {
    if (!isDrawing || activeTool !== 'pen') return
    
    const point = getCanvasPoint(e)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    
    setLastPoint(point)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
    }
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  return (
    <div className="pdf-editor-modal">
      <div className="pdf-editor-content">
        {/* Header */}
        <div className="pdf-editor-header">
          <h2>PDF Editor</h2>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf"
            style={{ display: 'none' }}
          />
          <button 
            className="upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            <span>Upload PDF</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="pdf-editor-toolbar">
          <div className="tool-group">
            <button 
              className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`}
              onClick={() => setActiveTool('select')}
            >
              Select
            </button>
            <button 
              className={`tool-btn ${activeTool === 'pen' ? 'active' : ''}`}
              onClick={() => setActiveTool('pen')}
            >
              Pen
            </button>
          </div>
          
          <div className="tool-group">
            <button className="tool-btn" onClick={handleZoomOut}>
              <ZoomOut size={18} />
            </button>
            <span className="zoom-level">{Math.round(zoom * 100)}%</span>
            <button className="tool-btn" onClick={handleZoomIn}>
              <ZoomIn size={18} />
            </button>
            <button className="tool-btn" onClick={handleRotate}>
              <RotateCw size={18} />
            </button>
          </div>
          
          {activeTool === 'pen' && (
            <div className="tool-group">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="color-picker"
              />
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="size-slider"
              />
              <span>{brushSize}px</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="pdf-editor-main">
          {pdfError && (
            <div className="pdf-error">
              <p>{pdfError}</p>
              <button 
                className="retry-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Try Another File
              </button>
            </div>
          )}
          
          {pdfFileUrl ? (
            <div className="pdf-viewer">
              <div className="pdf-document-wrapper">
                <Document
                  file={pdfFileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="pdf-loading">
                      <div className="loading-spinner"></div>
                      <p>Loading PDF...</p>
                    </div>
                  }
                  error={
                    <div className="pdf-error">
                      <p>Failed to load PDF document</p>
                      <button 
                        className="retry-btn" 
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Try Another File
                      </button>
                    </div>
                  }
                >
                  <div 
                    className="pdf-page-container"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={zoom}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      onLoadSuccess={({ width, height }) => {
                        // Set canvas size to match PDF page
                        const canvas = canvasRef.current
                        if (canvas) {
                          canvas.width = width * zoom
                          canvas.height = height * zoom
                        }
                      }}
                    />
                    
                    {/* Drawing Canvas Overlay */}
                    <canvas
                      ref={canvasRef}
                      className="editor-canvas overlay-canvas"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 10,
                        cursor: activeTool === 'pen' ? 'crosshair' : 'default',
                        pointerEvents: 'auto'
                      }}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                    />
                  </div>
                </Document>
              </div>
              
              {/* Page Navigation */}
              {numPages && numPages > 1 && (
                <div className="page-navigation">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1}
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {numPages}</span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, numPages))}
                    disabled={currentPage >= numPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Default upload prompt
            <div className="upload-prompt">
              <FileText size={48} />
              <h3>Upload a PDF to start editing</h3>
              <p>Click "Upload PDF" to load a document</p>
              <button 
                className="upload-btn large"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} />
                <span>Upload PDF</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SimplePDFEditor