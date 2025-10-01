<template>
  <v-card elevation="1" rounded="lg" class="mb-3" hover>
    <v-card-text class="pa-4">
      <div class="d-flex align-start">
        <!-- Status Icon -->
        <v-avatar :color="getStatusColor(donation.status)" size="40" class="mr-3 flex-shrink-0">
          <v-icon color="white" size="20">
            {{ getStatusIcon(donation.status) }}
          </v-icon>
        </v-avatar>

        <!-- Content -->
        <div class="flex-grow-1">
          <!-- Header -->
          <div class="d-flex align-center justify-space-between mb-2">
            <h4 class="text-subtitle-1 font-weight-medium">{{ donation.description }}</h4>
            <v-chip :color="getStatusColor(donation.status)" size="small" variant="tonal">
              {{ getStatusText(donation.status) }}
            </v-chip>
          </div>

          <!-- Institution Info -->
          <div class="mb-2">
            <v-btn
              variant="text"
              size="small"
              color="primary"
              @click="viewInstitution"
              class="pa-0 text-none"
            >
              <v-icon start size="16">mdi-home-heart</v-icon>
              {{ institutionName }}
            </v-btn>
          </div>

          <!-- Details -->
          <div class="d-flex flex-wrap ga-4 mb-3">
            <div
              v-if="donation.quantity"
              class="d-flex align-center text-body-2 text-medium-emphasis"
            >
              <v-icon size="16" class="mr-1">mdi-cube-outline</v-icon>
              <span>{{ donation.quantity }}</span>
            </div>

            <div class="d-flex align-center text-body-2 text-medium-emphasis">
              <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
              <span>{{ formatDate(donation.createdAt) }}</span>
            </div>

            <div
              v-if="donation.scheduledDate"
              class="d-flex align-center text-body-2 text-medium-emphasis"
            >
              <v-icon size="16" class="mr-1">mdi-clock-outline</v-icon>
              <span>Agendado para {{ formatDate(donation.scheduledDate) }}</span>
            </div>
          </div>

          <!-- Feedback -->
          <div v-if="donation.feedback" class="mb-3">
            <v-alert color="success" variant="tonal" density="compact">
              <div class="d-flex align-start">
                <v-icon class="mr-2 flex-shrink-0" size="16">mdi-message-text</v-icon>
                <div>
                  <div class="font-weight-medium mb-1">Feedback da instituição:</div>
                  <div class="text-body-2 font-italic">"{{ donation.feedback }}"</div>
                </div>
              </div>
            </v-alert>
          </div>

          <!-- Photos -->
          <div v-if="donation.photos && donation.photos.length > 0">
            <h5 class="text-subtitle-2 mb-2">Fotos da doação:</h5>
            <div class="d-flex ga-2 flex-wrap">
              <v-img
                v-for="(photo, index) in donation.photos"
                :key="index"
                :src="photo"
                width="80"
                height="80"
                cover
                rounded="lg"
              />
            </div>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Donation, DonationStatus } from '../../types/interfaces'
import { findInstitutionById } from '../../mock/data'

interface Props {
  donation: Donation
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'view-institution': [institutionId: string]
}>()

// Computed
const institutionName = computed(() => {
  const institution = findInstitutionById(props.donation.institutionId)
  return institution?.name || 'Instituição não encontrada'
})

// Methods
const getStatusColor = (status: DonationStatus): string => {
  const colors = {
    pending: 'warning',
    confirmed: 'info',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error',
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status: DonationStatus): string => {
  const icons = {
    pending: 'mdi-clock-outline',
    confirmed: 'mdi-check-circle-outline',
    in_progress: 'mdi-truck-delivery-outline',
    completed: 'mdi-heart',
    cancelled: 'mdi-close-circle-outline',
  }
  return icons[status] || 'mdi-help-circle-outline'
}

const getStatusText = (status: DonationStatus): string => {
  const texts = {
    pending: 'Pendente',
    confirmed: 'Confirmada',
    in_progress: 'Em andamento',
    completed: 'Concluída',
    cancelled: 'Cancelada',
  }
  return texts[status] || 'Desconhecido'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const viewInstitution = () => {
  emit('view-institution', props.donation.institutionId)
}
</script>
