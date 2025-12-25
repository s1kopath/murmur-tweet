import React from 'react'
import './ConfirmationDialog.css'

interface ConfirmationDialogProps {
  isOpen: boolean
  title: string
  message: string
  emoji?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  emoji,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  if (!isOpen) return null

  const defaultEmojis: Record<string, string> = {
    danger: '🗑️',
    warning: '⚠️',
    info: '💡',
  }

  const displayEmoji = emoji || defaultEmojis[type] || '❓'

  return (
    <div className="confirmation-overlay" onClick={onCancel}>
      <div
        className={`confirmation-dialog confirmation-${type}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirmation-emoji">{displayEmoji}</div>
        <h3 className="confirmation-title">{title}</h3>
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button
            className="btn btn-secondary confirmation-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`btn confirmation-confirm confirmation-confirm-${type}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

