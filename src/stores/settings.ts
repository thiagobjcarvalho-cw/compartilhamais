// stores/settings.ts
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { NeedCategory } from '../types/interfaces'

const STORAGE_KEY = 'compartilhamais_settings'

export interface UserSettings {
  profile: {
    name: string
    email: string
    phone: string
    city: string
  }
  preferences: {
    categories: NeedCategory[]
    maxDistance: number
  }
  notifications: {
    newInstitutions: boolean
    urgentNeeds: boolean
    donationUpdates: boolean
    weeklyReport: boolean
  }
}

const defaultSettings: UserSettings = {
  profile: {
    name: '',
    email: '',
    phone: '',
    city: '',
  },
  preferences: {
    categories: [],
    maxDistance: 10,
  },
  notifications: {
    newInstitutions: true,
    urgentNeeds: true,
    donationUpdates: true,
    weeklyReport: false,
  },
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<UserSettings>({ ...defaultSettings })
  const loading = ref<boolean>(false)

  // Actions
  const loadFromStorage = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        settings.value = { ...defaultSettings, ...parsed }
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do localStorage:', error)
      settings.value = { ...defaultSettings }
    }
  }

  const saveToStorage = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
    } catch (error) {
      console.error('Erro ao salvar configurações no localStorage:', error)
    }
  }

  const updateProfile = (profile: Partial<UserSettings['profile']>): void => {
    settings.value.profile = { ...settings.value.profile, ...profile }
    saveToStorage()
  }

  const updatePreferences = (preferences: Partial<UserSettings['preferences']>): void => {
    settings.value.preferences = { ...settings.value.preferences, ...preferences }
    saveToStorage()
  }

  const updateNotifications = (notifications: Partial<UserSettings['notifications']>): void => {
    settings.value.notifications = { ...settings.value.notifications, ...notifications }
    saveToStorage()
  }

  const resetSettings = (): void => {
    settings.value = { ...defaultSettings }
    saveToStorage()
  }

  const exportUserData = (): string => {
    const exportData = {
      settings: settings.value,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0',
    }
    return JSON.stringify(exportData, null, 2)
  }

  const clearCache = (): void => {
    // Limpar dados de cache específicos (mantendo configurações)
    const keysToRemove = [
      'compartilhamais_cache',
      'compartilhamais_temp',
    ]
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  const init = (): void => {
    loadFromStorage()
  }

  // Auto-save quando configurações mudam
  watch(
    settings,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  return {
    // State
    settings,
    loading,

    // Actions
    loadFromStorage,
    saveToStorage,
    updateProfile,
    updatePreferences,
    updateNotifications,
    resetSettings,
    exportUserData,
    clearCache,
    init,
  }
})
