'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Comment {
  id_comments: number
  name: string
  message: string
  created_at: string
  id_parent: number | null
  replies?: Comment[]
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/comments')
      .then((r) => r.json())
      .then((data) => setComments(data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this comment and all replies?')) return

    try {
      const response = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setComments(comments.filter((c) => c.id_comments !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const renderComment = (comment: Comment, isReply = false) => (
    <div
      key={comment.id_comments}
      className={`card bg-secondary mb-3 ${isReply ? 'ms-4' : ''}`}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="card-subtitle mb-2">
              <strong>{comment.name}</strong>
              {isReply && <span className="badge bg-info ms-2">Reply</span>}
            </h6>
            <small className="text-muted">
              {new Date(comment.created_at).toLocaleString()}
            </small>
          </div>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(comment.id_comments)}
          >
            Delete
          </button>
        </div>
        <p className="card-text mt-2">{comment.message}</p>
      </div>
    </div>
  )

  if (loading) {
    return <div className="text-center py-20">Loading...</div>
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5">
      <div className="container">
        <h1 className="mb-4">Moderate Comments</h1>

        {comments.length === 0 ? (
          <p className="text-muted">No comments yet</p>
        ) : (
          <div>
            {comments.map((comment) => (
              <div key={comment.id_comments}>
                {renderComment(comment)}
                {comment.replies &&
                  comment.replies.map((reply) => renderComment(reply, true))}
              </div>
            ))}
          </div>
        )}

        <Link href="/admin" className="btn btn-outline-warning mt-4">
          ← Back
        </Link>
      </div>
    </div>
  )
}

