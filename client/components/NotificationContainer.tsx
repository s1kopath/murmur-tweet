import React from 'react'
import { useNotification, Notification } from '../contexts/NotificationContext'
import './NotificationContainer.css'

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const { removeNotification } = useNotification()
  const { type, message, emoji, id } = notification

  // Default emojis based on type if not provided
  const defaultEmojis: Record<string, string> = {
    success: '✨',
    error: '😅',
    info: '💡',
    warning: '⚠️',
  }

  const displayEmoji = emoji || defaultEmojis[type] || '📢'

  const handleClick = () => {
    removeNotification(id)
  }

  return (
    <div className={`notification notification-${type}`} onClick={handleClick}>
      <div className="notification-content">
        <span className="notification-emoji">{displayEmoji}</span>
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" aria-label="Close notification">
        ×
      </button>
    </div>
  )
}

export const NotificationContainer: React.FC = () => {
  const { notifications } = useNotification()

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  )
}
