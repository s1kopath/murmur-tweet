import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{ borderBottom: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/timeline" style={{ textDecoration: 'none', color: '#007bff', fontSize: '1.5em', fontWeight: 'bold' }}>
            Murmur
          </Link>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/timeline">Timeline</Link>
              <Link to={`/users/${user?.id}`}>My Profile</Link>
              <span>Welcome, {user?.name}</span>
              <button
                onClick={logout}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

