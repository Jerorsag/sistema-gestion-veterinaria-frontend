import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { historyService } from '@/services/histories'

export const useHistoriesFilters = () => {
  const filters = useMemo(
    () => ({
      search: '',
      mascota: null as number | null,
    }),
    [],
  )

  return {
    filters,
  }
}

export const useHistoriesQuery = (params: { search?: string; mascota?: number | null }) =>
  useQuery({
    queryKey: ['histories', params],
    queryFn: () =>
      historyService.list({
        ...params,
        mascota: params.mascota ?? undefined,
      }),
  })

export const useHistoryDetailQuery = (id?: string) =>
  useQuery({
    queryKey: ['histories', 'detail', id],
    queryFn: () => historyService.detail(id!),
    enabled: Boolean(id),
  })

export const useHistoryByPetQuery = (petId?: number | string) =>
  useQuery({
    queryKey: ['histories', 'byPet', petId],
    queryFn: () => historyService.byPet(petId!),
    enabled: Boolean(petId),
  })

export const useHistorySearchQuery = (query: string) =>
  useQuery({
    queryKey: ['histories', 'search', query],
    queryFn: () => historyService.search(query),
    enabled: Boolean(query),
  })

export const useLastConsultQuery = (historyId?: number | string) =>
  useQuery({
    queryKey: ['histories', 'last-consult', historyId],
    queryFn: () => historyService.lastConsult(historyId!),
    enabled: Boolean(historyId),
  })

