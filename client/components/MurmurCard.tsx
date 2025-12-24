import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Murmur } from '../services/murmurService';
import { likeService } from '../services/likeService';
import { useAuth } from '../contexts/AuthContext';

interface MurmurCardProps {
  murmur: Murmur;
  onLikeChange?: () => void;
  showDelete?: boolean;
  onDelete?: () => void;
}

export const MurmurCard: React.FC<MurmurCardProps> = ({
  murmur,
  onLikeChange,
  showDelete = false,
  onDelete,
}) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(murmur.likes_count);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (liked) {
        await likeService.unlike(murmur.id);
        setLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        await likeService.like(murmur.id);
        setLiked(true);
        setLikesCount(likesCount + 1);
      }
      if (onLikeChange) onLikeChange();
    } catch (err: any) {
      console.error('Error toggling like:', err);
      // If already liked/unliked, sync state
      if (err.response?.status === 400) {
        // Bad request - might be already liked/unliked
        // Try to sync by reloading
        if (onLikeChange) onLikeChange();
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '10px' }}>
        <Link to={`/users/${murmur.user.id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
          {murmur.user.name} (@{murmur.user.username})
        </Link>
        <span style={{ color: '#666', marginLeft: '10px', fontSize: '0.9em' }}>
          {formatDate(murmur.created_at)}
        </span>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <Link to={`/murmurs/${murmur.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <p style={{ margin: 0 }}>{murmur.text}</p>
        </Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          onClick={handleLike}
          disabled={!isAuthenticated || loading}
          style={{
            backgroundColor: liked ? '#ff6b6b' : 'transparent',
            border: '1px solid #ddd',
            padding: '5px 10px',
            cursor: isAuthenticated ? 'pointer' : 'not-allowed',
            borderRadius: '4px',
          }}
        >
          ❤️ {likesCount}
        </button>
        {showDelete && onDelete && (
          <button
            onClick={onDelete}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

