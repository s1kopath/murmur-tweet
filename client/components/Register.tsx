import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const Register: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(username, password, name, email)
      navigate('/timeline')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <h1 className="text-center">Register</h1>
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
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
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
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-small text-secondary mt-1">
                Minimum 6 characters
              </p>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <p className="text-center mt-3">
            Already have an account?{' '}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
