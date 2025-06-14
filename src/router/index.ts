import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import InstitutionProfile from '@/pages/InstitutionProfile.vue'
import DonorProfile from '@/pages/DonorProfile.vue'

// Lazy loading para páginas secundárias
const DonationsPage = () => import('@/pages/DonationsPage.vue')
const FavoritesPage = () => import('@/pages/FavoritesPage.vue')
const SettingsPage = () => import('@/pages/SettingsPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'SolidarityApp - Conectando corações generosos',
      },
    },
    {
      path: '/institution/:id',
      name: 'institution-profile',
      component: InstitutionProfile,
      meta: {
        title: 'Perfil da Instituição - SolidarityApp',
      },
    },
    {
      path: '/profile',
      name: 'donor-profile',
      component: DonorProfile,
      meta: {
        title: 'Meu Perfil - SolidarityApp',
      },
    },
    {
      path: '/donations',
      name: 'donations',
      component: DonationsPage,
      meta: {
        title: 'Minhas Doações - SolidarityApp',
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesPage,
      meta: {
        title: 'Instituições Favoritas - SolidarityApp',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage,
      meta: {
        title: 'Configurações - SolidarityApp',
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
  document.title = (to.meta.title as string) || 'SolidarityApp'
})

export default router
