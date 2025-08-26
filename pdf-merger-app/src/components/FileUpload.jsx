import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, HardDrive } from 'lucide-react'
import './FileUpload.css'

export function FileUpload({ onFilesAdded, isCompact = false }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFilesAdded(acceptedFiles)
    }
  }, [onFilesAdded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 500 * 1024 * 1024, // 500MB (increased from 50MB)
    multiple: true
  })

  if (isCompact) {
    return (
      <div className="file-upload compact" {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="compact-upload-area futuristic-card">
          <Upload size={20} />
          <span>Add more PDFs</span>
        </div>
      </div>
    )
  }

  return (
    <div className="file-upload" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={`upload-area futuristic-card ${isDragActive ? 'drag-active' : ''}`}>
        <div className="upload-icon">
          <FileText size={48} />
          <Upload size={24} className="upload-overlay" />
        </div>
        <h3 className="upload-title">
          {isDragActive ? 'Drop your PDFs here' : 'Drag & Drop PDF Files'}
        </h3>
        <p className="upload-subtitle">or click to browse your files</p>
        <button className="browse-btn futuristic-btn primary">
          <HardDrive size={16} />
          Browse Files
        </button>
        <p className="upload-info">
          Supports PDF files only • Max file size: 500MB
        </p>
      </div>
    </div>
  )
}