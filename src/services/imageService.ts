/**
 * BGK WEAR - Image Processing & Storage Service
 * Handles client-side high-performance image compression, resizing, and optimization.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  reductionPercentage: number;
  width: number;
  height: number;
}

/**
 * Compresses an image file or base64 string using an off-screen HTML5 Canvas.
 * Downsamples high-resolution mobile photos (which can be 5-15MB) to web-optimized 1200px max dimensions.
 */
export async function compressImage(
  input: File | string,
  maxWidth = 1200,
  maxHeight = 1600,
  quality = 0.82
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const handleLoad = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate aspect ratio preserving dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to initialize canvas 2D rendering context'));
        return;
      }

      // High quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Export as optimized WebP or JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      // Estimate sizes
      const originalEstimate = typeof input === 'string' 
        ? Math.round((input.length * 3) / 4 / 1024) 
        : Math.round(input.size / 1024);
      
      const compressedSizeKB = Math.round((compressedDataUrl.length * 3) / 4 / 1024);
      const reduction = originalEstimate > 0 
        ? Math.max(0, Math.round(((originalEstimate - compressedSizeKB) / originalEstimate) * 100))
        : 0;

      resolve({
        dataUrl: compressedDataUrl,
        originalSizeKB: originalEstimate || compressedSizeKB,
        compressedSizeKB,
        reductionPercentage: reduction,
        width,
        height
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'));
    };

    if (typeof input === 'string') {
      img.src = input;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file buffer'));
      reader.readAsDataURL(input);
    }
  });
}

/**
 * Validates whether a file is an acceptable image format and size
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  if (!allowedTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPG, PNG, WebP or HEIC).'
    };
  }

  const maxSizeBytes = 25 * 1024 * 1024; // 25MB max upload before compression
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: 'Image file size exceeds 25MB. Please choose a smaller photo.'
    };
  }

  return { valid: true };
}
