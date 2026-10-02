'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddMerchandisePage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [limited, setLimited] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!name || !price || !image) {
        setError('Name, price, and image are required')
        return
      }

      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock || '0')
      formData.append('limited', limited ? '1' : '0')
      formData.append('image', image)

      const response = await fetch('/api/merchandise', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to add merchandise')
        return
      }

      router.push('/admin/merchandise')
    } catch (err) {
      setError('An error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h1 className="mb-4">Add Merchandise</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card bg-secondary p-4">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">
                    Price (Rp)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="stock" className="form-label">
                    Stock
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="limited"
                  checked={limited}
                  onChange={(e) => setLimited(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="limited">
                  Mark as Limited Edition
                </label>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Product Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add Merchandise'}
                </button>
                <Link href="/admin/merchandise" className="btn btn-outline-warning">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

