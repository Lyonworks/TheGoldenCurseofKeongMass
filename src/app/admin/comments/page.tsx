'use client';

import { useState, useEffect } from 'react';
import type { Comment } from '@/types';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      if (data.success) setComments(data.data);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter((c) => c.id_comments !== id));
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="mb-4">Manage Comments</h1>

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Message</th>
              <th>Type</th>
              <th>Created</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((c) => (
              <tr key={c.id_comments}>
                <td>{c.name}</td>
                <td>{c.message.substring(0, 50)}...</td>
                <td>{c.id_parent ? 'Reply' : 'Comment'}</td>
                <td>{new Date(c.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c.id_comments)}
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
