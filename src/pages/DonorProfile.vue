<template>
  <div class="donor-profile">
    <!-- Header -->
    <v-app-bar
      color="primary"
      density="comfortable"
      elevation="0"
    >
      <v-btn
        icon
        @click="$router.back()"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      
      <v-app-bar-title>Meu Perfil</v-app-bar-title>
      
      <v-btn icon>
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Profile Header -->
    <div class="profile-header">
      <v-container>
        <div class="profile-info">
          <v-avatar size="80" class="profile-avatar">
            <v-img
              :src="donor?.avatar || '/images/default-avatar.jpg'"
              :alt="donor?.name"
            />
          </v-avatar>
          
          <div class="profile-details">
            <h2 class="profile-name">{{ donor?.name }}</h2>
            <p class="profile-subtitle">Doador Solidário desde {{ formatJoinDate(donor?.createdAt) }}</p>
            
            <!-- Quick stats -->
            <div class="quick-stats">
              <div class="stat-item">
                <span class="stat-number">{{ donor?.stats.totalDonations }}</span>
                <span class="stat-label">Doações</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{ donor?.stats.institutionsHelped }}</span>
                <span class="stat-label">Instituições</span>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Content -->
    <div class="profile-content">
      <v-container>
        <!-- Impact Metrics -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-chart-line</v-icon>
            Seu Impacto
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col
                v-for="metric in donor?.stats.impactMetrics"
                :key="metric.label"
                cols="6"
                sm="3"
              >
                <v-card
                  variant="tonal"
                  color="primary"
                  class="text-center impact-card"
                >
                  <v-card-text class="pa-4">
                    <v-icon size="32" :color="metric.icon.includes('food') ? 'orange' : 'primary'" class="mb-2">
                      {{ metric.icon }}
                    </v-icon>
                    <div class="impact-number">{{ metric.value }}</div>
                    <div class="impact-unit">{{ metric.unit }}</div>
                    <div class="impact-label">{{ metric.label }}</div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Recent Donations -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="success">mdi-history</v-icon>
              Doações Recentes
            </div>
            <v-btn
              size="small"
              variant="text"
              color="primary"
              @click="showAllDonations = !showAllDonations"
            >
              {{ showAllDonations ? 'Ver menos' : 'Ver todas' }}
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <div v-if="recentDonations.length === 0" class="empty-state">
              <v-icon size="64" color="grey-lighten-1">mdi-gift-outline</v-icon>
              <h3 class="mt-4 mb-2">Nenhuma doação ainda</h3>
              <p class="text-grey">Que tal fazer sua primeira doação?</p>
              <v-btn
                color="primary"
                @click="$router.push('/')"
              >
                Encontrar Instituições
              </v-btn>
            </div>
            
            <div v-else>
              <DonationHistoryItem
                v-for="donation in displayedDonations"
                :key="donation.id"
                :donation="donation"
                @view-institution="viewInstitution"
              />
            </div>
          </v-card-text>
        </v-card>

        <!-- Preferences -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="info">mdi-heart-settings</v-icon>
            Preferências de Doação
          </v-card-title>
          
          <v-card-text>
            <!-- Preferred Categories -->
            <div class="preference-section">
              <h4 class="mb-3">Categorias de Interesse</h4>
              <v-chip-group
                v-model="selectedPreferences"
                multiple
                color="primary"
              >
                <v-chip
                  v-for="category in categoryOptions"
                  :key="category.value"
                  :value="category.value"
                  size="small"
                  filter
                >
                  <v-icon start size="16">{{ category.icon }}</v-icon>
                  {{ category.title }}
                </v-chip>
              </v-chip-group>
            </div>

            <v-divider class="my-4" />

            <!-- Distance Preference -->
            <div class="preference-section">
              <h4 class="mb-3">Distância Máxima</h4>
              <v-slider
                v-model="maxDistance"
                :min="1"
                :max="20"
                :step="1"
                thumb-label
                color="primary"
                class="distance-slider"
              >
                <template #thumb-label="{ modelValue }">
                  {{ modelValue }}km
                </template>
              </v-slider>
              <p class="text-caption text-grey">
                Mostrar instituições em um raio de {{ maxDistance }}km
              </p>
            </div>

            <v-divider class="my-4" />

            <!-- Notifications -->
            <div class="preference-section">
              <h4 class="mb-3">Notificações</h4>
              <div class="notification-settings">
                <v-switch
                  v-model="notifications.newInstitutions"
                  label="Novas instituições próximas"
                  color="primary"
                  hide-details
                />
                <v-switch
                  v-model="notifications.urgentNeeds"
                  label="Necessidades urgentes"
                  color="primary"
                  hide-details
                />
                <v-switch
                  v-model="notifications.donationUpdates"
                  label="Atualizações das minhas doações"
                  color="primary"
                  hide-details
                />
                <v-switch
                  v-model="notifications.weeklyReport"
                  label="Relatório semanal de impacto"
                  color="primary"
                  hide-details
                />
              </div>
            </div>

            <!-- Save Button -->
            <div class="text-center mt-4">
              <v-btn
                color="primary"
                size="large"
                @click="savePreferences"
              >
                <v-icon start>mdi-content-save</v-icon>
                Salvar Preferências
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- Achievements -->
        <v-card class="mb-6" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2" color="warning">mdi-trophy</v-icon>
            Conquistas
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col
                v-for="achievement in achievements"
                :key="achievement.id"
                cols="12"
                sm="6"
                md="4"
              >
                <AchievementCard
                  :achievement="achievement"
                  :unlocked="achievement.unlocked"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDonorStore } from '../stores/donor'
import type { Donation } from '../types/interfaces'
import { needCategoryOptions, mockDonations, findInstitutionById } from '../mock/data'
import DonationHistoryItem from '../components/donor/DonationHistoryItem.vue'
import AchievementCard from '../components/donor/AchievementCard.vue'

const router = useRouter()
const donorStore = useDonorStore()

// Reactive state
const showAllDonations = ref(false)
const selectedPreferences = ref<string[]>([])
const maxDistance = ref(5)
const notifications = ref({
  newInstitutions: true,
  urgentNeeds: true,
  donationUpdates: true,
  weeklyReport: false
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 4000
})

// Computed
const donor = computed(() => donorStore.currentDonor)

const recentDonations = computed(() => {
  return mockDonations
    .filter(donation => donation.donorId === donor.value?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const displayedDonations = computed(() => {
  return showAllDonations.value 
    ? recentDonations.value 
    : recentDonations.value.slice(0, 3)
})

const categoryOptions = computed(() => needCategoryOptions)

const achievements = computed(() => [
  {
    id: 1,
    title: 'Primeira Doação',
    description: 'Fez sua primeira doação',
    icon: 'mdi-heart',
    color: 'red',
    unlocked: (donor.value?.stats.totalDonations || 0) > 0
  },
  {
    id: 2,
    title: 'Doador Generoso',
    description: '10 doações realizadas',
    icon: 'mdi-gift-multiple',
    color: 'blue',
    unlocked: (donor.value?.stats.totalDonations || 0) >= 10
  },
  {
    id: 3,
    title: 'Impacto Local',
    description: '5 instituições diferentes ajudadas',
    icon: 'mdi-map-marker-multiple',
    color: 'green',
    unlocked: (donor.value?.stats.institutionsHelped || 0) >= 5
  },
  {
    id: 4,
    title: 'Doador Constante',
    description: 'Doações por 3 meses consecutivos',
    icon: 'mdi-calendar-check',
    color: 'purple',
    unlocked: false // Logic would be more complex
  },
  {
    id: 5,
    title: 'Embaixador da Solidariedade',
    description: 'Compartilhou o app 5 vezes',
    icon: 'mdi-share-variant',
    color: 'orange',
    unlocked: false
  },
  {
    id: 6,
    title: 'Herói da Comunidade',
    description: '100 pessoas impactadas indiretamente',
    icon: 'mdi-account-group',
    color: 'teal',
    unlocked: false
  }
])

// Methods
const formatJoinDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long'
  })
}

const viewInstitution = (institutionId: string) => {
  router.push(`/institution/${institutionId}`)
}

const savePreferences = () => {
  // Save preferences logic here
  donorStore.updatePreferences({
    categories: selectedPreferences.value,
    maxDistance: maxDistance.value,
    notifications: notifications.value
  })
  
  showSnackbar('Preferências salvas com sucesso! ✅', 'success')
}

const showSnackbar = (text: string, color: string = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color,
    timeout: 4000
  }
}

// Lifecycle
onMounted(() => {
  if (donor.value) {
    selectedPreferences.value = donor.value.preferences.categories || []
    maxDistance.value = donor.value.preferences.maxDistance || 5
    notifications.value = { ...donor.value.preferences.notifications }
  }
})
</script>

<style scoped lang="scss">
.donor-profile {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.profile-header {
  margin-top: 40px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: white;
  padding: 24px 0;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-avatar {
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.profile-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 16px;
}

.quick-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
  
  .stat-number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
  }
  
  .stat-label {
    font-size: 0.875rem;
    opacity: 0.9;
  }
}

.profile-content {
  padding: 24px 0;
  margin-top: -12px;
  background: rgb(var(--v-theme-background));
  border-radius: 24px 24px 0 0;
  position: relative;
  z-index: 1;
}

.impact-card {
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
}

.impact-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}

.impact-unit {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 4px;
}

.impact-label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  line-height: 1.2;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
}

.preference-section {
  margin-bottom: 24px;
  
  h4 {
    color: rgb(var(--v-theme-on-surface));
    margin-bottom: 12px;
  }
}

.distance-slider {
  margin: 16px 0;
}

.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// Mobile responsiveness
@media (max-width: 600px) {
  .profile-info {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .profile-details {
    text-align: center;
  }
  
  .quick-stats {
    justify-content: center;
    gap: 32px;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .stat-item .stat-number {
    font-size: 1.25rem;
  }
}

// Dark theme adjustments
.v-theme--dark {
  .profile-header {
    background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  }
}
</style>