import { PDFDocument } from 'pdf-lib';

export async function mergePDFs(files) {
  if (!files || files.length === 0) {
    throw new Error('No files provided for merging');
  }

  try {
    const mergedPdf = await PDFDocument.create();
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      
      if (pageCount > 0) {
        const pageIndices = Array.from({ length: pageCount }, (_, idx) => idx);
        const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
    }
    
    const pdfBytes = await mergedPdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('PDF merge error:', error);
    throw new Error(`Failed to merge PDFs: ${error.message}`);
  }
}

export async function splitPDF(file) {
  if (!file) {
    throw new Error('No file provided for splitting');
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const pageCount = pdf.getPageCount();
    const results = [];
    
    // Split into individual pages
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);
      const pdfBytes = await newPdf.save();
      results.push({
        name: `page_${i + 1}.pdf`,
        blob: new Blob([pdfBytes], { type: 'application/pdf' })
      });
    }
    
    return results;
  } catch (error) {
    console.error('PDF split error:', error);
    throw new Error(`Failed to split PDF: ${error.message}`);
  }
}