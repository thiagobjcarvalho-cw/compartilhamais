// stores/favorites.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Institution } from '../types/interfaces'
import { mockInstitutions } from '../mock/data'

const STORAGE_KEY = 'compartilhamais_favorites'

export const useFavoritesStore = defineStore('favorites', () => {
  // State
  const favoriteIds = ref<string[]>([])
  const loading = ref<boolean>(false)

  // Computed
  const favoriteInstitutions = computed<Institution[]>(() => {
    return mockInstitutions.filter((institution) =>
      favoriteIds.value.includes(institution.id)
    )
  })

  const favoritesCount = computed<number>(() => favoriteIds.value.length)

  const isFavorite = computed(() => {
    return (institutionId: string): boolean => {
      return favoriteIds.value.includes(institutionId)
    }
  })

  // Actions
  const loadFromStorage = (): void => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        favoriteIds.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos do localStorage:', error)
      favoriteIds.value = []
    }
  }

  const saveToStorage = (): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value))
    } catch (error) {
      console.error('Erro ao salvar favoritos no localStorage:', error)
    }
  }

  const addFavorite = (institutionId: string): boolean => {
    if (!favoriteIds.value.includes(institutionId)) {
      favoriteIds.value.push(institutionId)
      saveToStorage()
      return true
    }
    return false
  }

  const removeFavorite = (institutionId: string): boolean => {
    const index = favoriteIds.value.indexOf(institutionId)
    if (index > -1) {
      favoriteIds.value.splice(index, 1)
      saveToStorage()
      return true
    }
    return false
  }

  const toggleFavorite = (institutionId: string): { added: boolean; institutionName: string } => {
    const institution = mockInstitutions.find((inst) => inst.id === institutionId)
    const institutionName = institution?.name || 'Instituição'

    if (favoriteIds.value.includes(institutionId)) {
      removeFavorite(institutionId)
      return { added: false, institutionName }
    } else {
      addFavorite(institutionId)
      return { added: true, institutionName }
    }
  }

  const clearAllFavorites = (): void => {
    favoriteIds.value = []
    saveToStorage()
  }

  const init = (): void => {
    loadFromStorage()
  }

  // Watcher para auto-save
  watch(
    favoriteIds,
    () => {
      saveToStorage()
    },
    { deep: true }
  )

  return {
    // State
    favoriteIds,
    loading,

    // Computed
    favoriteInstitutions,
    favoritesCount,
    isFavorite,

    // Actions
    loadFromStorage,
    saveToStorage,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearAllFavorites,
    init,
  }
})
