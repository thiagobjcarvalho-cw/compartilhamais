// Store de Notificações
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationFilters,
} from '@/types/auth'

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<NotificationFilters>({})
  const showNotificationPanel = ref(false)

  // Mock de notificações iniciais
  const mockNotifications: Notification[] = [
    {
      id: 'notif-1',
      userId: 'user-1',
      type: 'urgent' as NotificationType,
      priority: 'urgent' as NotificationPriority,
      title: 'Necessidade Urgente!',
      message: 'Casa da Esperança precisa urgentemente de cobertores para o inverno.',
      icon: 'mdi-alert-circle',
      actionUrl: '/institution/1',
      actionLabel: 'Ver Instituição',
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'notif-2',
      userId: 'user-1',
      type: 'donation' as NotificationType,
      priority: 'medium' as NotificationPriority,
      title: 'Doação Confirmada',
      message: 'Sua doação para o Centro Educacional Luz foi recebida com sucesso!',
      icon: 'mdi-check-circle',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=200&q=80',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'notif-3',
      userId: 'user-1',
      type: 'info' as NotificationType,
      priority: 'low' as NotificationPriority,
      title: 'Nova Instituição Próxima',
      message: 'Biblioteca Comunitária Saber foi adicionada em sua região.',
      icon: 'mdi-information',
      actionUrl: '/institution/8',
      actionLabel: 'Conhecer',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      readAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]

  // Getters
  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  const hasUnread = computed(() => unreadCount.value > 0)

  const urgentNotifications = computed(() => {
    return notifications.value.filter(n => n.priority === 'urgent' && !n.read)
  })

  const filteredNotifications = computed(() => {
    let filtered = [...notifications.value]

    if (filters.value.type) {
      filtered = filtered.filter(n => n.type === filters.value.type)
    }

    if (filters.value.priority) {
      filtered = filtered.filter(n => n.priority === filters.value.priority)
    }

    if (filters.value.read !== undefined) {
      filtered = filtered.filter(n => n.read === filters.value.read)
    }

    if (filters.value.dateFrom) {
      filtered = filtered.filter(n => n.createdAt >= filters.value.dateFrom!)
    }

    if (filters.value.dateTo) {
      filtered = filtered.filter(n => n.createdAt <= filters.value.dateTo!)
    }

    // Ordena por data (mais recentes primeiro) e prioridade
    return filtered.sort((a, b) => {
      // Primeiro, ordena por não lidas
      if (a.read !== b.read) {
        return a.read ? 1 : -1
      }
      
      // Depois por prioridade
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      // Por fim, por data
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  })

  const groupedNotifications = computed(() => {
    const groups: Record<string, Notification[]> = {
      today: [],
      yesterday: [],
      week: [],
      older: [],
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 86400000)
    const weekAgo = new Date(today.getTime() - 7 * 86400000)

    filteredNotifications.value.forEach(notification => {
      const notifDate = new Date(notification.createdAt)
      
      if (notifDate >= today) {
        groups.today.push(notification)
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification)
      } else if (notifDate >= weekAgo) {
        groups.week.push(notification)
      } else {
        groups.older.push(notification)
      }
    })

    return groups
  })

  // Actions
  const loadNotifications = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000))
      notifications.value = [...mockNotifications]
    } catch (err) {
      error.value = 'Erro ao carregar notificações'
      console.error('Load notifications error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const markAsRead = async (notificationId: string): Promise<boolean> => {
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 300))

      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
        notification.readAt = new Date().toISOString()
      }

      return true
    } catch (err) {
      console.error('Mark as read error:', err)
      return false
    }
  }

  const markAllAsRead = async (): Promise<boolean> => {
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))

      const now = new Date().toISOString()
      notifications.value.forEach(notification => {
        if (!notification.read) {
          notification.read = true
          notification.readAt = now
        }
      })

      return true
    } catch (err) {
      console.error('Mark all as read error:', err)
      return false
    }
  }

  const deleteNotification = async (notificationId: string): Promise<boolean> => {
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 300))

      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }

      return true
    } catch (err) {
      console.error('Delete notification error:', err)
      return false
    }
  }

  const clearAll = async (): Promise<boolean> => {
    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, 500))
      notifications.value = []
      return true
    } catch (err) {
      console.error('Clear all notifications error:', err)
      return false
    }
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): void => {
    const newNotification: Notification = {
      ...notification,
      id: 'notif-' + Date.now(),
      createdAt: new Date().toISOString(),
    }

    notifications.value.unshift(newNotification)
    
    // Se for urgente, mostra o painel
    if (notification.priority === 'urgent') {
      showNotificationPanel.value = true
    }
  }

  const updateFilters = (newFilters: Partial<NotificationFilters>): void => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = (): void => {
    filters.value = {}
  }

  const toggleNotificationPanel = (): void => {
    showNotificationPanel.value = !showNotificationPanel.value
  }

  // Simula recebimento de notificações em tempo real
  const startRealtimeNotifications = (): void => {
    // Em produção, isso seria uma conexão WebSocket ou SSE
    setInterval(() => {
      const random = Math.random()
      if (random > 0.95) { // 5% de chance a cada 30 segundos
        const types: NotificationType[] = ['info', 'success', 'donation', 'urgent']
        const priorities: NotificationPriority[] = ['low', 'medium', 'high', 'urgent']
        
        addNotification({
          userId: 'user-1',
          type: types[Math.floor(Math.random() * types.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          title: 'Nova Notificação',
          message: 'Você tem uma nova atualização no sistema.',
          icon: 'mdi-bell',
          read: false,
        })
      }
    }, 30000) // Verifica a cada 30 segundos
  }

  return {
    // State
    notifications,
    isLoading,
    error,
    filters,
    showNotificationPanel,

    // Getters
    unreadCount,
    hasUnread,
    urgentNotifications,
    filteredNotifications,
    groupedNotifications,

    // Actions
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
    updateFilters,
    clearFilters,
    toggleNotificationPanel,
    startRealtimeNotifications,
  }
})