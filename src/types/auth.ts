// Types para Autenticação e Autorização

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
  CPF = 'cpf',
}

export enum UserRole {
  DONOR = 'donor',
  INSTITUTION = 'institution',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export interface User {
  id: string
  name: string
  email?: string
  cpf?: string
  phone?: string
  avatar?: string
  role: UserRole
  provider: AuthProvider
  emailVerified: boolean
  phoneVerified: boolean
  createdAt: string
  updatedAt: string
  lastLogin?: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  notifications: NotificationPreferences
  privacy: PrivacySettings
  language: string
  theme: 'light' | 'dark' | 'auto'
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  newInstitutions: boolean
  urgentNeeds: boolean
  donationUpdates: boolean
  weeklyReport: boolean
  marketing: boolean
}

export interface PrivacySettings {
  profileVisible: boolean
  showDonationHistory: boolean
  showLocation: boolean
  allowAnalytics: boolean
}

export interface AuthCredentials {
  email?: string
  cpf?: string
  password?: string
  provider?: AuthProvider
  token?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RegisterData {
  name: string
  email?: string
  cpf?: string
  password: string
  confirmPassword: string
  phone?: string
  role: UserRole
  acceptTerms: boolean
}

export interface SocialAuthConfig {
  provider: AuthProvider
  clientId: string
  redirectUri: string
  scope: string[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  accessToken: string | null
  refreshToken: string | null
}

// Notification Types
export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  DONATION = 'donation',
  URGENT = 'urgent',
  SYSTEM = 'system',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  icon?: string
  image?: string
  actionUrl?: string
  actionLabel?: string
  read: boolean
  createdAt: string
  readAt?: string
  metadata?: Record<string, any>
}

export interface NotificationFilters {
  type?: NotificationType
  priority?: NotificationPriority
  read?: boolean
  dateFrom?: string
  dateTo?: string
}