<!-- src/pages/DonationsPage.vue -->
<template>
  <div class="donations-page">
    <!-- Header da Página -->
    <div class="page-header">
      <div class="d-flex align-center mb-4">
        <v-btn icon variant="text" @click="$router.back()" class="mr-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <div>
          <h1 class="text-h4 font-weight-bold">Minhas Doações</h1>
          <p class="text-body-1 text-medium-emphasis mb-0">
            Histórico completo de suas contribuições
          </p>
        </div>
      </div>

      <!-- Estatísticas Rápidas -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="32" color="success" class="mb-2">mdi-heart</v-icon>
              <div class="text-h5 font-weight-bold">{{ totalDonations }}</div>
              <div class="text-caption text-medium-emphasis">Total de Doações</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="32" color="primary" class="mb-2">mdi-calendar</v-icon>
              <div class="text-h5 font-weight-bold">{{ donationsThisMonth }}</div>
              <div class="text-caption text-medium-emphasis">Este Mês</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="32" color="warning" class="mb-2">mdi-star</v-icon>
              <div class="text-h5 font-weight-bold">{{ institutionsHelped }}</div>
              <div class="text-caption text-medium-emphasis">Instituições</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-card variant="outlined">
            <v-card-text class="text-center">
              <v-icon size="32" color="info" class="mb-2">mdi-trophy</v-icon>
              <div class="text-h5 font-weight-bold">{{ impactMetrics }}</div>
              <div class="text-caption text-medium-emphasis">Métricas</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Filtros -->
    <v-card flat class="mb-4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              placeholder="Buscar por descrição..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              item-title="title"
              item-value="value"
              label="Status"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filterPeriod"
              :items="periodOptions"
              item-title="title"
              item-value="value"
              label="Período"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" md="2">
            <v-btn block color="primary" variant="outlined" @click="exportHistory">
              <v-icon start>mdi-download</v-icon>
              Exportar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Lista de Doações -->
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-history</v-icon>
        Histórico de Doações
        <v-spacer />
        <v-chip color="primary" variant="outlined"> {{ filteredDonations.length }} doações </v-chip>
      </v-card-title>

      <v-divider />

      <div v-if="loading" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="48" />
        <p class="text-body-2 text-medium-emphasis mt-4">Carregando histórico...</p>
      </div>

      <div v-else-if="!filteredDonations.length" class="text-center py-8">
        <v-icon size="64" color="grey-lighten-2">mdi-heart-outline</v-icon>
        <h3 class="text-h6 mt-4 mb-2">Nenhuma doação encontrada</h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ search ? 'Tente ajustar os filtros de busca' : 'Que tal fazer sua primeira doação?' }}
        </p>
        <v-btn color="primary" variant="outlined" @click="$router.push('/')">
          <v-icon start>mdi-plus</v-icon>
          Nova Doação
        </v-btn>
      </div>

      <div v-else class="pa-4">
        <!-- Lista de doações usando card customizado -->
        <v-card
          v-for="donation in paginatedDonations"
          :key="donation.id"
          variant="outlined"
          class="mb-3"
          @click="viewDonationDetails(donation)"
          style="cursor: pointer"
        >
          <v-card-text>
            <div class="d-flex justify-space-between align-start mb-2">
              <div>
                <h3 class="text-h6 font-weight-medium">{{ donation.description }}</h3>
                <p class="text-body-2 text-medium-emphasis mb-1">
                  {{ getInstitutionName(donation.institutionId) }}
                </p>
              </div>
              <v-chip :color="getStatusColor(donation.status)" variant="flat" size="small">
                {{ getStatusLabel(donation.status) }}
              </v-chip>
            </div>

            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center gap-4">
                <div class="text-body-2">
                  <v-icon size="16" class="mr-1">mdi-package-variant</v-icon>
                  {{ donation.quantity || 'Quantidade não especificada' }}
                </div>
                <div class="text-body-2">
                  <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                  {{ formatDate(donation.createdAt) }}
                </div>
              </div>

              <v-btn icon variant="text" size="small" @click.stop="viewDonationDetails(donation)">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="d-flex justify-center mt-6">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            :total-visible="7"
            color="primary"
          />
        </div>
      </div>
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
import type { Donation, DonationStatus } from '@/types/interfaces'
import { DonationStatus as DonationStatusEnum } from '@/types/interfaces'
import { mockDonations, mockInstitutions } from '@/mock/data'

const donorStore = useDonorStore()

// Tipos específicos para filtros
type PeriodFilter = 'week' | 'month' | 'quarter' | 'year'

interface StatusOption {
  title: string
  value: DonationStatus
}

interface PeriodOption {
  title: string
  value: PeriodFilter
}

// Estado reativo
const loading = ref<boolean>(true)
const search = ref<string>('')
const filterStatus = ref<DonationStatus | ''>('')
const filterPeriod = ref<PeriodFilter | ''>('')
const currentPage = ref<number>(1)
const itemsPerPage = ref<number>(10)

// Snackbar
const showSnackbar = ref<boolean>(false)
const snackbarMessage = ref<string>('')
const snackbarColor = ref<string>('info')

// Opções de filtro - usando enums corretos
const statusOptions: StatusOption[] = [
  { title: 'Confirmada', value: DonationStatusEnum.CONFIRMED },
  { title: 'Pendente', value: DonationStatusEnum.PENDING },
  { title: 'Em Progresso', value: DonationStatusEnum.IN_PROGRESS },
  { title: 'Concluída', value: DonationStatusEnum.COMPLETED },
  { title: 'Cancelada', value: DonationStatusEnum.CANCELLED },
]

const periodOptions: PeriodOption[] = [
  { title: 'Última semana', value: 'week' },
  { title: 'Último mês', value: 'month' },
  { title: 'Últimos 3 meses', value: 'quarter' },
  { title: 'Último ano', value: 'year' },
]

// Computed - usando dados mock centralizados
const totalDonations = computed<number>(
  () => donorStore.currentDonor?.stats.totalDonations || mockDonations.length,
)

const donationsThisMonth = computed<number>(() => {
  const thisMonth = new Date().getMonth()
  return mockDonations.filter((donation) => new Date(donation.createdAt).getMonth() === thisMonth)
    .length
})

const institutionsHelped = computed<number>(
  () => donorStore.currentDonor?.stats.institutionsHelped || 0,
)

const impactMetrics = computed<number>(
  () => donorStore.currentDonor?.stats.impactMetrics.length || 0,
)

const filteredDonations = computed<Donation[]>(() => {
  let filtered = [...mockDonations]

  if (search.value) {
    const searchLower = search.value.toLowerCase()
    filtered = filtered.filter((donation) =>
      donation.description.toLowerCase().includes(searchLower),
    )
  }

  if (filterStatus.value) {
    filtered = filtered.filter((donation) => donation.status === filterStatus.value)
  }

  if (filterPeriod.value) {
    const now = new Date()
    const periodDate = new Date()

    switch (filterPeriod.value) {
      case 'week':
        periodDate.setDate(now.getDate() - 7)
        break
      case 'month':
        periodDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        periodDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        periodDate.setFullYear(now.getFullYear() - 1)
        break
    }

    filtered = filtered.filter((donation) => new Date(donation.createdAt) >= periodDate)
  }

  return filtered
})

const totalPages = computed<number>(() =>
  Math.ceil(filteredDonations.value.length / itemsPerPage.value),
)

const paginatedDonations = computed<Donation[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDonations.value.slice(start, end)
})

// Helper functions
const getInstitutionName = (institutionId: string): string => {
  const institution = mockInstitutions.find((inst) => inst.id === institutionId)
  return institution?.name || 'Instituição não encontrada'
}

const getStatusColor = (status: DonationStatus): string => {
  const colors: Record<DonationStatus, string> = {
    [DonationStatusEnum.PENDING]: 'warning',
    [DonationStatusEnum.CONFIRMED]: 'info',
    [DonationStatusEnum.IN_PROGRESS]: 'primary',
    [DonationStatusEnum.COMPLETED]: 'success',
    [DonationStatusEnum.CANCELLED]: 'error',
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status: DonationStatus): string => {
  const labels: Record<DonationStatus, string> = {
    [DonationStatusEnum.PENDING]: 'Pendente',
    [DonationStatusEnum.CONFIRMED]: 'Confirmada',
    [DonationStatusEnum.IN_PROGRESS]: 'Em Progresso',
    [DonationStatusEnum.COMPLETED]: 'Concluída',
    [DonationStatusEnum.CANCELLED]: 'Cancelada',
  }
  return labels[status] || status
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// Métodos com tipagem forte
const viewDonationDetails = (donation: Donation): void => {
  showMessage(`Visualizando doação: ${donation.description}`, 'info')
  // TODO: Implementar modal de detalhes ou navegação
}

const exportHistory = (): void => {
  showMessage(`Exportando ${filteredDonations.value.length} doações...`, 'info')
  // TODO: Implementar exportação CSV/PDF
}

const showMessage = (message: string, color: string = 'info'): void => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

// Lifecycle
onMounted(async (): Promise<void> => {
  await donorStore.init()
  loading.value = false
})
</script>

<style scoped>
.donations-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

@media (max-width: 960px) {
  .donations-page {
    padding: 16px;
  }
}
</style>
