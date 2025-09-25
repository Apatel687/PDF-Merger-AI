import { useState, useEffect } from 'react'
import { useResponsive } from '../utils/responsive'
import { useToast } from './Toast'
import { 
  Share2, 
  RotateCw, 
  Scissors, 
  Trash2, 
  Eye, 
  Download,
  Copy,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Linkedin,
  MoreHorizontal,
  Split,
  Combine,
  X,
  Zap
} from 'lucide-react'
import './PDFToolbar.css'

export function PDFToolbar({ 
  files, 
  onRotatePage, 
  onDeletePage, 
  onSplitPDF, 
  onShare,
  mergedPdfUrl,
  disabled = false
}) {
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { isMobile, isTablet, isTouchDevice } = useResponsive()
  const { notify } = useToast()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.share-wrapper') && !event.target.closest('.mobile-menu')) {
        setShowShareMenu(false)
        setActiveDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const shareOptions = [
    {
      icon: Copy,
      label: 'Copy Link',
      action: () => handleShare('copy'),
      color: '#6b7280'
    },
    {
      icon: Mail,
      label: 'Email',
      action: () => handleShare('email'),
      color: '#dc2626'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      action: () => handleShare('whatsapp'),
      color: '#16a34a'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      action: () => handleShare('facebook'),
      color: '#1877f2'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      action: () => handleShare('twitter'),
      color: '#1da1f2'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      action: () => handleShare('linkedin'),
      color: '#0a66c2'
    }
  ]

  const handleShare = async (platform) => {
    if (!mergedPdfUrl) {
      notify('Please merge PDFs first to share', 'error')
      return
    }

    const shareData = {
      title: 'Merged PDF Document',
      text: 'Check out this merged PDF document',
      url: mergedPdfUrl
    }

    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(mergedPdfUrl)
          notify('Link copied to clipboard!', 'success')
        } catch (err) {
          console.error('Failed to copy:', err)
          notify('Failed to copy link', 'error')
        }
        break
      
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`)
        break
      
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`)
        break
      
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`)
        break
      
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`)
        break
      
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`)
        break
      
      default:
        // Try native Web Share API
        if (navigator.share) {
          try {
            await navigator.share(shareData)
          } catch (err) {
            console.error('Error sharing:', err)
          }
        }
    }
    
    setShowShareMenu(false)
    onShare?.(platform)
  }

  const handleToolAction = (action, data) => {
    switch (action) {
      case 'rotate':
        onRotatePage?.(data)
        break
      case 'delete':
        onDeletePage?.(data)
        break
      case 'split':
        onSplitPDF?.(data)
        break
      default:
        break
    }
  }

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <div className={`pdf-toolbar ${disabled ? 'disabled' : ''} futuristic-card`}>
      <div className="toolbar-header">
        <div className="ai-indicator">
          <Zap size={16} />
          <span>AI Tools Active</span>
        </div>
      </div>
      
      {/* Primary Actions */}
      <div className="toolbar-section primary-actions">
        <div className="toolbar-group">
          <button 
            className="toolbar-btn futuristic-btn primary"
            onClick={() => handleToolAction('rotate')}
            disabled={disabled || files.length === 0}
            title="Rotate Pages"
          >
            <RotateCw size={18} />
            <span className="btn-label">Rotate</span>
          </button>
          
          <button 
            className="toolbar-btn futuristic-btn"
            onClick={() => handleToolAction('split')}
            disabled={disabled || files.length === 0}
            title="Split PDF"
          >
            <Split size={18} />
            <span className="btn-label">Split</span>
          </button>
          
          <button 
            className="toolbar-btn futuristic-btn danger"
            onClick={() => handleToolAction('delete')}
            disabled={disabled || files.length === 0}
            title="Delete Pages"
          >
            <Trash2 size={18} />
            <span className="btn-label">Delete</span>
          </button>
        </div>
      </div>

      {/* Share Section */}
      <div className="toolbar-section share-section">
        <div className="share-wrapper">
          <button 
            className="toolbar-btn futuristic-btn share-btn"
            onClick={() => setShowShareMenu(!showShareMenu)}
            disabled={!mergedPdfUrl}
            title="Share PDF"
          >
            <Share2 size={18} />
            <span className="btn-label">Share</span>
          </button>
          
          {showShareMenu && (
            <>
              {isMobile && (
                <div 
                  className="share-overlay"
                  onClick={() => setShowShareMenu(false)}
                />
              )}
              <div className="share-menu futuristic-card">
                <div className="share-menu-header">
                  <h4>Share PDF</h4>
                  <button 
                    className="close-btn"
                    onClick={() => setShowShareMenu(false)}
                  >
                    <X size={16} />
                  </button>
                </div>
                
                <div className="share-options">
                  {shareOptions.map((option, index) => (
                    <button
                      key={index}
                      className="share-option"
                      onClick={() => {
                        option.action()
                        setShowShareMenu(false)
                      }}
                      style={{ '--option-color': option.color }}
                    >
                      <option.icon size={20} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* File Info */}
      <div className="toolbar-section file-info">
        <div className="file-count">
          <Eye size={16} />
          <span>{files.length} file{files.length !== 1 ? 's' : ''}</span>
        </div>
        
        {mergedPdfUrl && (
          <div className="merge-status">
            <div className="status-indicator success"></div>
            <span>Ready to download</span>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="toolbar-section mobile-menu">
        <button 
          className="toolbar-btn futuristic-btn mobile-toggle"
          onClick={() => toggleDropdown('mobile')}
        >
          <MoreHorizontal size={18} />
        </button>
        
        {activeDropdown === 'mobile' && (
          <div className="mobile-dropdown futuristic-card">
            <button onClick={() => handleToolAction('rotate')}>
              <RotateCw size={16} />
              Rotate Pages
            </button>
            <button onClick={() => handleToolAction('split')}>
              <Split size={16} />
              Split PDF
            </button>
            <button onClick={() => handleToolAction('delete')}>
              <Trash2 size={16} />
              Delete Pages
            </button>
            <button onClick={() => setShowShareMenu(true)}>
              <Share2 size={16} />
              Share PDF
            </button>
          </div>
        )}
      </div>
    </div>
  )
}