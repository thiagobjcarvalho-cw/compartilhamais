<template>
  <v-card elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center justify-space-between pa-4">
      <div class="d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-filter-variant</v-icon>
        <span class="text-h6">Filtros</span>
      </div>
      <v-btn size="small" variant="text" color="grey" @click="clearFilters"> Limpar </v-btn>
    </v-card-title>

    <v-card-text class="pa-4 pt-0">
      <!-- Filtro por Tipo de Instituição -->
      <div class="mb-6">
        <h4 class="text-subtitle-1 font-weight-medium mb-3">Tipo de Instituição</h4>
        <v-chip-group
          :model-value="filters.types"
          @update:model-value="updateFilter('types', $event)"
          multiple
          color="primary"
        >
          <v-chip
            v-for="type in institutionTypes"
            :key="type.value"
            :value="type.value"
            size="small"
            filter
          >
            <v-icon start size="16">{{ type.icon }}</v-icon>
            {{ type.title }}
          </v-chip>
        </v-chip-group>
      </div>

      <!-- Filtro por Categoria de Necessidade -->
      <div class="mb-6">
        <h4 class="text-subtitle-1 font-weight-medium mb-3">Categorias de Necessidade</h4>
        <v-chip-group
          :model-value="filters.categories"
          @update:model-value="updateFilter('categories', $event)"
          multiple
          color="secondary"
        >
          <v-chip
            v-for="category in needCategories"
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

      <!-- Filtro por Urgência -->
      <div class="mb-6">
        <h4 class="text-subtitle-1 font-weight-medium mb-3">Nível de Urgência</h4>
        <v-chip-group
          :model-value="filters.urgency"
          @update:model-value="updateFilter('urgency', $event)"
          multiple
          color="warning"
        >
          <v-chip
            v-for="urgency in urgencyLevels"
            :key="urgency.value"
            :value="urgency.value"
            size="small"
            filter
            :color="urgency.color"
          >
            <v-icon start size="16">{{ urgency.icon }}</v-icon>
            {{ urgency.title }}
          </v-chip>
        </v-chip-group>
      </div>

      <!-- Filtro por Distância -->
      <div class="mb-6">
        <h4 class="text-subtitle-1 font-weight-medium mb-3">Distância Máxima</h4>
        <v-slider
          :model-value="filters.maxDistance"
          @update:model-value="updateFilter('maxDistance', $event)"
          :min="1"
          :max="20"
          :step="1"
          thumb-label
          color="primary"
          class="mb-2"
        >
          <template #thumb-label="{ modelValue }"> {{ modelValue }}km </template>
        </v-slider>
        <p class="text-caption text-grey">
          Mostrar instituições em um raio de {{ filters.maxDistance }}km
        </p>
      </div>

      <!-- Filtro de Verificação -->
      <div>
        <v-switch
          :model-value="filters.verified"
          @update:model-value="updateFilter('verified', $event)"
          label="Apenas instituições verificadas"
          color="success"
          hide-details
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { InstitutionFilters } from '@/types/interfaces'

interface Props {
  filters: InstitutionFilters
}

defineProps<Props>()

const emit = defineEmits<{
  update: [filters: Partial<InstitutionFilters>]
  clear: []
}>()

// Mock data - em produção viriam das stores
const institutionTypes = [
  { value: 'shelter', title: 'Abrigos', icon: 'mdi-home-heart' },
  { value: 'education', title: 'Educação', icon: 'mdi-school' },
  { value: 'health', title: 'Saúde', icon: 'mdi-hospital-box' },
  { value: 'elderly', title: 'Idosos', icon: 'mdi-account-supervisor' },
]

const needCategories = [
  { value: 'food', title: 'Alimentos', icon: 'mdi-food' },
  { value: 'clothes', title: 'Roupas', icon: 'mdi-tshirt-crew' },
  { value: 'hygiene', title: 'Higiene', icon: 'mdi-shower' },
  { value: 'medical', title: 'Médico', icon: 'mdi-medical-bag' },
]

const urgencyLevels = [
  { value: 'low', title: 'Baixa', color: 'success', icon: 'mdi-circle' },
  { value: 'medium', title: 'Média', color: 'warning', icon: 'mdi-circle' },
  { value: 'high', title: 'Alta', color: 'error', icon: 'mdi-circle' },
  { value: 'critical', title: 'Crítica', color: 'error', icon: 'mdi-alert-circle' },
]

const updateFilter = (key: keyof InstitutionFilters, value: unknown) => {
  emit('update', { [key]: value })
}

const clearFilters = () => {
  emit('clear')
}
</script>
