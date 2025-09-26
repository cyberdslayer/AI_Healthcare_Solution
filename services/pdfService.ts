
// This assumes pdf.js is loaded via a script tag in index.html
declare const pdfjsLib: any;

/**
 * Extracts text from a PDF file using the pdf.js library.
 * This function runs entirely in the browser.
 * @param file The PDF file to process.
 * @returns A promise that resolves with the extracted text content.
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
    }

    // In a full-stack implementation, if `fullText` is empty or has very little content,
    // this would be the point to trigger a fallback to a server-side OCR service (like Tesseract).
    // For this client-side demo, we rely solely on embedded text extraction.
    if (!fullText.trim()) {
        console.warn("No selectable text found in PDF. OCR fallback would be needed in a real application.");
        return "Warning: This PDF appears to be image-based. Text could not be automatically extracted. An OCR (Optical Character Recognition) process would be required for analysis.";
    }

    return fullText;
};
