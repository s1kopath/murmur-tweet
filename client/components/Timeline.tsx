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
    <div className="container">
      <h1>Timeline</h1>
      {isAuthenticated && (
        <div className="card">
          <textarea
            className="form-textarea"
            value={newMurmur}
            onChange={(e) => setNewMurmur(e.target.value)}
            placeholder="What's happening?"
            maxLength={280}
            rows={4}
          />
          <div className="flex-between mt-2">
            <span className="text-small">{newMurmur.length}/280</span>
            <button
              onClick={handlePost}
              disabled={posting || !newMurmur.trim()}
              className="btn btn-primary"
            >
              {posting ? 'Posting...' : 'Post Murmur'}
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className="spinner"></div>
      ) : murmurs.length === 0 ? (
        <div className="empty-state">
          <h3>
            {isAuthenticated
              ? 'No murmurs in your timeline yet'
              : 'No murmurs found'}
          </h3>
          <p>
            {isAuthenticated
              ? 'Start posting or follow users to see their posts in your timeline!'
              : 'Be the first to post a murmur!'}
          </p>
          {isAuthenticated && (
            <Link to="/discover" className="btn btn-primary">
              Discover Users
            </Link>
          )}
        </div>
      ) : (
        <>
          {murmurs.map((murmur) => (
            <MurmurCard key={murmur.id} murmur={murmur} />
          ))}
          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              Previous
            </button>
            <span className="text-small">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
