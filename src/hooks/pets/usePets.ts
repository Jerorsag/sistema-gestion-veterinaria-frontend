import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'

import type { PetPayload } from '@/api/types/pets'
import { petService } from '@/services/pets/pet.service'
import { speciesService } from '@/services/pets/species.service'
import { breedService } from '@/services/pets/breed.service'

const usePetsFiltersInternal = () => {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(
    () => ({
      search: params.get('q') ?? '',
      especie: params.get('especie') ? Number(params.get('especie')) : null,
    }),
    [params],
  )

  const updateFilters = (next: Partial<typeof filters>) => {
    const newParams = new URLSearchParams(params)
    if (next.search !== undefined) newParams.set('q', next.search)
    if (next.especie !== undefined && next.especie !== null) newParams.set('especie', String(next.especie))
    if (next.especie === null) newParams.delete('especie')
    setParams(newParams, { replace: true })
  }

  return { filters, updateFilters }
}

const getErrorMessage = (error: AxiosError<any>) => {
  const data = error.response?.data
  if (data) {
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message
  }
  return 'Ocurrió un error con mascotas.'
}

export const usePetsFilters = usePetsFiltersInternal

export const usePetsQuery = (filters: { search: string; especie: number | null }) =>
  useQuery({
    queryKey: ['pets', filters],
    queryFn: () => petService.list(filters),
  })

export const usePetDetailQuery = (id?: string) =>
  useQuery({
    queryKey: ['pets', 'detail', id],
    queryFn: () => petService.detail(id!),
    enabled: Boolean(id),
  })

export const usePetCreateMutation = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PetPayload) => petService.create(payload),
    onSuccess: (pet) => {
      toast.success('Mascota registrada')
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      navigate(`/app/mascotas/${pet.id}`)
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const usePetUpdateMutation = (id: number | string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: PetPayload) => petService.update(id, payload),
    onSuccess: (pet) => {
      toast.success('Mascota actualizada')
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      queryClient.invalidateQueries({ queryKey: ['pets', 'detail', String(id)] })
      return pet
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const usePetDeleteMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: (id: number | string) => petService.remove(id),
    onSuccess: () => {
      toast.success('Mascota eliminada')
      queryClient.invalidateQueries({ queryKey: ['pets'] })
      navigate('/app/mascotas')
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useSpeciesQuery = () =>
  useQuery({
    queryKey: ['species'],
    queryFn: speciesService.list,
    staleTime: 5 * 60 * 1000,
  })

export const useBreedsQuery = (speciesId?: number | null) =>
  useQuery({
    queryKey: ['breeds', speciesId],
    queryFn: () => breedService.listBySpecies(speciesId!),
    enabled: Boolean(speciesId),
  })

