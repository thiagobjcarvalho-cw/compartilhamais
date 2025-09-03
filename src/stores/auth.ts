// Store de Autenticação
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type {
  User,
  AuthCredentials,
  AuthResponse,
  RegisterData,
  AuthState,
  AuthProvider,
  UserRole,
} from '@/types/auth'

// Simulação de API - Em produção, isso seria uma chamada real
const API_DELAY = 1000

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  
  // State
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value && !!accessToken.value)
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userAvatar = computed(() => user.value?.avatar || '')
  
  const hasRole = (role: UserRole): boolean => {
    return userRole.value === role
  }

  const canAccessInstitutionFeatures = computed(() => {
    return userRole.value === UserRole.INSTITUTION || userRole.value === UserRole.ADMIN
  })

  // Actions
  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, API_DELAY))
      
      // Mock de resposta bem-sucedida
      const mockUser: User = {
        id: 'user-1',
        name: credentials.email?.split('@')[0] || 'Usuário',
        email: credentials.email,
        cpf: credentials.cpf,
        role: UserRole.DONOR,
        provider: credentials.provider || 'email',
        emailVerified: true,
        phoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${credentials.email?.split('@')[0]}&background=6C63FF&color=fff`,
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            newInstitutions: true,
            urgentNeeds: true,
            donationUpdates: true,
            weeklyReport: false,
            marketing: false,
          },
          privacy: {
            profileVisible: true,
            showDonationHistory: false,
            showLocation: true,
            allowAnalytics: true,
          },
          language: 'pt-BR',
          theme: 'light',
        },
      }

      const mockResponse: AuthResponse = {
        user: mockUser,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresIn: 3600,
      }

      // Salva no store
      user.value = mockResponse.user
      accessToken.value = mockResponse.accessToken
      refreshToken.value = mockResponse.refreshToken

      // Salva no localStorage
      localStorage.setItem('accessToken', mockResponse.accessToken)
      localStorage.setItem('refreshToken', mockResponse.refreshToken)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))

      return true
    } catch (err) {
      error.value = 'Erro ao fazer login. Verifique suas credenciais.'
      console.error('Login error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Validações
      if (data.password !== data.confirmPassword) {
        throw new Error('As senhas não coincidem')
      }

      if (!data.acceptTerms) {
        throw new Error('Você deve aceitar os termos de uso')
      }

      // Simula chamada à API
      await new Promise(resolve => setTimeout(resolve, API_DELAY))

      // Mock de usuário criado
      const mockUser: User = {
        id: 'user-' + Date.now(),
        name: data.name,
        email: data.email,
        cpf: data.cpf,
        phone: data.phone,
        role: data.role,
        provider: data.email ? 'email' : 'cpf',
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${data.name}&background=6C63FF&color=fff`,
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            newInstitutions: true,
            urgentNeeds: true,
            donationUpdates: true,
            weeklyReport: false,
            marketing: false,
          },
          privacy: {
            profileVisible: true,
            showDonationHistory: false,
            showLocation: true,
            allowAnalytics: true,
          },
          language: 'pt-BR',
          theme: 'light',
        },
      }

      // Auto login após registro
      user.value = mockUser
      accessToken.value = 'mock-access-token-' + Date.now()
      refreshToken.value = 'mock-refresh-token-' + Date.now()

      // Salva no localStorage
      localStorage.setItem('accessToken', accessToken.value)
      localStorage.setItem('refreshToken', refreshToken.value)
      localStorage.setItem('user', JSON.stringify(mockUser))

      return true
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar conta'
      console.error('Register error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const socialLogin = async (provider: AuthProvider): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simula processo OAuth
      await new Promise(resolve => setTimeout(resolve, API_DELAY))

      // Mock de resposta do provider social
      const mockUser: User = {
        id: 'user-social-' + Date.now(),
        name: `Usuário ${provider}`,
        email: `user@${provider}.com`,
        role: UserRole.DONOR,
        provider: provider,
        emailVerified: true,
        phoneVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${provider}&background=6C63FF&color=fff`,
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false,
            newInstitutions: true,
            urgentNeeds: true,
            donationUpdates: true,
            weeklyReport: false,
            marketing: false,
          },
          privacy: {
            profileVisible: true,
            showDonationHistory: false,
            showLocation: true,
            allowAnalytics: true,
          },
          language: 'pt-BR',
          theme: 'light',
        },
      }

      user.value = mockUser
      accessToken.value = 'mock-social-token-' + Date.now()
      refreshToken.value = 'mock-social-refresh-' + Date.now()

      // Salva no localStorage
      localStorage.setItem('accessToken', accessToken.value)
      localStorage.setItem('refreshToken', refreshToken.value)
      localStorage.setItem('user', JSON.stringify(mockUser))

      return true
    } catch (err) {
      error.value = `Erro ao fazer login com ${provider}`
      console.error('Social login error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    isLoading.value = true

    try {
      // Simula chamada à API para invalidar tokens
      await new Promise(resolve => setTimeout(resolve, 500))

      // Limpa o store
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      error.value = null

      // Limpa o localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')

      // Redireciona para home
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('accessToken')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      return false
    }

    try {
      // Simula validação do token
      await new Promise(resolve => setTimeout(resolve, 500))

      // Restaura dados do usuário
      user.value = JSON.parse(userData)
      accessToken.value = token
      refreshToken.value = localStorage.getItem('refreshToken')

      return true
    } catch (err) {
      console.error('Auth check error:', err)
      await logout()
      return false
    }
  }

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken.value) {
      return false
    }

    try {
      // Simula refresh do token
      await new Promise(resolve => setTimeout(resolve, 500))

      accessToken.value = 'mock-new-access-token-' + Date.now()
      localStorage.setItem('accessToken', accessToken.value)

      return true
    } catch (err) {
      console.error('Token refresh error:', err)
      await logout()
      return false
    }
  }

  const updateUser = async (updates: Partial<User>): Promise<boolean> => {
    if (!user.value) return false

    isLoading.value = true
    error.value = null

    try {
      // Simula atualização na API
      await new Promise(resolve => setTimeout(resolve, API_DELAY))

      // Atualiza o usuário local
      user.value = { ...user.value, ...updates, updatedAt: new Date().toISOString() }
      localStorage.setItem('user', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = 'Erro ao atualizar perfil'
      console.error('Update user error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      // Simula envio de email
      await new Promise(resolve => setTimeout(resolve, API_DELAY))
      return true
    } catch (err) {
      error.value = 'Erro ao enviar email de recuperação'
      console.error('Reset password error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,

    // Getters
    isAuthenticated,
    userRole,
    userName,
    userAvatar,
    canAccessInstitutionFeatures,

    // Actions
    login,
    register,
    socialLogin,
    logout,
    checkAuth,
    refreshAccessToken,
    updateUser,
    resetPassword,
    hasRole,
  }
})