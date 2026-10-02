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

export default function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then(({ id }) => setId(id))
  }, [params])

  useEffect(() => {
    if (!id) return

    fetch('/api/articles')
      .then((r) => r.json())
      .then((data) => {
        const found = data.find((n: News) => n.id_news === parseInt(id))
        setNews(found || null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  if (!news) {
    return (
      <div className="text-center py-20">
        <p>News not found</p>
        <Link href="/articles" className="btn btn-warning">
          Back to News
        </Link>
      </div>
    )
  }

  return (
    <section className="py-5 text-white pt-24">
      <div className="container">
        <Link href="/articles" className="btn btn-outline-warning mb-4">
          ← Back to News
        </Link>

        <article>
          <h1 className="mb-3">{news.title}</h1>
          <div className="d-flex gap-3 mb-4 text-muted">
            <span>By {news.author}</span>
            <span>
              {new Date(news.created_at).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          <img
            src={`/assets/img/articles/${news.image}`}
            className="img-fluid rounded-4 mb-4"
            alt={news.title}
            style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
          />

          <div className="lead">
            <div
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>
        </article>
      </div>
    </section>
  )
}
