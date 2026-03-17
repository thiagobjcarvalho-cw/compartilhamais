<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section">
      <v-container>
        <v-row align="center" justify="center" class="text-center">
          <v-col cols="12" md="8">
            <h1 class="hero-title mb-4">
              Transforme vidas com sua <span class="text-primary">generosidade</span>
            </h1>
            <p class="hero-subtitle mb-6">
              Conectamos você a instituições que precisam de ajuda em sua região.
              Cada doação faz a diferença na vida de alguém.
            </p>
            
            <!-- Quick Stats -->
            <v-row class="mb-6">
              <v-col cols="6" md="3">
                <div class="stat-card">
                  <v-icon color="primary" size="32">mdi-home-heart</v-icon>
                  <h3 class="text-h5 font-weight-bold mt-2">{{ institutions.length }}</h3>
                  <p class="text-caption">Instituições</p>
                </div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="stat-card">
                  <v-icon color="success" size="32">mdi-hand-heart</v-icon>
                  <h3 class="text-h5 font-weight-bold mt-2">2.5k+</h3>
                  <p class="text-caption">Doações Realizadas</p>
                </div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="stat-card">
                  <v-icon color="info" size="32">mdi-account-group</v-icon>
                  <h3 class="text-h5 font-weight-bold mt-2">10k+</h3>
                  <p class="text-caption">Pessoas Ajudadas</p>
                </div>
              </v-col>
              <v-col cols="6" md="3">
                <div class="stat-card">
                  <v-icon color="warning" size="32">mdi-map-marker-radius</v-icon>
                  <h3 class="text-h5 font-weight-bold mt-2">SP</h3>
                  <p class="text-caption">Sua Região</p>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Search and Filters Section -->
    <v-container class="search-section">
      <v-card elevation="0" rounded="xl" class="search-card">
        <v-card-text class="pa-4">
          <v-row align="center">
            <!-- Search Field -->
            <v-col cols="12" md="5">
              <v-text-field
                v-model="filters.search"
                placeholder="Buscar instituições por nome ou causa..."
                prepend-inner-icon="mdi-magnify"
                variant="solo"
                density="comfortable"
                hide-details
                clearable
                rounded="lg"
                bg-color="background"
                @input="onSearchChange"
              />
            </v-col>

            <!-- Type Filter -->
            <v-col cols="12" sm="6" md="3">
              <v-select
                v-model="filters.type"
                :items="institutionTypeOptions"
                item-title="title"
                item-value="value"
                placeholder="Tipo de instituição"
                variant="solo"
                density="comfortable"
                hide-details
                clearable
                rounded="lg"
                bg-color="background"
                @update:model-value="onFilterChange"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #prepend>
                      <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
                <template #selection="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="20" :color="item.raw.color" class="mr-2">{{ item.raw.icon }}</v-icon>
                    <span>{{ item.title }}</span>
                  </div>
                </template>
              </v-select>
            </v-col>

            <!-- Urgency Filter -->
            <v-col cols="12" sm="6" md="2">
              <v-select
                v-model="filters.urgency"
                :items="urgencyLevelOptions"
                item-title="title"
                item-value="value"
                placeholder="Urgência"
                variant="solo"
                density="comfortable"
                hide-details
                clearable
                rounded="lg"
                bg-color="background"
              >
                <template #item="{ props: itemProps, item }">
                  <v-list-item v-bind="itemProps">
                    <template #prepend>
                      <v-icon :color="item.raw.color" size="16">{{ item.raw.icon }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <!-- Advanced Filters Button -->
            <v-col cols="12" md="2">
              <v-btn
                block
                variant="tonal"
                color="primary"
                rounded="lg"
                @click="showAdvancedFilters = !showAdvancedFilters"
              >
                <v-icon start>mdi-tune-variant</v-icon>
                Mais Filtros
                <v-badge
                  v-if="activeFiltersCount > 0"
                  :content="activeFiltersCount"
                  color="secondary"
                  inline
                  class="ml-2"
                />
              </v-btn>
            </v-col>
          </v-row>

          <!-- Advanced Filters -->
          <v-expand-transition>
            <v-row v-show="showAdvancedFilters" class="mt-4">
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.needCategory"
                  :items="needCategoryOptions"
                  item-title="title"
                  item-value="value"
                  placeholder="Tipo de Necessidade"
                  variant="solo"
                  density="comfortable"
                  hide-details
                  clearable
                  rounded="lg"
                  bg-color="background"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-slider
                  v-model="filters.maxDistance"
                  :min="1"
                  :max="10"
                  step="1"
                  thumb-label
                  label="Distância máxima"
                  hide-details
                  color="primary"
                >
                  <template #append>
                    <span class="text-body-2">{{ filters.maxDistance }}km</span>
                  </template>
                </v-slider>
              </v-col>
              <v-col cols="12" md="3">
                <v-switch
                  v-model="filters.verified"
                  label="Apenas verificadas"
                  color="success"
                  hide-details
                  density="comfortable"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-btn
                  block
                  variant="text"
                  color="grey"
                  rounded="lg"
                  @click="clearFilters"
                >
                  <v-icon start>mdi-filter-remove</v-icon>
                  Limpar Filtros
                </v-btn>
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Toggle View Buttons -->
    <v-container class="py-2">
      <div class="d-flex justify-space-between align-center mb-4">
        <div>
          <h2 class="text-h5 font-weight-bold">
            Instituições Próximas
          </h2>
          <p class="text-body-2 text-medium-emphasis">
            {{ filteredInstitutions.length }} instituições encontradas
          </p>
        </div>
        <v-btn-toggle
          v-model="viewMode"
          mandatory
          color="primary"
          rounded="lg"
          density="comfortable"
        >
          <v-btn value="cards" size="small">
            <v-icon start>mdi-view-grid</v-icon>
            Cards
          </v-btn>
          <v-btn value="map" size="small">
            <v-icon start>mdi-map</v-icon>
            Mapa
          </v-btn>
        </v-btn-toggle>
      </div>
    </v-container>

    <!-- Content Area -->
    <v-container fluid class="pa-0">
      <!-- Map View -->
      <div v-if="viewMode === 'map'" class="map-container">
        <MapView 
          :institutions="filteredInstitutions" 
          height="600px"
          @institution-click="navigateToInstitution"
        />
      </div>

      <!-- Cards View -->
      <v-container v-else>
        <v-row>
          <v-col
            v-for="institution in filteredInstitutions"
            :key="institution.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <InstitutionCard
              :institution="institution"
              @click="navigateToInstitution(institution)"
              @donate="openDonationDialog(institution)"
              @favorite="toggleFavorite(institution)"
            />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-if="filteredInstitutions.length === 0" justify="center" class="mt-8">
          <v-col cols="12" md="6" class="text-center">
            <v-icon size="80" color="grey-lighten-2">mdi-magnify-close</v-icon>
            <h3 class="text-h5 mt-4 mb-2">Nenhuma instituição encontrada</h3>
            <p class="text-body-1 text-medium-emphasis">
              Tente ajustar os filtros ou ampliar a área de busca
            </p>
            <v-btn
              color="primary"
              variant="tonal"
              rounded="lg"
              class="mt-4"
              @click="clearFilters"
            >
              Limpar Filtros
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Floating Action Button -->
    <v-btn
      v-if="viewMode === 'cards'"
      position="fixed"
      location="bottom end"
      size="large"
      color="primary"
      icon
      elevation="4"
      class="fab-button"
      @click="addInstitutionDialog = true"
    >
      <v-icon>mdi-plus</v-icon>
      <v-tooltip
        activator="parent"
        location="start"
      >
        Cadastrar Instituição
      </v-tooltip>
    </v-btn>

    <!-- Donation Dialog -->
    <DonationDialog
      v-model="donationDialog"
      :institution="selectedInstitution"
      :need="selectedNeed"
      @confirm="handleDonationConfirm"
    />

    <!-- Add Institution Dialog -->
    <AddInstitutionDialog 
      v-model="addInstitutionDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MapView from '@/components/map/MapView.vue'
import InstitutionCard from '@/components/institution/InstitutionCard.vue'
import DonationDialog from '@/components/institution/DonationDialog.vue'
import AddInstitutionDialog from '@/components/institution/AddInstitutionDialog.vue'
import { useInstitutionsStore } from '@/stores/institutions'
import type { Institution, InstitutionFilters, Need } from '@/types/interfaces'
import {
  institutionTypeOptions,
  needCategoryOptions,
  urgencyLevelOptions,
} from '@/mock/data'

import { useFavoritesStore } from '@/stores/favorites'
import { useUiStore } from '@/stores/ui'

 // Stores
 const institutionsStore = useInstitutionsStore()
 const router = useRouter()

 // Additional stores
 const favoritesStore = useFavoritesStore()
 const uiStore = useUiStore()

// Refs
const viewMode = ref<'cards' | 'map'>('cards')
const showAdvancedFilters = ref(false)
const donationDialog = ref(false)
const addInstitutionDialog = ref(false)
const selectedInstitution = ref<Institution | null>(null)
const selectedNeed = ref<Need | null>(null)

// Filters
const filters = ref<InstitutionFilters>({
  search: '',
  type: null,
  needCategory: null,
  urgency: null,
  maxDistance: 5,
  verified: false,
})

// Computed
const institutions = computed(() => institutionsStore.institutions)
const filteredInstitutions = computed(() => {
  return institutionsStore.getFilteredInstitutions(filters.value)
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.type) count++
  if (filters.value.needCategory) count++
  if (filters.value.urgency) count++
  if (filters.value.verified) count++
  if (filters.value.maxDistance !== 5) count++
  return count
})

// Methods
const onSearchChange = () => {
  // Debounce search if needed
}

const onFilterChange = () => {
  // Apply filters
}

const clearFilters = () => {
  filters.value = {
    search: '',
    type: null,
    needCategory: null,
    urgency: null,
    maxDistance: 5,
    verified: false,
  }
}

const navigateToInstitution = (institution: Institution) => {
  router.push(`/institution/${institution.id}`)
}

const openDonationDialog = (institution: Institution, need?: Need) => {
  selectedInstitution.value = institution
  selectedNeed.value = need || null
  donationDialog.value = true
}

const toggleFavorite = (institution: Institution) => {
  const result = favoritesStore.toggleFavorite(institution.id)

  if (result.added) {
    uiStore.showSuccess(`${result.institutionName} adicionada aos favoritos`)
  } else {
    uiStore.showWarning(`${result.institutionName} removida dos favoritos`)
  }
}

const handleDonationConfirm = (donationData: unknown) => {
  console.log('Donation confirmed:', donationData)
  donationDialog.value = false
  uiStore.showSuccess('Doação registrada com sucesso! A instituição entrará em contato em breve.')
}

// Lifecycle
onMounted(() => {
  institutionsStore.loadInstitutions()
})
</script>

<style scoped>
.home-container {
  min-height: calc(100vh - 128px);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #6C63FF 0%, #8B80FF 50%, #FF6B6B 100%);
  color: white;
  padding: 60px 0 40px;
  margin-bottom: -40px;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.95;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  color: white;
}

/* Search Section */
.search-section {
  position: relative;
  z-index: 1;
  margin-bottom: 20px;
}

.search-card {
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Map Container */
.map-container {
  position: relative;
  width: 100%;
  height: 600px;
  background: #f5f5f5;
  border-radius: 12px;
  overflow: hidden;
  margin: 0 16px;
}

/* FAB Button */
.fab-button {
  bottom: 24px !important;
  right: 24px !important;
}

/* Responsive */
@media (max-width: 600px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-section {
    padding: 40px 0 30px;
  }
  
  .map-container {
    height: 400px;
    margin: 0 8px;
  }
}
</style>
