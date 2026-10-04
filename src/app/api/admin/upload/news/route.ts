import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/supabase/auth';
import { uploadImage } from '@/services/storage';
import { STORAGE_BUCKETS } from '@/lib/utils/constants';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authorization
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const oldPath = formData.get('oldPath') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Upload to news bucket
    const result = await uploadImage(
      STORAGE_BUCKETS.NEWS,
      file,
      oldPath || undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        url: result.url,
        path: result.path,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    );
  }
}
