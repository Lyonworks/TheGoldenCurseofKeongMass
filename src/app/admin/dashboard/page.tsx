'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/auth/login');
  };

  return (
    <div className="admin-dashboard p-4">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin control panel.</p>

      <div className="mt-4">
        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">News</h5>
              <p className="card-text">Manage news articles</p>
              <a href="/admin/news" className="btn btn-primary btn-sm">
                Manage
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Merchandise</h5>
              <p className="card-text">Manage products</p>
              <a href="/admin/merchandise" className="btn btn-primary btn-sm">
                Manage
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Comments</h5>
              <p className="card-text">Moderate comments</p>
              <a href="/admin/comments" className="btn btn-primary btn-sm">
                Manage
              </a>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">About</h5>
              <p className="card-text">Edit about section</p>
              <a href="/admin/about" className="btn btn-primary btn-sm">
                Edit
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
