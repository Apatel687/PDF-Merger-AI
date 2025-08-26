import React, { useState, useEffect } from 'react'
import { X, Copy, Mail, MessageCircle, Facebook, Twitter, Linkedin } from 'lucide-react'
import './ShareModal.css'

export function ShareModal({ isOpen, onClose, pdfUrl, fileName }) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pdfUrl)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleEmailShare = () => {
    window.open(`mailto:?subject=Check out this PDF&body=I wanted to share this PDF with you: ${encodeURIComponent(pdfUrl)}`)
  }

  const handleWhatsAppShare = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this PDF: ${pdfUrl}`)}`)
  }

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pdfUrl)}`)
  }

  const handleTwitterShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out this PDF')}&url=${encodeURIComponent(pdfUrl)}`)
  }

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pdfUrl)}`)
  }

  if (!isOpen) return null

  const shareOptions = [
    {
      icon: Copy,
      label: 'Copy Link',
      action: handleCopyLink,
      color: '#6b7280'
    },
    {
      icon: Mail,
      label: 'Email',
      action: handleEmailShare,
      color: '#dc2626'
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      action: handleWhatsAppShare,
      color: '#16a34a'
    },
    {
      icon: Facebook,
      label: 'Facebook',
      action: handleFacebookShare,
      color: '#1877f2'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      action: handleTwitterShare,
      color: '#1da1f2'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      action: handleLinkedInShare,
      color: '#0a66c2'
    }
  ]

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal futuristic-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Share Document</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-content">
          <div className="file-preview">
            <div className="file-icon">
              <div className="file-icon-bg">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div className="file-info">
              <h3>{fileName}</h3>
              <p>Ready to share</p>
            </div>
          </div>
          
          <div className="share-options">
            {shareOptions.map((option, index) => (
              <button
                key={index}
                className="share-option futuristic-btn"
                onClick={() => {
                  option.action()
                  onClose()
                }}
                style={{ '--option-color': option.color }}
              >
                <option.icon size={20} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}