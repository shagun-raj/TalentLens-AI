import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker for client-side extraction in browser
if (typeof window !== 'undefined') {
  // Use official unpkg CDN or inline fallback for worker to avoid bundling friction
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ClientPDFExtractionResult {
  success: boolean;
  text: string;
  numPages: number;
  error?: string;
  errorCategory?: string;
}

/**
 * Extracts readable plain text from a File / ArrayBuffer in the browser using pdfjs-dist.
 */
export async function extractTextFromPDFFile(file: File): Promise<ClientPDFExtractionResult> {
  const startTime = Date.now();
  try {
    if (!file || file.size === 0) {
      return {
        success: false,
        text: '',
        numPages: 0,
        errorCategory: 'EMPTY_FILE',
        error: 'PDF file is empty (0 bytes).',
      };
    }

    const arrayBuffer = await file.arrayBuffer();
    const header = new Uint8Array(arrayBuffer.slice(0, 5));
    const headerStr = String.fromCharCode(...header);

    if (!headerStr.startsWith('%PDF')) {
      return {
        success: false,
        text: '',
        numPages: 0,
        errorCategory: 'INVALID_FORMAT',
        error: 'The uploaded file does not have a valid PDF header (%PDF).',
      };
    }

    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages || 1;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();

      const pageLines: string[] = [];
      let currentLine = '';
      let lastY: number | null = null;

      for (const item of textContent.items as any[]) {
        if ('str' in item && typeof item.str === 'string') {
          const y = item.transform ? item.transform[5] : null;
          if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
            if (currentLine.trim()) pageLines.push(currentLine.trim());
            currentLine = item.str;
          } else {
            currentLine += (currentLine ? ' ' : '') + item.str;
          }
          if (y !== null) lastY = y;
        }
      }
      if (currentLine.trim()) pageLines.push(currentLine.trim());
      const pageCombined = pageLines.join('\n');
      if (pageCombined.trim()) {
        pageTexts.push(`--- Page ${pageNum} ---\n${pageCombined.trim()}`);
      }
    }

    const fullText = pageTexts.join('\n\n').trim();
    const duration = Date.now() - startTime;

    if (!fullText || fullText.length < 20) {
      return {
        success: false,
        text: fullText,
        numPages,
        errorCategory: 'UNREADABLE_IMAGE',
        error: 'PDF contains no extractable text. It may be a scanned image or protected.',
      };
    }

    // Safe diagnostic log
    console.log(`[ClientPDFExtractor] Extracted "${file.name}": ${numPages} page(s), ${fullText.length} chars in ${duration}ms`);

    return {
      success: true,
      text: fullText,
      numPages,
    };
  } catch (err: any) {
    console.error(`[ClientPDFExtractor] Error extracting "${file.name}":`, err);
    return {
      success: false,
      text: '',
      numPages: 0,
      errorCategory: 'CORRUPTED',
      error: `Unable to read this PDF: ${err.message || 'Corrupted or unreadable format.'}`,
    };
  }
}
