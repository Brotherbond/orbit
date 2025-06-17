// SweetAlert-like notification system
export type NotificationType = "success" | "error" | "warning" | "info"

export interface NotificationOptions {
  title?: string
  message: string
  type: NotificationType
  duration?: number
  showConfirmButton?: boolean
  confirmButtonText?: string
  onConfirm?: () => void
}

export const showNotification = (options: NotificationOptions) => {
  // In a real implementation, this would use a proper notification library
  // For now, we'll use the browser's alert/confirm

  const { title, message, type, showConfirmButton = false, confirmButtonText = "OK", onConfirm } = options

  const fullMessage = title ? `${title}\n\n${message}` : message

  if (showConfirmButton) {
    const confirmed = confirm(fullMessage)
    if (confirmed && onConfirm) {
      onConfirm()
    }
    return confirmed
  } else {
    alert(fullMessage)
    return true
  }
}

// Convenience methods
export const showSuccess = (message: string, title?: string) => {
  showNotification({ type: "success", message, title })
}

export const showError = (message: string, title?: string) => {
  showNotification({ type: "error", message, title })
}

export const showWarning = (message: string, title?: string) => {
  showNotification({ type: "warning", message, title })
}

export const showInfo = (message: string, title?: string) => {
  showNotification({ type: "info", message, title })
}

export const showConfirm = (message: string, onConfirm: () => void, title?: string) => {
  return showNotification({
    type: "warning",
    message,
    title,
    showConfirmButton: true,
    onConfirm,
  })
}
