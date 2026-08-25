export interface PDFExtractionResult {
  success: boolean;
  text: string;
  numPages: number;
  info?: any;
  error?: string;
  errorCategory?: 'EMPTY_FILE' | 'INVALID_FORMAT' | 'CORRUPTED' | 'UNREADABLE_IMAGE' | 'PARSER_ERROR';
}

/**
 * Extracts readable plain text from a PDF buffer using Mozilla's pdfjs-dist engine.
 * Handles multi-page resumes, preserves logical line breaks and page breaks,
 * validates magic bytes, and provides diagnostic metadata without exposing sensitive info.
 */
export async function extractTextFromPDFBuffer(
  buffer: Buffer,
  fileName: string = 'Uploaded Resume'
): Promise<PDFExtractionResult> {
  const startTime = Date.now();

  try {
    if (!buffer || buffer.length === 0) {
      console.warn(`[PDFService] Extraction aborted: ${fileName} is empty (0 bytes)`);
      return {
        success: false,
        text: '',
        numPages: 0,
        errorCategory: 'EMPTY_FILE',
        error: 'PDF file is empty (0 bytes).',
      };
    }

    // Check PDF magic bytes (%PDF)
    const header = buffer.subarray(0, 5).toString('utf-8');
    if (!header.startsWith('%PDF')) {
      console.warn(`[PDFService] Invalid file signature for ${fileName}: expected %PDF, found "${header.substring(0, 4)}"`);
      return {
        success: false,
        text: '',
        numPages: 0,
        errorCategory: 'INVALID_FORMAT',
        error: 'File does not have a valid PDF header signature (%PDF).',
      };
    }

    // Import pdfjs-dist legacy build for Node.js environment
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

    const uint8Array = new Uint8Array(buffer);
    const loadingTask = getDocument({
      data: uint8Array,
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
          // If Y position changes significantly, treat as new line
          const y = item.transform ? item.transform[5] : null;
          if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
            if (currentLine.trim()) {
              pageLines.push(currentLine.trim());
            }
            currentLine = item.str;
          } else {
            currentLine += (currentLine ? ' ' : '') + item.str;
          }
          if (y !== null) {
            lastY = y;
          }
        }
      }
      if (currentLine.trim()) {
        pageLines.push(currentLine.trim());
      }

      const pageCombined = pageLines.join('\n');
      if (pageCombined.trim()) {
        pageTexts.push(`--- Page ${pageNum} ---\n${pageCombined.trim()}`);
      }
    }

    const fullText = pageTexts.join('\n\n');
    const cleanText = fullText.trim();
    const durationMs = Date.now() - startTime;

    if (!cleanText || cleanText.length < 20) {
      console.warn(`[PDFService] Extraction warning: ${fileName} (${numPages} pages) yielded only ${cleanText.length} chars. Might be image-only.`);
      return {
        success: false,
        text: cleanText,
        numPages,
        errorCategory: 'UNREADABLE_IMAGE',
        error: 'PDF contains no extractable text. It may be a scanned image or password-protected.',
      };
    }

    // Diagnostic safe log (no PII, no resume content)
    console.log(
      `[PDFService] Successfully extracted ${fileName}: Pages: ${numPages}, Characters: ${cleanText.length}, Duration: ${durationMs}ms`
    );

    return {
      success: true,
      text: cleanText,
      numPages,
    };
  } catch (err: any) {
    const durationMs = Date.now() - startTime;
    console.error(`[PDFService] Error extracting ${fileName} after ${durationMs}ms:`, err.message || err);
    return {
      success: false,
      text: '',
      numPages: 0,
      errorCategory: 'CORRUPTED',
      error: `Unable to read this PDF document: ${err.message || 'PDF appears corrupted or unreadable.'}`,
    };
  }
}
