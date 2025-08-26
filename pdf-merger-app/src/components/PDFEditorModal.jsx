import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  X, 
  FileText, 
  Upload, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Download,
  Eye,
  Square,
  Trash2,
  Copy,
  Plus,
  Minus,
  Settings,
  Layers,
  Move,
  ChevronLeft,
  ChevronRight,
  Circle,
  MousePointer,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Grid3x3,
  List,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Expand,
  Shrink,
  AlignCenter,
  BookOpen,
  ScrollText
} from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import './PDFEditorModal.css'

// Configure PDF.js worker - simplified configuration
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

export const PDFEditorModal = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  
  // Tool states
  const [activeTool, setActiveTool] = useState('select')
  const [brushColor, setBrushColor] = useState('#ff0000')
  const [brushSize, setBrushSize] = useState(3)
  const [highlighterColor, setHighlighterColor] = useState('#ffff00')
  const [highlighterSize, setHighlighterSize] = useState(20)
  const [highlighterOpacity, setHighlighterOpacity] = useState(0.4)
  const [textColor, setTextColor] = useState('#000000')
  const [fontSize, setFontSize] = useState(16)
  const [textFont, setTextFont] = useState('Arial')
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 })
  
  // Canvas states
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  
  // Effects
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  const [rotation, setRotation] = useState(0)
  
  // History and file states
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [pdfFile, setPdfFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // PDF-specific states
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfError, setPdfError] = useState(null)
  const [pdfFileUrl, setPdfFileUrl] = useState(null)
  const [pdfDimensions, setPdfDimensions] = useState({ width: 800, height: 600 })
  const [loadingTimeout, setLoadingTimeout] = useState(null)
  
  // UI states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePanel, setActivePanel] = useState('tools')
  const [showColorPicker, setShowColorPicker] = useState(false)
  
  // PDF Canvas editing states
  const [canvasSize, setCanvasSize] = useState({ width: 'auto', height: 'auto' })
  const [fitMode, setFitMode] = useState('width') // 'width', 'height', 'page', 'custom'
  const [selectedPages, setSelectedPages] = useState([])
  const [pageEditMode, setPageEditMode] = useState('single') // 'single', 'range', 'all'
  const [scrollPosition, setScrollPosition] = useState(0)
  const [canvasScale, setCanvasScale] = useState(1)
  const [viewMode, setViewMode] = useState('single') // 'single', 'continuous', 'facing'
  
  // Simplified worker source
  const workerSources = [
    '/pdf.worker.min.js' // Local worker (fastest)
  ]

  useEffect(() => {
    if (isOpen && canvasRef.current && !pdfFileUrl) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      // Clear canvas with white background for default canvas
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Save initial state
      saveState()
    }
  }, [isOpen, pdfFileUrl])

  const saveState = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    try {
      const imageData = canvas.toDataURL()
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(imageData)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    } catch (error) {
      console.warn('Failed to save canvas state:', error)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      restoreState(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      restoreState(history[historyIndex + 1])
    }
  }

  const restoreState = (imageData) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = imageData
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return
    
    // Accept all PDF files without size restrictions
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
        
        // Don't set isLoading to true to avoid showing loading screen
        // The PDF will render directly without showing a loading indicator
        setIsLoading(false)
        
        console.log('PDF file loaded:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2), 'MB')
      } catch (error) {
        console.error('Error creating PDF URL:', error)
        setPdfError('Failed to process PDF file. Please try another file.')
        setIsLoading(false)
      }
    } else {
      setPdfError('Please select a valid PDF file (.pdf)')
      setIsLoading(false)
    }
    
    // Clear the input value to allow re-uploading the same file
    event.target.value = ''
  }

  // Enhanced drawing functions
  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    
    // Get the actual canvas size vs displayed size
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    // Calculate point relative to canvas with proper scaling
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY
    
    return { x, y }
  }, [])

  const startDrawing = useCallback((e) => {
    // Don't allow drawing when select tool is active
    if (activeTool === 'select') return
    
    const point = getCanvasPoint(e)
    setLastPoint(point)
    
    if (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser') {
      setIsDrawing(true)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      
      // Set tool properties
      if (activeTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineWidth = brushSize * 2
        ctx.globalAlpha = 1
      } else if (activeTool === 'highlighter') {
        ctx.globalCompositeOperation = 'multiply'
        ctx.strokeStyle = highlighterColor
        ctx.lineWidth = highlighterSize
        ctx.globalAlpha = highlighterOpacity
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      } else { // pen
        ctx.globalCompositeOperation = 'source-over'
        ctx.strokeStyle = brushColor
        ctx.lineWidth = brushSize
        ctx.globalAlpha = 1
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
      }
    } else if (activeTool === 'pan') {
      setIsPanning(true)
    }
  }, [activeTool, brushColor, brushSize, highlighterColor, highlighterSize, highlighterOpacity, getCanvasPoint])

  const draw = useCallback((e) => {
    const point = getCanvasPoint(e)
    
    if (isDrawing && (activeTool === 'pen' || activeTool === 'highlighter' || activeTool === 'eraser')) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
      
      setLastPoint(point)
    } else if (isPanning && activeTool === 'pan') {
      const deltaX = point.x - lastPoint.x
      const deltaY = point.y - lastPoint.y
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))
    }
  }, [isDrawing, isPanning, activeTool, lastPoint, getCanvasPoint])

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false)
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      saveState()
    }
    if (isPanning) {
      setIsPanning(false)
    }
  }, [isDrawing, isPanning])

  const handleAddText = useCallback((e) => {
    if (activeTool !== 'text') return
    
    const point = getCanvasPoint(e)
    const text = prompt('Enter text:')
    
    if (text && text.trim()) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      ctx.fillStyle = textColor
      ctx.font = `${fontSize}px ${textFont}`
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      
      // Handle multi-line text
      const lines = text.split('\n')
      lines.forEach((line, index) => {
        ctx.fillText(line, point.x, point.y + (index * fontSize * 1.2))
      })
      
      saveState()
    }
  }, [activeTool, textColor, fontSize, textFont, getCanvasPoint])

  const handleAddShape = useCallback((e) => {
    if (activeTool !== 'rectangle' && activeTool !== 'circle' && activeTool !== 'line') return
    
    const point = getCanvasPoint(e)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushSize
    ctx.globalAlpha = 1
    
    if (activeTool === 'rectangle') {
      const width = 100
      const height = 60
      ctx.strokeRect(point.x, point.y, width, height)
    } else if (activeTool === 'circle') {
      const radius = 40
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI)
      ctx.stroke()
    } else if (activeTool === 'line') {
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(point.x + 100, point.y + 50)
      ctx.stroke()
    }
    
    saveState()
  }, [activeTool, brushColor, brushSize, getCanvasPoint])

  const handleAddHighlighterShape = useCallback((e) => {
    if (activeTool !== 'highlighter-rectangle' && activeTool !== 'highlighter-circle' && activeTool !== 'highlighter-line') return
    
    const point = getCanvasPoint(e)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Use highlighter properties
    ctx.globalCompositeOperation = 'multiply'
    ctx.strokeStyle = highlighterColor
    ctx.fillStyle = highlighterColor
    ctx.lineWidth = highlighterSize / 4 // Thinner line for shapes
    ctx.globalAlpha = highlighterOpacity
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    if (activeTool === 'highlighter-rectangle') {
      const width = 120
      const height = 80
      // Draw filled rectangle with highlighter effect
      ctx.fillRect(point.x, point.y, width, height)
      ctx.strokeRect(point.x, point.y, width, height)
    } else if (activeTool === 'highlighter-circle') {
      const radius = 50
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()
    } else if (activeTool === 'highlighter-line') {
      ctx.lineWidth = highlighterSize / 2 // Thicker line for highlighter line
      ctx.beginPath()
      ctx.moveTo(point.x, point.y)
      ctx.lineTo(point.x + 120, point.y + 20)
      ctx.stroke()
    }
    
    // Reset canvas properties
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
    
    saveState()
  }, [activeTool, highlighterColor, highlighterSize, highlighterOpacity, getCanvasPoint])

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
    saveState()
  }

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      saveState()
    }
  }

  const handleResetZoom = () => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.25, 5) // Increased max zoom and step
      return newZoom
    })
  }

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.25, 0.25) // Increased step size
      return newZoom
    })
  }

  const handleZoomToFit = () => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }

  // PDF Canvas editing functions
  const handleFitToWidth = () => {
    setFitMode('width')
    const container = document.querySelector('.editor-canvas-container')
    if (container && pdfDimensions.width) {
      const containerWidth = container.clientWidth - 40 // padding
      const newZoom = containerWidth / pdfDimensions.width
      setZoom(Math.min(newZoom, 3)) // max 300%
      setPanOffset({ x: 0, y: 0 })
    }
  }

  const handleFitToHeight = () => {
    setFitMode('height')
    const container = document.querySelector('.editor-canvas-container')
    if (container && pdfDimensions.height) {
      const containerHeight = container.clientHeight - 100 // padding and controls
      const newZoom = containerHeight / pdfDimensions.height
      setZoom(Math.min(newZoom, 3)) // max 300%
      setPanOffset({ x: 0, y: 0 })
    }
  }

  const handleFitToPage = () => {
    setFitMode('page')
    const container = document.querySelector('.editor-canvas-container')
    if (container && pdfDimensions.width && pdfDimensions.height) {
      const containerWidth = container.clientWidth - 40
      const containerHeight = container.clientHeight - 100
      const zoomX = containerWidth / pdfDimensions.width
      const zoomY = containerHeight / pdfDimensions.height
      const newZoom = Math.min(zoomX, zoomY, 3) // fit entire page
      setZoom(newZoom)
      setPanOffset({ x: 0, y: 0 })
    }
  }

  const handleCanvasResize = (width, height) => {
    setCanvasSize({ width, height })
    setFitMode('custom')
  }

  const handlePageSelection = (pageNum) => {
    if (pageEditMode === 'single') {
      setSelectedPages([pageNum])
      setCurrentPage(pageNum)
    } else if (pageEditMode === 'range') {
      if (selectedPages.length === 0) {
        setSelectedPages([pageNum])
      } else if (selectedPages.length === 1) {
        const start = Math.min(selectedPages[0], pageNum)
        const end = Math.max(selectedPages[0], pageNum)
        const range = []
        for (let i = start; i <= end; i++) {
          range.push(i)
        }
        setSelectedPages(range)
      } else {
        setSelectedPages([pageNum])
      }
    }
  }

  const handleSelectAllPages = () => {
    if (numPages) {
      const allPages = []
      for (let i = 1; i <= numPages; i++) {
        allPages.push(i)
      }
      setSelectedPages(allPages)
      setPageEditMode('all')
    }
  }

  const handleScrollToPage = (pageNum) => {
    setCurrentPage(pageNum)
    // Smooth scroll to page if in continuous view
    if (viewMode === 'continuous') {
      const pageElement = document.querySelector(`[data-page-number="${pageNum}"]`)
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  const handleCanvasScaleChange = (scale) => {
    setCanvasScale(scale)
    setZoom(scale)
  }

  const resetCanvasSettings = () => {
    setCanvasSize({ width: 'auto', height: 'auto' })
    setFitMode('width')
    setSelectedPages([currentPage])
    setPageEditMode('single')
    setCanvasScale(1)
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const updateCanvasSize = (newZoom) => {
    const canvas = canvasRef.current
    if (canvas && pdfDimensions.width && pdfDimensions.height) {
      // Keep canvas internal dimensions same as PDF
      canvas.width = pdfDimensions.width
      canvas.height = pdfDimensions.height
      
      // Update canvas context
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Apply effects
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const updateCanvasEffects = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    }
  }

  // Update canvas when effects change
  useEffect(() => {
    updateCanvasEffects()
  }, [brightness, contrast, saturation])

  // Update canvas when zoom changes
  useEffect(() => {
    if (pdfDimensions.width && pdfDimensions.height) {
      updateCanvasSize(zoom)
    }
  }, [zoom, pdfDimensions])

  // Initialize selected pages when PDF loads
  useEffect(() => {
    if (numPages && selectedPages.length === 0) {
      setSelectedPages([currentPage])
    }
  }, [numPages, currentPage])

  // Update canvas scale when zoom changes
  useEffect(() => {
    if (canvasScale !== zoom) {
      setCanvasScale(zoom)
    }
  }, [zoom])

  const handleColorChange = (color) => {
    if (activeTool === 'highlighter') {
      setHighlighterColor(color)
    } else {
      setBrushColor(color)
      setTextColor(color)
    }
  }

  const handleHighlighterColorChange = (color) => {
    setHighlighterColor(color)
  }

  const presetColors = [
    '#000000', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ffffff',
    '#808080', '#800000', '#008000', '#000080',
    '#808000', '#800080', '#008080', '#c0c0c0'
  ]

  const highlighterColors = [
    '#ffff99', // Very Light Yellow
    '#ccffcc', // Very Light Green
    '#ffddaa', // Very Light Orange
    '#ffccdd', // Very Light Pink
    '#ccffff', // Very Light Cyan
    '#ffdddd', // Very Light Red
    '#ddffdd', // Very Light Mint
    '#fff5aa', // Very Light Golden
    '#e6e6fa', // Very Light Lavender
    '#ffe6e6', // Very Light Rose
    '#e6f3ff', // Very Light Blue
    '#ffffcc', // Very Light Cream
    '#f0fff0', // Very Light Honeydew
    '#fff0f5', // Very Light Lavender Blush
    '#f5fffa', // Very Light Mint Cream
    '#fffacd'  // Very Light Lemon Chiffon
  ]

  const handleSave = () => {
    const canvas = canvasRef.current
    const dataUrl = canvas.toDataURL('image/png')
    
    // Convert to blob and call onSave
    canvas.toBlob((blob) => {
      if (onSave) {
        onSave(blob, 'edited-pdf.png')
      }
    }, 'image/png')
    
    onClose()
  }

  // PDF document handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully. Pages:', numPages)
    setNumPages(numPages)
    setPdfError(null)
    
    // Don't need to set isLoading to false since we're not showing loading screen
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
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage += 'Network error occurred. Please check your internet connection and try again.'
      } else {
        errorMessage += 'Please try another file or refresh the page.'
      }
    } else {
      errorMessage += 'Please try another file or refresh the page.'
    }
    
    setPdfError(errorMessage)
  }

  const onPageLoadSuccess = (page) => {
    console.log('Page loaded successfully:', page.pageNumber)
    const { width, height } = page
    setPdfDimensions({ width, height })
    
    // Update canvas size to match PDF page dimensions with zoom
    const canvas = canvasRef.current
    if (canvas) {
      // Set canvas internal size to PDF dimensions scaled by zoom
      canvas.width = width * zoom
      canvas.height = height * zoom
      
      // Get context and configure
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Scale the context to match the zoom level
      ctx.scale(zoom, zoom)
      
      // Clear canvas with transparent background
      ctx.clearRect(0, 0, width, height)
      
      // Apply effects to the canvas
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
      
      // Save the initial state
      saveState()
    }
  }

  const onPageLoadError = (error) => {
    console.error('Page loading error:', error)
    setPdfError('Failed to load PDF page. Please try refreshing or use another file.')
  }

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, numPages || 1))
  }

  const retryPDFLoad = () => {
    if (pdfFile) {
      setIsLoading(true)
      setPdfError(null)
      
      // Clear any existing timeout
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
      
      // Recreate the file URL
      if (pdfFileUrl) {
        URL.revokeObjectURL(pdfFileUrl)
      }
      
      const newFileUrl = URL.createObjectURL(pdfFile)
      setPdfFileUrl(newFileUrl)
      setCurrentPage(1)
      
      // No timeout restrictions - let PDF load naturally
    }
  }

  // Cleanup function for PDF URL
  useEffect(() => {
    return () => {
      if (pdfFileUrl) {
        URL.revokeObjectURL(pdfFileUrl)
      }
      if (loadingTimeout) {
        clearTimeout(loadingTimeout)
      }
    }
  }, [pdfFileUrl, loadingTimeout])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault()
            if (e.shiftKey) {
              handleRedo()
            } else {
              handleUndo()
            }
            break
          case 's':
            e.preventDefault()
            handleSave()
            break
          case '+':
          case '=':
            e.preventDefault()
            handleZoomIn()
            break
          case '-':
            e.preventDefault()
            handleZoomOut()
            break
        }
      }
      
      // PDF Navigation shortcuts
      if (numPages && numPages > 1) {
        switch (e.key) {
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault()
            goToPreviousPage()
            break
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault()
            goToNextPage()
            break
          case 'Home':
            e.preventDefault()
            setCurrentPage(1)
            handleScrollToPage(1)
            break
          case 'End':
            e.preventDefault()
            setCurrentPage(numPages)
            handleScrollToPage(numPages)
            break
          case 'PageUp':
            e.preventDefault()
            setCurrentPage(prev => Math.max(prev - 1, 1))
            break
          case 'PageDown':
            e.preventDefault()
            setCurrentPage(prev => Math.min(prev + 1, numPages))
            break
        }
      }
      
      // PDF Canvas shortcuts
      if (pdfFileUrl) {
        switch (e.key) {
          case 'f':
            e.preventDefault()
            handleFitToPage()
            break
          case 'w':
            e.preventDefault()
            handleFitToWidth()
            break
          case 'g':
            e.preventDefault()
            handleFitToHeight()
            break
          case 'r':
            if (e.shiftKey) {
              e.preventDefault()
              resetCanvasSettings()
            }
            break
          case '1':
            e.preventDefault()
            setPageEditMode('single')
            setSelectedPages([currentPage])
            break
          case '2':
            e.preventDefault()
            setPageEditMode('range')
            break
          case '3':
            e.preventDefault()
            handleSelectAllPages()
            break
        }
      }
      
      // Tool shortcuts
      switch (e.key) {
        case 'p':
          setActiveTool('pen')
          break
        case 'e':
          setActiveTool('eraser')
          break
        case 't':
          setActiveTool('text')
          break
        case 'h':
          setActiveTool('highlighter')
          break
        case 'r':
          setActiveTool('rectangle')
          break
        case 'c':
          setActiveTool('circle')
          break
        case 'l':
          setActiveTool('line')
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleUndo, handleRedo, handleZoomIn, handleZoomOut, numPages, currentPage])

  const handleCanvasClick = (e) => {
    // Don't allow any actions when select tool is active
    if (activeTool === 'select') return
    
    switch (activeTool) {
      case 'text':
        handleAddText(e)
        break
      case 'rectangle':
      case 'circle':
      case 'line':
        handleAddShape(e)
        break
      case 'highlighter-rectangle':
      case 'highlighter-circle':
      case 'highlighter-line':
        handleAddHighlighterShape(e)
        break
    }
  }

  if (!isOpen) return null

  return (
    <div className="editor-modal-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <div className="editor-title">
            <FileText size={24} />
            <h2>PDF Editor</h2>
          </div>
          <div className="header-actions">
            <button className="header-btn" onClick={handleUndo} disabled={historyIndex <= 0}>
              <RotateCw size={18} />
            </button>
            <button className="header-btn" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
              <RotateCw size={18} />
            </button>
            <button className="header-btn save" onClick={handleSave}>
              <Download size={18} />
              <span>Save</span>
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="editor-content">
          <div className={`editor-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
              <button 
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <Plus size={18} /> : <Minus size={18} />}
              </button>
              {!sidebarCollapsed && <span>Tools & Settings</span>}
            </div>
            {/* File Upload */}
            <div className="editor-section">
              <h3>File</h3>
              <input 
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              <button 
                className="upload-btn"
                onClick={() => fileInputRef.current.click()}
              >
                <Upload size={18} />
                Upload PDF
              </button>
            </div>

            {/* Tools */}
            <div className="editor-section">
              <h3>Tools</h3>
              <div className="tools-grid">
                {[
                  { id: 'select', icon: MousePointer, label: 'Select', description: 'Navigate and view - no editing' },
                  { id: 'pen', icon: FileText, label: 'Pen', description: 'Draw freely' },
                  { id: 'highlighter', icon: Copy, label: 'Highlighter', description: 'Highlight text like a medical marker' },
                  { id: 'eraser', icon: Trash2, label: 'Eraser', description: 'Erase content' },
                  { id: 'text', icon: FileText, label: 'Text', description: 'Add text' },
                  { id: 'rectangle', icon: Square, label: 'Rectangle', description: 'Draw rectangle' },
                  { id: 'circle', icon: Circle, label: 'Circle', description: 'Draw circle' },
                  { id: 'line', icon: Minus, label: 'Line', description: 'Draw line' },
                  { id: 'pan', icon: Move, label: 'Pan', description: 'Move canvas' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    className={`tool-btn ${activeTool === tool.id ? 'active' : ''}`}
                    data-tool={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    title={tool.description}
                  >
                    <tool.icon size={18} />
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Tool Settings */}
              <div className="tool-settings">
                {(activeTool === 'pen' || activeTool === 'eraser') && (
                  <div className="setting-group">
                    <label>Brush Size: {brushSize}px</label>
                    <input 
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="range-input"
                    />
                  </div>
                )}
                
                {(activeTool === 'rectangle' || activeTool === 'circle' || activeTool === 'line') && (
                  <div className="setting-group">
                    <label>Line Width: {brushSize}px</label>
                    <input 
                      type="range"
                      min="1"
                      max="20"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="range-input"
                    />
                  </div>
                )}
                
                {activeTool === 'highlighter' && (
                  <>
                    <div className="setting-group">
                      <label>Highlighter Size: {highlighterSize}px</label>
                      <input 
                        type="range"
                        min="10"
                        max="80"
                        value={highlighterSize}
                        onChange={(e) => setHighlighterSize(Number(e.target.value))}
                        className="range-input"
                      />
                    </div>
                    <div className="setting-group">
                      <label>Transparency: {Math.round(highlighterOpacity * 100)}%</label>
                      <input 
                        type="range"
                        min="0.1"
                        max="0.8"
                        step="0.1"
                        value={highlighterOpacity}
                        onChange={(e) => setHighlighterOpacity(Number(e.target.value))}
                        className="range-input"
                      />
                    </div>
                    {/* Highlighter Preview */}
                    <div className="highlighter-preview">
                      <div className="preview-label">Preview:</div>
                      <div 
                        className="highlighter-sample"
                        style={{
                          backgroundColor: highlighterColor,
                          opacity: highlighterOpacity,
                          height: `${highlighterSize}px`,
                          width: '100%',
                          borderRadius: '2px',
                          border: '1px solid #e5e7eb',
                          margin: '0.5rem 0'
                        }}
                      />
                      <div className="preview-text">📝 Medical Report Text</div>
                    </div>
                  </>
                )}
                
                {activeTool === 'text' && (
                  <>
                    <div className="setting-group">
                      <label>Font Size: {fontSize}px</label>
                      <input 
                        type="range"
                        min="8"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="range-input"
                      />
                    </div>
                    <div className="setting-group">
                      <label>Font Family</label>
                      <select 
                        value={textFont}
                        onChange={(e) => setTextFont(e.target.value)}
                        className="font-select"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Highlighter Shapes */}
            <div className="editor-section">
              <h3>Highlighter Shapes</h3>
              <div className="tools-grid highlighter-shapes">
                {[
                  { id: 'highlighter-line', icon: Minus, label: 'H-Line', description: 'Highlighter line with transparency' },
                  { id: 'highlighter-circle', icon: Circle, label: 'H-Circle', description: 'Highlighter circle with transparency' },
                  { id: 'highlighter-rectangle', icon: Square, label: 'H-Rectangle', description: 'Highlighter rectangle with transparency' }
                ].map(tool => (
                  <button
                    key={tool.id}
                    className={`tool-btn highlighter-tool ${activeTool === tool.id ? 'active' : ''}`}
                    data-tool={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    title={tool.description}
                  >
                    <tool.icon size={18} />
                    <span>{tool.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Highlighter Shape Settings */}
              {(activeTool === 'highlighter-line' || activeTool === 'highlighter-circle' || activeTool === 'highlighter-rectangle') && (
                <>
                  <div className="setting-group">
                    <label>Shape Size: {highlighterSize}px</label>
                    <input 
                      type="range"
                      min="10"
                      max="100"
                      value={highlighterSize}
                      onChange={(e) => setHighlighterSize(Number(e.target.value))}
                      className="range-input"
                    />
                  </div>
                  <div className="setting-group">
                    <label>Transparency: {Math.round(highlighterOpacity * 100)}%</label>
                    <input 
                      type="range"
                      min="0.1"
                      max="0.8"
                      step="0.1"
                      value={highlighterOpacity}
                      onChange={(e) => setHighlighterOpacity(Number(e.target.value))}
                      className="range-input"
                    />
                  </div>
                  {/* Highlighter Shape Preview */}
                  <div className="highlighter-preview">
                    <div className="preview-label">{activeTool.split('-')[1].charAt(0).toUpperCase() + activeTool.split('-')[1].slice(1)} Preview:</div>
                    <div 
                      className="highlighter-sample"
                      style={{
                        backgroundColor: highlighterColor,
                        opacity: highlighterOpacity,
                        height: `${Math.min(highlighterSize, 30)}px`,
                        width: '100%',
                        borderRadius: activeTool === 'highlighter-circle' ? '50%' : '2px',
                        border: '1px solid #e5e7eb',
                        margin: '0.5rem 0'
                      }}
                    />
                    <div className="preview-text">🎯 {activeTool.split('-')[1]} with transparency</div>
                  </div>
                </>
              )}
            </div>

            {/* Colors */}
            {activeTool !== 'select' && activeTool !== 'pan' && (
              <div className="editor-section">
                <h3>Colors</h3>
              {(activeTool === 'highlighter' || activeTool.startsWith('highlighter-')) ? (
                <>
                  <div className="color-palette">
                    {highlighterColors.map(color => (
                      <button
                        key={color}
                        className={`color-btn ${highlighterColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleHighlighterColorChange(color)}
                        title={`Highlighter: ${color}`}
                      />
                    ))}
                  </div>
                  <div className="custom-color">
                    <label>Custom Highlighter:</label>
                    <input 
                      type="color"
                      value={highlighterColor}
                      onChange={(e) => handleHighlighterColorChange(e.target.value)}
                      className="color-picker"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="color-palette">
                    {presetColors.map(color => (
                      <button
                        key={color}
                        className={`color-btn ${(activeTool === 'pen' ? brushColor : textColor) === color ? 'active' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="custom-color">
                    <label>Custom Color:</label>
                    <input 
                      type="color"
                      value={activeTool === 'pen' ? brushColor : textColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="color-picker"
                    />
                  </div>
                </>
              )}
            </div>
            )}

            {/* PDF Canvas Controls */}
            {pdfFileUrl && (
              <div className="editor-section">
                <h3>PDF Canvas Controls</h3>
                
                {/* Fit Options */}
                <div className="fit-controls">
                  <h4>Fit Options</h4>
                  <div className="fit-buttons">
                    <button 
                      className={`fit-btn ${fitMode === 'width' ? 'active' : ''}`}
                      onClick={handleFitToWidth}
                      title="Fit to Width"
                    >
                      <Maximize2 size={16} />
                      Width
                    </button>
                    <button 
                      className={`fit-btn ${fitMode === 'height' ? 'active' : ''}`}
                      onClick={handleFitToHeight}
                      title="Fit to Height"
                    >
                      <Minimize2 size={16} />
                      Height
                    </button>
                    <button 
                      className={`fit-btn ${fitMode === 'page' ? 'active' : ''}`}
                      onClick={handleFitToPage}
                      title="Fit Entire Page"
                    >
                      <Monitor size={16} />
                      Page
                    </button>
                  </div>
                </div>

                {/* Canvas Size Controls */}
                <div className="canvas-size-controls">
                  <h4>Canvas Size</h4>
                  <div className="size-options">
                    <button 
                      className="size-btn"
                      onClick={() => handleCanvasResize(800, 600)}
                      title="Standard (800x600)"
                    >
                      <Monitor size={16} />
                      Standard
                    </button>
                    <button 
                      className="size-btn"
                      onClick={() => handleCanvasResize(1024, 768)}
                      title="Large (1024x768)"
                    >
                      <Maximize2 size={16} />
                      Large
                    </button>
                    <button 
                      className="size-btn"
                      onClick={() => handleCanvasResize('100%', '100%')}
                      title="Full Container"
                    >
                      <Expand size={16} />
                      Full
                    </button>
                  </div>
                  
                  {/* Custom Canvas Scale */}
                  <div className="setting-group">
                    <label>Canvas Scale: {Math.round(canvasScale * 100)}%</label>
                    <input 
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={canvasScale}
                      onChange={(e) => handleCanvasScaleChange(Number(e.target.value))}
                      className="range-input"
                    />
                  </div>
                </div>

                {/* Page Selection Controls */}
                {numPages && numPages > 1 && (
                  <div className="page-selection-controls">
                    <h4>Page Selection</h4>
                    <div className="page-edit-modes">
                      <button 
                        className={`mode-btn ${pageEditMode === 'single' ? 'active' : ''}`}
                        onClick={() => {
                          setPageEditMode('single')
                          setSelectedPages([currentPage])
                        }}
                        title="Edit Single Page"
                      >
                        <FileText size={16} />
                        Single
                      </button>
                      <button 
                        className={`mode-btn ${pageEditMode === 'range' ? 'active' : ''}`}
                        onClick={() => setPageEditMode('range')}
                        title="Select Page Range"
                      >
                        <List size={16} />
                        Range
                      </button>
                      <button 
                        className={`mode-btn ${pageEditMode === 'all' ? 'active' : ''}`}
                        onClick={handleSelectAllPages}
                        title="Edit All Pages"
                      >
                        <Grid3x3 size={16} />
                        All
                      </button>
                    </div>
                    
                    {/* Selected Pages Display */}
                    <div className="selected-pages">
                      <label>Selected Pages: </label>
                      <span className="page-numbers">
                        {selectedPages.length === 0 ? 'None' : 
                         selectedPages.length === numPages ? 'All' :
                         selectedPages.length > 5 ? `${selectedPages.length} pages` :
                         selectedPages.join(', ')}
                      </span>
                    </div>
                    
                    {/* Page Thumbnails/Quick Navigation */}
                    <div className="page-thumbnails">
                      <label>Quick Navigation:</label>
                      <div className="thumbnail-grid">
                        {Array.from({ length: Math.min(numPages, 10) }, (_, i) => i + 1).map(pageNum => (
                          <button
                            key={pageNum}
                            className={`thumbnail-btn ${
                              currentPage === pageNum ? 'current' : ''
                            } ${
                              selectedPages.includes(pageNum) ? 'selected' : ''
                            }`}
                            onClick={() => {
                              handlePageSelection(pageNum)
                              handleScrollToPage(pageNum)
                            }}
                            title={`Go to page ${pageNum}`}
                          >
                            {pageNum}
                          </button>
                        ))}
                        {numPages > 10 && (
                          <span className="more-pages">...{numPages - 10} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* View Mode Controls */}
                <div className="view-mode-controls">
                  <h4>View Mode</h4>
                  <div className="view-buttons">
                    <button 
                      className={`view-btn ${viewMode === 'single' ? 'active' : ''}`}
                      onClick={() => setViewMode('single')}
                      title="Single Page View"
                    >
                      <FileText size={16} />
                      Single
                    </button>
                    <button 
                      className={`view-btn ${viewMode === 'continuous' ? 'active' : ''}`}
                      onClick={() => setViewMode('continuous')}
                      title="Continuous Scroll"
                    >
                      <ScrollText size={16} />
                      Scroll
                    </button>
                    <button 
                      className={`view-btn ${viewMode === 'facing' ? 'active' : ''}`}
                      onClick={() => setViewMode('facing')}
                      title="Facing Pages"
                    >
                      <BookOpen size={16} />
                      Facing
                    </button>
                  </div>
                </div>

                {/* Reset Controls */}
                <div className="reset-controls">
                  <button 
                    className="transform-btn reset-all"
                    onClick={resetCanvasSettings}
                    title="Reset all canvas settings"
                  >
                    <RotateCcw size={18} />
                    <span>Reset Canvas</span>
                  </button>
                </div>
              </div>
            )}

            {/* Select Tool Instructions */}
            {activeTool === 'select' && (
              <div className="editor-section">
                <h3>Instructions</h3>
                <div className="instruction-panel">
                  <p>📌 <strong>Select Tool Active</strong></p>
                  <p>• Upload a PDF to start editing</p>
                  <p>• Choose an editing tool from above</p>
                  <p>• Use PDF Canvas Controls to resize and fit</p>
                  <p>• Navigation: Use arrow keys or page buttons</p>
                  
                  {pdfFileUrl && (
                    <div className="keyboard-shortcuts">
                      <h4>⌨️ Keyboard Shortcuts:</h4>
                      <div className="shortcut-list">
                        <span><kbd>F</kbd> Fit to Page</span>
                        <span><kbd>W</kbd> Fit to Width</span>
                        <span><kbd>G</kbd> Fit to Height</span>
                        <span><kbd>Home</kbd> First Page</span>
                        <span><kbd>End</kbd> Last Page</span>
                        <span><kbd>1</kbd> Single Page Mode</span>
                        <span><kbd>2</kbd> Range Selection</span>
                        <span><kbd>3</kbd> All Pages</span>
                        <span><kbd>Shift+R</kbd> Reset Canvas</span>
                        <span><kbd>Ctrl+Z</kbd> Undo</span>
                        <span><kbd>Ctrl+S</kbd> Save</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transform */}
            <div className="editor-section">
              <h3>Transform</h3>
              <div className="transform-controls">
                <button className="transform-btn" onClick={handleRotate}>
                  <RotateCw size={18} />
                  <span>Rotate 90°</span>
                </button>
                <button className="transform-btn" onClick={handleClearCanvas}>
                  <Trash2 size={18} />
                  <span>Clear All</span>
                </button>
                <button className="transform-btn" onClick={handleZoomToFit}>
                  <Eye size={18} />
                  <span>Reset View</span>
                </button>
              </div>
            </div>

            {/* Effects */}
            <div className="editor-section">
              <h3>Effects</h3>
              <div className="effects-controls">
                <div className="effect-control">
                  <label>Brightness</label>
                  <input 
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="range-input"
                  />
                  <span>{brightness}%</span>
                </div>
                
                <div className="effect-control">
                  <label>Contrast</label>
                  <input 
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="range-input"
                  />
                  <span>{contrast}%</span>
                </div>
                
                <div className="effect-control">
                  <label>Saturation</label>
                  <input 
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="range-input"
                  />
                  <span>{saturation}%</span>
                </div>
                
                <button 
                  className="transform-btn"
                  onClick={() => {
                    setBrightness(100)
                    setContrast(100)
                    setSaturation(100)
                  }}
                  style={{ marginTop: '0.5rem', width: '100%' }}
                >
                  <Settings size={18} />
                  <span>Reset Effects</span>
                </button>
              </div>
            </div>

            {/* Zoom */}
            <div className="editor-section">
              <h3>Zoom & View</h3>
              <div className="zoom-controls">
                <button 
                  className="zoom-btn"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.25}
                  title="Zoom Out (-)"
                >
                  <ZoomOut size={18} />
                </button>
                <div className="zoom-display">
                  <span className="zoom-level">{Math.round(zoom * 100)}%</span>
                  <button className="reset-zoom" onClick={handleZoomToFit} title="Fit to Screen">
                    Fit
                  </button>
                </div>
                <button 
                  className="zoom-btn"
                  onClick={handleZoomIn}
                  disabled={zoom >= 5}
                  title="Zoom In (+)"
                >
                  <ZoomIn size={18} />
                </button>
              </div>
              <div className="zoom-presets">
                {[0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4].map(zoomLevel => (
                  <button
                    key={zoomLevel}
                    className={`zoom-preset ${Math.abs(zoom - zoomLevel) < 0.1 ? 'active' : ''}`}
                    onClick={() => setZoom(zoomLevel)}
                    title={`${Math.round(zoomLevel * 100)}%`}
                  >
                    {zoomLevel < 1 ? `${Math.round(zoomLevel * 100)}%` : `${zoomLevel}x`}
                  </button>
                ))}
              </div>
              
              {/* Zoom Slider */}
              <div className="zoom-slider">
                <label>Zoom: {Math.round(zoom * 100)}%</label>
                <input 
                  type="range"
                  min="0.25"
                  max="5"
                  step="0.25"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="range-input"
                />
              </div>
            </div>
          </div>

          <div className="editor-canvas-container">
            <div className="canvas-wrapper">
              {/* PDF Viewer */}
              {pdfFileUrl ? (
                <div className="pdf-editor-workspace">
                  {pdfError && (
                    <div className="pdf-error">
                      <p>{pdfError}</p>
                      <button 
                        className="retry-btn"
                        onClick={retryPDFLoad}
                      >
                        Retry Loading
                      </button>
                      <button 
                        className="retry-btn"
                        onClick={() => fileInputRef.current?.click()}
                        style={{ marginLeft: '0.5rem', background: '#3b82f6' }}
                      >
                        Try Another File
                      </button>
                    </div>
                  )}
                  
                  {/* Always show the PDF canvas container */}
                  <div className="pdf-canvas-container">
                    {/* Always use react-pdf viewer */}
                    <div className="pdf-document-wrapper">
                      <Document
                        file={{
                          url: pdfFileUrl,
                          httpHeaders: {
                            'Access-Control-Allow-Origin': '*',
                            'Cache-Control': 'no-cache'
                          },
                          withCredentials: false
                        }}
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
                            <button className="retry-btn" onClick={retryPDFLoad}>
                              Retry Loading
                            </button>
                          </div>
                        }
                        options={{
                          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                          cMapPacked: true,
                          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
                          disableAutoFetch: true, // Disable for better performance with small files
                          disableStream: true, // Disable for better performance with small files
                          disableRange: true, // Disable for better performance with small files
                          enableXfa: false, // Disable for better performance
                          // Enhanced timeout and performance settings
                          verbosity: 0, // Reduce console noise
                          maxImageSize: 10485760, // 10MB max image size (reduced for small files)
                          isEvalSupported: false, // Security improvement
                          useSystemFonts: true, // Better font rendering
                          // Additional performance optimizations for small files
                          disableFontFace: true, // Disable font face for faster rendering
                          disableCreateObjectURL: false, // Keep enabled for better performance
                          pdfBug: false // Disable debugging for production
                        }}
                      >
                        <div className="pdf-page-wrapper"
                          style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                            transform: `rotate(${rotation}deg)`,
                            transformOrigin: 'center center',
                            width: canvasSize.width === 'auto' ? 'auto' : canvasSize.width,
                            height: canvasSize.height === 'auto' ? 'auto' : canvasSize.height,
                            maxWidth: fitMode === 'width' ? '100%' : 'none',
                            maxHeight: fitMode === 'height' ? '100%' : 'none',
                            overflow: fitMode === 'custom' ? 'auto' : 'visible'
                          }}
                        >
                          <div className="pdf-page-container">
                            <Page
                              pageNumber={currentPage}
                              scale={zoom}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="pdf-page"
                              onLoadSuccess={onPageLoadSuccess}
                              onLoadError={onPageLoadError}
                              loading={
                                <div className="pdf-loading">
                                  <div className="loading-spinner"></div>
                                  <p>Loading page...</p>
                                </div>
                              }
                              error={
                                <div className="pdf-error">
                                  <p>Failed to load page</p>
                                </div>
                              }
                            />
                            
                            {/* Drawing Canvas Overlay */}
                            <canvas
                              ref={canvasRef}
                              width={pdfDimensions.width * zoom}
                              height={pdfDimensions.height * zoom}
                              className={`editor-canvas overlay-canvas ${activeTool === 'highlighter' ? 'highlighter-cursor' : ''}`}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: `${pdfDimensions.width * zoom}px`,
                                height: `${pdfDimensions.height * zoom}px`,
                                zIndex: 10,
                                cursor: activeTool === 'select' ? 'default' : activeTool === 'pan' ? 'grab' : activeTool === 'highlighter' ? 'url("data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23fbbf24" stroke-width="3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>") 12 12, crosshair' : 'crosshair',
                                pointerEvents: 'auto',
                                touchAction: 'none'
                              }}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={stopDrawing}
                              onMouseLeave={stopDrawing}
                              onTouchStart={(e) => {
                                e.preventDefault()
                                const touch = e.touches[0]
                                const mouseEvent = new MouseEvent('mousedown', {
                                  clientX: touch.clientX,
                                  clientY: touch.clientY
                                })
                                startDrawing(mouseEvent)
                              }}
                              onTouchMove={(e) => {
                                e.preventDefault()
                                const touch = e.touches[0]
                                const mouseEvent = new MouseEvent('mousemove', {
                                  clientX: touch.clientX,
                                  clientY: touch.clientY
                                })
                                draw(mouseEvent)
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault()
                                stopDrawing()
                              }}
                              onClick={(e) => {
                                if (activeTool === 'text') {
                                  handleAddText(e)
                                } else if (['rectangle', 'circle', 'line'].includes(activeTool)) {
                                  handleAddShape(e)
                                } else if (['highlighter-rectangle', 'highlighter-circle', 'highlighter-line'].includes(activeTool)) {
                                  handleAddHighlighterShape(e)
                                }
                              }}
                            />
                          </div>
                        </div>
                      </Document>
                    </div>
                    
                    {/* Page Navigation */}
                    {numPages && numPages > 1 && (
                      <div className="page-navigation enhanced">
                        <div className="nav-controls">
                          <button 
                            className="page-btn scroll-btn"
                            onClick={() => {
                              setCurrentPage(1)
                              handleScrollToPage(1)
                            }}
                            disabled={currentPage <= 1}
                            title="First page (Home)"
                          >
                            <ArrowUp size={16} />
                            First
                          </button>
                            
                            <button 
                              className="page-btn"
                              onClick={goToPreviousPage}
                              disabled={currentPage <= 1}
                              title="Previous page (↑/←)"
                            >
                              <ChevronLeft size={20} />
                              Previous
                            </button>
                          </div>
                          
                          <div className="page-info enhanced">
                            <div className="page-display">
                              <span>Page </span>
                              <input 
                                type="number"
                                min="1"
                                max={numPages}
                                value={currentPage}
                                onChange={(e) => {
                                  const page = parseInt(e.target.value)
                                  if (page >= 1 && page <= numPages) {
                                    setCurrentPage(page)
                                    handleScrollToPage(page)
                                  }
                                }}
                                className="page-input"
                              />
                              <span> of {numPages}</span>
                            </div>
                            
                            {/* Page Range Selector */}
                            {pageEditMode === 'range' && selectedPages.length > 0 && (
                              <div className="range-info">
                                <span className="range-text">
                                  Selected: {Math.min(...selectedPages)}-{Math.max(...selectedPages)}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="nav-controls">
                            <button 
                              className="page-btn"
                              onClick={goToNextPage}
                              disabled={currentPage >= numPages}
                              title="Next page (↓/→)"
                            >
                              Next
                              <ChevronRight size={20} />
                            </button>
                            
                            <button 
                              className="page-btn scroll-btn"
                              onClick={() => {
                                setCurrentPage(numPages)
                                handleScrollToPage(numPages)
                              }}
                              disabled={currentPage >= numPages}
                              title="Last page (End)"
                            >
                              Last
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
              ) : (
                // Default canvas when no PDF is loaded
                <div className="default-canvas-container">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className={`editor-canvas ${activeTool === 'highlighter' ? 'highlighter-cursor' : ''}`}
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transformOrigin: 'center center',
                      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
                      cursor: activeTool === 'select' ? 'default' : activeTool === 'pan' ? 'grab' : activeTool === 'highlighter' ? 'url("data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23fbbf24" stroke-width="3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>") 12 12, crosshair' : 'crosshair'
                    }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      const touch = e.touches[0]
                      const mouseEvent = new MouseEvent('mousedown', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                      })
                      startDrawing(mouseEvent)
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault()
                      const touch = e.touches[0]
                      const mouseEvent = new MouseEvent('mousemove', {
                        clientX: touch.clientX,
                        clientY: touch.clientY
                      })
                      draw(mouseEvent)
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      stopDrawing()
                    }}
                    onClick={(e) => {
                      if (activeTool === 'text') {
                        handleAddText(e)
                      } else if (['rectangle', 'circle', 'line'].includes(activeTool)) {
                        handleAddShape(e)
                      } else if (['highlighter-rectangle', 'highlighter-circle', 'highlighter-line'].includes(activeTool)) {
                        handleAddHighlighterShape(e)
                      }
                    }}
                  />
                  <div className="upload-prompt">
                    <FileText size={48} />
                    <h3>Upload a PDF to start editing</h3>
                    <p>Click "Upload PDF" to load a document</p>
                  </div>
                </div>
              )}
              
              {/* Canvas overlays */}
              <div className="canvas-overlay">
                <div className="canvas-info">
                  <span className="tool-info">
                    Tool: <strong>{activeTool.startsWith('highlighter-') ? `Highlighter ${activeTool.split('-')[1].charAt(0).toUpperCase() + activeTool.split('-')[1].slice(1)}` : activeTool.charAt(0).toUpperCase() + activeTool.slice(1)}</strong>
                  </span>
                  {activeTool === 'text' && (
                    <span className="instruction">Click to add text</span>
                  )}
                  {['rectangle', 'circle', 'line'].includes(activeTool) && (
                    <span className="instruction">Click to add shape</span>
                  )}
                  {['highlighter-rectangle', 'highlighter-circle', 'highlighter-line'].includes(activeTool) && (
                    <span className="instruction">Click to add highlighter {activeTool.split('-')[1]}</span>
                  )}
                  {pdfFile && (
                    <span className="file-info">File: {pdfFile.name}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}