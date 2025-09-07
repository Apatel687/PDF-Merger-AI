// PDF.js setup for Chrome compatibility
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
const setupPDFJS = () => {
  try {
    // Use CDN worker for better compatibility
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
    
    // Alternative: use local worker
    // pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
    
    console.log('PDF.js configured successfully', pdfjsLib.version)
  } catch (error) {
    console.error('Error setting up PDF.js:', error)
    
    // Fallback configuration
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
      console.log('Using fallback PDF.js worker configuration')
    } catch (fallbackError) {
      console.error('Fallback PDF.js configuration failed:', fallbackError)
    }
  }
}

// Initialize PDF.js configuration
setupPDFJS()

export { pdfjsLib }
export default setupPDFJS
