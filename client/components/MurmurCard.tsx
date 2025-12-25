import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Murmur } from '../services/murmurService'
import { likeService } from '../services/likeService'
import { useAuth } from '../contexts/AuthContext'
import './MurmurCard.css'

interface MurmurCardProps {
  murmur: Murmur
  onLikeChange?: () => void
  showDelete?: boolean
  onDelete?: () => void
}

export const MurmurCard: React.FC<MurmurCardProps> = ({
  murmur,
  onLikeChange,
  showDelete = false,
  onDelete,
}) => {
  const { isAuthenticated } = useAuth()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(murmur.likes_count)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (isAuthenticated) {
        try {
          const isLiked = await likeService.getLikeStatus(murmur.id)
          setLiked(isLiked)
        } catch (err) {
          // If user is not authenticated or error occurs, keep default state
          console.error('Error checking like status:', err)
        }
      }
    }
    checkLikeStatus()
  }, [murmur.id, isAuthenticated])

  const handleLike = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    try {
      if (liked) {
        await likeService.unlike(murmur.id)
        setLiked(false)
        setLikesCount(likesCount - 1)
      } else {
        await likeService.like(murmur.id)
        setLiked(true)
        setLikesCount(likesCount + 1)
      }
      if (onLikeChange) onLikeChange()
    } catch (err: any) {
      console.error('Error toggling like:', err)
      if (err.response?.status === 400) {
        if (onLikeChange) onLikeChange()
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  return (
    <article className="card murmur-card">
      <div className="murmur-header">
        <Link to={`/users/${murmur.user.id}`} className="murmur-author">
          <strong>{murmur.user.name}</strong>
          <span className="text-secondary">@{murmur.user.username}</span>
        </Link>
        <span className="text-small murmur-date">
          {formatDate(murmur.created_at)}
        </span>
      </div>

      <Link to={`/murmurs/${murmur.id}`} className="murmur-content">
        <p>{murmur.text}</p>
      </Link>

      <div className="murmur-actions">
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || loading}
          className={`btn-like ${liked ? 'liked' : ''}`}
          aria-label={`${liked ? 'Unlike' : 'Like'} this murmur`}
        >
          <span className="like-icon">{liked ? '❤️' : '🤍'}</span>
          <span className={liked ? 'liked-count' : ''}>{likesCount}</span>
        </button>
        {showDelete && onDelete && (
          <button onClick={onDelete} className="btn btn-danger btn-sm">
            Delete
          </button>
        )}
      </div>
    </article>
  )
}
