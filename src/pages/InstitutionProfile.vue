<template>
  <div class="institution-profile">
    <!-- Header com imagem e info básica -->
    <div class="profile-header">
      <v-app-bar
        color="transparent"
        flat
        class="header-nav"
      >
        <v-btn
          icon
          @click="$router.back()"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        
        <v-spacer />
        
        <v-btn icon>
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
        
        <v-btn icon>
          <v-icon>mdi-heart-outline</v-icon>
        </v-btn>
      </v-app-bar>

      <div class="header-content">
        <!-- Galeria de imagens -->
        <v-carousel
          v-if="institution?.images && institution.images.length > 0"
          height="300"
          hide-delimiter-background
          show-arrows="hover"
          class="institution-gallery"
        >
          <v-carousel-item
            v-for="(image, index) in institution.images"
            :key="index"
            :src="image"
            cover
          />
        </v-carousel>

        <!-- Overlay com informações básicas -->
        <div class="header-overlay">
          <v-container>
            <div class="institution-basic-info">
              <div class="badges-row">
                <v-chip
                  v-if="institution?.verified"
                  color="success"
                  size="small"
                >
                  <v-icon start size="16">mdi-check-decagram</v-icon>
                  Verificada
                </v-chip>
                
                <v-chip
                  :color="getTypeColor(institution?.type)"
                  size="small"
                  variant="tonal"
                >
                  <v-icon start size="16">{{ getTypeIcon(institution?.type) }}</v-icon>
                  {{ getTypeLabel(institution?.type) }}
                </v-chip>
              </div>

              <h1 class="institution-title">{{ institution?.name }}</h1>
              <p class="institution-subtitle">{{ institution?.description }}</p>
              
              <div class="stats-row">
                <div class="stat-item">
                  <v-rating
                    :model-value="institution?.rating || 0"
                    readonly
                    density="compact"
                    size="small"
                    color="warning"
                    half-increments
                  />
                  <span class="rating-text">({{ institution?.rating }})</span>
                </div>
                
                <div class="stat-item">
                  <v-icon size="16">mdi-gift</v-icon>
                  <span>{{ institution?.totalDonations }} doações</span>
                </div>
                
                <div class="stat-item">
                  <v-icon size="16">mdi-map-marker</v-icon>
                  <span>{{ formatDistance(institution?.location.distance) }}</span>
                </div>
              </div>
            </div>
          </v-container>
        </div>
      </div>
    </div>

    <!-- Conteúdo principal -->
    <div class="profile-content">
      <v-container>
        <!-- Tabs de navegação -->
        <v-tabs
          v-model="activeTab"
          color="primary"
          align-tabs="center"
          class="content-tabs"
        >
          <v-tab value="needs">Necessidades</v-tab>
          <v-tab value="about">Sobre</v-tab>
          <v-tab value="contact">Contato</v-tab>
          <v-tab value="impact">Impacto</v-tab>
        </v-tabs>

        <!-- Conteúdo das tabs -->
        <v-tabs-window v-model="activeTab" class="mt-6">
          <!-- Tab: Necessidades -->
          <v-tabs-window-item value="needs">
            <div class="needs-section">
              <!-- Filtros rápidos -->
              <div class="needs-filters mb-4">
                <v-chip-group
                  v-model="needsFilter"
                  filter
                  multiple
                  color="primary"
                >
                  <v-chip
                    v-for="category in availableCategories"
                    :key="category.value"
                    :value="category.value"
                    size="small"
                  >
                    <v-icon start size="16">{{ category.icon }}</v-icon>
                    {{ category.title }}
                  </v-chip>
                </v-chip-group>
              </div>

              <!-- Lista de necessidades -->
              <v-row>
                <v-col
                  v-for="need in filteredNeeds"
                  :key="need.id"
                  cols="12"
                  md="6"
                >
                  <NeedCard
                    :need="need"
                    :institution="institution!"
                    @donate="openDonationDialog"
                  />
                </v-col>
              </v-row>

              <!-- Empty state para necessidades -->
              <div v-if="filteredNeeds.length === 0" class="empty-needs">
                <v-card class="text-center pa-8" variant="outlined">
                  <v-icon size="64" color="grey-lighten-1">mdi-heart-outline</v-icon>
                  <h3 class="mt-4 mb-2">Nenhuma necessidade encontrada</h3>
                  <p class="text-grey">Esta instituição não possui necessidades no momento ou nos filtros selecionados</p>
                </v-card>
              </div>
            </div>
          </v-tabs-window-item>

          <!-- Tab: Sobre -->
          <v-tabs-window-item value="about">
            <div class="about-section">
              <v-card>
                <v-card-text>
                  <h3 class="mb-4">📋 Sobre a Instituição</h3>
                  <p class="text-body-1 mb-4">{{ institution?.about }}</p>
                  
                  <v-divider class="my-4" />
                  
                  <div class="info-grid">
                    <div class="info-item">
                      <h4 class="text-subtitle-1 mb-2">
                        <v-icon class="mr-2">mdi-calendar</v-icon>
                        Fundada em
                      </h4>
                      <p>{{ formatDate(institution?.createdAt) }}</p>
                    </div>
                    
                    <div class="info-item">
                      <h4 class="text-subtitle-1 mb-2">
                        <v-icon class="mr-2">mdi-account-group</v-icon>
                        Pessoas Atendidas
                      </h4>
                      <p>Aproximadamente 100+ pessoas mensalmente</p>
                    </div>
                    
                    <div class="info-item">
                      <h4 class="text-subtitle-1 mb-2">
                        <v-icon class="mr-2">mdi-certificate</v-icon>
                        Certificações
                      </h4>
                      <div class="certificates">
                        <v-chip
                          v-if="institution?.verified"
                          color="success"
                          size="small"
                          class="mr-2 mb-2"
                        >
                          <v-icon start size="16">mdi-check-decagram</v-icon>
                          Verificada SolidarityApp
                        </v-chip>
                        <v-chip
                          color="info"
                          size="small"
                          class="mr-2 mb-2"
                        >
                          <v-icon start size="16">mdi-shield-check</v-icon>
                          CNPJ Ativo
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-tabs-window-item>

          <!-- Tab: Contato -->
          <v-tabs-window-item value="contact">
            <div class="contact-section">
              <v-row>
                <v-col cols="12" md="6">
                  <v-card>
                    <v-card-text>
                      <h3 class="mb-4">📞 Informações de Contato</h3>
                      
                      <div class="contact-methods">
                        <div class="contact-item">
                          <v-btn
                            :href="`tel:${institution?.contact.phone}`"
                            color="primary"
                            variant="outlined"
                            block
                            size="large"
                            class="mb-3"
                          >
                            <v-icon start>mdi-phone</v-icon>
                            {{ institution?.contact.phone }}
                          </v-btn>
                        </div>
                        
                        <div v-if="institution?.contact.whatsapp" class="contact-item">
                          <v-btn
                            :href="`https://wa.me/${institution?.contact.whatsapp?.replace(/\D/g, '')}`"
                            color="success"
                            variant="outlined"
                            block
                            size="large"
                            class="mb-3"
                          >
                            <v-icon start>mdi-whatsapp</v-icon>
                            WhatsApp
                          </v-btn>
                        </div>
                        
                        <div class="contact-item">
                          <v-btn
                            :href="`mailto:${institution?.contact.email}`"
                            color="info"
                            variant="outlined"
                            block
                            size="large"
                            class="mb-3"
                          >
                            <v-icon start>mdi-email</v-icon>
                            {{ institution?.contact.email }}
                          </v-btn>
                        </div>
                        
                        <div v-if="institution?.contact.website" class="contact-item">
                          <v-btn
                            :href="institution?.contact.website"
                            target="_blank"
                            color="secondary"
                            variant="outlined"
                            block
                            size="large"
                          >
                            <v-icon start>mdi-web</v-icon>
                            Website
                          </v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-card>
                    <v-card-text>
                      <h3 class="mb-4">📍 Localização</h3>
                      
                      <div class="location-info">
                        <p class="text-body-1 mb-3">
                          <v-icon class="mr-2">mdi-map-marker</v-icon>
                          {{ institution?.location.address }}<br>
                          {{ institution?.location.city }}, {{ institution?.location.state }}<br>
                          CEP: {{ institution?.location.zipCode }}
                        </p>
                        
                        <v-btn
                          :href="getMapsUrl()"
                          target="_blank"
                          color="primary"
                          variant="flat"
                          block
                          size="large"
                        >
                          <v-icon start>mdi-directions</v-icon>
                          Como Chegar
                        </v-btn>
                      </div>
                      
                      <!-- Mini mapa pode ser adicionado aqui -->
                      <div class="mini-map mt-4">
                        <v-card
                          height="200"
                          color="grey-lighten-3"
                          class="d-flex align-center justify-center"
                        >
                          <div class="text-center">
                            <v-icon size="48" color="grey">mdi-map</v-icon>
                            <p class="mt-2 text-grey">Mapa em breve</p>
                          </div>
                        </v-card>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-tabs-window-item>

          <!-- Tab: Impacto -->
          <v-tabs-window-item value="impact">
            <div class="impact-section">
              <v-row>
                <v-col cols="12" md="8">
                  <v-card>
                    <v-card-text>
                      <h3 class="mb-4">📊 Histórico de Impacto</h3>
                      
                      <!-- Stats cards -->
                      <v-row class="mb-4">
                        <v-col cols="6" sm="3">
                          <v-card variant="tonal" color="primary">
                            <v-card-text class="text-center">
                              <div class="text-h4">{{ institution?.totalDonations }}</div>
                              <div class="text-caption">Doações Recebidas</div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-card variant="tonal" color="success">
                            <v-card-text class="text-center">
                              <div class="text-h4">{{ activeNeedsCount }}</div>
                              <div class="text-caption">Necessidades Ativas</div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-card variant="tonal" color="info">
                            <v-card-text class="text-center">
                              <div class="text-h4">{{ institution?.rating }}</div>
                              <div class="text-caption">Avaliação</div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                        <v-col cols="6" sm="3">
                          <v-card variant="tonal" color="warning">
                            <v-card-text class="text-center">
                              <div class="text-h4">100+</div>
                              <div class="text-caption">Pessoas Ajudadas</div>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                      
                      <!-- Timeline de doações recentes -->
                      <h4 class="mb-3">Doações Recentes</h4>
                      <v-timeline
                        density="compact"
                        truncate-line="both"
                      >
                        <v-timeline-item
                          v-for="(donation, index) in recentDonations"
                          :key="index"
                          dot-color="primary"
                          size="small"
                        >
                          <div class="timeline-content">
                            <h5>{{ donation.description }}</h5>
                            <p class="text-caption text-grey">{{ formatTimeAgo(donation.createdAt) }}</p>
                          </div>
                        </v-timeline-item>
                      </v-timeline>
                    </v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="12" md="4">
                  <v-card>
                    <v-card-text>
                      <h3 class="mb-4">🏆 Conquistas</h3>
                      
                      <div class="achievements">
                        <v-card
                          v-for="achievement in achievements"
                          :key="achievement.id"
                          variant="outlined"
                          class="mb-3"
                        >
                          <v-card-text class="pa-3">
                            <div class="d-flex align-center">
                              <v-icon
                                :color="achievement.color"
                                size="32"
                                class="mr-3"
                              >
                                {{ achievement.icon }}
                              </v-icon>
                              <div>
                                <h5>{{ achievement.title }}</h5>
                                <p class="text-caption mb-0">{{ achievement.description }}</p>
                              </div>
                            </div>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-container>
    </div>

    <!-- Botão flutuante de doação -->
    <v-fab
      color="primary"
      location="bottom end"
      size="large"
      icon="mdi-heart"
      @click="openGeneralDonationDialog"
    />

    <!-- Dialog de doação -->
    <DonationDialog
      v-model="donationDialog"
      :institution="institution"
      :selected-need="selectedNeed"
      @confirm="onDonationConfirm"
    />

    <!-- Loading overlay -->
    <v-overlay
      v-model="loading"
      class="align-center justify-center"
    >
      <v-progress-circular
        color="primary"
        size="64"
        indeterminate
      />
    </v-overlay>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInstitutionsStore } from '../stores/institutions'
import type { Institution, Need } from '../types/interfaces'
import { 
  institutionTypeOptions, 
  needCategoryOptions,
  mockDonations 
} from '../mock/data'
import NeedCard from '../components/institution/NeedCard.vue'
import DonationDialog from '../components/institution/DonationDialog.vue'

const route = useRoute()
const router = useRouter()
const institutionsStore = useInstitutionsStore()

// Reactive state
const institution = ref<Institution | null>(null)
const loading = ref(true)
const activeTab = ref('needs')
const needsFilter = ref<string[]>([])
const selectedNeed = ref<Need | null>(null)
const donationDialog = ref(false)

// Computed
const filteredNeeds = computed(() => {
  if (!institution.value) return []
  
  let needs = institution.value.needs.filter(need => !need.fulfilled)
  
  if (needsFilter.value.length > 0) {
    needs = needs.filter(need => needsFilter.value.includes(need.category))
  }
  
  return needs.sort((a, b) => {
    const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
  })
})

const availableCategories = computed(() => {
  if (!institution.value) return []
  
  const categories = new Set(institution.value.needs.map(need => need.category))
  return needCategoryOptions.filter(cat => categories.has(cat.value))
})

const activeNeedsCount = computed(() => {
  return institution.value?.needs.filter(need => !need.fulfilled).length || 0
})

const recentDonations = computed(() => {
  return mockDonations
    .filter(donation => donation.institutionId === institution.value?.id)
    .slice(0, 5)
})

const achievements = computed(() => [
  {
    id: 1,
    title: 'Instituição Verificada',
    description: 'Documentação validada',
    icon: 'mdi-check-decagram',
    color: 'success'
  },
  {
    id: 2,
    title: 'Transparência Total',
    description: 'Relatórios públicos',
    icon: 'mdi-eye',
    color: 'info'
  },
  {
    id: 3,
    title: 'Bem Avaliada',
    description: `${institution.value?.rating}/5 estrelas`,
    icon: 'mdi-star',
    color: 'warning'
  }
])

// Methods
const getTypeIcon = (type: string | undefined) => {
  return institutionTypeOptions.find(opt => opt.value === type)?.icon || 'mdi-home'
}

const getTypeLabel = (type: string | undefined) => {
  return institutionTypeOptions.find(opt => opt.value === type)?.title || type
}

const getTypeColor = (type: string | undefined) => {
  const colors = {
    shelter: 'deep-purple',
    education: 'blue',
    health: 'red',
    elderly: 'orange',
    children: 'pink',
    animals: 'brown',
    environment: 'green',
    religious: 'indigo',
    community: 'teal'
  }
  return colors[type] || 'grey'
}

const formatDistance = (distance: number | undefined) => {
  if (!distance) return ''
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m de você`
  }
  return `${distance.toFixed(1)}km de você`
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long'
  })
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Hoje'
  if (days === 1) return 'Há 1 dia'
  if (days < 7) return `Há ${days} dias`
  if (days < 30) return `Há ${Math.floor(days / 7)} semanas`
  return `Há ${Math.floor(days / 30)} meses`
}

const getMapsUrl = () => {
  if (!institution.value) return ''
  const address = encodeURIComponent(
    `${institution.value.location.address}, ${institution.value.location.city}, ${institution.value.location.state}`
  )
  return `https://www.google.com/maps/search/?api=1&query=${address}`
}

const openDonationDialog = (need: Need) => {
  selectedNeed.value = need
  donationDialog.value = true
}

const openGeneralDonationDialog = () => {
  selectedNeed.value = null
  donationDialog.value = true
}

const onDonationConfirm = (donationData: any) => {
  // Handle donation confirmation
  donationDialog.value = false
  selectedNeed.value = null
  
  // Show success message or redirect
}

// Lifecycle
onMounted(async () => {
  const institutionId = route.params.id as string
  
  try {
    const result = await institutionsStore.fetchInstitutionById(institutionId)
    if (result) {
      institution.value = result
    } else {
      // Institution not found, redirect to home
      router.push('/')
    }
  } catch (error) {
    console.error('Error loading institution:', error)
    router.push('/')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.institution-profile {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.profile-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%) !important;
}

.institution-gallery {
  height: 300px;
}

.header-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent 0%, rgba(0,0,0,0.7) 100%);
  color: white;
  padding: 32px 0 24px;
}

.institution-basic-info {
  .badges-row {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .institution-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 8px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  }
  
  .institution-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 16px;
    line-height: 1.5;
  }
  
  .stats-row {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.9rem;
    
    .rating-text {
      margin-left: 4px;
    }
  }
}

.profile-content {
  background: rgb(var(--v-theme-background));
  border-radius: 24px 24px 0 0;
  margin-top: -24px;
  position: relative;
  z-index: 1;
  min-height: 60vh;
}

.content-tabs {
  margin-top: 24px;
}

.needs-section {
  .needs-filters {
    background: rgb(var(--v-theme-surface));
    padding: 16px;
    border-radius: 12px;
    border: 1px solid rgba(var(--v-border-color), 0.2);
  }
}

.about-section {
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-top: 16px;
  }
  
  .info-item {
    h4 {
      color: rgb(var(--v-theme-primary));
      margin-bottom: 8px;
    }
  }
  
  .certificates {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.contact-section {
  .contact-methods {
    .contact-item {
      margin-bottom: 12px;
    }
  }
  
  .location-info {
    p {
      line-height: 1.6;
    }
  }
  
  .mini-map {
    border-radius: 12px;
    overflow: hidden;
  }
}

.impact-section {
  .timeline-content {
    h5 {
      margin-bottom: 4px;
      color: rgb(var(--v-theme-on-surface));
    }
  }
  
  .achievements {
    .achievement-card {
      border-left: 4px solid rgb(var(--v-theme-primary));
    }
  }
}

.empty-needs {
  margin-top: 32px;
}

// Mobile responsiveness
@media (max-width: 600px) {
  .institution-title {
    font-size: 1.5rem !important;
  }
  
  .institution-subtitle {
    font-size: 1rem !important;
  }
  
  .stats-row {
    gap: 16px !important;
  }
  
  .stat-item {
    font-size: 0.85rem !important;
  }
  
  .info-grid {
    grid-template-columns: 1fr !important;
    gap: 16px !important;
  }
}

// Dark theme adjustments
.v-theme--dark {
  .profile-header {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  }
  
  .header-overlay {
    background: linear-gradient(transparent 0%, rgba(0,0,0,0.8) 100%);
  }
}
</style>