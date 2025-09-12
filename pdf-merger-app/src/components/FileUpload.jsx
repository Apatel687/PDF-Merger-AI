import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, HardDrive, AlertCircle, CheckCircle } from 'lucide-react'
import './FileUpload.css'

export function FileUpload({ onFilesAdded, isCompact = false }) {
  const [uploadStatus, setUploadStatus] = useState(null)
  
  const validatePDFFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const buffer = e.target.result
        const bytes = new Uint8Array(buffer)
        
        // Check PDF header
        if (bytes.length >= 4) {
          const header = String.fromCharCode(...bytes.slice(0, 4))
          if (header === '%PDF') {
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          resolve(false)
        }
      }
      reader.onerror = () => resolve(false)
      reader.readAsArrayBuffer(file.slice(0, 10))
    })
  }
  
  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    try {
      setUploadStatus('validating')
      
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(f => f.errors.map(e => e.message).join(', '))
        setUploadStatus({ type: 'error', message: `Invalid files: ${errors.join(', ')}` })
        setTimeout(() => setUploadStatus(null), 5000)
        return
      }
      
      if (acceptedFiles.length > 0) {
        // Validate each PDF file
        const validFiles = []
        const invalidFiles = []
        
        for (const file of acceptedFiles) {
          const isValid = await validatePDFFile(file)
          if (isValid) {
            validFiles.push(file)
          } else {
            invalidFiles.push(file.name)
          }
        }
        
        if (invalidFiles.length > 0) {
          setUploadStatus({ 
            type: 'error', 
            message: `Invalid PDF files: ${invalidFiles.join(', ')}` 
          })
          setTimeout(() => setUploadStatus(null), 5000)
        }
        
        if (validFiles.length > 0) {
          setUploadStatus({ type: 'success', message: `Added ${validFiles.length} file(s)` })
          onFilesAdded(validFiles)
          setTimeout(() => setUploadStatus(null), 3000)
        }
      }
    } catch (error) {
      console.error('Error processing files:', error)
      setUploadStatus({ type: 'error', message: 'Error processing files. Please try again.' })
      setTimeout(() => setUploadStatus(null), 5000)
    }
  }, [onFilesAdded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 500 * 1024 * 1024, // 500MB (increased from 50MB)
    multiple: true,
    onError: (error) => {
      console.error('Dropzone error:', error)
      setUploadStatus({ type: 'error', message: 'Upload error. Please try again.' })
      setTimeout(() => setUploadStatus(null), 5000)
    }
  })
  
  const renderStatus = () => {
    if (!uploadStatus) return null
    
    if (uploadStatus === 'validating') {
      return (
        <div className="upload-status validating" role="status" aria-live="polite" aria-busy="true">
          <div className="spinner"></div>
          <span>Validating files...</span>
          <progress className="upload-progress" aria-hidden="true"></progress>
        </div>
      )
    }
    
    return (
      <div className={`upload-status ${uploadStatus.type}`} role="status" aria-live="polite">
        {uploadStatus.type === 'error' ? (
          <AlertCircle size={16} />
        ) : (
          <CheckCircle size={16} />
        )}
        <span>{uploadStatus.message}</span>
      </div>
    )
  }

  if (isCompact) {
    return (
      <div className="file-upload compact">
        <div {...getRootProps({ role: 'button', tabIndex: 0, 'aria-label': 'Add PDF files' })}>
          <input {...getInputProps()} aria-label="Choose PDF files" />
          <div className="compact-upload-area futuristic-card">
            <Upload size={20} />
            <span>Add more PDFs</span>
          </div>
        </div>
        {renderStatus()}
      </div>
    )
  }

  return (
    <div className="file-upload">
      <div {...getRootProps({ role: 'button', tabIndex: 0, 'aria-label': 'Upload PDFs via drag and drop or click' })}>
        <input {...getInputProps()} aria-label="Upload PDF files" />
        <div className={`upload-area futuristic-card ${isDragActive ? 'drag-active' : ''}`} aria-busy={uploadStatus==='validating'}>
          <div className="upload-icon">
            <FileText size={48} />
            <Upload size={24} className="upload-overlay" />
          </div>
          <h3 className="upload-title">
            {isDragActive ? 'Drop your PDFs here' : 'Drag & Drop PDF Files'}
          </h3>
          <p className="upload-subtitle">or click to browse your files</p>
          <button className="browse-btn futuristic-btn primary" type="button" aria-label="Browse files">
            <HardDrive size={16} />
            Browse Files
          </button>
          <p className="upload-info">
            Supports PDF files only • Max file size: 500MB
          </p>
        </div>
      </div>
      {renderStatus()}
    </div>
  )
}