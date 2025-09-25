import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export async function addPageNumbers(file, options = {}) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    const {
      position = 'bottom-right',
      fontSize = 12,
      color = { r: 0, g: 0, b: 0 },
      margin = 20
    } = options;

    pages.forEach((page, index) => {
      const { width, height } = page.getSize();
      const pageNumber = `${index + 1}`;
      
      let x, y;
      switch (position) {
        case 'bottom-left':
          x = margin;
          y = margin;
          break;
        case 'bottom-right':
          x = width - margin - font.widthOfTextAtSize(pageNumber, fontSize);
          y = margin;
          break;
        case 'top-left':
          x = margin;
          y = height - margin - fontSize;
          break;
        case 'top-right':
          x = width - margin - font.widthOfTextAtSize(pageNumber, fontSize);
          y = height - margin - fontSize;
          break;
        default:
          x = width - margin - font.widthOfTextAtSize(pageNumber, fontSize);
          y = margin;
      }

      page.drawText(pageNumber, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
      });
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error adding page numbers:', error);
    throw new Error(`Failed to add page numbers: ${error.message}`);
  }
}

export async function addWatermark(file, watermarkText, options = {}) {
  if (!file || !watermarkText) {
    throw new Error('File and watermark text are required');
  }

  try {
    console.log('Starting watermark process...');
    const arrayBuffer = await file.arrayBuffer();
    console.log('File loaded, size:', arrayBuffer.byteLength);
    
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    console.log('PDF document loaded');
    
    const pages = pdfDoc.getPages();
    console.log('Number of pages:', pages.length);
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    console.log('Font embedded');
    
    const {
      fontSize = 40,
      opacity = 0.3,
      color = { r: 0.7, g: 0.7, b: 0.7 }
    } = options;

    pages.forEach((page, index) => {
      console.log(`Processing page ${index + 1}`);
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      
      const x = (width - textWidth) / 2;
      const y = height / 2;

      // Add watermark without rotation first to test
      page.drawText(watermarkText, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity
      });
      
      console.log(`Watermark added to page ${index + 1}`);
    });

    console.log('Saving PDF...');
    const pdfBytes = await pdfDoc.save();
    console.log('PDF saved, size:', pdfBytes.length);
    
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Detailed watermark error:', error);
    throw new Error(`Failed to add watermark: ${error.message}`);
  }
}