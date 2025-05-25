import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Donor, DonorPreferences } from '../types/interfaces'
import { mockDonor } from '../mock/data'

export const useDonorStore = defineStore('donor', () => {
  // State
  const currentDonor = ref<Donor | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const init = async () => {
    loading.value = true
    error.value = null

    try {
      // Simula carregamento do perfil do doador
      await new Promise((resolve) => setTimeout(resolve, 300))
      currentDonor.value = mockDonor
    } catch (err) {
      error.value = 'Erro ao carregar perfil do doador'
      console.error('Erro ao carregar doador:', err)
    } finally {
      loading.value = false
    }
  }

  const updatePreferences = (preferences: Partial<DonorPreferences>) => {
    if (currentDonor.value) {
      currentDonor.value.preferences = {
        ...currentDonor.value.preferences,
        ...preferences,
      }
    }
  }

  const updateProfile = (profileData: Partial<Donor>) => {
    if (currentDonor.value) {
      currentDonor.value = {
        ...currentDonor.value,
        ...profileData,
      }
    }
  }

  return {
    // State
    currentDonor,
    loading,
    error,

    // Actions
    init,
    updatePreferences,
    updateProfile,
  }
})
