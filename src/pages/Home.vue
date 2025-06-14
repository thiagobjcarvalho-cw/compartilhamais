<template>
  <div class="home-container">
    <!-- Barra de Filtros e Pesquisa -->
    <v-card flat class="search-container" elevation="2">
      <v-card-text class="pb-2">
        <v-row align="center" no-gutters>
          <!-- Campo de Pesquisa -->
          <v-col cols="12" md="6" class="pr-md-2 mb-2 mb-md-0">
            <v-text-field
              v-model="filters.search"
              placeholder="Pesquisar instituições..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              @input="onSearchChange"
            />
          </v-col>

          <!-- Filtro de Tipo -->
          <v-col cols="12" md="3" class="px-md-2 mb-2 mb-md-0">
            <v-select
              v-model="filters.type"
              :items="institutionTypeOptions"
              item-title="title"
              item-value="value"
              placeholder="Tipo de instituição"
              variant="outlined"
              density="compact"
              hide-details
              clearable
              @update:model-value="onFilterChange"
            >
              <template #item="{ props: itemProps, item }">
                <v-list-item v-bind="itemProps">
                  <template #prepend>
                    <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </v-col>

          <!-- Botão de Filtros Avançados -->
          <v-col cols="12" md="3" class="pl-md-2">
            <v-btn
              block
              variant="outlined"
              color="primary"
              @click="showAdvancedFilters = !showAdvancedFilters"
            >
              <v-icon start>mdi-filter-variant</v-icon>
              Filtros
              <v-chip v-if="activeFiltersCount" color="primary" size="x-small" class="ml-2">
                {{ activeFiltersCount }}
              </v-chip>
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filtros Avançados (Expansível) -->
        <v-expand-transition>
          <div v-show="showAdvancedFilters" class="mt-4">
            <v-row>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.needCategory"
                  :items="needCategoryOptions"
                  item-title="title"
                  item-value="value"
                  placeholder="Categoria de Necessidade"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="3">
                <v-select
                  v-model="filters.urgency"
                  :items="urgencyLevelOptions"
                  item-title="title"
                  item-value="value"
                  placeholder="Urgência"
                  variant="outlined"
                  density="compact"
                  hide-details
                  clearable
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-icon :color="item.raw.color">{{ item.raw.icon }}</v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>

              <v-col cols="12" md="3">
                <v-slider
                  v-model="filters.maxDistance"
                  :min="1"
                  :max="50"
                  step="1"
                  thumb-label
                  label="Distância máxima (km)"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-checkbox
                  v-model="filters.verified"
                  label="Apenas verificadas"
                  density="compact"
                  hide-details
                />
              </v-col>
            </v-row>

            <v-row class="mt-2">
              <v-col cols="12">
                <v-btn color="primary" variant="flat" @click="applyAdvancedFilters" class="mr-2">
                  <v-icon start>mdi-check</v-icon>
                  Aplicar Filtros
                </v-btn>

                <v-btn variant="outlined" @click="clearFilters">
                  <v-icon start>mdi-filter-remove</v-icon>
                  Limpar
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <!-- Área Principal - Mapa/Lista -->
    <div class="content-container">
      <!-- Área do Mapa -->
      <div class="map-container">
        <MapView
          :institutions="paginatedInstitutions"
          :loading="loading"
          @institution-selected="selectInstitution"
        />
      </div>

      <!-- Lista de Instituições -->
      <div class="institutions-container">
        <div class="institutions-header pa-4">
          <div class="d-flex justify-space-between align-center">
            <h3 class="text-h6">
              <v-icon class="mr-2">mdi-heart-multiple</v-icon>
              Instituições ({{ filteredInstitutions.length }})
            </h3>

            <v-btn-toggle v-model="viewMode" mandatory variant="outlined" density="compact">
              <v-btn value="grid" size="small">
                <v-icon>mdi-view-grid</v-icon>
              </v-btn>
              <v-btn value="list" size="small">
                <v-icon>mdi-view-list</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>

        <v-divider />

        <!-- ✅ ETAPA 2: SEÇÃO OTIMIZADA COM VUETIFY -->
        <div class="institutions-content">
          <!-- Grid Mode - Otimizado para largura expandida -->
          <v-container v-if="viewMode === 'grid'" fluid class="pa-4">
            <v-row dense>
              <v-col
                v-for="institution in paginatedInstitutions"
                :key="institution.id"
                cols="12"
                sm="12"
                md="6"
                lg="4"
                xl="3"
                xxl="3"
                class="d-flex"
              >
                <InstitutionCard
                  :institution="institution"
                  class="flex-grow-1"
                  @click="selectInstitution(institution)"
                  @donate="openDonationDialog(institution)"
                />
              </v-col>
            </v-row>

            <!-- Paginação centralizada -->
            <v-row v-if="totalPages > 1" justify="center" class="mt-4">
              <v-col cols="auto">
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  :total-visible="7"
                  color="primary"
                  density="comfortable"
                  show-first-last-page
                />
              </v-col>
            </v-row>
          </v-container>

          <!-- List Mode - Layout horizontal expandido -->
          <v-container v-else-if="viewMode === 'list'" fluid class="pa-4">
            <v-row dense>
              <v-col
                v-for="institution in paginatedInstitutions"
                :key="institution.id"
                cols="12"
                class="d-flex"
              >
                <InstitutionCard
                  :institution="institution"
                  variant="list"
                  class="flex-grow-1"
                  @click="selectInstitution(institution)"
                  @donate="openDonationDialog(institution)"
                />
              </v-col>
            </v-row>

            <!-- Paginação para modo lista também -->
            <v-row v-if="totalPages > 1" justify="center" class="mt-4">
              <v-col cols="auto">
                <v-pagination
                  v-model="currentPage"
                  :length="totalPages"
                  :total-visible="7"
                  color="primary"
                  density="comfortable"
                  show-first-last-page
                />
              </v-col>
            </v-row>
          </v-container>

          <!-- Estado vazio otimizado -->
          <v-container v-if="!filteredInstitutions.length" fluid>
            <v-row justify="center" align="center" style="min-height: 400px">
              <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
                <v-avatar size="120" color="grey-lighten-3" class="mb-6">
                  <v-icon size="60" color="grey-lighten-1">mdi-magnify</v-icon>
                </v-avatar>

                <h3 class="text-h5 font-weight-medium mb-2">Nenhuma instituição encontrada</h3>

                <p class="text-body-1 text-medium-emphasis mb-6 mx-auto" style="max-width: 300px">
                  Tente ajustar os filtros de busca ou expandir a área de procura
                </p>

                <v-btn color="primary" variant="elevated" size="large" @click="clearFilters">
                  <v-icon start>mdi-filter-remove</v-icon>
                  Limpar Filtros
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </div>
    </div>

    <!-- Painel Lateral de Detalhes (Desktop) -->
    <v-navigation-drawer
      v-model="showDetailsPanel"
      location="right"
      temporary
      width="450"
      class="d-none d-lg-block"
    >
      <InstitutionProfile
        v-if="selectedInstitution"
        :institution="selectedInstitution"
        @close="showDetailsPanel = false"
        @donate="openDonationDialog(selectedInstitution)"
      />
    </v-navigation-drawer>

    <!-- Dialog Mobile de Detalhes -->
    <v-dialog
      v-model="showMobileDetails"
      fullscreen
      transition="dialog-bottom-transition"
      class="d-lg-none"
    >
      <InstitutionProfile
        v-if="selectedInstitution"
        :institution="selectedInstitution"
        @close="showMobileDetails = false"
        @donate="openDonationDialog(selectedInstitution)"
      />
    </v-dialog>

    <!-- Dialog de Doação -->
    <DonationDialog
      v-model="showDonationDialog"
      :institution="selectedInstitution"
      @donation-completed="onDonationCompleted"
    />

    <!-- Snackbar para feedback -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false"> Fechar </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import InstitutionCard from '@/components/institution/InstitutionCard.vue'
import InstitutionProfile from '@/components/institution/InstitutionProfile.vue'
import DonationDialog from '@/components/institution/DonationDialog.vue'
import MapView from '@/components/map/MapView.vue'
import type { Institution, InstitutionFilters } from '@/types/interfaces'
import {
  mockInstitutions,
  filterInstitutions,
  institutionTypeOptions,
  needCategoryOptions,
  urgencyLevelOptions,
} from '@/mock/data'

// ✅ CORREÇÃO: Definir nome do componente seguindo Vue.js Style Guide
defineOptions({
  name: 'HomePage',
})

// Estado reativo tipado seguindo padrão enterprise
const loading = ref<boolean>(true)
const showAdvancedFilters = ref<boolean>(false)
const showDetailsPanel = ref<boolean>(false)
const showMobileDetails = ref<boolean>(false)
const showDonationDialog = ref<boolean>(false)
const selectedInstitution = ref<Institution | null>(null)
const viewMode = ref<'grid' | 'list'>('grid')

const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(20)

// Snackbar states
const showSnackbar = ref<boolean>(false)
const snackbarMessage = ref<string>('')
const snackbarColor = ref<string>('info')

// Filtros reativos com tipagem forte
const filters = reactive<InstitutionFilters>({
  search: '',
  type: undefined,
  needCategory: undefined,
  urgency: undefined,
  maxDistance: 10,
  verified: undefined,
})

// Computed properties otimizados
const filteredInstitutions = computed<Institution[]>(() => {
  return filterInstitutions(filters)
})

const activeFiltersCount = computed<number>(() => {
  let count = 0
  if (filters.type) count++
  if (filters.needCategory) count++
  if (filters.urgency) count++
  if (filters.verified !== undefined) count++
  if (filters.maxDistance !== 10) count++
  return count
})

const paginatedInstitutions = computed<Institution[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredInstitutions.value.slice(start, end)
})

const totalPages = computed<number>(() => {
  return Math.ceil(filteredInstitutions.value.length / itemsPerPage.value)
})

// Métodos com tipagem forte e error handling
const onSearchChange = (): void => {
  // A busca é reativa através do computed filteredInstitutions
  currentPage.value = 1 // Reset para primeira página ao pesquisar
}

const onFilterChange = (): void => {
  // Os filtros são reativos através do computed filteredInstitutions
  currentPage.value = 1 // Reset para primeira página ao filtrar
}

const applyAdvancedFilters = (): void => {
  showAdvancedFilters.value = false
  currentPage.value = 1
  showMessage('Filtros aplicados', 'success')
}

const clearFilters = (): void => {
  Object.assign(filters, {
    search: '',
    type: undefined,
    needCategory: undefined,
    urgency: undefined,
    maxDistance: 10,
    verified: undefined,
  })
  showAdvancedFilters.value = false
  currentPage.value = 1
  showMessage('Filtros limpos', 'info')
}

const selectInstitution = (institution: Institution): void => {
  selectedInstitution.value = institution

  // Desktop: sidebar, Mobile: dialog fullscreen
  if (window.innerWidth >= 1280) {
    showDetailsPanel.value = true
  } else {
    showMobileDetails.value = true
  }
}

const openDonationDialog = (institution: Institution): void => {
  selectedInstitution.value = institution
  showDonationDialog.value = true

  // Fechar painéis de detalhes
  showDetailsPanel.value = false
  showMobileDetails.value = false
}

const onDonationCompleted = (): void => {
  showDonationDialog.value = false
  showMessage('Doação registrada com sucesso!', 'success')
}

const showMessage = (message: string, color: string = 'info'): void => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

// Lifecycle com error handling robusto
onMounted(async (): Promise<void> => {
  try {
    // Simular carregamento
    await new Promise((resolve) => setTimeout(resolve, 800))
    loading.value = false

    showMessage(`${mockInstitutions.length} instituições carregadas`, 'success')
  } catch (error) {
    console.error('Erro ao carregar:', error)
    loading.value = false
    showMessage('Erro ao carregar dados', 'error')
  }
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  overflow: hidden;
}

.search-container {
  flex-shrink: 0;
  border-radius: 0 !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.content-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* ✅ ETAPA 1: Inversão arquitetural - Lista primária, Mapa secundário */
.map-container {
  flex: 0 0 35%;
  position: relative;
  background: #f8fafc;
  min-width: 350px;
  border-radius: 0 8px 8px 0;
  order: 2; /* ✅ CRÍTICO: Mover mapa para direita */
}

.institutions-container {
  flex: 1;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  background: white;
  min-width: 450px;
  max-width: none;
  order: 1; /* ✅ CRÍTICO: Priorizar lista na esquerda */
}

.institutions-header {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.institutions-content {
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

/* ✅ OTIMIZAÇÃO: Breakpoints progressivos pós-inversão */
@media (max-width: 1400px) {
  .map-container {
    flex: 0 0 40%;
    min-width: 320px;
  }

  .institutions-container {
    min-width: 400px;
  }
}

@media (max-width: 1200px) {
  .content-container {
    flex-direction: column;
  }

  .map-container {
    flex: 0 0 45vh;
    min-width: auto;
    border-radius: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    border-right: none;
    order: 1; /* ✅ MOBILE: Mapa primeiro em telas pequenas */
  }

  .institutions-container {
    flex: 1;
    max-width: none;
    border-right: none;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    order: 2; /* ✅ MOBILE: Lista depois em telas pequenas */
  }

  .institutions-content {
    max-height: calc(55vh - 100px);
  }
}

@media (max-width: 960px) {
  .home-container {
    height: calc(100vh - 56px);
  }

  .map-container {
    flex: 0 0 35vh;
    min-height: 250px;
  }

  .institutions-content {
    max-height: calc(65vh - 120px);
  }
}

/* ✅ OTIMIZAÇÃO: Telas extra largas com hierarquia visual invertida */
@media (min-width: 1600px) {
  .map-container {
    flex: 0 0 32%;
    min-width: 500px;
  }

  .institutions-container {
    min-width: 600px;
  }
}

/* ✅ MELHORIA: Smooth transitions para UX superior */
.institutions-container,
.map-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ✅ PERFORMANCE: Otimização de scroll para lista de instituições */
.institutions-content {
  scroll-behavior: smooth;
  scrollbar-width: thin;
}

.institutions-content::-webkit-scrollbar {
  width: 4px;
}

.institutions-content::-webkit-scrollbar-track {
  background: transparent;
}

.institutions-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
</style>
