'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddNewsPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!title || !content || !author || !image) {
        setError('All fields are required')
        return
      }

      const formData = new FormData()
      formData.append('title', title)
      formData.append('content', content)
      formData.append('author', author)
      formData.append('image', image)

      const response = await fetch('/api/articles', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to add news')
        return
      }

      router.push('/admin/articles')
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
            <h1 className="mb-4">Add News</h1>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card bg-secondary p-4">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="author" className="form-label">
                  Author
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Content
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Image
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
                  {loading ? 'Adding...' : 'Add News'}
                </button>
                <Link href="/admin/articles" className="btn btn-outline-warning">
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

