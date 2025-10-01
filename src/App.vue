<template>
  <v-app>
    <!-- Barra de Navegação Superior -->
    <v-app-bar elevation="0" height="72" class="app-header">
      <v-app-bar-nav-icon @click="drawer = !drawer" color="primary" />

      <v-toolbar-title class="d-flex align-center">
        <v-icon class="mr-2" color="primary" size="32">mdi-hand-heart</v-icon>
        <span class="app-title">CompartilhaMais</span>
      </v-toolbar-title>

      <v-spacer />

      <!-- Ações do Header -->
      <v-badge
        v-if="isAuthenticated"
        :content="unreadCount"
        :model-value="hasUnread"
        color="secondary"
        overlap
      >
        <v-btn icon variant="text" color="primary" @click="goToNotifications">
          <v-icon>mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>

      <v-menu v-if="isAuthenticated" offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" color="primary" class="ml-2" v-bind="props">
            <v-avatar size="32">
              <v-img v-if="userAvatar" :src="userAvatar" />
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">{{ userName }}</v-list-item-title>
            <v-list-item-subtitle>{{ authStore.user?.email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider />
          <v-list-item to="/profile">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title>Meu Perfil</v-list-item-title>
          </v-list-item>
          <v-list-item to="/settings">
            <template v-slot:prepend>
              <v-icon>mdi-cog</v-icon>
            </template>
            <v-list-item-title>Configurações</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon color="error">mdi-logout</v-icon>
            </template>
            <v-list-item-title class="text-error">Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        variant="flat"
        color="primary"
        to="/login"
        prepend-icon="mdi-login"
      >
        Entrar
      </v-btn>
    </v-app-bar>

    <!-- Menu Lateral Navegação -->
    <v-navigation-drawer v-model="drawer" temporary width="280">
      <!-- Header do Drawer -->
      <div class="drawer-header pa-6 text-center">
        <v-avatar size="80" color="primary" class="mb-3">
          <v-icon size="40" color="white">mdi-hand-heart</v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-bold">CompartilhaMais</h3>
        <p class="text-caption text-medium-emphasis mt-1">Conectando corações generosos</p>
      </div>
      
      <v-divider />
      
      <v-list nav density="comfortable" class="pa-2">
        <v-list-item 
          v-for="item in menuItems" 
          :key="item.title" 
          :to="item.route" 
          rounded="lg"
          class="mb-1"
          active-class="menu-active"
        >
          <template #prepend>
            <v-badge
              v-if="item.badge"
              :content="item.badge"
              :model-value="item.badge > 0"
              color="secondary"
              inline
            >
              <v-icon :color="item.color || 'primary'">{{ item.icon }}</v-icon>
            </v-badge>
            <v-icon v-else :color="item.color || 'primary'">{{ item.icon }}</v-icon>
          </template>

          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
        
        <template v-if="isAuthenticated">
          <v-divider class="my-2" />
          <v-list-item
            @click="handleLogout"
            rounded="lg"
            class="mb-1"
          >
            <template #prepend>
              <v-icon color="error">mdi-logout</v-icon>
            </template>
            <v-list-item-title class="text-error">Sair</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <!-- Conteúdo Principal -->
    <v-main>
      <v-container fluid class="pa-0" style="max-width: 100%; overflow-x: hidden">
        <router-view />
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer height="56" class="d-none d-md-flex footer-gradient">
      <v-container class="d-flex align-center justify-space-between">
        <span class="text-caption"> © 2024 CompartilhaMais - Transformando vidas através da solidariedade </span>
        <div>
          <v-btn icon size="small" variant="text">
            <v-icon size="20">mdi-instagram</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text">
            <v-icon size="20">mdi-facebook</v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text">
            <v-icon size="20">mdi-twitter</v-icon>
          </v-btn>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

const router = useRouter()
const authStore = useAuthStore()
const notificationsStore = useNotificationsStore()

const drawer = ref(false)


interface MenuItem {
  title: string
  icon: string
  route: string
  color?: string
  badge?: number
}

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.userName)
const userAvatar = computed(() => authStore.userAvatar)
const unreadCount = computed(() => notificationsStore.unreadCount)
const hasUnread = computed(() => notificationsStore.hasUnread)

// Menu items baseados na autenticação
const menuItems = computed<MenuItem[]>(() => {
  const baseItems: MenuItem[] = [
    {
      title: 'Mapa de Instituições',
      icon: 'mdi-map-marker-radius',
      route: '/',
      color: 'primary',
    },
  ]

  if (isAuthenticated.value) {
    return [
      ...baseItems,
      {
        title: 'Minhas Doações',
        icon: 'mdi-hand-heart-outline',
        route: '/donations',
        color: 'secondary',
      },
      {
        title: 'Instituições Favoritas',
        icon: 'mdi-star-outline',
        route: '/favorites',
        color: 'warning',
      },
      {
        title: 'Notificações',
        icon: 'mdi-bell-outline',
        route: '/notifications',
        color: 'info',
        badge: unreadCount.value,
      },
      {
        title: 'Meu Perfil',
        icon: 'mdi-account-outline',
        route: '/profile',
        color: 'info',
      },
      {
        title: 'Configurações',
        icon: 'mdi-cog-outline',
        route: '/settings',
        color: 'grey',
      },
    ]
  } else {
    return [
      ...baseItems,
      {
        title: 'Entrar / Cadastrar',
        icon: 'mdi-login',
        route: '/login',
        color: 'primary',
      },
    ]
  }
})

// Methods
const handleLogout = async () => {
  await authStore.logout()
  drawer.value = false
}

const goToNotifications = () => {
  router.push('/notifications')
}

const goToProfile = () => {
  if (isAuthenticated.value) {
    router.push('/profile')
  } else {
    router.push('/login')
  }
}

// Lifecycle
onMounted(async () => {
  // Verificar autenticação
  await authStore.checkAuth()
  
  // Carregar notificações se autenticado
  if (isAuthenticated.value) {
    await notificationsStore.loadNotifications()
  }
})
</script>

<style scoped>
/* App Header Styles */
.app-header {
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.app-title {
  font-size: 1.4rem;
  font-weight: 600;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B6B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Drawer Styles */
.drawer-header {
  background: linear-gradient(135deg, #6C63FF 0%, #8B80FF 100%);
  color: white;
}

.drawer-header h3,
.drawer-header p {
  color: white !important;
}

.menu-active {
  background-color: rgba(108, 99, 255, 0.08) !important;
}

.menu-active :deep(.v-list-item__prepend .v-icon) {
  color: #6C63FF !important;
}

/* Footer Styles */
.footer-gradient {
  background: linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

/* Main Content */
.v-main {
  padding-top: 72px !important;
  background-color: #F8F9FA;
}

/* Container adjustments */
.v-container {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

/* Responsiveness */
@media (max-width: 600px) {
  .app-title {
    font-size: 1.2rem !important;
  }
  
  .v-app-bar {
    height: 64px !important;
  }
  
  .v-main {
    padding-top: 64px !important;
  }
}
</style>
