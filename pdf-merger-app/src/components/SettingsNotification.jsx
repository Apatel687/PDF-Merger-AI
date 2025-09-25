import { useState, useEffect } from 'react'
import { Check, X, Info, AlertTriangle } from 'lucide-react'
import './SettingsNotification.css'

const SettingsNotification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={16} />
      case 'error':
        return <X size={16} />
      case 'warning':
        return <AlertTriangle size={16} />
      default:
        return <Info size={16} />
    }
  }

  return (
    <div className={`settings-notification ${type} ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="notification-icon">
        {getIcon()}
      </div>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={() => setIsVisible(false)}>
        <X size={14} />
      </button>
    </div>
  )
}

export default SettingsNotification