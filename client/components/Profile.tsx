import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userService, User } from '../services/userService'
import { murmurService, Murmur } from '../services/murmurService'
import { followService } from '../services/followService'
import { MurmurCard } from './MurmurCard'
import { useAuth } from '../contexts/AuthContext'

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user: currentUser, isAuthenticated } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [murmurs, setMurmurs] = useState<Murmur[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [following, setFollowing] = useState(false)
  const [isOwnProfile, setIsOwnProfile] = useState(false)
  const [newMurmur, setNewMurmur] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true)
      try {
        const userId = id ? parseInt(id) : currentUser?.id || 0
        const userData = await userService.getById(userId)
        setUser(userData)
        const ownProfile = currentUser?.id === userId
        setIsOwnProfile(ownProfile)

        if (isAuthenticated && !ownProfile && currentUser) {
          try {
            const followStatus = await followService.getFollowStatus(userId)
            setFollowing(followStatus)
          } catch (err) {
            // Ignore error, user might not be authenticated
          }
        }

        const murmursResponse = await murmurService.getByUserId(
          userId,
          page,
          10,
        )
        setMurmurs(murmursResponse.data)
        setTotal(murmursResponse.total)
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [id, page, currentUser, isAuthenticated])

  const handleFollow = async () => {
    if (!user) return
    try {
      if (following) {
        await followService.unfollow(user.id)
      } else {
        await followService.follow(user.id)
      }
      // Refresh user data to get accurate counts
      const updatedUser = await userService.getById(user.id)
      setUser(updatedUser)
      const followStatus = await followService.getFollowStatus(user.id)
      setFollowing(followStatus)
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      // Sync state on error
      if (user) {
        try {
          const followStatus = await followService.getFollowStatus(user.id)
          setFollowing(followStatus)
        } catch (syncErr) {
          // Ignore sync errors
        }
      }
    }
  }

  const handlePost = async () => {
    if (!newMurmur.trim() || !isAuthenticated || !isOwnProfile) return
    setPosting(true)
    try {
      await murmurService.create({ text: newMurmur })
      setNewMurmur('')
      // Reload murmurs to show the new post
      const userId = id ? parseInt(id) : currentUser?.id || 0
      const murmursResponse = await murmurService.getByUserId(userId, page, 10)
      setMurmurs(murmursResponse.data)
      setTotal(murmursResponse.total)
    } catch (err) {
      console.error('Error posting murmur:', err)
    } finally {
      setPosting(false)
    }
  }

  const handleDelete = async (murmurId: number) => {
    try {
      await murmurService.delete(murmurId)
      setMurmurs(murmurs.filter((m) => m.id !== murmurId))
      setTotal(total - 1)
    } catch (err) {
      console.error('Error deleting murmur:', err)
    }
  }

  const totalPages = Math.ceil(total / 10)

  if (loading) {
    return (
      <div className="container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>User not found</h3>
          <p>The user you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card profile-header">
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="text-secondary">@{user.username}</p>
          <p className="text-secondary text-small mt-1">{user.email}</p>
          <div className="profile-stats mt-2">
            <span>
              <strong>{user.followers_count}</strong>{' '}
              <span className="text-secondary">Followers</span>
            </span>
            <span>
              <strong>{user.following_count}</strong>{' '}
              <span className="text-secondary">Following</span>
            </span>
          </div>
        </div>
        {isAuthenticated && !isOwnProfile && (
          <button
            onClick={handleFollow}
            className={`btn ${following ? 'btn-secondary' : 'btn-primary'}`}
          >
            {following ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      {isOwnProfile && isAuthenticated && (
        <div className="card mt-3">
          <textarea
            className="form-textarea"
            value={newMurmur}
            onChange={(e) => setNewMurmur(e.target.value)}
            placeholder="What's on your mind?"
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
      <h3 className="mt-3">Murmurs</h3>
      {murmurs.length === 0 ? (
        <div className="empty-state">
          <p>No murmurs found</p>
        </div>
      ) : (
        <>
          {murmurs.map((murmur) => (
            <MurmurCard
              key={murmur.id}
              murmur={murmur}
              showDelete={isOwnProfile}
              onDelete={() => handleDelete(murmur.id)}
            />
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
