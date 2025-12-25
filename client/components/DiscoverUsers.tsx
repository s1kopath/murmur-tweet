import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService, User } from '../services/userService'
import { followService } from '../services/followService'
import { useAuth } from '../contexts/AuthContext'

export const DiscoverUsers: React.FC = () => {
  const { user: currentUser, isAuthenticated } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [followingStatus, setFollowingStatus] = useState<{
    [userId: number]: boolean
  }>({})
  const [loadingFollow, setLoadingFollow] = useState<{
    [userId: number]: boolean
  }>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUsers = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const allUsers = await userService.getAll()
        // Filter out current user
        const otherUsers = allUsers.filter((u) => u.id !== currentUser?.id)
        setUsers(otherUsers)

        // Load follow status for all users
        const statusMap: { [userId: number]: boolean } = {}
        if (otherUsers.length > 0) {
          await Promise.all(
            otherUsers.map(async (u) => {
              try {
                const isFollowing = await followService.getFollowStatus(u.id)
                statusMap[u.id] = isFollowing
              } catch (err) {
                statusMap[u.id] = false
              }
            }),
          )
        }
        setFollowingStatus(statusMap)
      } catch (err: any) {
        console.error('Error loading users:', err)
        setError(
          err.response?.data?.message ||
            'Failed to load users. Please try again.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [isAuthenticated, currentUser])

  const handleFollow = async (userId: number) => {
    if (!isAuthenticated) return

    setLoadingFollow({ ...loadingFollow, [userId]: true })
    try {
      const isFollowing = followingStatus[userId]
      if (isFollowing) {
        await followService.unfollow(userId)
      } else {
        await followService.follow(userId)
      }

      // Update status
      setFollowingStatus({
        ...followingStatus,
        [userId]: !isFollowing,
      })

      // Update user's follower count in the list
      setUsers(
        users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              followers_count: isFollowing
                ? u.followers_count - 1
                : u.followers_count + 1,
            }
          }
          return u
        }),
      )
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      // Sync status on error
      try {
        const followStatus = await followService.getFollowStatus(userId)
        setFollowingStatus({ ...followingStatus, [userId]: followStatus })
      } catch (syncErr) {
        // Ignore sync errors
      }
    } finally {
      setLoadingFollow({ ...loadingFollow, [userId]: false })
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1>Discover Users</h1>
        <p>Please log in to discover and follow other users.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1>Discover Users</h1>
        <div>Loading users...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Discover Users</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Follow users to see their murmurs in your timeline
      </p>
      {users.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>
            No other users found.
          </p>
        </div>
      ) : (
        <div>
          {users.map((user) => (
            <div
              key={user.id}
              style={{
                border: '1px solid #ddd',
                padding: '15px',
                marginBottom: '15px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <Link
                  to={`/users/${user.id}`}
                  style={{
                    textDecoration: 'none',
                    color: '#007bff',
                    fontWeight: 'bold',
                  }}
                >
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    @{user.username}
                  </p>
                </Link>
                <p
                  style={{ margin: '5px 0', fontSize: '0.9em', color: '#888' }}
                >
                  {user.followers_count} followers · {user.following_count}{' '}
                  following
                </p>
              </div>
              <button
                onClick={() => handleFollow(user.id)}
                disabled={loadingFollow[user.id]}
                style={{
                  backgroundColor: followingStatus[user.id]
                    ? '#6c757d'
                    : '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: loadingFollow[user.id] ? 'not-allowed' : 'pointer',
                  borderRadius: '4px',
                  minWidth: '100px',
                }}
              >
                {loadingFollow[user.id]
                  ? '...'
                  : followingStatus[user.id]
                    ? 'Unfollow'
                    : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
