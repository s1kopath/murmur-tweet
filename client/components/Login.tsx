import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/timeline')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1 className="text-center">Login</h1>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-center mt-3">
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
