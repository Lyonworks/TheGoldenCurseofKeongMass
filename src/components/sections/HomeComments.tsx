'use client';

import { useEffect, useRef, useState } from 'react';
import type { Comment } from '@/types';
import { getParentComments, getCommentReplies } from '@/services/comments';
import { formatDate } from '@/lib/utils/formatters';

export function HomeComments() {
  const [parentComments, setParentComments] = useState<Comment[]>([]);
  const [repliesMap, setRepliesMap] = useState<{ [key: number]: Comment[] }>({});
  const [ownedCommentIds, setOwnedCommentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Initialize user token via server API
    // Token is stored in secure HTTP-only cookie by the server
    const initToken = async () => {
      try {
        await fetch('/api/user-token', { method: 'GET' });
      } catch (error) {
        console.error('Error initializing user token:', error);
      }
    };

    initToken();
  }, []);

  const loadComments = async () => {
    const parents = await getParentComments();
    setParentComments(parents);

    // Load replies for each parent comment
    const replies: { [key: number]: Comment[] } = {};
    for (const parent of parents) {
      replies[parent.id_comments] = await getCommentReplies(parent.id_comments);
    }
    setRepliesMap(replies);
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, []);

  // aos.css hides every [data-aos] node until AOS observes it, and AOS.init()
  // runs once from the root layout. Comments rendered after that — a reply just
  // posted, a list reloaded — are never observed, so they stay invisible until
  // a page refresh re-runs prepare(). refreshHard() re-collects the elements.
  // This must be its own effect: a state update inside loadComments has not
  // reached the DOM yet, so the new nodes would not exist to be scanned.
  useEffect(() => {
    (window as Window & { AOS?: { refreshHard: () => void } }).AOS?.refreshHard();
  }, [parentComments, repliesMap]);

  useEffect(() => {
    // Fetch list of comment IDs owned by current user
    const checkOwnership = async () => {
      try {
        const res = await fetch('/api/comments/ownership');
        const data = await res.json();
        if (data.success) {
          setOwnedCommentIds(data.ownedCommentIds);
        }
      } catch (error) {
        console.error('Error checking comment ownership:', error);
      }
    };

    checkOwnership();
  }, []);

  const refreshOwnership = async () => {
    const res = await fetch('/api/comments/ownership');
    const data = await res.json();
    if (data.success) setOwnedCommentIds(data.ownedCommentIds);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || 'Failed to post comment');
        return;
      }

      form.reset();
      setReplyTo(null);
      await loadComments();
      await refreshOwnership();
    } catch (error) {
      console.error('Error posting comment:', error);
      setFormError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this comment?')) return;

    const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || 'Failed to delete comment');
      return;
    }

    if (editing === id) setEditing(null);
    await loadComments();
    await refreshOwnership();
  };

  const startEdit = (comment: Comment) => {
    setEditing(comment.id_comments);
    setEditText(comment.message);
    setReplyTo(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditText('');
  };

  const handleEdit = async (id: number) => {
    const message = editText.trim();
    if (!message) {
      setFormError('Message required');
      return;
    }

    setFormError('');
    const res = await fetch(`/api/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    if (!res.ok) {
      setFormError(data.error || 'Failed to update comment');
      return;
    }

    cancelEdit();
    await loadComments();
  };

  const startReply = (comment: Comment) => {
    setReplyTo({ id: comment.id_comments, name: comment.name });
    setEditing(null);
    setEditText('');
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  if (loading) {
    return (
      <section id="comment" className="py-5 bg-dark text-white">
        <div className="container">
          <h2 className="text-center mb-4">FORUM</h2>
          <p className="text-center">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="comment" className="py-5 bg-dark text-white">
      <div className="container">
        <h2 className="text-center mb-4" data-aos="fade-up">
          FORUM
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} data-aos="fade-up" className="mb-4">
          <input
            type="hidden"
            name="id_parent"
            value={replyTo === null ? '' : String(replyTo.id)}
          />
          {replyTo !== null && (
            <div className="alert alert-warning py-2 d-flex justify-content-between align-items-center">
              <span>Replying to {replyTo.name}</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-dark"
                onClick={cancelReply}
              >
                Cancel
              </button>
            </div>
          )}
          <input
            type="text"
            name="name"
            className="form-control mb-2"
            placeholder="Name"
            required
          />
          <textarea
            name="message"
            className="form-control mb-2"
            placeholder="Comment"
            required
          ></textarea>
          {formError && (
            <div className="alert alert-danger py-2" role="alert">
              {formError}
            </div>
          )}
          <button type="submit" className="btn btn-warning" disabled={submitting}>
            {submitting ? 'Posting...' : 'Submit'}
          </button>
        </form>

        <hr />

        <div className="comment-list">
          {parentComments.length > 0 ? (
            parentComments.map((comment) => (
              <div
                key={comment.id_comments}
                className="comment-box mb-3 p-3 rounded bg-secondary"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="d-flex align-items-center gap-2 mb-1">
                  <strong>{comment.name}</strong>
                  <small className="text-light opacity-75">
                    {formatDate(comment.created_at, 'full')}
                  </small>
                </div>

                <p className="comment-text">{comment.message}</p>

                {editing === comment.id_comments ? (
                  <div className="mt-2">
                    <textarea
                      className="form-control mb-2"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                    />
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(comment.id_comments)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-light btn-sm"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex gap-3">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-warning text-decoration-none reply-btn"
                      onClick={() => startReply(comment)}
                    >
                      Reply
                    </button>
                    {ownedCommentIds.includes(comment.id_comments) && (
                      <>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-warning text-decoration-none edit-btn"
                          onClick={() => startEdit(comment)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-link p-0 text-warning text-decoration-none"
                          onClick={() => handleDelete(comment.id_comments)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Replies */}
                {repliesMap[comment.id_comments]?.length > 0 && (
                  <div className="reply-list mt-3">
                    {repliesMap[comment.id_comments].map((reply) => (
                      <div
                        key={reply.id_comments}
                        className="reply-box ms-4 mt-3"
                        data-aos="fade-left"
                      >
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <strong>{reply.name}</strong>
                          <small className="text-light opacity-75">
                            {formatDate(reply.created_at, 'full')}
                          </small>
                        </div>
                        <p className="comment-text">{reply.message}</p>

                        {editing === reply.id_comments ? (
                          <div className="mt-2">
                            <textarea
                              className="form-control mb-2"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              rows={3}
                            />
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-warning btn-sm"
                                onClick={() => handleEdit(reply.id_comments)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-light btn-sm"
                                onClick={cancelEdit}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          ownedCommentIds.includes(reply.id_comments) && (
                            <div className="d-flex gap-3">
                              <button
                                type="button"
                                className="btn btn-link p-0 text-warning text-decoration-none edit-btn"
                                onClick={() => startEdit(reply)}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-link p-0 text-warning text-decoration-none"
                                onClick={() => handleDelete(reply.id_comments)}
                              >
                                Delete
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center opacity-75">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </section>
  );
}
