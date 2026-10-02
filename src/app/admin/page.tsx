'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch('/api/(auth)/logout', { method: 'POST' })
      router.push('/login')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h1>Admin Dashboard</h1>
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <div className="row g-4">
          <div className="col-md-3">
            <Link href="/admin/articles" className="text-decoration-none">
              <div className="card bg-secondary text-white h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">📰 News</h5>
                  <p className="card-text">Manage news articles</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link href="/admin/merchandise" className="text-decoration-none">
              <div className="card bg-secondary text-white h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">🛍️ Merchandise</h5>
                  <p className="card-text">Manage products</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link href="/admin/about-section" className="text-decoration-none">
              <div className="card bg-secondary text-white h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">ℹ️ About</h5>
                  <p className="card-text">Manage about section</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link href="/admin/comments" className="text-decoration-none">
              <div className="card bg-secondary text-white h-100">
                <div className="card-body text-center">
                  <h5 className="card-title">💬 Comments</h5>
                  <p className="card-text">Manage forum</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

