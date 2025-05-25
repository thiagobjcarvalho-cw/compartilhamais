// mock/data.ts
import type { Institution, Donor, Donation, InstitutionFilters } from '@/types/interfaces'

import { InstitutionType, NeedCategory, UrgencyLevel, DonationStatus } from '@/types/interfaces'

export const mockInstitutions: Institution[] = [
  {
    id: '1',
    name: 'Casa da Esperança',
    type: InstitutionType.SHELTER,
    description: 'Abrigo que atende famílias em situação de vulnerabilidade social',
    about:
      'Fundada em 1998, a Casa da Esperança já acolheu mais de 2.000 famílias, oferecendo moradia temporária, alimentação, apoio psicossocial e orientação para reinserção social.',
    location: {
      address: 'Rua da Solidariedade, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
      latitude: -23.5505,
      longitude: -46.6333,
      distance: 0.85,
    },
    contact: {
      phone: '(11) 3456-7890',
      email: 'contato@casadaesperanca.org.br',
      whatsapp: '(11) 99999-9999',
      website: 'www.casadaesperanca.org.br',
    },
    needs: [
      {
        id: 'need-1',
        title: 'Alimentos não perecíveis',
        description: '50kg de arroz, feijão, macarrão e óleo',
        category: NeedCategory.FOOD,
        quantity: '50kg',
        urgency: UrgencyLevel.HIGH,
        fulfilled: false,
        createdAt: '2024-05-20T10:00:00Z',
      },
      {
        id: 'need-2',
        title: 'Cobertores e roupas de cama',
        description: '30 cobertores e jogos de lençol',
        category: NeedCategory.SHELTER,
        quantity: '30 unidades',
        urgency: UrgencyLevel.CRITICAL,
        fulfilled: false,
        createdAt: '2024-05-18T14:30:00Z',
      },
    ],
    images: ['/images/casa-esperanca-1.jpg', '/images/casa-esperanca-2.jpg'],
    verified: true,
    rating: 4.8,
    totalDonations: 145,
    createdAt: '2020-01-15T00:00:00Z',
    updatedAt: '2024-05-24T15:30:00Z',
  },
  {
    id: '2',
    name: 'Centro Educacional Luz',
    type: InstitutionType.EDUCATION,
    description: 'Centro educacional que oferece reforço escolar para crianças carentes',
    about: 'O Centro Educacional Luz atende 200 crianças de 6 a 14 anos em contraturno escolar.',
    location: {
      address: 'Av. da Educação, 456',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-890',
      latitude: -23.5615,
      longitude: -46.6564,
      distance: 1.2,
    },
    contact: {
      phone: '(11) 2345-6789',
      email: 'contato@centroluz.org.br',
    },
    needs: [
      {
        id: 'need-3',
        title: 'Material escolar',
        description: 'Cadernos, lápis, canetas, borrachas',
        category: NeedCategory.EDUCATION,
        quantity: 'Para 50 crianças',
        urgency: UrgencyLevel.MEDIUM,
        fulfilled: false,
        createdAt: '2024-05-22T11:00:00Z',
      },
    ],
    images: ['/images/centro-luz-1.jpg'],
    verified: true,
    rating: 4.6,
    totalDonations: 89,
    createdAt: '2019-03-10T00:00:00Z',
    updatedAt: '2024-05-23T12:15:00Z',
  },
]

export const mockDonor: Donor = {
  id: 'donor-1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '(11) 99999-0000',
  avatar: '/images/avatar-joao.jpg',
  location: {
    address: 'Rua das Flores, 100',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-000',
    latitude: -23.5489,
    longitude: -46.6388,
  },
  stats: {
    totalDonations: 12,
    institutionsHelped: 8,
    impactMetrics: [
      {
        label: 'Refeições fornecidas',
        value: 150,
        unit: 'refeições',
        icon: 'mdi-food',
      },
      {
        label: 'Crianças beneficiadas',
        value: 25,
        unit: 'crianças',
        icon: 'mdi-account-child',
      },
    ],
  },
  preferences: {
    categories: [NeedCategory.FOOD, NeedCategory.EDUCATION],
    maxDistance: 5,
    notifications: {
      newInstitutions: true,
      urgentNeeds: true,
      donationUpdates: true,
      weeklyReport: false,
    },
  },
  createdAt: '2024-01-15T00:00:00Z',
}

export const mockDonations: Donation[] = [
  {
    id: 'donation-1',
    donorId: 'donor-1',
    institutionId: '1',
    needId: 'need-1',
    description: '10kg de arroz e 5kg de feijão',
    quantity: '15kg',
    scheduledDate: '2024-05-22T14:00:00Z',
    status: DonationStatus.COMPLETED,
    photos: ['/images/donation-1.jpg'],
    feedback: 'Recebido com muito carinho! Obrigado pela generosidade.',
    createdAt: '2024-05-20T10:30:00Z',
    completedAt: '2024-05-22T14:15:00Z',
  },
]

// Options para componentes
export const institutionTypeOptions = [
  { value: InstitutionType.SHELTER, title: 'Abrigos', icon: 'mdi-home-heart', color: 'blue' },
  { value: InstitutionType.EDUCATION, title: 'Educação', icon: 'mdi-school', color: 'green' },
  { value: InstitutionType.HEALTH, title: 'Saúde', icon: 'mdi-hospital-box', color: 'red' },
  {
    value: InstitutionType.ELDERLY,
    title: 'Idosos',
    icon: 'mdi-account-supervisor',
    color: 'purple',
  },
]

export const needCategoryOptions = [
  { value: NeedCategory.FOOD, title: 'Alimentos', icon: 'mdi-food', color: '#FF6B6B' },
  { value: NeedCategory.CLOTHES, title: 'Roupas', icon: 'mdi-tshirt-crew', color: '#4ECDC4' },
  { value: NeedCategory.HYGIENE, title: 'Higiene', icon: 'mdi-shower', color: '#45B7D1' },
  { value: NeedCategory.EDUCATION, title: 'Educação', icon: 'mdi-book-open', color: '#FFA726' },
  { value: NeedCategory.MEDICAL, title: 'Médico', icon: 'mdi-medical-bag', color: '#E74C3C' },
  { value: NeedCategory.SHELTER, title: 'Abrigo', icon: 'mdi-home', color: '#9B59B6' },
]

export const urgencyLevelOptions = [
  { value: UrgencyLevel.LOW, title: 'Baixa', color: '#4CAF50', icon: 'mdi-circle' },
  { value: UrgencyLevel.MEDIUM, title: 'Média', color: '#FF9800', icon: 'mdi-circle' },
  { value: UrgencyLevel.HIGH, title: 'Alta', color: '#FF5722', icon: 'mdi-circle' },
  { value: UrgencyLevel.CRITICAL, title: 'Crítica', color: '#F44336', icon: 'mdi-alert-circle' },
]

// Helper functions
export const findInstitutionById = (id: string): Institution | undefined => {
  return mockInstitutions.find((inst) => inst.id === id)
}

export const filterInstitutions = (filters: InstitutionFilters): Institution[] => {
  return mockInstitutions.filter((institution) => {
    // Filtro de busca
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = institution.name.toLowerCase().includes(searchLower)
      const matchesDescription = institution.description.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesDescription) {
        return false
      }
    }

    // Filtro de distância
    if (filters.maxDistance && institution.location.distance) {
      if (institution.location.distance > filters.maxDistance) {
        return false
      }
    }

    // Filtro de verificação
    if (filters.verified !== undefined && institution.verified !== filters.verified) {
      return false
    }

    return true
  })
}
