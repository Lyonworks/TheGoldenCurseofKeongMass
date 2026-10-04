'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="bg-secondary p-4 rounded text-white"
        style={{ width: '320px' }}
      >
        <h4 className="text-center mb-3">Admin Login</h4>

        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
        )}

        <input
          type="text"
          className="form-control mb-2"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn btn-warning w-100"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
