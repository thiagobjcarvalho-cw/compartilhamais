<template>
  <v-card class="institution-profile" elevation="0" height="100%">
    <!-- Header do Perfil -->
    <v-card-title class="d-flex justify-space-between align-center pa-4">
      <div class="d-flex align-center">
        <v-icon class="mr-2" :color="typeIcon.color">{{ typeIcon.icon }}</v-icon>
        <span class="text-h6">{{ institution.name }}</span>
      </div>
      <v-btn icon variant="text" size="small" @click="handleClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-divider />

    <!-- Conteúdo do Perfil -->
    <v-card-text class="pa-0" style="overflow-y: auto; max-height: calc(100vh - 200px)">
      <!-- Imagens da Instituição -->
      <div v-if="institution.images && institution.images.length" class="pa-4">
        <v-carousel
          v-if="institution.images.length > 1"
          height="200"
          hide-delimiter-background
          show-arrows="hover"
        >
          <v-carousel-item
            v-for="(image, index) in institution.images"
            :key="index"
            :src="image"
            cover
          />
        </v-carousel>

        <v-img v-else :src="institution.images[0]" height="200" cover class="rounded" />
      </div>

      <!-- Status e Verificação -->
      <div class="pa-4 pb-2">
        <div class="d-flex align-center mb-3">
          <v-chip
            :color="institution.verified ? 'success' : 'warning'"
            variant="elevated"
            size="small"
            class="mr-2"
          >
            <v-icon start>{{
              institution.verified ? 'mdi-check-circle' : 'mdi-alert-circle'
            }}</v-icon>
            {{ institution.verified ? 'Verificada' : 'Não Verificada' }}
          </v-chip>

          <v-rating
            v-if="institution.rating"
            :model-value="institution.rating"
            color="amber"
            density="compact"
            readonly
            size="small"
          />
        </div>

        <!-- Tipo da Instituição -->
        <v-chip :color="typeIcon.color" variant="outlined" size="small" class="mb-3">
          <v-icon start>{{ typeIcon.icon }}</v-icon>
          {{ typeIcon.title }}
        </v-chip>

        <!-- Descrição -->
        <p class="text-body-1 mb-3">{{ institution.description }}</p>
        <p v-if="institution.about" class="text-body-2 text-medium-emphasis">
          {{ institution.about }}
        </p>
      </div>

      <v-divider />

      <!-- Localização -->
      <div class="pa-4">
        <h3 class="text-h6 mb-3 d-flex align-center">
          <v-icon class="mr-2">mdi-map-marker</v-icon>
          Localização
        </h3>

        <div class="text-body-2">
          <div>{{ institution.location.address }}</div>
          <div>{{ institution.location.city }}, {{ institution.location.state }}</div>
          <div>CEP: {{ institution.location.zipCode }}</div>
          <div v-if="institution.location.distance" class="text-primary mt-1">
            <v-icon size="small">mdi-map-marker-distance</v-icon>
            {{ institution.location.distance.toFixed(1) }}km de distância
          </div>
        </div>
      </div>

      <v-divider />

      <!-- Informações de Contato -->
      <div class="pa-4">
        <h3 class="text-h6 mb-3 d-flex align-center">
          <v-icon class="mr-2">mdi-contact-mail</v-icon>
          Contato
        </h3>

        <v-list density="compact" class="pa-0">
          <v-list-item v-if="institution.contact.phone" prepend-icon="mdi-phone">
            <v-list-item-title>{{ institution.contact.phone }}</v-list-item-title>
            <template #append>
              <v-btn icon variant="text" size="small" :href="`tel:${institution.contact.phone}`">
                <v-icon>mdi-phone</v-icon>
              </v-btn>
            </template>
          </v-list-item>

          <v-list-item v-if="institution.contact.whatsapp" prepend-icon="mdi-whatsapp">
            <v-list-item-title>{{ institution.contact.whatsapp }}</v-list-item-title>
            <template #append>
              <v-btn
                icon
                variant="text"
                size="small"
                :href="`https://wa.me/${institution.contact.whatsapp.replace(/\D/g, '')}`"
                target="_blank"
              >
                <v-icon>mdi-whatsapp</v-icon>
              </v-btn>
            </template>
          </v-list-item>

          <v-list-item v-if="institution.contact.email" prepend-icon="mdi-email">
            <v-list-item-title>{{ institution.contact.email }}</v-list-item-title>
            <template #append>
              <v-btn icon variant="text" size="small" :href="`mailto:${institution.contact.email}`">
                <v-icon>mdi-email</v-icon>
              </v-btn>
            </template>
          </v-list-item>

          <v-list-item v-if="institution.contact.website" prepend-icon="mdi-web">
            <v-list-item-title>{{ institution.contact.website }}</v-list-item-title>
            <template #append>
              <v-btn icon variant="text" size="small" :href="safeWebsite" target="_blank">
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <div v-if="!hasContactInfo" class="text-body-2 text-medium-emphasis">
          Informações de contato não disponíveis.
        </div>
      </div>

      <v-divider />

      <!-- Necessidades Atuais -->
      <div class="pa-4">
        <h3 class="text-h6 mb-3 d-flex align-center">
          <v-icon class="mr-2">mdi-hand-heart</v-icon>
          Necessidades Atuais
          <v-chip
            v-if="activeNeeds.length"
            color="orange"
            variant="outlined"
            size="x-small"
            class="ml-2"
          >
            {{ activeNeeds.length }}
          </v-chip>
        </h3>

        <div v-if="activeNeeds.length" class="needs-container">
          <v-card
            v-for="need in activeNeeds"
            :key="need.id"
            variant="outlined"
            class="need-card mb-3"
          >
            <v-card-text class="pb-2">
              <div class="d-flex justify-space-between align-start mb-2">
                <h4 class="text-subtitle-1">{{ need.title }}</h4>
                <v-chip :color="getUrgencyColor(need.urgency)" variant="elevated" size="x-small">
                  {{ getUrgencyLabel(need.urgency) }}
                </v-chip>
              </div>

              <p class="text-body-2 mb-2">{{ need.description }}</p>

              <div class="d-flex align-center">
                <v-chip
                  :color="getCategoryColor(need.category)"
                  variant="outlined"
                  size="small"
                  class="mr-2"
                >
                  <v-icon start>{{ getCategoryIcon(need.category) }}</v-icon>
                  {{ getCategoryLabel(need.category) }}
                </v-chip>

                <span class="text-caption text-medium-emphasis">
                  Quantidade: {{ need.quantity }}
                </span>
              </div>
            </v-card-text>
          </v-card>
        </div>

        <div v-else class="text-body-2 text-medium-emphasis text-center py-4">
          <v-icon size="48" class="mb-2">mdi-check-circle-outline</v-icon>
          <div>Todas as necessidades atendidas no momento!</div>
        </div>
      </div>

      <v-divider />

      <!-- Estatísticas -->
      <div class="pa-4">
        <h3 class="text-h6 mb-3 d-flex align-center">
          <v-icon class="mr-2">mdi-chart-line</v-icon>
          Estatísticas
        </h3>

        <v-row>
          <v-col cols="6">
            <v-card variant="outlined" class="text-center pa-3">
              <div class="text-h4 text-primary">{{ institution.totalDonations || 0 }}</div>
              <div class="text-caption">Doações Recebidas</div>
            </v-card>
          </v-col>

          <v-col cols="6">
            <v-card variant="outlined" class="text-center pa-3">
              <div class="text-h4 text-success">{{ activeNeeds.length }}</div>
              <div class="text-caption">Necessidades Ativas</div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <!-- Ações -->
    <v-card-actions class="pa-4">
      <v-btn
        color="primary"
        variant="flat"
        size="large"
        block
        :disabled="!activeNeeds.length"
        @click="handleDonate"
      >
        <v-icon start>mdi-heart</v-icon>
        {{ activeNeeds.length ? 'Fazer Doação' : 'Sem Necessidades' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Institution } from '@/types/interfaces'
import { InstitutionType, NeedCategory, UrgencyLevel } from '@/types/interfaces'

// Props
interface Props {
  institution: Institution
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  donate: []
}>()

// Computed properties
const activeNeeds = computed(() => {
  return props.institution.needs.filter((need) => !need.fulfilled)
})

const typeIcon = computed(() => {
  const typeMap: Record<InstitutionType, { icon: string; color: string; title: string }> = {
    [InstitutionType.SHELTER]: { icon: 'mdi-home-heart', color: 'blue', title: 'Abrigo' },
    [InstitutionType.EDUCATION]: { icon: 'mdi-school', color: 'green', title: 'Educação' },
    [InstitutionType.HEALTH]: { icon: 'mdi-hospital-box', color: 'red', title: 'Saúde' },
    [InstitutionType.ELDERLY]: { icon: 'mdi-account-supervisor', color: 'purple', title: 'Idosos' },
    [InstitutionType.ANIMALS]: { icon: 'mdi-paw', color: 'orange', title: 'Animais' },
    [InstitutionType.ENVIRONMENT]: { icon: 'mdi-leaf', color: 'teal', title: 'Meio Ambiente' },
  }
  return (
    typeMap[props.institution.type] || { icon: 'mdi-help-circle', color: 'grey', title: 'Outro' }
  )
})

const safeWebsite = computed(() => {
  const website = props.institution.contact.website
  if (!website) return '#'

  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    return `https://${website}`
  }
  return website
})

const hasContactInfo = computed(() => {
  const contact = props.institution.contact
  return !!(contact.phone || contact.email || contact.whatsapp || contact.website)
})

// Methods - Mapeamentos completos e type-safe
const getUrgencyColor = (urgency: UrgencyLevel): string => {
  const urgencyMap: Record<UrgencyLevel, string> = {
    [UrgencyLevel.LOW]: 'success',
    [UrgencyLevel.MEDIUM]: 'warning',
    [UrgencyLevel.HIGH]: 'orange',
    [UrgencyLevel.CRITICAL]: 'error',
  }
  return urgencyMap[urgency] || 'grey'
}

const getUrgencyLabel = (urgency: UrgencyLevel): string => {
  const labelMap: Record<UrgencyLevel, string> = {
    [UrgencyLevel.LOW]: 'Baixa',
    [UrgencyLevel.MEDIUM]: 'Média',
    [UrgencyLevel.HIGH]: 'Alta',
    [UrgencyLevel.CRITICAL]: 'Crítica',
  }
  return labelMap[urgency] || 'Indefinida'
}

const getCategoryColor = (category: NeedCategory): string => {
  const colorMap: Record<NeedCategory, string> = {
    [NeedCategory.FOOD]: 'red',
    [NeedCategory.CLOTHES]: 'blue',
    [NeedCategory.HYGIENE]: 'cyan',
    [NeedCategory.EDUCATION]: 'orange',
    [NeedCategory.MEDICAL]: 'pink',
    [NeedCategory.SHELTER]: 'purple',
    [NeedCategory.ELECTRONICS]: 'indigo',
    [NeedCategory.VOLUNTEERS]: 'teal',
  }
  return colorMap[category] || 'grey'
}

const getCategoryIcon = (category: NeedCategory): string => {
  const iconMap: Record<NeedCategory, string> = {
    [NeedCategory.FOOD]: 'mdi-food',
    [NeedCategory.CLOTHES]: 'mdi-tshirt-crew',
    [NeedCategory.HYGIENE]: 'mdi-shower',
    [NeedCategory.EDUCATION]: 'mdi-book-open',
    [NeedCategory.MEDICAL]: 'mdi-medical-bag',
    [NeedCategory.SHELTER]: 'mdi-home',
    [NeedCategory.ELECTRONICS]: 'mdi-laptop',
    [NeedCategory.VOLUNTEERS]: 'mdi-account-group',
  }
  return iconMap[category] || 'mdi-help-circle'
}

const getCategoryLabel = (category: NeedCategory): string => {
  const labelMap: Record<NeedCategory, string> = {
    [NeedCategory.FOOD]: 'Alimentos',
    [NeedCategory.CLOTHES]: 'Roupas',
    [NeedCategory.HYGIENE]: 'Higiene',
    [NeedCategory.EDUCATION]: 'Educação',
    [NeedCategory.MEDICAL]: 'Médico',
    [NeedCategory.SHELTER]: 'Abrigo',
    [NeedCategory.ELECTRONICS]: 'Eletrônicos',
    [NeedCategory.VOLUNTEERS]: 'Voluntários',
  }
  return labelMap[category] || 'Outro'
}

const handleClose = () => {
  emit('close')
}

const handleDonate = () => {
  emit('donate')
}
</script>

<style scoped>
.institution-profile {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.v-card-text {
  flex: 1;
}

.needs-container {
  max-height: 300px;
  overflow-y: auto;
}

.need-card {
  border-left: 4px solid;
}

.need-card:nth-child(odd) {
  border-left-color: rgb(var(--v-theme-primary));
}

.need-card:nth-child(even) {
  border-left-color: rgb(var(--v-theme-secondary));
}
</style>
