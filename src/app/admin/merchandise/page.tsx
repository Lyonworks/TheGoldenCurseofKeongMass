'use client';

import { useState, useEffect, useRef } from 'react';
import type { Merchandise } from '@/types';
import { imageSrc } from '@/lib/utils/formatters';

const EMPTY = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  limited: false,
  image: '',
};

export default function AdminMerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMerchandise();
  }, []);

  const loadMerchandise = async () => {
    try {
      const res = await fetch('/api/admin/merchandise');
      const data = await res.json();
      if (data.success) {
        setMerchandise(data.data);
      } else {
        setFormError(data.error || 'Failed to load merchandise');
      }
    } catch (err) {
      console.error('Error loading merchandise:', err);
      setFormError('Failed to load merchandise');
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

    const res = await fetch('/api/admin/upload/merchandise', { method: 'POST', body });
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

      const res = await fetch(
        editingId ? `/api/admin/merchandise/${editingId}` : '/api/admin/merchandise',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, image }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to save merchandise');
        return;
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(EMPTY);
      if (fileRef.current) fileRef.current.value = '';
      await loadMerchandise();
    } catch (err) {
      console.error('Error saving merchandise:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save merchandise');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this merchandise?')) return;

    const res = await fetch(`/api/admin/merchandise/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || 'Failed to delete merchandise');
      return;
    }

    await loadMerchandise();
  };

  const openForm = (item?: Merchandise) => {
    setEditingId(item ? item.id : null);
    setFormData(
      item
        ? {
            name: item.name,
            description: item.description || '',
            price: item.price,
            stock: item.stock,
            limited: item.limited,
            image: item.image || '',
          }
        : EMPTY
    );
    setFormError('');
    if (fileRef.current) fileRef.current.value = '';
    setShowForm(true);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Manage Merchandise</h1>
        <button className="btn btn-primary" onClick={() => openForm()}>
          + Add Merchandise
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
            <h5>{editingId ? 'Edit' : 'Add'} Merchandise</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="merch-name">Name</label>
                <input
                  id="merch-name"
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="merch-description">Description</label>
                <textarea
                  id="merch-description"
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="merch-price">Price (IDR)</label>
                  <input
                    id="merch-price"
                    type="number"
                    className="form-control"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label" htmlFor="merch-stock">Stock</label>
                  <input
                    id="merch-stock"
                    type="number"
                    className="form-control"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="limited"
                    checked={formData.limited}
                    onChange={(e) =>
                      setFormData({ ...formData, limited: e.target.checked })
                    }
                  />
                  <label className="form-check-label" htmlFor="limited">
                    Limited Edition
                  </label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="merch-image">Image</label>
                <input
                  id="merch-image"
                  ref={fileRef}
                  type="file"
                  className="form-control"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                />
                {formData.image && (
                  <div className="mt-2">
                    <img
                      src={imageSrc(formData.image, 'merchandise/')}
                      alt="Current merchandise image"
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
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Limited</th>
              <th style={{ width: '120px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchandise.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.image && (
                    <img
                      src={imageSrc(m.image, 'merchandise/')}
                      alt={m.name}
                      style={{ maxHeight: '48px' }}
                      className="rounded"
                    />
                  )}
                </td>
                <td>{m.name}</td>
                <td>Rp {m.price.toLocaleString('id-ID')}</td>
                <td>{m.stock}</td>
                <td>{m.limited ? '✓' : '✗'}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openForm(m)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(m.id)}
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
