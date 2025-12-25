import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MurmurCard } from './MurmurCard'
import { murmurService, Murmur } from '../services/murmurService'
import { useAuth } from '../contexts/AuthContext'

export const Timeline: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [murmurs, setMurmurs] = useState<Murmur[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [newMurmur, setNewMurmur] = useState('')
  const [posting, setPosting] = useState(false)

  const loadMurmurs = async () => {
    setLoading(true)
    try {
      const response = isAuthenticated
        ? await murmurService.getTimeline(page, 10)
        : await murmurService.getAll(page, 10)
      setMurmurs(response.data)
      setTotal(response.total)
    } catch (err) {
      console.error('Error loading murmurs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMurmurs()
  }, [page, isAuthenticated])

  const handlePost = async () => {
    if (!newMurmur.trim() || !isAuthenticated) return
    setPosting(true)
    try {
      await murmurService.create({ text: newMurmur })
      setNewMurmur('')
      loadMurmurs()
    } catch (err) {
      console.error('Error posting murmur:', err)
    } finally {
      setPosting(false)
    }
  }

  const totalPages = Math.ceil(total / 10)

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Timeline</h1>
      {isAuthenticated && (
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <textarea
            value={newMurmur}
            onChange={(e) => setNewMurmur(e.target.value)}
            placeholder="What's happening?"
            maxLength={280}
            rows={3}
            style={{
              width: '100%',
              padding: '8px',
              boxSizing: 'border-box',
              marginBottom: '10px',
            }}
          />
          <button
            onClick={handlePost}
            disabled={posting || !newMurmur.trim()}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              cursor: posting ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
            }}
          >
            {posting ? 'Posting...' : 'Post Murmur'}
          </button>
        </div>
      )}
      {loading ? (
        <div>Loading...</div>
      ) : murmurs.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>
            {isAuthenticated
              ? 'No murmurs in your timeline yet. Follow users to see their posts!'
              : 'No murmurs found'}
          </p>
          {isAuthenticated && (
            <Link
              to="/discover"
              style={{
                color: '#007bff',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Discover Users →
            </Link>
          )}
        </div>
      ) : (
        <>
          {murmurs.map((murmur) => (
            <MurmurCard
              key={murmur.id}
              murmur={murmur}
              onLikeChange={loadMurmurs}
            />
          ))}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              style={{
                padding: '8px 16px',
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
