import { useEffect } from 'react'

export function AdBanner({ slot, format = 'auto', responsive = true, style = {} }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.log('AdSense not loaded yet')
    }
  }, [])

  return (
    <div className="ad-container" style={{ textAlign: 'center', margin: '20px 0', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-YOUR_ADSENSE_ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  )
}

export function MicrosoftAd({ width = 728, height = 90, style = {} }) {
  useEffect(() => {
    // Microsoft Advertising script will be loaded globally
    if (window.Microsoft && window.Microsoft.Advertising) {
      // Initialize Microsoft ads
    }
  }, [])

  return (
    <div className="microsoft-ad" style={{ textAlign: 'center', margin: '20px 0', ...style }}>
      <div 
        id={`microsoft-ad-${Math.random().toString(36).substr(2, 9)}`}
        style={{ width: `${width}px`, height: `${height}px`, margin: '0 auto' }}
      >
        {/* Microsoft Ad will be inserted here */}
      </div>
    </div>
  )
}