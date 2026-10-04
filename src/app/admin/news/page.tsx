'use client';

import { useState, useEffect, useRef } from 'react';
import type { News } from '@/types';
import { imageSrc } from '@/lib/utils/formatters';

const EMPTY = { title: '', content: '', author: '', image: '' };

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const res = await fetch('/api/admin/news');
      const data = await res.json();
      if (data.success) {
        setNews(data.data);
      } else {
        setFormError(data.error || 'Failed to load news');
      }
    } catch (err) {
      console.error('Error loading news:', err);
      setFormError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  // Upload before saving: the row needs a URL, and letting the browser guess one
  // from the file input is how a "created" record ends up with a dead image.
  const uploadImage = async (file: File, oldPath: string | null) => {
    const body = new FormData();
    body.append('file', file);
    if (oldPath?.startsWith('http')) body.append('oldPath', oldPath);

    const res = await fetch('/api/admin/upload/news', { method: 'POST', body });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data.url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);

    try {
      let image = formData.image;

      const file = fileRef.current?.files?.[0];
      if (file) {
        image = await uploadImage(file, editingId ? formData.image : null);
      }

      const payload = { ...formData, image };
      const res = await fetch(
        editingId ? `/api/admin/news/${editingId}` : '/api/admin/news',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save news');
        return;
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(EMPTY);
      if (fileRef.current) fileRef.current.value = '';
      await loadNews();
    } catch (err) {
      console.error('Error saving news:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save news');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this news article?')) return;

    const res = await fetch(`/api/admin/news/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || 'Failed to delete news');
      return;
    }

    await loadNews();
  };

  const openForm = (item?: News) => {
    setEditingId(item ? item.id_news : null);
    setFormData(item ? { ...EMPTY, ...item } : EMPTY);
    setFormError('');
    if (fileRef.current) fileRef.current.value = '';
    setShowForm(true);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Manage News</h1>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Add News
        </button>
      </div>

      {formError && !showForm && (
        <div className="alert alert-danger" role="alert">
          {formError}
        </div>
      )}

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5>{editingId ? 'Edit' : 'Add'} News</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="news-title">Title</label>
                <input
                  id="news-title"
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="news-content">Content</label>
                <textarea
                  id="news-content"
                  className="form-control"
                  rows={5}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="news-author">Author</label>
                <input
                  id="news-author"
                  type="text"
                  className="form-control"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="news-image">Image</label>
                <input
                  id="news-image"
                  ref={fileRef}
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={imageSrc(formData.image, 'news/')}
                      alt="Current news image"
                      style={{ maxHeight: '120px' }}
                      className="rounded"
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger ps-0"
                      onClick={() => setFormData({ ...formData, image: '' })}
                    >
                      Remove image
                    </button>
                  </div>
                )}
              </div>
              {formError && (
                <div className="alert alert-danger py-2" role="alert">
                  {formError}
                </div>
              )}
              <button type="submit" className="btn btn-success" disabled={saving}>
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {news.map((n) => (
              <tr key={n.id_news}>
                <td>
                  {n.image && (
                    <img
                      src={imageSrc(n.image, 'news/')}
                      alt={n.title}
                      style={{ maxHeight: '48px' }}
                      className="rounded"
                    />
                  )}
                </td>
                <td>{n.title}</td>
                <td>{n.author}</td>
                <td>{new Date(n.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openForm(n)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(n.id_news)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
