<template>
  <v-card
    :class="['text-center', unlocked ? 'elevation-4' : 'elevation-1', unlocked ? '' : 'opacity-70']"
    :color="unlocked ? 'surface' : 'surface-variant'"
    rounded="lg"
    hover
  >
    <v-card-text class="pa-4">
      <!-- Achievement Icon -->
      <div class="position-relative d-inline-block mb-3">
        <v-avatar :color="unlocked ? achievement.color : 'grey-lighten-3'" size="64">
          <v-icon :color="unlocked ? 'white' : 'grey'" size="32">
            {{ achievement.icon }}
          </v-icon>
        </v-avatar>

        <!-- Lock overlay -->
        <v-avatar
          v-if="!unlocked"
          color="grey-darken-2"
          size="24"
          class="position-absolute lock-overlay"
        >
          <v-icon color="white" size="16">mdi-lock</v-icon>
        </v-avatar>
      </div>

      <!-- Achievement Title -->
      <h4 class="mb-2 font-weight-medium" :class="unlocked ? 'text-on-surface' : 'text-grey'">
        {{ achievement.title }}
      </h4>

      <!-- Achievement Description -->
      <p
        class="text-caption mb-3"
        :class="unlocked ? 'text-on-surface-variant' : 'text-grey-lighten-1'"
      >
        {{ achievement.description }}
      </p>

      <!-- Achievement Status -->
      <v-chip
        :color="unlocked ? 'success' : 'grey-lighten-2'"
        :variant="unlocked ? 'flat' : 'outlined'"
        size="small"
        class="mb-3"
      >
        <v-icon start size="16">
          {{ unlocked ? 'mdi-check-circle' : 'mdi-lock' }}
        </v-icon>
        {{ unlocked ? 'Conquistado' : 'Bloqueado' }}
      </v-chip>

      <!-- Progress bar -->
      <div v-if="achievement.progress !== undefined">
        <div class="d-flex justify-space-between align-center mb-1">
          <span class="text-caption">Progresso</span>
          <span class="text-caption">{{ achievement.progress }}%</span>
        </div>
        <v-progress-linear
          :model-value="achievement.progress"
          :color="unlocked ? achievement.color : 'grey'"
          height="6"
          rounded
          class="mb-2"
        />
      </div>

      <!-- Unlock date -->
      <div v-if="unlocked && achievement.unlockedAt" class="border-t pt-2">
        <p class="text-caption text-grey">
          Conquistado em {{ formatUnlockDate(achievement.unlockedAt) }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  color: string
  progress?: number
  unlockedAt?: string
  isNew?: boolean
}

interface Props {
  achievement: Achievement
  unlocked: boolean
}

defineProps<Props>()

const formatUnlockDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
</script>

<style scoped>
.border-t {
  border-top: 1px solid rgba(var(--v-border-color), 0.2);
}

.opacity-70 {
  opacity: 0.7;
}

.lock-overlay {
  bottom: -4px;
  right: -4px;
  border: 2px solid white;
}
</style>
