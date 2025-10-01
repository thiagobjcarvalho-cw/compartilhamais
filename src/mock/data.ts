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
      'Fundada em 1998, a Casa da Esperança já acolheu mais de 2.000 famílias, oferecendo moradia temporária, alimentação, apoio psicossocial e orientação para reinserção social. Nossa missão é proporcionar dignidade e esperança para aqueles que mais precisam.',
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
        description: '50kg de arroz, feijão, macarrão e óleo para alimentar 30 famílias',
        category: NeedCategory.FOOD,
        quantity: '50kg',
        urgency: UrgencyLevel.HIGH,
        fulfilled: false,
        createdAt: '2024-05-20T10:00:00Z',
      },
      {
        id: 'need-2',
        title: 'Cobertores e roupas de cama',
        description: '30 cobertores e jogos de lençol para o inverno',
        category: NeedCategory.SHELTER,
        quantity: '30 unidades',
        urgency: UrgencyLevel.CRITICAL,
        fulfilled: false,
        createdAt: '2024-05-18T14:30:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&q=80',
    ],
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
    about: 'O Centro Educacional Luz atende 200 crianças de 6 a 14 anos em contraturno escolar. Oferecemos reforço em matemática, português, inglês e informática, além de atividades culturais e esportivas.',
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
      whatsapp: '(11) 98888-7777',
    },
    needs: [
      {
        id: 'need-3',
        title: 'Material escolar',
        description: 'Cadernos, lápis, canetas, borrachas para o novo semestre',
        category: NeedCategory.EDUCATION,
        quantity: 'Para 50 crianças',
        urgency: UrgencyLevel.MEDIUM,
        fulfilled: false,
        createdAt: '2024-05-22T11:00:00Z',
      },
      {
        id: 'need-4',
        title: 'Computadores para laboratório',
        description: '10 computadores usados em bom estado para aulas de informática',
        category: NeedCategory.EDUCATION,
        quantity: '10 unidades',
        urgency: UrgencyLevel.HIGH,
        fulfilled: false,
        createdAt: '2024-05-20T11:00:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    ],
    verified: true,
    rating: 4.6,
    totalDonations: 89,
    createdAt: '2019-03-10T00:00:00Z',
    updatedAt: '2024-05-23T12:15:00Z',
  },
  {
    id: '3',
    name: 'Lar dos Idosos São Francisco',
    type: InstitutionType.ELDERLY,
    description: 'Casa de repouso que cuida de 45 idosos com amor e dedicação',
    about: 'Há 15 anos cuidando de idosos em situação de abandono ou vulnerabilidade. Oferecemos cuidados médicos, fisioterapia, atividades recreativas e muito carinho. Nossa equipe é formada por profissionais especializados em geriatria.',
    location: {
      address: 'Rua dos Cuidados, 789',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01235-123',
      latitude: -23.5489,
      longitude: -46.6388,
      distance: 2.3,
    },
    contact: {
      phone: '(11) 3333-4444',
      email: 'contato@larsaofrancisco.org.br',
      whatsapp: '(11) 97777-8888',
      website: 'www.larsaofrancisco.org.br',
    },
    needs: [
      {
        id: 'need-5',
        title: 'Fraldas geriátricas',
        description: '500 unidades de fraldas tamanho G e GG',
        category: NeedCategory.HYGIENE,
        quantity: '500 unidades',
        urgency: UrgencyLevel.CRITICAL,
        fulfilled: false,
        createdAt: '2024-05-23T09:00:00Z',
      },
      {
        id: 'need-6',
        title: 'Medicamentos básicos',
        description: 'Dipirona, paracetamol, vitaminas e suplementos',
        category: NeedCategory.MEDICAL,
        quantity: 'Lista completa',
        urgency: UrgencyLevel.HIGH,
        fulfilled: false,
        createdAt: '2024-05-22T14:00:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1576765608535-5f04d1e3dc0b?w=800&q=80',
      'https://images.unsplash.com/photo-1559234938-b60fff04894c?w=800&q=80',
    ],
    verified: true,
    rating: 4.9,
    totalDonations: 234,
    createdAt: '2018-07-20T00:00:00Z',
    updatedAt: '2024-05-24T10:00:00Z',
  },
  {
    id: '4',
    name: 'Hospital Infantil Arco-Íris',
    type: InstitutionType.HEALTH,
    description: 'Hospital especializado no tratamento gratuito de crianças com câncer',
    about: 'Referência no tratamento oncológico pediátrico, atendemos gratuitamente 300 crianças por mês. Contamos com equipamentos de última geração e uma equipe multidisciplinar dedicada. Além do tratamento médico, oferecemos apoio psicológico para as famílias.',
    location: {
      address: 'Av. da Saúde, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01240-500',
      latitude: -23.5705,
      longitude: -46.6444,
      distance: 3.5,
    },
    contact: {
      phone: '(11) 4444-5555',
      email: 'doacoes@hospitalarcoiris.org.br',
      whatsapp: '(11) 96666-7777',
      website: 'www.hospitalarcoiris.org.br',
    },
    needs: [
      {
        id: 'need-7',
        title: 'Brinquedos novos',
        description: 'Brinquedos para a brinquedoteca e presentear as crianças internadas',
        category: NeedCategory.OTHER,
        quantity: 'Diversos',
        urgency: UrgencyLevel.MEDIUM,
        fulfilled: false,
        createdAt: '2024-05-21T16:00:00Z',
      },
      {
        id: 'need-8',
        title: 'Lenços e toucas',
        description: 'Lenços coloridos e toucas para crianças em quimioterapia',
        category: NeedCategory.CLOTHES,
        quantity: '100 unidades',
        urgency: UrgencyLevel.LOW,
        fulfilled: false,
        createdAt: '2024-05-20T11:30:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    ],
    verified: true,
    rating: 5.0,
    totalDonations: 567,
    createdAt: '2015-03-10T00:00:00Z',
    updatedAt: '2024-05-24T18:00:00Z',
  },
  {
    id: '5',
    name: 'Projeto Crescer',
    type: InstitutionType.EDUCATION,
    description: 'ONG que oferece cursos profissionalizantes para jovens de comunidades',
    about: 'Transformamos vidas através da educação profissional. Oferecemos cursos de programação, design, administração, gastronomia e muito mais. Já formamos mais de 5.000 jovens, com 80% de empregabilidade.',
    location: {
      address: 'Rua das Oportunidades, 200',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01250-100',
      latitude: -23.5550,
      longitude: -46.6600,
      distance: 1.8,
    },
    contact: {
      phone: '(11) 5555-6666',
      email: 'contato@projetocrescer.org',
      whatsapp: '(11) 95555-4444',
    },
    needs: [
      {
        id: 'need-9',
        title: 'Notebooks para aulas',
        description: 'Notebooks usados em bom estado para curso de programação',
        category: NeedCategory.EDUCATION,
        quantity: '20 unidades',
        urgency: UrgencyLevel.HIGH,
        fulfilled: false,
        createdAt: '2024-05-23T13:00:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    ],
    verified: true,
    rating: 4.7,
    totalDonations: 123,
    createdAt: '2017-08-15T00:00:00Z',
    updatedAt: '2024-05-24T09:00:00Z',
  },
  {
    id: '6',
    name: 'Abrigo Animal Patinhas',
    type: InstitutionType.ANIMAL,
    description: 'Abrigo que resgata e cuida de animais abandonados',
    about: 'Cuidamos de mais de 200 cães e gatos resgatados das ruas. Oferecemos tratamento veterinário, castração, alimentação e muito amor até encontrarem um novo lar. Realizamos feiras de adoção mensais.',
    location: {
      address: 'Estrada do Amor, 500',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01260-200',
      latitude: -23.5800,
      longitude: -46.6700,
      distance: 4.2,
    },
    contact: {
      phone: '(11) 6666-7777',
      email: 'adocao@abrigopatinhas.org',
      whatsapp: '(11) 94444-3333',
      website: 'www.abrigopatinhas.org',
    },
    needs: [
      {
        id: 'need-10',
        title: 'Ração para cães e gatos',
        description: '500kg de ração de boa qualidade',
        category: NeedCategory.FOOD,
        quantity: '500kg',
        urgency: UrgencyLevel.CRITICAL,
        fulfilled: false,
        createdAt: '2024-05-24T08:00:00Z',
      },
      {
        id: 'need-11',
        title: 'Medicamentos veterinários',
        description: 'Antibióticos, vermífugos e antipulgas',
        category: NeedCategory.MEDICAL,
        quantity: 'Diversos',
        urgency: UrgencyLevel.HIGH,
        fulfilled: false,
        createdAt: '2024-05-23T15:00:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    ],
    verified: true,
    rating: 4.9,
    totalDonations: 456,
    createdAt: '2016-05-20T00:00:00Z',
    updatedAt: '2024-05-24T12:00:00Z',
  },
  {
    id: '7',
    name: 'Cozinha Solidária',
    type: InstitutionType.FOOD,
    description: 'Preparamos e distribuímos 500 refeições diárias para pessoas em situação de rua',
    about: 'Funcionamos há 8 anos preparando refeições nutritivas e distribuindo em pontos estratégicos da cidade. Nossa equipe de voluntários trabalha com amor para levar dignidade através da alimentação.',
    location: {
      address: 'Rua da Compaixão, 50',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01270-300',
      latitude: -23.5450,
      longitude: -46.6350,
      distance: 0.5,
    },
    contact: {
      phone: '(11) 7777-8888',
      email: 'voluntarios@cozinhasolidaria.org',
      whatsapp: '(11) 93333-2222',
    },
    needs: [
      {
        id: 'need-12',
        title: 'Alimentos frescos',
        description: 'Verduras, legumes e frutas para preparar refeições saudáveis',
        category: NeedCategory.FOOD,
        quantity: '200kg semanais',
        urgency: UrgencyLevel.HIGH,
        fulfilled: false,
        createdAt: '2024-05-24T06:00:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80',
      'https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&q=80',
    ],
    verified: true,
    rating: 4.8,
    totalDonations: 789,
    createdAt: '2016-02-10T00:00:00Z',
    updatedAt: '2024-05-24T20:00:00Z',
  },
  {
    id: '8',
    name: 'Biblioteca Comunitária Saber',
    type: InstitutionType.EDUCATION,
    description: 'Biblioteca gratuita com mais de 10.000 livros e espaço de estudos',
    about: 'Oferecemos acesso gratuito à leitura, internet, cursos de alfabetização e reforço escolar. Nosso espaço é frequentado por mais de 500 pessoas por semana, desde crianças até idosos.',
    location: {
      address: 'Praça do Conhecimento, 15',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01280-400',
      latitude: -23.5580,
      longitude: -46.6480,
      distance: 2.1,
    },
    contact: {
      phone: '(11) 8888-9999',
      email: 'contato@bibliotecasaber.org',
      whatsapp: '(11) 92222-1111',
    },
    needs: [
      {
        id: 'need-13',
        title: 'Livros didáticos e literatura',
        description: 'Livros em bom estado para ampliar nosso acervo',
        category: NeedCategory.EDUCATION,
        quantity: 'Qualquer quantidade',
        urgency: UrgencyLevel.LOW,
        fulfilled: false,
        createdAt: '2024-05-22T10:00:00Z',
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    verified: true,
    rating: 4.5,
    totalDonations: 67,
    createdAt: '2019-11-05T00:00:00Z',
    updatedAt: '2024-05-23T14:00:00Z',
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
  { value: InstitutionType.SHELTER, title: 'Abrigos', icon: 'mdi-home-heart', color: '#6C63FF' },
  { value: InstitutionType.EDUCATION, title: 'Educação', icon: 'mdi-school', color: '#00D9A3' },
  { value: InstitutionType.HEALTH, title: 'Saúde', icon: 'mdi-hospital-box', color: '#FF6B6B' },
  { value: InstitutionType.ELDERLY, title: 'Idosos', icon: 'mdi-account-supervisor', color: '#9B59B6' },
  { value: InstitutionType.ANIMAL, title: 'Animais', icon: 'mdi-paw', color: '#FFB74D' },
  { value: InstitutionType.FOOD, title: 'Alimentação', icon: 'mdi-food-apple', color: '#4ECDC4' },
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
