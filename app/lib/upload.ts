/**
 * Image Upload Utilities
 * Handles image uploads to Supabase Storage
 */

import { createClient } from '@/utils/supabase/client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export interface UploadResult {
  url: string;
  path: string;
}

export interface UploadError {
  error: string;
}

/**
 * Validate image file
 */
export function validateImage(file: File): string | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `Datei zu groß. Maximal ${MAX_FILE_SIZE / 1024 / 1024}MB erlaubt.`;
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Ungültiger Dateityp. Nur JPG, PNG und WebP erlaubt.';
  }

  return null;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  file: File,
  bucket: 'products' | 'portfolios' | 'avatars',
  folder?: string
): Promise<UploadResult | UploadError> {
  // Validate
  const validationError = validateImage(file);
  if (validationError) {
    return { error: validationError };
  }

  try {
    const supabase = createClient();

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      // console.error('Upload error:', error);
      return { error: 'Upload fehlgeschlagen. Bitte versuche es erneut.' };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    // console.error('Upload error:', error);
    return { error: 'Ein Fehler ist aufgetreten.' };
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(
  bucket: 'products' | 'portfolios' | 'avatars',
  path: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      // console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    // console.error('Delete error:', error);
    return false;
  }
}

/**
 * Upload multiple images
 */
export async function uploadMultipleImages(
  files: File[],
  bucket: 'products' | 'portfolios' | 'avatars',
  folder?: string
): Promise<(UploadResult | UploadError)[]> {
  const uploads = files.map((file) => uploadImage(file, bucket, folder));
  return Promise.all(uploads);
}
