<!-- src/pages/FavoritesPage.vue -->
<template>
  <div class="favorites-page">
    <!-- Header da Página -->
    <div class="page-header">
      <div class="d-flex align-center mb-4">
        <v-btn icon variant="text" @click="$router.back()" class="mr-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <h1 class="text-h4 font-weight-bold">Instituições Favoritas</h1>
          <p class="text-body-1 text-medium-emphasis mb-0">
            Suas instituições marcadas como favoritas
          </p>
        </div>
      </div>
    </div>

    <!-- Filtros e Busca -->
    <v-card flat class="mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              placeholder="Buscar instituições favoritas..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filterType"
              :items="institutionTypeOptions"
              item-title="title"
              item-value="value"
              label="Tipo de Instituição"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-btn-toggle v-model="viewMode" mandatory variant="outlined" density="compact">
              <v-btn value="grid" size="small">
                <v-icon>mdi-view-grid</v-icon>
              </v-btn>
              <v-btn value="list" size="small">
                <v-icon>mdi-view-list</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="text-body-2 text-medium-emphasis mt-4">Carregando favoritas...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!filteredFavorites.length" class="text-center py-12">
      <v-icon size="72" color="grey-lighten-2">mdi-star-outline</v-icon>
      <h3 class="text-h6 mt-4 mb-2">
        {{ search || filterType ? 'Nenhuma favorita encontrada' : 'Nenhuma instituição favorita' }}
      </h3>
      <p class="text-body-2 text-medium-emphasis mb-4">
        {{
          search || filterType
            ? 'Tente ajustar os filtros de busca'
            : 'Explore o mapa e favorite suas instituições preferidas'
        }}
      </p>
      <v-btn color="primary" variant="outlined" @click="$router.push('/')">
        <v-icon start>mdi-map-marker</v-icon>
        Explorar Mapa
      </v-btn>
    </div>

    <!-- Grid View -->
    <v-row v-else-if="viewMode === 'grid'" class="mb-4">
      <v-col
        v-for="institution in filteredFavorites"
        :key="institution.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card variant="outlined" @click="viewInstitution(institution)" style="cursor: pointer">
          <v-img :src="institution.images?.[0] || '/default-institution.jpg'" height="200" cover>
            <div class="d-flex justify-end pa-2">
              <v-btn
                icon
                variant="flat"
                color="warning"
                size="small"
                @click.stop="toggleFavorite(institution.id)"
              >
                <v-icon>mdi-star</v-icon>
              </v-btn>
            </div>
          </v-img>

          <v-card-text>
            <h3 class="text-h6 font-weight-medium mb-1">{{ institution.name }}</h3>

            <p class="text-body-2 text-medium-emphasis mb-2">
              <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
              {{ institution.location.city }}, {{ institution.location.state }}
            </p>

            <div class="d-flex align-center justify-space-between mb-2">
              <v-chip size="small" :color="getTypeColor(institution.type)" variant="outlined">
                {{ getTypeLabel(institution.type) }}
              </v-chip>

              <v-chip v-if="institution.verified" size="small" color="success" variant="outlined">
                <v-icon start size="12">mdi-check-circle</v-icon>
                Verificada
              </v-chip>
            </div>

            <p
              class="text-body-2 mb-3"
              style="
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              "
            >
              {{ institution.description }}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="text" size="small" @click.stop="viewInstitution(institution)">
              <v-icon start>mdi-eye</v-icon>
              Ver Detalhes
            </v-btn>

            <v-spacer />

            <v-btn
              variant="flat"
              color="primary"
              size="small"
              @click.stop="openDonationDialog(institution)"
            >
              <v-icon start>mdi-heart</v-icon>
              Doar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- List View -->
    <v-card v-else>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-star-multiple</v-icon>
        Instituições Favoritas
        <v-spacer />
        <v-chip color="primary" variant="outlined">
          {{ filteredFavorites.length }} favoritas
        </v-chip>
      </v-card-title>

      <v-divider />

      <v-list>
        <template v-for="(institution, index) in filteredFavorites" :key="institution.id">
          <v-list-item @click="viewInstitution(institution)" class="py-4">
            <template #prepend>
              <v-avatar size="56" class="mr-4">
                <v-img
                  :src="institution.images?.[0] || '/default-institution.jpg'"
                  :alt="institution.name"
                />
              </v-avatar>
            </template>

            <v-list-item-title class="text-h6 font-weight-medium mb-1">
              {{ institution.name }}
            </v-list-item-title>

            <v-list-item-subtitle class="mb-2">
              <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
              {{ institution.location.city }}, {{ institution.location.state }}

              <span v-if="institution.location.distance" class="ml-2">
                <v-icon size="16" class="mr-1">mdi-map-marker-distance</v-icon>
                {{ institution.location.distance }}km
              </span>
            </v-list-item-subtitle>

            <div class="d-flex align-center flex-wrap gap-2 mb-2">
              <v-chip size="small" :color="getTypeColor(institution.type)" variant="outlined">
                {{ getTypeLabel(institution.type) }}
              </v-chip>

              <v-chip v-if="institution.verified" size="small" color="success" variant="outlined">
                <v-icon start size="12">mdi-check-circle</v-icon>
                Verificada
              </v-chip>

              <v-chip v-if="institution.rating" size="small" variant="outlined">
                <v-icon start size="12" color="warning">mdi-star</v-icon>
                {{ institution.rating.toFixed(1) }}
              </v-chip>
            </div>

            <template #append>
              <div class="d-flex flex-column align-center gap-2">
                <v-btn
                  icon
                  variant="text"
                  color="warning"
                  @click.stop="toggleFavorite(institution.id)"
                >
                  <v-icon>mdi-star</v-icon>
                </v-btn>

                <v-btn
                  icon
                  variant="text"
                  color="primary"
                  @click.stop="openDonationDialog(institution)"
                >
                  <v-icon>mdi-heart</v-icon>
                </v-btn>
              </div>
            </template>
          </v-list-item>

          <v-divider v-if="index < filteredFavorites.length - 1" />
        </template>
      </v-list>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDonorStore } from '@/stores/donor'
import type { Institution, InstitutionType } from '@/types/interfaces'
import { mockInstitutions, institutionTypeOptions } from '@/mock/data'

const donorStore = useDonorStore()

// Tipos específicos
type ViewMode = 'grid' | 'list'

// Estado reativo
const loading = ref<boolean>(true)
const search = ref<string>('')
const filterType = ref<InstitutionType | ''>('')
const viewMode = ref<ViewMode>('grid')

// Snackbar
const showSnackbar = ref<boolean>(false)
const snackbarMessage = ref<string>('')
const snackbarColor = ref<string>('info')

// Estado das favoritas - simulando persistência local
const favoriteInstitutionIds = ref<string[]>(['1', '2']) // Mock inicial

// Computed - filtrando instituições mock por IDs favoritos
const favoriteInstitutions = computed<Institution[]>(() => {
  return mockInstitutions.filter((institution) =>
    favoriteInstitutionIds.value.includes(institution.id),
  )
})

const filteredFavorites = computed<Institution[]>(() => {
  let filtered = [...favoriteInstitutions.value]

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter(
      (institution) =>
        institution.name.toLowerCase().includes(searchLower) ||
        institution.description.toLowerCase().includes(searchLower) ||
        institution.location.city.toLowerCase().includes(searchLower),
    )
  }

  if (filterType.value) {
    filtered = filtered.filter((institution) => institution.type === filterType.value)
  }

  return filtered
})

// Helper functions seguindo padrão do mock/data.ts
const getTypeColor = (type: InstitutionType): string => {
  const typeOption = institutionTypeOptions.find((option) => option.value === type)
  return typeOption?.color || 'grey'
}

const getTypeLabel = (type: InstitutionType): string => {
  const typeOption = institutionTypeOptions.find((option) => option.value === type)
  return typeOption?.title || type
}

// Métodos com tipagem forte e prevenção de erros
const viewInstitution = (institution: Institution): void => {
  // Navegação usando rota já configurada
  window.open(`/institution/${institution.id}`, '_blank')
}

const toggleFavorite = (institutionId: string): void => {
  const index = favoriteInstitutionIds.value.indexOf(institutionId)
  const institution = mockInstitutions.find((inst) => inst.id === institutionId)

  if (index > -1) {
    favoriteInstitutionIds.value.splice(index, 1)
    showMessage(`${institution?.name || 'Instituição'} removida dos favoritos`, 'warning')
  } else {
    favoriteInstitutionIds.value.push(institutionId)
    showMessage(`${institution?.name || 'Instituição'} adicionada aos favoritos`, 'success')
  }

  // TODO: Implementar persistência real (localStorage/API)
}

const openDonationDialog = (institution: Institution): void => {
  // Navegar para home com instituição selecionada
  showMessage(`Redirecionando para doação: ${institution.name}`, 'info')
  // TODO: Implementar abertura do DonationDialog ou navegação específica
}

const showMessage = (message: string, color: string = 'info'): void => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

// Lifecycle
onMounted(async (): Promise<void> => {
  await donorStore.init()

  // Simular carregamento de favoritas
  setTimeout(() => {
    loading.value = false

    if (favoriteInstitutions.value.length > 0) {
      showMessage(`${favoriteInstitutions.value.length} favoritas carregadas`, 'success')
    }
  }, 500)
})
</script>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 960px) {
  .favorites-page {
    padding: 16px;
  }
}
</style>
