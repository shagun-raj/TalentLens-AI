/**
 * Deterministic file fingerprinting for exact duplicate resume detection.
 * Computes a SHA-256 digest from actual file content (ArrayBuffer or string).
 */
export async function calculateFileHash(fileOrContent: File | ArrayBuffer | string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      let buffer: ArrayBuffer;
      if (fileOrContent instanceof File) {
        buffer = await fileOrContent.arrayBuffer();
      } else if (fileOrContent instanceof ArrayBuffer) {
        buffer = fileOrContent;
      } else {
        const encoder = new TextEncoder();
        buffer = encoder.encode(fileOrContent).buffer;
      }
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Subtle crypto SHA-256 failed, falling back to deterministic checksum', e);
  }

  // Fallback hash implementation
  let str = '';
  if (fileOrContent instanceof File) {
    str = `${fileOrContent.name}_${fileOrContent.size}_${fileOrContent.lastModified}`;
  } else if (typeof fileOrContent === 'string') {
    str = fileOrContent;
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}
