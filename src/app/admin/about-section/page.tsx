'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface About {
  id: number
  description: string
}

interface AboutImage {
  id_image: number
  image: string
}

export default function AdminAboutPage() {
  const [about, setAbout] = useState<About | null>(null)
  const [images, setImages] = useState<AboutImage[]>([])
  const [description, setDescription] = useState('')
  const [newImage, setNewImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then((data) => {
        setAbout(data.about)
        setImages(data.images || [])
        setDescription(data.about?.description || '')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleUpdateDescription = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('description', description)

      const response = await fetch('/api/about', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to update')
        return
      }

      alert('Description updated successfully')
    } catch (err) {
      setError('An error occurred')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newImage) {
      setError('Please select an image')
      return
    }

    setSaving(true)

    try {
      const formData = new FormData()
      formData.append('image', newImage)

      const response = await fetch('/api/about', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to upload image')
        return
      }

      // Refresh images
      const data = await fetch('/api/about').then((r) => r.json())
      setImages(data.images || [])
      setNewImage(null)
      alert('Image added successfully')
    } catch (err) {
      setError('An error occurred')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Delete this image?')) return

    try {
      const response = await fetch(`/api/about/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setImages(images.filter((img) => img.id_image !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5">
      <div className="container">
        <h1 className="mb-4">Manage About Section</h1>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-4">
          {/* Description */}
          <div className="col-md-6">
            <div className="card bg-secondary p-4">
              <h5 className="card-title mb-3">Game Description</h5>
              <form onSubmit={handleUpdateDescription}>
                <textarea
                  className="form-control mb-3"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Description'}
                </button>
              </form>
            </div>
          </div>

          {/* Images */}
          <div className="col-md-6">
            <div className="card bg-secondary p-4">
              <h5 className="card-title mb-3">About Images</h5>

              <div className="mb-4">
                <h6>Add New Image</h6>
                <form onSubmit={handleAddImage}>
                  <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                  />
                  <button
                    type="submit"
                    className="btn btn-success btn-sm"
                    disabled={saving || !newImage}
                  >
                    {saving ? 'Uploading...' : 'Upload Image'}
                  </button>
                </form>
              </div>

              <h6>Current Images</h6>
              <div className="list-group">
                {images.map((img) => (
                  <div
                    key={img.id_image}
                    className="list-group-item bg-dark d-flex justify-content-between align-items-center"
                  >
                    <img
                      src={`/assets/img/${img.image}`}
                      alt="About"
                      style={{ maxHeight: '50px', maxWidth: '50px' }}
                    />
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteImage(img.id_image)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Link href="/admin" className="btn btn-outline-warning mt-4">
          ← Back
        </Link>
      </div>
    </div>
  )
}

