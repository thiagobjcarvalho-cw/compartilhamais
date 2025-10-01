// src/types/interfaces.ts

// Enums
export enum InstitutionType {
  SHELTER = 'shelter',
  EDUCATION = 'education',
  HEALTH = 'health',
  ELDERLY = 'elderly',
  ANIMAL = 'animal',
  ENVIRONMENT = 'environment',
  FOOD = 'food',
}

export enum NeedCategory {
  FOOD = 'food',
  CLOTHES = 'clothes',
  HYGIENE = 'hygiene',
  EDUCATION = 'education',
  MEDICAL = 'medical',
  SHELTER = 'shelter',
  ELECTRONICS = 'electronics',
  VOLUNTEERS = 'volunteers',
  OTHER = 'other',
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum DonationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Interfaces auxiliares
export interface Location {
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  distance?: number
}

export interface Contact {
  phone?: string
  email?: string
  whatsapp?: string
  website?: string
}

export interface Need {
  id: string
  title: string
  description: string
  category: NeedCategory
  quantity: string
  urgency: UrgencyLevel
  fulfilled: boolean
  createdAt: string
  fulfilledAt?: string
}

export interface ImpactMetric {
  label: string
  value: number
  unit: string
  icon: string
}

export interface DonorStats {
  totalDonations: number
  institutionsHelped: number
  impactMetrics: ImpactMetric[]
}

export interface NotificationPreferences {
  newInstitutions: boolean
  urgentNeeds: boolean
  donationUpdates: boolean
  weeklyReport: boolean
}

export interface DonorPreferences {
  categories: NeedCategory[]
  maxDistance: number
  notifications: NotificationPreferences
}

// Interfaces principais
export interface Institution {
  id: string
  name: string
  type: InstitutionType
  description: string
  about?: string
  location: Location
  contact: Contact
  needs: Need[]
  images?: string[]
  verified: boolean
  rating?: number
  totalDonations?: number
  createdAt: string
  updatedAt: string

  // Campos opcionais para compatibilidade (campos antigos)
  categories?: string[]
  address?: string
  phone?: string
  email?: string
  website?: string
  peopleHelped?: number
}

export interface Donor {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  location?: Location
  stats: DonorStats
  preferences: DonorPreferences
  createdAt: string
}

export interface Donation {
  id: string
  donorId: string
  institutionId: string
  needId?: string
  description: string
  quantity?: string
  scheduledDate?: string
  status: DonationStatus
  photos?: string[]
  feedback?: string
  createdAt: string
  completedAt?: string

  // Campos opcionais para compatibilidade
  amount?: number
  items?: string[]
  type?: 'money' | 'items' | 'volunteer'
  message?: string
}

// Interface para formulário de doação
export interface DonationFormData {
  institutionId: string
  needId?: string
  description: string
  quantity?: string
  contactPreference: string
  scheduledDate?: string
  message?: string
}

export interface MapLocation {
  lat: number
  lng: number
}

// ✅ NOVA INTERFACE - Para mapa (seguindo padrão enterprise)
export interface MapPin {
  id: string
  institution: Institution
  position: MapLocation
}

// ✅ NOVA INTERFACE - Para urgentNeeds tipado
export interface UrgentNeedItem {
  institution: Institution
  need: Need
}

// Interfaces para filtros e busca - ✅ CORRIGIDA
export interface InstitutionFilters {
  search?: string
  type?: InstitutionType
  needCategory?: NeedCategory
  urgency?: UrgencyLevel
  maxDistance?: number
  verified?: boolean
  hasUrgentNeeds?: boolean
  // Arrays para múltipla seleção (compatibilidade com stores)
  categories?: NeedCategory[]
  types?: InstitutionType[]
  urgencyLevels?: UrgencyLevel[]
}

export interface FilterOptions {
  category?: string
  location?: string
  urgency?: string
  searchQuery?: string
}

// Interfaces para componentes
export interface SelectOption {
  value: string | number
  title: string
  icon?: string
  color?: string
}

export interface InstitutionTypeOption extends SelectOption {
  value: InstitutionType
}

export interface NeedCategoryOption extends SelectOption {
  value: NeedCategory
  color: string
}

export interface UrgencyLevelOption extends SelectOption {
  value: UrgencyLevel
  color: string
}

// Interface para API responses
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  timestamp: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Types auxiliares
export type InstitutionId = string
export type DonorId = string
export type DonationId = string
export type NeedId = string

// Interfaces para eventos do componente
export interface InstitutionSelectedEvent {
  institution: Institution
}

export interface DonationCompletedEvent {
  donation: Donation
  institution: Institution
}

export interface FilterChangeEvent {
  filters: InstitutionFilters
}

// Interface para configurações da aplicação
export interface AppConfig {
  googleMapsApiKey?: string
  defaultLocation: MapLocation
  maxSearchRadius: number
  enableNotifications: boolean
}

// Interface para tema/personalização
export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  darkMode: boolean
  compactMode: boolean
}

// ✅ NOVA INTERFACE - Para stats de instituições
export interface InstitutionStats {
  totalNeeds: number
  urgentNeeds: number
  fulfilledNeeds: number
  rating?: number
  totalDonations?: number
}

export default {
  InstitutionType,
  NeedCategory,
  UrgencyLevel,
  DonationStatus,
}
