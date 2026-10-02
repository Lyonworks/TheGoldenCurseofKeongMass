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

export default function NewsPage() {
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

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <section className="py-5 text-white pt-24">
      <div className="container">
        <h1 className="text-center mb-4">NEWS</h1>
        <div className="row g-4">
          {news.map((n) => (
            <div key={n.id_news} className="col-lg-4 col-md-6 col-12">
              <Link
                href={`/articles/${n.id_news}`}
                className="text-decoration-none text-white"
              >
                <div className="card h-100 border-0 news-card">
                  <img
                    src={`/assets/img/articles/${n.image}`}
                    className="card-img-top"
                    alt={n.title}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{n.title}</h5>
                      <small className="opacity-80 text-nowrap ms-2">
                        {new Date(n.created_at).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </small>
                    </div>
                    <p className="card-text text-dark opacity-75">
                      {n.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                    </p>
                    <small className="text-muted">By {n.author}</small>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

