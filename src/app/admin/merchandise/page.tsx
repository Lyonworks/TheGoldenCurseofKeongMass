'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Merchandise {
  id: number
  name: string
  price: number
  stock: number
  limited: number
  image: string
}

export default function AdminMerchandisePage() {
  const [merchandise, setMerchandise] = useState<Merchandise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/merchandise')
      .then((r) => r.json())
      .then((data) => setMerchandise(data))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this merchandise?')) return

    try {
      const response = await fetch(`/api/merchandise/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMerchandise(merchandise.filter((m) => m.id !== id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-vh-100 bg-dark text-white pt-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Manage Merchandise</h1>
          <Link href="/admin/merchandise/add" className="btn btn-success">
            + Add Product
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Limited</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchandise.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>Rp {m.price.toLocaleString()}</td>
                    <td>{m.stock}</td>
                    <td>{m.limited ? 'Yes' : 'No'}</td>
                    <td>
                      <Link
                        href={`/admin/merchandise/${m.id}`}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(m.id)}
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

