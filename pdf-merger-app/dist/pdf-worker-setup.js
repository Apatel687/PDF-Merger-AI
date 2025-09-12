// PDF.js Worker Setup
if (typeof window !== 'undefined' && window.pdfjsLib) {
  // Configure PDF.js for better compatibility using local worker
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  
  // Set additional options
  window.pdfjsLib.GlobalWorkerOptions.verbosity = window.pdfjsLib.VerbosityLevel.ERRORS;
}