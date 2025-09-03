// Guards de Rotas para Autenticação
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types/auth'

export const requireAuth = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  // Verifica se há token salvo
  const hasAuth = await authStore.checkAuth()
  
  if (!hasAuth) {
    // Salva a rota que o usuário tentou acessar
    const redirectPath = to.fullPath !== '/login' ? to.fullPath : '/'
    next({
      path: '/login',
      query: { redirect: redirectPath }
    })
  } else {
    next()
  }
}

export const requireRole = (roles: UserRole[]) => {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    
    // Primeiro verifica autenticação
    const hasAuth = await authStore.checkAuth()
    
    if (!hasAuth) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Verifica se o usuário tem um dos papéis necessários
    const userRole = authStore.userRole
    if (userRole && roles.includes(userRole)) {
      next()
    } else {
      // Usuário não tem permissão
      next({
        path: '/403',
        replace: true
      })
    }
  }
}

export const requireInstitution = requireRole([UserRole.INSTITUTION, UserRole.ADMIN])
export const requireAdmin = requireRole([UserRole.ADMIN])
export const requireModerator = requireRole([UserRole.MODERATOR, UserRole.ADMIN])

export const guestOnly = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()
  
  const hasAuth = await authStore.checkAuth()
  
  if (hasAuth) {
    // Usuário já está autenticado, redireciona para home ou dashboard
    const redirectPath = authStore.userRole === UserRole.INSTITUTION 
      ? '/dashboard' 
      : '/profile'
    next(redirectPath)
  } else {
    next()
  }
}