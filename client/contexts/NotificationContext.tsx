import React, { createContext, useContext, useState, useCallback } from 'react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  emoji?: string
  duration?: number
}

interface NotificationContextType {
  showNotification: (
    type: NotificationType,
    message: string,
    emoji?: string,
    duration?: number,
  ) => void
  notifications: Notification[]
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const showNotification = useCallback(
    (
      type: NotificationType,
      message: string,
      emoji?: string,
      duration: number = 3000,
    ) => {
      const id = Math.random().toString(36).substr(2, 9)
      const notification: Notification = {
        id,
        type,
        message,
        emoji,
        duration,
      }

      setNotifications((prev) => [...prev, notification])

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, duration)
      }
    },
    [removeNotification],
  )

  return (
    <NotificationContext.Provider
      value={{ showNotification, notifications, removeNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
