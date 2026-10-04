'use client';

import { useState, useEffect, useRef } from 'react';
import type { AboutImage } from '@/types';
import { imageSrc } from '@/lib/utils/formatters';

export default function AdminAboutPage() {
  const [aboutId, setAboutId] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<AboutImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aboutRes, imagesRes] = await Promise.all([
        fetch('/api/admin/about'),
        fetch('/api/admin/about/images'),
      ]);
      const aboutData = await aboutRes.json();
      const imagesData = await imagesRes.json();

      if (aboutData.success) {
        setDescription(aboutData.data?.description || '');
        setAboutId(aboutData.data?.id_about ?? null);
      } else {
        setFormError(aboutData.error || 'Failed to load about');
      }
      if (imagesData.success) {
        setImages(imagesData.data);
      } else {
        setFormError(imagesData.error || 'Failed to load about images');
      }
    } catch (err) {
      console.error('Error loading about:', err);
      setFormError('Failed to load about');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      // The about table is a single-row table keyed on id_about 1; the PUT
      // endpoint updates that row rather than inserting a second one.
      const res = await fetch('/api/admin/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, id: aboutId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save about');
        return;
      }
    } catch (err) {
      console.error('Error saving about:', err);
      setFormError('Failed to save about');
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setFormError('Choose an image first');
      return;
    }

    setFormError('');
    setUploading(true);

    try {
      const body = new FormData();
      body.append('file', file);

      const res = await fetch('/api/admin/upload/about', { method: 'POST', body });
      const uploadData = await res.json();
      if (!res.ok) throw new Error(uploadData.error || 'Upload failed');

      const saveRes = await fetch('/api/admin/about/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: uploadData.url }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || 'Failed to save image');

      if (fileRef.current) fileRef.current.value = '';
      const list = await (await fetch('/api/admin/about/images')).json();
      if (list.success) setImages(list.data);
    } catch (err) {
      console.error('Error uploading about image:', err);
      setFormError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Delete this image?')) return;

    const res = await fetch(`/api/admin/about/images?id=${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || 'Failed to delete image');
      return;
    }

    setImages(images.filter((img) => img.id_image !== id));
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Manage About</h1>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="mb-3">
              <label className="form-label" htmlFor="about-description">
                About Description
              </label>
              <textarea
                id="about-description"
                className="form-control"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {formError && (
              <div className="alert alert-danger py-2" role="alert">
                {formError}
              </div>
            )}
            <button type="submit" className="btn btn-success" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>

      <h3 className="mt-5 mb-3">About Images</h3>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="about-image-file">
              Upload New Image
            </label>
            <input
              id="about-image-file"
              ref={fileRef}
              type="file"
              className="form-control"
              accept="image/jpeg,image/png,image/webp,image/gif"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>

          <div className="table-responsive mt-4">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Image</th>
                  <th style={{ width: '100px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {images.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center text-muted">
                      No images yet
                    </td>
                  </tr>
                ) : (
                  images.map((img) => (
                    <tr key={img.id_image}>
                      <td>
                        <img
                          src={imageSrc(img.image, 'about/')}
                          alt={`About image ${img.id_image}`}
                          style={{ maxHeight: '64px' }}
                          className="rounded"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteImage(img.id_image)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
