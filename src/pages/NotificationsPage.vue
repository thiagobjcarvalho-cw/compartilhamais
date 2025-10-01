<template>
  <v-container class="notifications-page py-8">
    <!-- Header com ações -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold mb-2">
          <v-icon icon="mdi-bell" class="mr-2" />
          Notificações
        </h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Fique por dentro de todas as novidades e atualizações
        </p>
      </v-col>
      <v-col cols="12" md="4" class="text-md-end">
        <v-btn
          v-if="hasUnread"
          variant="tonal"
          color="primary"
          prepend-icon="mdi-check-all"
          @click="handleMarkAllAsRead"
          class="mb-2 mb-md-0 mr-2"
        >
          Marcar todas como lidas
        </v-btn>
        <v-btn
          variant="outlined"
          color="error"
          prepend-icon="mdi-delete-sweep"
          @click="confirmClearAll"
        >
          Limpar todas
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filtros -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-card elevation="0" border rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filters.type"
                  label="Tipo"
                  :items="notificationTypes"
                  clearable
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-filter"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filters.priority"
                  label="Prioridade"
                  :items="priorityLevels"
                  clearable
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-alert"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-select
                  v-model="filters.read"
                  label="Status"
                  :items="readStatus"
                  clearable
                  variant="outlined"
                  density="compact"
                  prepend-inner-icon="mdi-eye"
                />
              </v-col>
              <v-col cols="12" sm="6" md="3" class="d-flex align-center">
                <v-btn
                  variant="text"
                  color="primary"
                  @click="clearFilters"
                  prepend-icon="mdi-refresh"
                >
                  Limpar filtros
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="lg" class="text-center pa-4">
          <v-icon icon="mdi-bell-ring" size="32" color="primary" class="mb-2" />
          <div class="text-h5 font-weight-bold">{{ unreadCount }}</div>
          <div class="text-caption text-medium-emphasis">Não lidas</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="lg" class="text-center pa-4">
          <v-icon icon="mdi-alert-circle" size="32" color="error" class="mb-2" />
          <div class="text-h5 font-weight-bold">{{ urgentNotifications.length }}</div>
          <div class="text-caption text-medium-emphasis">Urgentes</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="lg" class="text-center pa-4">
          <v-icon icon="mdi-gift" size="32" color="success" class="mb-2" />
          <div class="text-h5 font-weight-bold">{{ donationCount }}</div>
          <div class="text-caption text-medium-emphasis">Doações</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card elevation="0" border rounded="lg" class="text-center pa-4">
          <v-icon icon="mdi-bell" size="32" color="grey" class="mb-2" />
          <div class="text-h5 font-weight-bold">{{ notifications.length }}</div>
          <div class="text-caption text-medium-emphasis">Total</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="isLoading">
      <v-col cols="12" class="text-center py-8">
        <v-progress-circular indeterminate color="primary" size="48" />
        <p class="text-subtitle-1 mt-4">Carregando notificações...</p>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else-if="!filteredNotifications.length">
      <v-col cols="12">
        <v-card elevation="0" border rounded="lg" class="text-center py-12">
          <v-icon
            :icon="filters.type || filters.priority || filters.read !== undefined ? 'mdi-filter-off' : 'mdi-bell-off'"
            size="64"
            color="grey-lighten-1"
            class="mb-4"
          />
          <h3 class="text-h6 mb-2">
            {{ filters.type || filters.priority || filters.read !== undefined 
              ? 'Nenhuma notificação encontrada' 
              : 'Você não tem notificações' 
            }}
          </h3>
          <p class="text-body-2 text-medium-emphasis">
            {{ filters.type || filters.priority || filters.read !== undefined 
              ? 'Tente ajustar os filtros para ver mais resultados' 
              : 'Quando houver novidades, você será notificado aqui' 
            }}
          </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Notifications List -->
    <v-row v-else>
      <v-col cols="12">
        <!-- Grouped Notifications -->
        <template v-for="(group, key) in groupedNotifications" :key="key">
          <div v-if="group.length > 0" class="mb-6">
            <h3 class="text-subtitle-1 font-weight-bold mb-3 text-medium-emphasis">
              {{ getGroupTitle(key) }}
            </h3>
            
            <v-card
              v-for="notification in group"
              :key="notification.id"
              elevation="0"
              border
              rounded="lg"
              class="mb-3 notification-card"
              :class="{ 'notification-unread': !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <v-card-text>
                <v-row no-gutters align="center">
                  <!-- Icon/Image -->
                  <v-col cols="auto" class="mr-4">
                    <v-avatar v-if="notification.image" size="48">
                      <v-img :src="notification.image" />
                    </v-avatar>
                    <v-avatar v-else :color="getNotificationColor(notification)" size="48">
                      <v-icon :icon="notification.icon || 'mdi-bell'" color="white" />
                    </v-avatar>
                  </v-col>

                  <!-- Content -->
                  <v-col>
                    <div class="d-flex align-center mb-1">
                      <h4 class="text-subtitle-1 font-weight-bold mr-2">
                        {{ notification.title }}
                      </h4>
                      <v-chip
                        v-if="notification.priority === 'urgent'"
                        size="x-small"
                        color="error"
                        variant="tonal"
                      >
                        Urgente
                      </v-chip>
                      <v-chip
                        v-if="!notification.read"
                        size="x-small"
                        color="primary"
                        variant="tonal"
                        class="ml-1"
                      >
                        Nova
                      </v-chip>
                    </div>
                    <p class="text-body-2 mb-2">{{ notification.message }}</p>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-clock-outline" size="14" class="mr-1" />
                      <span class="text-caption text-medium-emphasis">
                        {{ formatDate(notification.createdAt) }}
                      </span>
                      <v-btn
                        v-if="notification.actionUrl"
                        variant="text"
                        color="primary"
                        size="small"
                        class="ml-auto"
                        :to="notification.actionUrl"
                      >
                        {{ notification.actionLabel || 'Ver mais' }}
                        <v-icon icon="mdi-chevron-right" end />
                      </v-btn>
                    </div>
                  </v-col>

                  <!-- Actions -->
                  <v-col cols="auto" class="ml-4">
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn
                          icon="mdi-dots-vertical"
                          variant="text"
                          size="small"
                          v-bind="props"
                          @click.stop
                        />
                      </template>
                      <v-list density="compact">
                        <v-list-item
                          v-if="!notification.read"
                          @click.stop="markAsRead(notification.id)"
                        >
                          <v-list-item-title>
                            <v-icon icon="mdi-check" size="18" class="mr-2" />
                            Marcar como lida
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          @click.stop="deleteNotification(notification.id)"
                        >
                          <v-list-item-title class="text-error">
                            <v-icon icon="mdi-delete" size="18" class="mr-2" />
                            Excluir
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </template>
      </v-col>
    </v-row>

    <!-- Clear All Dialog -->
    <v-dialog v-model="clearDialog" max-width="400">
      <v-card>
        <v-card-title>Limpar todas as notificações?</v-card-title>
        <v-card-text>
          Esta ação não pode ser desfeita. Todas as suas notificações serão removidas permanentemente.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="clearDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="flat" @click="handleClearAll">Limpar todas</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import type { NotificationType, NotificationPriority, Notification } from '@/types/auth'

const router = useRouter()
const notificationsStore = useNotificationsStore()

// State
const clearDialog = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Store data
const {
  notifications,
  isLoading,
  error,
  filters,
  unreadCount,
  hasUnread,
  urgentNotifications,
  filteredNotifications,
  groupedNotifications
} = notificationsStore

// Computed
const donationCount = computed(() => {
  return notifications.value.filter(n => n.type === 'donation').length
})

// Filter options
const notificationTypes = [
  { title: 'Informação', value: 'info' },
  { title: 'Sucesso', value: 'success' },
  { title: 'Doação', value: 'donation' },
  { title: 'Urgente', value: 'urgent' },
  { title: 'Sistema', value: 'system' }
]

const priorityLevels = [
  { title: 'Baixa', value: 'low' },
  { title: 'Média', value: 'medium' },
  { title: 'Alta', value: 'high' },
  { title: 'Urgente', value: 'urgent' }
]

const readStatus = [
  { title: 'Não lidas', value: false },
  { title: 'Lidas', value: true }
]

// Methods
const getNotificationColor = (notification: Notification) => {
  const colors: Record<NotificationType, string> = {
    info: 'blue',
    success: 'success',
    warning: 'warning',
    error: 'error',
    donation: 'green',
    urgent: 'red',
    system: 'grey'
  }
  return colors[notification.type] || 'grey'
}

const getGroupTitle = (key: string) => {
  const titles: Record<string, string> = {
    today: 'Hoje',
    yesterday: 'Ontem',
    week: 'Esta semana',
    older: 'Mais antigas'
  }
  return titles[key] || key
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInHours * 60)
    return `Há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours)
    return `Há ${hours} ${hours === 1 ? 'hora' : 'horas'}`
  } else if (diffInHours < 48) {
    return 'Ontem'
  } else if (diffInHours < 168) {
    const days = Math.floor(diffInHours / 24)
    return `Há ${days} dias`
  } else {
    return date.toLocaleDateString('pt-BR')
  }
}

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.read) {
    await markAsRead(notification.id)
  }
  
  if (notification.actionUrl) {
    router.push(notification.actionUrl)
  }
}

const markAsRead = async (notificationId: string) => {
  const success = await notificationsStore.markAsRead(notificationId)
  if (success) {
    showSnackbar('Notificação marcada como lida', 'success')
  }
}

const handleMarkAllAsRead = async () => {
  const success = await notificationsStore.markAllAsRead()
  if (success) {
    showSnackbar('Todas as notificações foram marcadas como lidas', 'success')
  }
}

const deleteNotification = async (notificationId: string) => {
  const success = await notificationsStore.deleteNotification(notificationId)
  if (success) {
    showSnackbar('Notificação excluída', 'success')
  }
}

const confirmClearAll = () => {
  clearDialog.value = true
}

const handleClearAll = async () => {
  clearDialog.value = false
  const success = await notificationsStore.clearAll()
  if (success) {
    showSnackbar('Todas as notificações foram removidas', 'success')
  }
}

const clearFilters = () => {
  notificationsStore.clearFilters()
}

const showSnackbar = (message: string, color: string = 'success') => {
  snackbar.value = { show: true, message, color }
}

// Lifecycle
onMounted(async () => {
  await notificationsStore.loadNotifications()
  // Inicia notificações em tempo real
  notificationsStore.startRealtimeNotifications()
})
</script>

<style scoped>
.notifications-page {
  max-width: 1200px;
  margin: 0 auto;
}

.notification-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notification-unread {
  background-color: rgba(108, 99, 255, 0.05);
  border-left: 3px solid #6C63FF;
}
</style>