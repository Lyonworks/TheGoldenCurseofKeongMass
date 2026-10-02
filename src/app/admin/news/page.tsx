'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface News {
  id_news: number
  title: string
  content: string
  author: string
  image: string
  created_at: string
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/articles')
      .then((r) => r.json())
      .then((data) => {
        setNews(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this news?')) return

    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNews(news.filter((n) => n.id_news !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Manage News</h1>
          <Link href="/admin/articles/add" className="btn btn-success">
            + Add News
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {news.map((n) => (
                  <tr key={n.id_news}>
                    <td>{n.title}</td>
                    <td>{n.author}</td>
                    <td>
                      {new Date(n.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        href={`/admin/articles/${n.id_news}`}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Edit
                      </Link>
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
        )}

        <Link href="/admin" className="btn btn-outline-warning mt-4">
          ← Back
        </Link>
      </div>
    </div>
  )
}

