const API_BASES = [
  (import.meta as any).env?.VITE_BACKEND_BASE || 'http://localhost:3001',
  'http://backend:3001',
  'http://localhost:3001'
]

let currentBaseIndex = 0

function getBaseUrl(): string {
  return API_BASES[currentBaseIndex]
}

function setBaseUrl(index: number): void {
  if (index < API_BASES.length) {
    currentBaseIndex = index
  }
}

async function fetchWithFallback<T>(endpoint: string, options?: RequestInit): Promise<T> {
  let lastError: Error | null = null
  
  for (let i = 0; i < API_BASES.length; i++) {
    try {
      const url = `${API_BASES[i]}${endpoint}`
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      })
      
      if (res.ok) {
        setBaseUrl(i)
        return await res.json()
      }
      
      if (res.status === 404) {
        throw new Error('404')
      }
    } catch (err) {
      lastError = err as Error
      console.warn(`Fallback ${i + 1}/${API_BASES.length} failed:`, err)
    }
  }
  
  throw lastError || new Error('All fetch attempts failed')
}

export const api = {
  get: <T>(endpoint: string) => fetchWithFallback<T>(endpoint),
  
  post: <T>(endpoint: string, data: any) => 
    fetchWithFallback<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: <T>(endpoint: string, data: any) => 
    fetchWithFallback<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: <T>(endpoint: string) => 
    fetchWithFallback<T>(endpoint, {
      method: 'DELETE',
    }),
}

export default api
