import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import InstitutionProfile from '@/pages/InstitutionProfile.vue'
import DonorProfile from '@/pages/DonorProfile.vue'
import { requireAuth, guestOnly } from '@/router/guards'

// Lazy loading para páginas secundárias
const DonationsPage = () => import('@/pages/DonationsPage.vue')
const FavoritesPage = () => import('@/pages/FavoritesPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')
const LoginPage = () => import('@/pages/LoginPage.vue')
const NotificationsPage = () => import('@/pages/NotificationsPage.vue')
const ForbiddenPage = () => import('@/pages/ForbiddenPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'CompartilhaMais - Conectando corações generosos',
      },
    },
    {
      path: '/institution/:id',
      name: 'institution-profile',
      component: InstitutionProfile,
      meta: {
        title: 'Perfil da Instituição - CompartilhaMais',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      beforeEnter: guestOnly,
      meta: {
        title: 'Entrar - CompartilhaMais',
      },
    },
    {
      path: '/profile',
      name: 'donor-profile',
      component: DonorProfile,
      beforeEnter: requireAuth,
      meta: {
        title: 'Meu Perfil - CompartilhaMais',
      },
    },
    {
      path: '/donations',
      name: 'donations',
      component: DonationsPage,
      beforeEnter: requireAuth,
      meta: {
        title: 'Minhas Doações - CompartilhaMais',
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesPage,
      beforeEnter: requireAuth,
      meta: {
        title: 'Instituições Favoritas - CompartilhaMais',
      },
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: NotificationsPage,
      beforeEnter: requireAuth,
      meta: {
        title: 'Notificações - CompartilhaMais',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      beforeEnter: requireAuth,
      meta: {
        title: 'Configurações - CompartilhaMais',
      },
    },
    {
      path: '/403',
      name: 'forbidden',
      component: ForbiddenPage,
      meta: {
        title: 'Acesso Negado - CompartilhaMais',
      },
    },
    // Redirect legacy routes
    {
      path: '/about',
      redirect: '/profile',
    },
    // Catch-all 404 route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

// Update page title on route change
router.beforeEach((to) => {
  document.title = (to.meta.title as string) || 'CompartilhaMais'
})

export default router
