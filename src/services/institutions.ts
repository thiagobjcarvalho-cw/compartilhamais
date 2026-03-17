import { api } from './api'

export interface Need {
  id: string
  title: string
  description: string
  quantity: number
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  category: string
  fulfilled: boolean
  institutionId?: string
  institutionName?: string
}

export interface Institution {
  id: string
  name: string
  type: string
  description: string
  location: {
    city: string
    state: string
    latitude: number
    longitude: number
    distance?: number
  }
  verified: boolean
  rating: number
  totalDonations: number
  images: string[]
  needs: Need[]
  createdAt: string
  updatedAt: string
}

export const institutionsService = {
  getAll: () => api.get<Institution[]>('/institutions'),
  
  getById: (id: string) => api.get<Institution>(`/institutions/${id}`),
  
  getNeeds: (id: string) => api.get<Need[]>(`/institutions/${id}/needs`),
  
  getAllNeeds: () => api.get<Need[]>('/needs'),
  
  getUrgentNeeds: () => api.get<Need[]>('/needs/urgent'),
  
  search: (query: string) => api.get<Institution[]>('/institutions'),
}

export default institutionsService
