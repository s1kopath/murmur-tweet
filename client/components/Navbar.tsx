import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/timeline" className="navbar-brand">
          <img
            src="/favicon.svg"
            alt="Murmur Ghost"
            className="navbar-logo"
            width="32"
            height="32"
          />
          <span>Murmur</span>
        </Link>

        {isAuthenticated && (
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}

        <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link
                to="/timeline"
                className={`navbar-link ${isActive('/timeline') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Timeline
              </Link>
              <Link
                to="/discover"
                className={`navbar-link ${isActive('/discover') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Discover
              </Link>
              <Link
                to={`/users/${user?.id}`}
                className={`navbar-link ${location.pathname === `/users/${user?.id}` ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <span className="navbar-welcome">Welcome, {user?.name}</span>
              <button onClick={logout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
