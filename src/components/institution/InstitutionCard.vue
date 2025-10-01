<template>
  <v-card
    :class="['institution-card', { 'list-variant': variant === 'list' }]"
    :elevation="hover ? 8 : 2"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="handleClick"
  >
    <!-- Imagem da instituição -->
    <div v-if="!isListVariant" class="image-container">
      <v-img :src="institutionImage" height="200" cover class="institution-image">
        <!-- Overlay com badges -->
        <div class="image-overlay">
          <v-chip v-if="institution.verified" color="success" size="small" class="verified-badge">
            <v-icon start size="small">mdi-check-circle</v-icon>
            Verificada
          </v-chip>

          <v-chip v-if="hasUrgentNeeds" color="error" size="small" class="urgent-badge">
            <v-icon start size="small">mdi-alert-circle</v-icon>
            Urgente
          </v-chip>
        </div>

        <!-- Distância -->
        <div v-if="institution.location.distance" class="distance-badge">
          <v-chip color="white" variant="elevated" size="small">
            <v-icon start size="small">mdi-map-marker-distance</v-icon>
            {{ institution.location.distance.toFixed(1) }}km
          </v-chip>
        </div>
      </v-img>
    </div>

    <!-- Conteúdo principal -->
    <v-card-title class="pb-2">
      <div class="d-flex align-center">
        <v-icon :color="typeIcon.color" class="mr-2">{{ typeIcon.icon }}</v-icon>
        <span class="text-truncate">{{ institution.name }}</span>
        <v-spacer />

        <!-- Rating (se disponível) -->
        <v-rating
          v-if="institution.rating"
          :model-value="institution.rating"
          color="amber"
          density="compact"
          readonly
          size="small"
        />
      </div>
    </v-card-title>

    <v-card-subtitle class="pt-0">
      <div class="d-flex align-center mb-1">
        <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
        <span class="text-truncate"
          >{{ institution.location.city }}, {{ institution.location.state }}</span
        >
      </div>

      <!-- Lista de badges no modo lista -->
      <div v-if="isListVariant" class="d-flex align-center mt-2">
        <v-chip
          v-if="institution.verified"
          color="success"
          variant="outlined"
          size="x-small"
          class="mr-1"
        >
          <v-icon start size="x-small">mdi-check-circle</v-icon>
          Verificada
        </v-chip>

        <v-chip v-if="institution.location.distance" variant="outlined" size="x-small" class="mr-1">
          <v-icon start size="x-small">mdi-map-marker-distance</v-icon>
          {{ institution.location.distance.toFixed(1) }}km
        </v-chip>

        <v-chip v-if="hasUrgentNeeds" color="error" variant="outlined" size="x-small">
          <v-icon start size="x-small">mdi-alert-circle</v-icon>
          Urgente
        </v-chip>
      </div>
    </v-card-subtitle>

    <v-card-text>
      <p
        class="text-body-2 mb-3"
        :class="{ 'line-clamp-2': !isListVariant, 'line-clamp-3': isListVariant }"
      >
        {{ institution.description }}
      </p>

      <!-- Necessidades atuais -->
      <div v-if="activeNeeds.length" class="needs-section mb-3">
        <div class="text-caption text-medium-emphasis mb-1">
          Necessidades atuais ({{ activeNeeds.length }}):
        </div>

        <div class="d-flex flex-wrap gap-1">
          <v-chip
            v-for="need in displayNeeds"
            :key="need.id"
            :color="getCategoryColor(need.category)"
            variant="outlined"
            size="x-small"
          >
            <v-icon start size="x-small">{{ getCategoryIcon(need.category) }}</v-icon>
            {{ getCategoryLabel(need.category) }}
            <v-badge
              v-if="need.urgency === 'critical' || need.urgency === 'high'"
              :color="getUrgencyColor(need.urgency)"
              dot
              inline
            />
          </v-chip>

          <v-chip
            v-if="activeNeeds.length > maxDisplayNeeds"
            variant="outlined"
            size="x-small"
            color="grey"
          >
            +{{ activeNeeds.length - maxDisplayNeeds }}
          </v-chip>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="stats-section">
        <v-row dense>
          <v-col cols="6">
            <div class="stat-item">
              <v-icon size="small" color="primary">mdi-heart-multiple</v-icon>
              <span class="text-caption ml-1">{{ institution.totalDonations || 0 }} doações</span>
            </div>
          </v-col>
          <v-col cols="6">
            <div class="stat-item">
              <v-icon size="small" color="success">mdi-hand-heart</v-icon>
              <span class="text-caption ml-1">{{ activeNeeds.length }} necessidades</span>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <!-- Ações -->
    <v-card-actions class="pt-0">
      <v-btn variant="text" size="small" @click.stop="handleViewDetails">
        <v-icon start size="small">mdi-eye</v-icon>
        Ver Detalhes
      </v-btn>

      <v-spacer />

      <v-btn
        color="primary"
        variant="elevated"
        size="small"
        :disabled="!activeNeeds.length"
        @click.stop="handleDonate"
      >
        <v-icon start size="small">mdi-heart</v-icon>
        {{ activeNeeds.length ? 'Doar' : 'Sem necessidades' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Institution } from '@/types/interfaces'
import { InstitutionType, NeedCategory, UrgencyLevel } from '@/types/interfaces'

// Props
interface Props {
  institution: Institution
  variant?: 'card' | 'list'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'card',
})

// Emits
const emit = defineEmits<{
  click: []
  donate: []
  viewDetails: []
}>()

// Estado local
const hover = ref(false)

// Computed
const isListVariant = computed(() => props.variant === 'list')

// ✅ OTIMIZAÇÃO MÍNIMA: Apenas 1 necessidade extra no modo lista
const maxDisplayNeeds = computed(() => (isListVariant.value ? 4 : 3))

const activeNeeds = computed(() => {
  return props.institution.needs.filter((need) => !need.fulfilled)
})

const displayNeeds = computed(() => {
  return activeNeeds.value.slice(0, maxDisplayNeeds.value)
})

const hasUrgentNeeds = computed(() => {
  return activeNeeds.value.some(
    (need) => need.urgency === UrgencyLevel.CRITICAL || need.urgency === UrgencyLevel.HIGH,
  )
})

const institutionImage = computed(() => {
  if (props.institution.images && props.institution.images.length > 0) {
    return props.institution.images[0]
  }
  // Imagem placeholder baseada no tipo
  const placeholderMap: Record<string, string> = {
    [InstitutionType.SHELTER]: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    [InstitutionType.EDUCATION]: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    [InstitutionType.HEALTH]: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
    [InstitutionType.ELDERLY]: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80',
    [InstitutionType.ANIMAL]: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&q=80',
    [InstitutionType.ENVIRONMENT]: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
    [InstitutionType.FOOD]: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
  }

  return placeholderMap[props.institution.type] || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80'
})

const typeIcon = computed(() => {
  const typeMap: Record<string, { icon: string; color: string }> = {
    [InstitutionType.SHELTER]: { icon: 'mdi-home-heart', color: 'blue' },
    [InstitutionType.EDUCATION]: { icon: 'mdi-school', color: 'green' },
    [InstitutionType.HEALTH]: { icon: 'mdi-hospital-box', color: 'red' },
    [InstitutionType.ELDERLY]: { icon: 'mdi-account-supervisor', color: 'purple' },
    [InstitutionType.ANIMAL]: { icon: 'mdi-paw', color: 'orange' },
    [InstitutionType.ENVIRONMENT]: { icon: 'mdi-leaf', color: 'teal' },
    [InstitutionType.FOOD]: { icon: 'mdi-food-apple', color: 'amber' },
  }
  return typeMap[props.institution.type] || { icon: 'mdi-help-circle', color: 'grey' }
})

// Methods - Mapeamentos completos e type-safe
const getCategoryColor = (category: NeedCategory): string => {
  const colorMap: Record<string, string> = {
    [NeedCategory.FOOD]: 'red',
    [NeedCategory.CLOTHES]: 'blue',
    [NeedCategory.HYGIENE]: 'cyan',
    [NeedCategory.EDUCATION]: 'orange',
    [NeedCategory.MEDICAL]: 'pink',
    [NeedCategory.SHELTER]: 'purple',
    [NeedCategory.ELECTRONICS]: 'indigo',
    [NeedCategory.VOLUNTEERS]: 'teal',
    [NeedCategory.OTHER]: 'grey',
  }
  return colorMap[category] || 'grey'
}

const getCategoryIcon = (category: NeedCategory): string => {
  const iconMap: Record<string, string> = {
    [NeedCategory.FOOD]: 'mdi-food',
    [NeedCategory.CLOTHES]: 'mdi-tshirt-crew',
    [NeedCategory.HYGIENE]: 'mdi-shower',
    [NeedCategory.EDUCATION]: 'mdi-book-open',
    [NeedCategory.MEDICAL]: 'mdi-medical-bag',
    [NeedCategory.SHELTER]: 'mdi-home',
    [NeedCategory.ELECTRONICS]: 'mdi-laptop',
    [NeedCategory.VOLUNTEERS]: 'mdi-account-group',
    [NeedCategory.OTHER]: 'mdi-gift',
  }
  return iconMap[category] || 'mdi-help-circle'
}

const getCategoryLabel = (category: NeedCategory): string => {
  const labelMap: Record<string, string> = {
    [NeedCategory.FOOD]: 'Alimentos',
    [NeedCategory.CLOTHES]: 'Roupas',
    [NeedCategory.HYGIENE]: 'Higiene',
    [NeedCategory.EDUCATION]: 'Educação',
    [NeedCategory.MEDICAL]: 'Médico',
    [NeedCategory.SHELTER]: 'Abrigo',
    [NeedCategory.ELECTRONICS]: 'Eletrônicos',
    [NeedCategory.VOLUNTEERS]: 'Voluntários',
    [NeedCategory.OTHER]: 'Outros',
  }
  return labelMap[category] || 'Outro'
}

const getUrgencyColor = (urgency: UrgencyLevel): string => {
  const urgencyMap: Record<string, string> = {
    [UrgencyLevel.LOW]: 'success',
    [UrgencyLevel.MEDIUM]: 'warning',
    [UrgencyLevel.HIGH]: 'orange',
    [UrgencyLevel.CRITICAL]: 'error',
  }
  return urgencyMap[urgency] || 'grey'
}

const handleClick = () => {
  emit('click')
}

const handleViewDetails = () => {
  emit('viewDetails')
  emit('click') // Também emite click para compatibilidade
}

const handleDonate = () => {
  emit('donate')
}
</script>

<style scoped>
.institution-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 12px;
  overflow: hidden;
}

.institution-card:hover {
  transform: translateY(-4px);
}

/* ✅ MODO LISTA: Mantém estrutura original + melhorias mínimas */
.list-variant {
  display: flex;
  flex-direction: row;
  max-height: 200px;
}

.list-variant .image-container {
  flex-shrink: 0;
  width: 200px;
}

.image-container {
  position: relative;
}

.institution-image {
  border-radius: 0;
}

.image-overlay {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.distance-badge {
  position: absolute;
  bottom: 8px;
  right: 8px;
}

.verified-badge,
.urgent-badge {
  backdrop-filter: blur(4px);
}

.needs-section {
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: 8px;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 4px;
  padding: 8px;
}

.stats-section {
  background: rgba(var(--v-theme-surface), 0.3);
  border-radius: 4px;
  padding: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gap-1 {
  gap: 4px;
}

/* ✅ RESPONSIVIDADE: Mantém original para garantir funcionamento */
@media (max-width: 768px) {
  .list-variant {
    flex-direction: column;
    max-height: none;
  }

  .list-variant .image-container {
    width: 100%;
  }
}
</style>
