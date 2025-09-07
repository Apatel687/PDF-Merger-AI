import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import {
  CSS,
} from '@dnd-kit/utilities'
import { 
  FileText, 
  Upload, 
  Download, 
  RotateCw, 
  Trash2, 
  Eye, 
  Move, 
  ZoomIn, 
  ZoomOut,
  GripVertical,
  X,
  Plus,
  Minus
} from 'lucide-react'
import './EnhancedPDFPreview.css'

// Set up PDF.js worker with better error handling
try {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
} catch (error) {
  console.warn('Using fallback PDF worker:', error)
  pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`
}

function PDFPageThumbnail({ 
  file, 
  pageIndex, 
  onRotate, 
  onDelete, 
  onSelect, 
  isSelected, 
  viewMode = 'grid',
  scale = 0.2 
}) {
  const [numPages, setNumPages] = useState(null)
  const [pageRotation, setPageRotation] = useState(0)

  const handleRotate = () => {
    const newRotation = (pageRotation + 90) % 360
    setPageRotation(newRotation)
    onRotate?.(file.id, pageIndex, newRotation)
  }

  const handleDelete = () => {
    if (window.confirm(`Delete page ${pageIndex + 1}?`)) {
      onDelete?.(file.id, pageIndex)
    }
  }

  return (
    <div className={`pdf-page-thumbnail ${isSelected ? 'selected' : ''} ${viewMode}`}>
      <div className="thumbnail-container futuristic-card">
        <div className="file-name-badge">
          {file.name.replace('.pdf', '')}
        </div>
        <Document
          file={file.file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="loading-placeholder">Loading...</div>}
          error={<div className="error-placeholder">Error loading PDF</div>}
          options={{
            cMapUrl: '/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: '/standard_fonts/',
            disableAutoFetch: true,
            disableStream: true,
            disableRange: true,
            enableXfa: false,
            verbosity: 0,
            maxImageSize: 10485760,
            isEvalSupported: false,
            useSystemFonts: true,
            disableFontFace: true,
            disableCreateObjectURL: false,
            pdfBug: false
          }}

        >
          <Page
            pageNumber={pageIndex + 1}
            scale={scale}
            rotate={pageRotation}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<div className="page-loading">Loading page...</div>}
          />
        </Document>
        
        <div className="page-overlay">
          <div className="page-actions">
            <button
              className="action-btn rotate futuristic-btn"
              onClick={handleRotate}
              title="Rotate page"
            >
              <RotateCw size={14} />
            </button>
            <button
              className="action-btn delete futuristic-btn"
              onClick={handleDelete}
              title="Delete page"
            >
              <Trash2 size={14} />
            </button>
            <button
              className="action-btn view futuristic-btn"
              onClick={() => onSelect?.(file.id, pageIndex)}
              title="View page"
            >
              <Eye size={14} />
            </button>
          </div>
        </div>
        
        <div className="page-info">
          <span className="page-number">Page {pageIndex + 1}</span>
          {numPages && <span className="total-pages">of {numPages}</span>}
        </div>
      </div>
    </div>
  )
}

function SortablePDFItem({ file, onRemove, onRotatePage, onDeletePage, onSelectPage, viewMode, scale }) {
  const [numPages, setNumPages] = useState(null)
  const [selectedPages, setSelectedPages] = useState(new Set())
  const [isExpanded, setIsExpanded] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: file.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderPageThumbnails = () => {
    if (!numPages || !isExpanded) return null

    return (
      <div className="pages-grid">
        {Array.from({ length: numPages }, (_, index) => (
          <PDFPageThumbnail
            key={index}
            file={file}
            pageIndex={index}
            onRotate={onRotatePage}
            onDelete={onDeletePage}
            onSelect={onSelectPage}
            isSelected={selectedPages.has(index)}
            viewMode={viewMode}
            scale={scale}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`enhanced-pdf-item ${isDragging ? 'dragging' : ''} futuristic-card`}
    >
      <div className="pdf-item-header">
        <div 
          className="drag-handle"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </div>
        
        <div className="pdf-icon">
          <FileText size={24} />
        </div>
        
        <div className="pdf-info">
          <div className="pdf-name" title={file.name}>
            {file.name}
          </div>
          <div className="pdf-details">
            <span className="pdf-size">{formatFileSize(file.size)}</span>
            {numPages && <span className="page-count">{numPages} pages</span>}
            <span className="pdf-source">From: {file.name.replace('.pdf', '')}</span>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="expand-btn futuristic-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse' : 'Expand to view pages'}
          >
            {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
          </button>
          
          <button 
            onClick={() => onRemove(file.id)}
            className="remove-btn futuristic-btn"
            title="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* PDF Document for page counting */}
      <div style={{ display: 'none' }}>
        <Document
          file={file.file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        />
      </div>

      {/* Page thumbnails */}
      {renderPageThumbnails()}
    </div>
  )
}

export function EnhancedPDFPreview({ 
  files, 
  onFileRemove, 
  onReorder, 
  onRotatePage,
  onDeletePage,
  onSelectPage 
}) {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [scale, setScale] = useState(0.15)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex(file => file.id === active.id)
      const newIndex = files.findIndex(file => file.id === over.id)

      onReorder(arrayMove(files, oldIndex, newIndex))
    }
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.05, 0.5))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.05, 0.1))
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="enhanced-pdf-preview">
      <div className="preview-header futuristic-card">
        <div className="preview-controls">
          <div className="view-controls">
            <button
              className={`view-btn futuristic-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              Grid
            </button>
            <button
              className={`view-btn futuristic-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              List
            </button>
          </div>
          
          <div className="zoom-controls">
            <button
              className="zoom-btn futuristic-btn"
              onClick={handleZoomOut}
              disabled={scale <= 0.1}
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button
              className="zoom-btn futuristic-btn"
              onClick={handleZoomIn}
              disabled={scale >= 0.5}
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>
        
        <p className="preview-instructions">
          Drag to reorder files • Click + to view pages
        </p>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={files.map(file => file.id)}
          strategy={rectSortingStrategy}
        >
          <div className={`pdf-list ${viewMode}`}>
            {files.map((file, index) => (
              <div key={file.id} className="pdf-item-wrapper">
                <div className="item-number">{index + 1}</div>
                <SortablePDFItem 
                  file={file}
                  onRemove={onFileRemove}
                  onRotatePage={onRotatePage}
                  onDeletePage={onDeletePage}
                  onSelectPage={onSelectPage}
                  viewMode={viewMode}
                  scale={scale}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
