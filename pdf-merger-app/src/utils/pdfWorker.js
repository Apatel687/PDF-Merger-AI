// Simple PDF worker setup
export const setupPDFWorker = () => {
  if (typeof window !== 'undefined' && !window.pdfjsWorkerSetup) {
    // Set up PDF.js worker
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        window.pdfjsWorkerSetup = true;
      }
    };
    document.head.appendChild(script);
  }
};

// Initialize on import
setupPDFWorker();