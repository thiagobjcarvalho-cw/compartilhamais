<template>
  <v-card
    class="need-card"
    :class="{ 'urgent': isUrgent }"
    elevation="2"
    rounded="lg"
  >
    <!-- Header com categoria e urgência -->
    <div class="need-header">
      <v-chip
        :color="getCategoryColor(need.category)"
        size="small"
        variant="tonal"
        class="category-chip"
      >
        <v-icon start size="16">{{ getCategoryIcon(need.category) }}</v-icon>
        {{ getCategoryTitle(need.category) }}
      </v-chip>
      
      <v-chip
        :color="getUrgencyColor(need.urgency)"
        size="small"
        class="urgency-chip"
      >
        <v-icon start size="16">{{ getUrgencyIcon(need.urgency) }}</v-icon>
        {{ getUrgencyTitle(need.urgency) }}
      </v-chip>
    </div>

    <!-- Conteúdo principal -->
    <v-card-text class="need-content">
      <h3 class="need-title">{{ need.title }}</h3>
      <p class="need-description">{{ need.description }}</p>
      
      <!-- Quantidade se disponível -->
      <div v-if="need.quantity" class="quantity-section">
        <v-icon size="18" class="mr-2" color="primary">mdi-cube-outline</v-icon>
        <span class="quantity-text">{{ need.quantity }}</span>
      </div>
      
      <!-- Data de criação -->
      <div class="created-date">
        <v-icon size="16" class="mr-1" color="grey">mdi-clock-outline</v-icon>
        <span class="date-text">Adicionado {{ formatTimeAgo(need.createdAt) }}</span>
      </div>
    </v-card-text>

    <!-- Ações -->
    <v-card-actions class="need-actions">
      <v-btn
        :color="getUrgencyColor(need.urgency)"
        variant="flat"
        rounded="pill"
        size="large"
        block
        @click="$emit('donate', need)"
      >
        <v-icon start>mdi-heart</v-icon>
        {{ getDonateButtonText(need.urgency) }}
      </v-btn>
    </v-card-actions>

    <!-- Badge de urgência flutuante -->
    <div v-if="isUrgent" class="urgent-badge">
      <v-icon size="20">mdi-alert</v-icon>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Need, Institution } from '../../types/interfaces'
import { needCategoryOptions, urgencyLevelOptions } from '../../mock/data'

interface Props {
  need: Need
  institution: Institution
}

const props = defineProps<Props>()

defineEmits<{
  donate: [need: Need]
}>()

// Computed
const isUrgent = computed(() => {
  return props.need.urgency === 'critical' || props.need.urgency === 'high'
})

// Helper functions
const getCategoryIcon = (category: string) => {
  return needCategoryOptions.find(opt => opt.value === category)?.icon || 'mdi-circle'
}

const getCategoryTitle = (category: string) => {
  return needCategoryOptions.find(opt => opt.value === category)?.title || category
}

const getCategoryColor = (category: string) => {
  const option = needCategoryOptions.find(opt => opt.value === category)
  return option?.color || '#757575'
}

const getUrgencyIcon = (urgency: string) => {
  return urgencyLevelOptions.find(opt => opt.value === urgency)?.icon || 'mdi-circle'
}

const getUrgencyTitle = (urgency: string) => {
  return urgencyLevelOptions.find(opt => opt.value === urgency)?.title || urgency
}

const getUrgencyColor = (urgency: string) => {
  const colorMap = {
    low: 'success',
    medium: 'warning',
    high: 'error',
    critical: 'error'
  }
  return colorMap[urgency] || 'grey'
}

const getDonateButtonText = (urgency: string) => {
  const textMap = {
    low: 'Quero Ajudar',
    medium: 'Vou Ajudar',
    high: 'Ajudar Agora',
    critical: 'Ajuda Urgente!'
  }
  return textMap[urgency] || 'Quero Ajudar'
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (hours < 1) return 'há poucos minutos'
  if (hours < 24) return `há ${hours}h`
  if (days === 1) return 'há 1 dia'
  if (days < 7) return `há ${days} dias`
  if (days < 30) return `há ${Math.floor(days / 7)} semanas`
  return `há ${Math.floor(days / 30)} meses`
}
</script>

<style scoped lang="scss">
.need-card {
  position: relative;
  border: 1px solid rgba(var(--v-border-color), 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
  }
  
  &.urgent {
    border-left: 4px solid rgb(var(--v-theme-error));
    background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.02) 0%, transparent 100%);
  }
}

.need-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 0;
  gap: 8px;
}

.category-chip {
  flex: 1;
  max-width: 60%;
}

.urgency-chip {
  flex-shrink: 0;
}

.need-content {
  padding: 16px !important;
  padding-top: 12px !important;
}

.need-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 8px;
  line-height: 1.3;
}

.need-description {
  color: rgb(var(--v-theme-on-surface-variant));
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.quantity-section {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 8px 12px;
  background: rgba(var(--v-theme-primary), 0.1);
  border-radius: 8px;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

.quantity-text {
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
  font-size: 0.9rem;
}

.created-date {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.date-text {
  font-size: 0.8rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.need-actions {
  padding: 16px !important;
  padding-top: 8px !important;
}

.urgent-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: rgb(var(--v-theme-error));
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(var(--v-theme-error), 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// Mobile responsiveness
@media (max-width: 600px) {
  .need-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .category-chip,
  .urgency-chip {
    flex: none;
    max-width: none;
  }
  
  .need-title {
    font-size: 1rem;
  }
  
  .need-description {
    font-size: 0.85rem;
  }
}

// Dark theme adjustments
.v-theme--dark {
  .need-card {
    background: rgb(var(--v-theme-surface));
    
    &.urgent {
      background: linear-gradient(135deg, rgba(var(--v-theme-error), 0.1) 0%, transparent 100%);
    }
  }
  
  .quantity-section {
    background: rgba(var(--v-theme-primary), 0.2);
  }
}
</style>