// stores/ui.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type SnackbarColor = 'success' | 'error' | 'warning' | 'info' | 'primary' | 'secondary'

export interface SnackbarOptions {
  message: string
  color?: SnackbarColor
  timeout?: number
  icon?: string
}

export const useUiStore = defineStore('ui', () => {
  // Snackbar State
  const snackbar = ref({
    show: false,
    message: '',
    color: 'info' as SnackbarColor,
    timeout: 3000,
    icon: '',
  })

  // Loading State
  const globalLoading = ref(false)
  const loadingMessage = ref('')

  // Snackbar Actions
  const showSnackbar = (options: SnackbarOptions): void => {
    snackbar.value = {
      show: true,
      message: options.message,
      color: options.color || 'info',
      timeout: options.timeout || 3000,
      icon: options.icon || getDefaultIcon(options.color || 'info'),
    }
  }

  const hideSnackbar = (): void => {
    snackbar.value.show = false
  }

  // Convenience methods
  const showSuccess = (message: string, timeout?: number): void => {
    showSnackbar({ message, color: 'success', timeout, icon: 'mdi-check-circle' })
  }

  const showError = (message: string, timeout?: number): void => {
    showSnackbar({ message, color: 'error', timeout: timeout || 5000, icon: 'mdi-alert-circle' })
  }

  const showWarning = (message: string, timeout?: number): void => {
    showSnackbar({ message, color: 'warning', timeout, icon: 'mdi-alert' })
  }

  const showInfo = (message: string, timeout?: number): void => {
    showSnackbar({ message, color: 'info', timeout, icon: 'mdi-information' })
  }

  // Loading Actions
  const setLoading = (loading: boolean, message?: string): void => {
    globalLoading.value = loading
    loadingMessage.value = message || ''
  }

  // Helper function
  const getDefaultIcon = (color: SnackbarColor): string => {
    const icons: Record<SnackbarColor, string> = {
      success: 'mdi-check-circle',
      error: 'mdi-alert-circle',
      warning: 'mdi-alert',
      info: 'mdi-information',
      primary: 'mdi-information',
      secondary: 'mdi-information',
    }
    return icons[color]
  }

  return {
    // State
    snackbar,
    globalLoading,
    loadingMessage,

    // Actions
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    setLoading,
  }
})
