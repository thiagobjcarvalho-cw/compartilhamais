// stores/institutions.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Institution,
  InstitutionFilters,
  MapPin,
  Need,
  UrgentNeedItem,
  UrgencyLevel,
  NeedCategory,
  InstitutionType,
  InstitutionStats,
} from '../types/interfaces'
import { UrgencyLevel as UrgencyLevelEnum } from '../types/interfaces'
import { mockInstitutions, filterInstitutions } from '../mock/data'

export const useInstitutionsStore = defineStore('institutions', () => {
  // State tipado seguindo padrão enterprise
  const institutions = ref<Institution[]>([])
  const selectedInstitution = ref<Institution | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Filters - ✅ CORREÇÃO: Estrutura corrigida seguindo interface atualizada
  const filters = ref<InstitutionFilters>({
    search: '',
    type: undefined,
    needCategory: undefined,
    urgency: undefined, // ✅ CORRIGIDO: Valor único, não array
    maxDistance: 10,
    verified: undefined,
    hasUrgentNeeds: undefined,
    // Campos de arrays para múltipla seleção
    categories: [],
    types: [],
    urgencyLevels: [],
  })

  const userLocation = ref<{ lat: number; lng: number } | null>(null)

  // Getters com tipagem forte enterprise
  const filteredInstitutions = computed<Institution[]>(() => {
    return filterInstitutions(filters.value)
  })

  // ✅ CORREÇÃO: MapPin tipado corretamente seguindo interface
  const mapPins = computed<MapPin[]>(() => {
    return filteredInstitutions.value.map(
      (institution): MapPin => ({
        id: institution.id,
        institution,
        position: {
          lat: institution.location.latitude,
          lng: institution.location.longitude,
        },
      }),
    )
  })

  const institutionsByDistance = computed<Institution[]>(() => {
    return [...filteredInstitutions.value].sort(
      (a, b) => (a.location.distance || 999) - (b.location.distance || 999),
    )
  })

  const nearbyInstitutions = computed<Institution[]>(() => {
    return filteredInstitutions.value.filter(
      (institution) => (institution.location.distance || 0) <= 2,
    )
  })

  // ✅ CORREÇÃO: Tipagem forte eliminando 'any' completamente
  const urgentNeeds = computed<UrgentNeedItem[]>(() => {
    const urgent: UrgentNeedItem[] = []

    filteredInstitutions.value.forEach((institution) => {
      institution.needs
        .filter(
          (need: Need) =>
            need.urgency === UrgencyLevelEnum.CRITICAL || need.urgency === UrgencyLevelEnum.HIGH,
        )
        .forEach((need: Need) => {
          urgent.push({ institution, need })
        })
    })

    // ✅ CORREÇÃO: Mapeamento tipado para ordenação com Record type
    return urgent.sort((a, b) => {
      const urgencyOrder: Record<UrgencyLevel, number> = {
        [UrgencyLevelEnum.CRITICAL]: 4,
        [UrgencyLevelEnum.HIGH]: 3,
        [UrgencyLevelEnum.MEDIUM]: 2,
        [UrgencyLevelEnum.LOW]: 1,
      }
      return urgencyOrder[b.need.urgency] - urgencyOrder[a.need.urgency]
    })
  })

  const totalInstitutions = computed<number>(() => institutions.value.length)

  const verifiedInstitutions = computed<Institution[]>(() =>
    filteredInstitutions.value.filter((institution) => institution.verified),
  )

  const institutionsWithUrgentNeeds = computed<Institution[]>(() =>
    filteredInstitutions.value.filter((institution) =>
      institution.needs.some(
        (need) =>
          need.urgency === UrgencyLevelEnum.CRITICAL || need.urgency === UrgencyLevelEnum.HIGH,
      ),
    ),
  )

  // Actions com tipagem forte e error handling robusto
  const fetchInstitutions = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      // Simula API call com delay realista
      await new Promise((resolve) => setTimeout(resolve, 500))
      institutions.value = mockInstitutions
    } catch (err) {
      error.value = 'Erro ao carregar instituições'
      console.error('Erro ao buscar instituições:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchInstitutionById = async (id: string): Promise<Institution | null> => {
    loading.value = true
    error.value = null

    try {
      // Simula API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      const institution = mockInstitutions.find((inst) => inst.id === id)

      if (institution) {
        selectedInstitution.value = institution
        return institution
      } else {
        error.value = 'Instituição não encontrada'
        return null
      }
    } catch (err) {
      error.value = 'Erro ao carregar instituição'
      console.error('Erro ao buscar instituição:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateFilters = (newFilters: Partial<InstitutionFilters>): void => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = (): void => {
    filters.value = {
      search: '',
      type: undefined,
      needCategory: undefined,
      urgency: undefined,
      maxDistance: 10,
      verified: undefined,
      hasUrgentNeeds: undefined,
      categories: [],
      types: [],
      urgencyLevels: [],
    }
  }

  const setUserLocation = (location: { lat: number; lng: number }): void => {
    userLocation.value = location
    // Recalcula distâncias quando localização do usuário muda
    calculateDistances()
  }

  const calculateDistances = (): void => {
    if (!userLocation.value) return

    institutions.value.forEach((institution) => {
      const distance = calculateDistance(
        userLocation.value!.lat,
        userLocation.value!.lng,
        institution.location.latitude,
        institution.location.longitude,
      )
      institution.location.distance = Math.round(distance * 100) / 100
    })
  }

  // Função helper para calcular distância (Haversine formula) - Tipagem matemática precisa
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Raio da Terra em km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  const searchInstitutions = async (query: string): Promise<void> => {
    updateFilters({ search: query })
  }

  // ✅ CORREÇÃO: Tipagem de retorno específica usando interface
  const getInstitutionStats = (institutionId: string): InstitutionStats | null => {
    const institution = institutions.value.find((inst) => inst.id === institutionId)
    if (!institution) return null

    return {
      totalNeeds: institution.needs.length,
      urgentNeeds: institution.needs.filter(
        (need: Need) =>
          need.urgency === UrgencyLevelEnum.CRITICAL || need.urgency === UrgencyLevelEnum.HIGH,
      ).length,
      fulfilledNeeds: institution.needs.filter((need: Need) => need.fulfilled).length,
      rating: institution.rating,
      totalDonations: institution.totalDonations,
    }
  }

  // Novos métodos para funcionalidades avançadas
  const getInstitutionsByType = (type: InstitutionType): Institution[] => {
    return filteredInstitutions.value.filter((institution) => institution.type === type)
  }

  const getInstitutionsByCategory = (category: NeedCategory): Institution[] => {
    return filteredInstitutions.value.filter((institution) =>
      institution.needs.some((need) => need.category === category),
    )
  }

  const toggleInstitutionFavorite = (institutionId: string): void => {
    // TODO: Implementar lógica de favoritos
    console.log('Toggle favorite for institution:', institutionId)
  }

  // Initialize com tipagem forte e geolocalização
  const init = async (): Promise<void> => {
    await fetchInstitutions()

    // Tenta obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.warn('Erro ao obter localização:', error)
          // Define localização padrão (centro de SP)
          setUserLocation({ lat: -23.5505, lng: -46.6333 })
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutos
        },
      )
    } else {
      // Define localização padrão se geolocalização não estiver disponível
      setUserLocation({ lat: -23.5505, lng: -46.6333 })
    }
  }

  const reset = (): void => {
    institutions.value = []
    selectedInstitution.value = null
    loading.value = false
    error.value = null
    clearFilters()
    userLocation.value = null
  }

  return {
    // State
    institutions,
    selectedInstitution,
    loading,
    error,
    filters,
    userLocation,

    // Getters
    filteredInstitutions,
    mapPins,
    institutionsByDistance,
    nearbyInstitutions,
    urgentNeeds,
    totalInstitutions,
    verifiedInstitutions,
    institutionsWithUrgentNeeds,

    // Actions
    fetchInstitutions,
    fetchInstitutionById,
    updateFilters,
    clearFilters,
    setUserLocation,
    searchInstitutions,
    getInstitutionStats,
    getInstitutionsByType,
    getInstitutionsByCategory,
    toggleInstitutionFavorite,
    init,
    reset,
  }
})
