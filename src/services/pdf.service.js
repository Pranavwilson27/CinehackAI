// src/services/pdf.service.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function extractTextFromPdf(buffer) {
  try {
    const data = new Uint8Array(buffer);
    const doc = await pdfjsLib.getDocument(data).promise;
    let allText = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      allText += pageText + '\n';
    }
    return allText;
  } catch (error) {
    console.error('Error parsing PDF with pdfjs-dist:', error);
    throw new Error('Failed to parse the PDF file.');
  }
}
