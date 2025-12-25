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

  const handleDelete = async (murmurId: number) => {
    try {
      await murmurService.delete(murmurId)
      setMurmurs(murmurs.filter((m) => m.id !== murmurId))
    } catch (err) {
      console.error('Error deleting murmur:', err)
    }
  }

  const totalPages = Math.ceil(total / 10)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2>{user.name}</h2>
        <p>@{user.username}</p>
        <p>Email: {user.email}</p>
        <p>
          Followers: {user.followers_count} | Following: {user.following_count}
        </p>
        {isAuthenticated && !isOwnProfile && (
          <button
            onClick={handleFollow}
            style={{
              backgroundColor: following ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {following ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <h3>Murmurs</h3>
      {murmurs.length === 0 ? (
        <div>No murmurs found</div>
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
