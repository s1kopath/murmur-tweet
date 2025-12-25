import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { userService, User } from '../services/userService'
import { followService } from '../services/followService'
import { ConfirmationDialog } from './ConfirmationDialog'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'

export const DiscoverUsers: React.FC = () => {
  const { user: currentUser, isAuthenticated } = useAuth()
  const { showNotification } = useNotification()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [followingStatus, setFollowingStatus] = useState<{
    [userId: number]: boolean
  }>({})
  const [loadingFollow, setLoadingFollow] = useState<{
    [userId: number]: boolean
  }>({})
  const [error, setError] = useState<string | null>(null)
  const [unfollowConfirm, setUnfollowConfirm] = useState<{
    isOpen: boolean
    userId: number | null
    userName: string | null
  }>({ isOpen: false, userId: null, userName: null })

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

    const isFollowing = followingStatus[userId]
    const user = users.find((u) => u.id === userId)

    // If unfollowing, show confirmation
    if (isFollowing) {
      setUnfollowConfirm({
        isOpen: true,
        userId,
        userName: user?.name || 'user',
      })
      return
    }

    // Direct follow (no confirmation needed)
    setLoadingFollow({ ...loadingFollow, [userId]: true })
    try {
      await followService.follow(userId)
      showNotification(
        'success',
        `Now following ${user?.name || 'user'}! 🎉`,
        '🎉',
        3000,
      )

      // Update status
      setFollowingStatus({
        ...followingStatus,
        [userId]: true,
      })

      // Update user's follower count in the list
      setUsers(
        users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              followers_count: u.followers_count + 1,
            }
          }
          return u
        }),
      )
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      showNotification('error', 'Failed to update follow status', '😅', 3000)
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

  const confirmUnfollow = async () => {
    if (!unfollowConfirm.userId) return
    const userId = unfollowConfirm.userId
    const userName = unfollowConfirm.userName
    setUnfollowConfirm({ isOpen: false, userId: null, userName: null })

    setLoadingFollow({ ...loadingFollow, [userId]: true })
    try {
      await followService.unfollow(userId)
      showNotification('info', `Unfollowed ${userName}`, '👋', 2500)

      // Update status
      setFollowingStatus({
        ...followingStatus,
        [userId]: false,
      })

      // Update user's follower count in the list
      setUsers(
        users.map((u) => {
          if (u.id === userId) {
            return {
              ...u,
              followers_count: u.followers_count - 1,
            }
          }
          return u
        }),
      )
    } catch (err: any) {
      console.error('Error toggling follow:', err)
      showNotification('error', 'Failed to update follow status', '😅', 3000)
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
      <div className="container">
        <div className="empty-state">
          <h3>Discover Users</h3>
          <p>Please log in to discover and follow other users.</p>
          <Link to="/login" className="btn btn-primary mt-2">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container">
        <h1>Discover Users</h1>
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="container">
      <ConfirmationDialog
        isOpen={unfollowConfirm.isOpen}
        title="Unfollow User?"
        message={`Are you sure you want to unfollow ${unfollowConfirm.userName}? You will no longer see their posts in your timeline.`}
        emoji="👋"
        confirmText="Unfollow"
        cancelText="Cancel"
        type="warning"
        onConfirm={confirmUnfollow}
        onCancel={() =>
          setUnfollowConfirm({ isOpen: false, userId: null, userName: null })
        }
      />
      <h1>Discover Users</h1>
      <p className="text-secondary mb-3">
        Follow users to see their murmurs in your timeline
      </p>
      {error && (
        <div
          className="card"
          style={{ backgroundColor: '#fee', borderColor: '#fcc' }}
        >
          <p className="error-message">{error}</p>
        </div>
      )}
      {users.length === 0 ? (
        <div className="empty-state">
          <p>No other users found.</p>
          <p className="text-secondary text-small mt-1">
            Register new accounts to follow other users, or ask others to
            register and join the platform.
          </p>
        </div>
      ) : (
        <div>
          {users.map((user) => (
            <div key={user.id} className="card user-card">
              <div className="user-info">
                <Link to={`/users/${user.id}`} className="user-link">
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <p className="text-secondary text-small mt-1">
                    @{user.username}
                  </p>
                </Link>
                <p className="text-small mt-2">
                  <strong>{user.followers_count}</strong> followers ·{' '}
                  <strong>{user.following_count}</strong> following
                </p>
              </div>
              <button
                onClick={() => handleFollow(user.id)}
                disabled={loadingFollow[user.id]}
                className={`btn btn-sm ${
                  followingStatus[user.id] ? 'btn-secondary' : 'btn-primary'
                }`}
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
