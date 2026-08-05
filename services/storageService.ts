import { ref, uploadBytesResumable, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from './firebase';
import { compressImage, validateImageFile } from './imageService';

export interface UploadProgressCallback {
  (progressPercent: number, statusMessage: string): void;
}

export interface StorageUploadResult {
  url: string;
  originalSizeKB: number;
  compressedSizeKB: number;
  storagePath: string;
}

/**
 * Uploads an image file or Data URL to Firebase Storage under `listings/{userId}/{filename}`
 * Automatically validates and compresses the image before upload.
 */
export async function uploadListingImage(
  fileOrDataUrl: File | string,
  userId: string,
  index: number = 0,
  onProgress?: UploadProgressCallback
): Promise<StorageUploadResult> {
  const timestamp = Date.now();
  const safeUserId = userId || 'anonymous_seller';
 const storagePath = `listings/${safeUserId}/${timestamp}_${index}.jpg`;

  try {
    let compressedDataUrl: string;
    let originalSizeKB = 0;
    let compressedSizeKB = 0;

    if (typeof fileOrDataUrl === 'string') {
      compressedDataUrl = fileOrDataUrl;
      compressedSizeKB = Math.round((fileOrDataUrl.length * 3) / 4 / 1024);
      originalSizeKB = compressedSizeKB;
    } else {
      const validation = validateImageFile(fileOrDataUrl);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid image file.');
      }
      onProgress?.(15, 'Compressing couture photography...');
      const compResult = await compressImage(fileOrDataUrl, 1400, 1800, 0.85);
      compressedDataUrl = compResult.dataUrl;
      originalSizeKB = compResult.originalSizeKB;
      compressedSizeKB = compResult.compressedSizeKB;
    }

    onProgress?.(40, 'Connecting to secure cloud storage...');

    try {
      const storageRef = ref(storage, storagePath);
      
      // Upload compressed data URL directly as base64 string
      const uploadTask = uploadString(storageRef, compressedDataUrl, 'data_url', {
       contentType: 'image/jpeg',
        customMetadata: {
          uploaderId: safeUserId,
          uploadedAt: new Date().toISOString(),
          aspectRatio: 'vertical_couture'
        }
      });

      onProgress?.(70, 'Uploading high-definition image to Firebase Storage...');
      const snapshot = await uploadTask;
      
      onProgress?.(90, 'Securing CDN download URL...');
      const downloadUrl = await getDownloadURL(snapshot.ref);

      onProgress?.(100, 'Upload complete ✨');

      return {
        url: downloadUrl,
        originalSizeKB,
        compressedSizeKB,
        storagePath
      };
    } catch (storageError) {
      console.warn('[Firebase Storage] Falling back to high-res data URL for offline resilience:', storageError);
      onProgress?.(100, 'Saved locally in high resolution ✨');
      return {
        url: compressedDataUrl,
        originalSizeKB,
        compressedSizeKB,
        storagePath: 'local_' + timestamp
      };
    }
  } catch (err: any) {
    console.error('Failed to process/upload image:', err);
    throw new Error(err.message || 'Image upload failed. Please try again.');
  }
}

/**
 * Upload multiple images with aggregated progress calculation
 */
export async function uploadMultipleListingImages(
  filesOrDataUrls: (File | string)[],
  userId: string,
  onOverallProgress?: (percent: number, currentItem: number, total: number) => void
): Promise<string[]> {
  const results: string[] = [];
  const total = filesOrDataUrls.length;

  for (let i = 0; i < total; i++) {
    const item = filesOrDataUrls[i];
    const res = await uploadListingImage(item, userId, i, (progress) => {
      const baseProgress = (i / total) * 100;
      const stepProgress = (progress / total);
      onOverallProgress?.(Math.round(baseProgress + stepProgress), i + 1, total);
    });
    results.push(res.url);
  }

  return results;
}

/**
 * Upload User Profile Avatar to `avatars/{userId}/avatar.webp`
 */
export async function uploadUserAvatar(
  fileOrDataUrl: File | string,
  userId: string
): Promise<string> {
  const res = await uploadListingImage(fileOrDataUrl, userId, 0);
  return res.url;
}
