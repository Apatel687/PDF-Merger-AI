// Ad Management Utilities

export const initializeAds = () => {
  // Initialize Google AdSense
  if (window.adsbygoogle) {
    try {
      const ads = document.querySelectorAll('.adsbygoogle')
      ads.forEach(ad => {
        if (!ad.getAttribute('data-adsbygoogle-status')) {
          window.adsbygoogle.push({})
        }
      })
    } catch (error) {
      console.log('AdSense initialization error:', error)
    }
  }

  // Initialize Microsoft Advertising
  if (window.Microsoft && window.Microsoft.Advertising) {
    try {
      // Microsoft Advertising initialization
      console.log('Microsoft Advertising initialized')
    } catch (error) {
      console.log('Microsoft Advertising error:', error)
    }
  }
}

export const loadAdScript = (type) => {
  return new Promise((resolve, reject) => {
    if (type === 'adsense') {
      if (window.adsbygoogle) {
        resolve()
        return
      }
      
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_ID'
      script.crossOrigin = 'anonymous'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    }
    
    if (type === 'microsoft') {
      if (window.Microsoft) {
        resolve()
        return
      }
      
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://www.bing.com/api/ads/js/ads.js'
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    }
  })
}

export const adConfig = {
  adsense: {
    client: 'ca-pub-YOUR_ADSENSE_ID',
    slots: {
      topBanner: 'YOUR_TOP_BANNER_SLOT',
      sidebar: 'YOUR_SIDEBAR_SLOT',
      content: 'YOUR_CONTENT_SLOT',
      footer: 'YOUR_FOOTER_SLOT'
    }
  },
  microsoft: {
    customerId: 'YOUR_MICROSOFT_CUSTOMER_ID',
    campaignId: 'YOUR_CAMPAIGN_ID'
  }
}