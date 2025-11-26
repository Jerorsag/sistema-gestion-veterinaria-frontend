import { apiClient } from '@/api/httpClient'
import { endpoints } from '@/api/endpoints'
import type {
  ClinicalHistorySummary,
  ClinicalHistoryDetail,
  LastConsultResponse,
} from '@/api/types/histories'
import type { PaginatedResponse } from '@/api/types/common'

export interface HistoryQueryParams {
  mascota?: number | string
  search?: string
}

const normalizeList = (data: ClinicalHistorySummary[] | PaginatedResponse<ClinicalHistorySummary>) => {
  if (Array.isArray(data)) return data
  if (data?.results) return data.results
  return []
}

const list = async (params: HistoryQueryParams = {}) => {
  const { data } = await apiClient.get<ClinicalHistorySummary[] | PaginatedResponse<ClinicalHistorySummary>>(
    endpoints.histories.base(),
    {
      params: {
        mascota: params.mascota,
        search: params.search,
      },
    },
  )
  return normalizeList(data)
}

const detail = async (id: number | string) => {
  const { data } = await apiClient.get<ClinicalHistoryDetail>(endpoints.histories.detail(id))
  return data
}

const byPet = async (petId: number | string) => {
  const { data } = await apiClient.get<ClinicalHistoryDetail>(endpoints.histories.byPet(petId))
  return data
}

const search = async (query: string) => {
  const { data } = await apiClient.get<ClinicalHistorySummary[]>(endpoints.histories.search(), {
    params: { q: query },
  })
  return data
}

const lastConsult = async (historyId: number | string) => {
  const { data } = await apiClient.get<LastConsultResponse>(endpoints.histories.lastConsult(historyId))
  return data
}

export const historyService = {
  list,
  detail,
  byPet,
  search,
  lastConsult,
}

