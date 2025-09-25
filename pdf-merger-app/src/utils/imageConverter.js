import { PDFDocument } from 'pdf-lib';

export async function imagesToPDF(imageFiles) {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const imageFile of imageFiles) {
      const arrayBuffer = await imageFile.arrayBuffer();
      let image;
      
      if (imageFile.type === 'image/jpeg' || imageFile.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else if (imageFile.type === 'image/png') {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else {
        throw new Error(`Unsupported image format: ${imageFile.type}`);
      }
      
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const imageAspectRatio = image.width / image.height;
      const pageAspectRatio = width / height;
      
      let drawWidth, drawHeight;
      if (imageAspectRatio > pageAspectRatio) {
        drawWidth = width;
        drawHeight = width / imageAspectRatio;
      } else {
        drawHeight = height;
        drawWidth = height * imageAspectRatio;
      }
      
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      
      page.drawImage(image, {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      });
    }
    
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error converting images to PDF:', error);
    throw new Error(`Failed to convert images to PDF: ${error.message}`);
  }
}

export async function pdfToImages(file, format = 'png') {
  try {
    // This would require PDF.js for rendering
    // For now, return a placeholder
    throw new Error('PDF to images conversion requires additional setup');
  } catch (error) {
    console.error('Error converting PDF to images:', error);
    throw new Error(`Failed to convert PDF to images: ${error.message}`);
  }
}