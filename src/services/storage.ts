import { supabaseServer } from '@/lib/supabase/server';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 5MB limit' };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}` };
  }

  // Check extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: `Invalid file extension: .${ext}` };
  }

  return { valid: true };
}

/**
 * Generate safe filename from original
 */
export function generateSafeFilename(originalName: string): string {
  const ext = originalName.split('.').pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${ext}`;
}

/**
 * Upload image to Supabase Storage
 */
export async function uploadImage(
  bucket: string,
  file: File,
  oldPath?: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Delete old file if replacing
    if (oldPath) {
      await deleteImage(bucket, oldPath);
    }

    // Generate safe filename
    const filename = generateSafeFilename(file.name);
    const path = filename;

    // Convert File to Buffer for server-side upload
    const buffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseServer.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const { data } = supabaseServer.storage
      .from(bucket)
      .getPublicUrl(path);

    return {
      success: true,
      url: data.publicUrl,
      path: path,
    };
  } catch (error) {
    console.error('Storage error:', error);
    return {
      success: false,
      error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImage(bucket: string, path: string): Promise<void> {
  try {
    await supabaseServer.storage
      .from(bucket)
      .remove([path]);
  } catch (error) {
    console.error('Failed to delete file:', error);
    // Don't throw - allow deletion to continue even if file cleanup fails
  }
}

/**
 * Get public URL for image path
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabaseServer.storage
    .from(bucket)
    .getPublicUrl(path);
  return data.publicUrl;
}
