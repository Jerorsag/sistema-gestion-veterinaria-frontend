import { apiClient } from '@/api/httpClient'
import { endpoints } from '@/api/endpoints'
import type { Breed, BreedListResponse } from '@/api/types/pets'

const listBySpecies = async (speciesId: number): Promise<Breed[]> => {
  const { data } = await apiClient.get<BreedListResponse>(endpoints.pets.breeds(), {
    params: { especie: speciesId },
  })

  if (Array.isArray(data)) return data
  if (data?.results) return data.results
  return []
}

export const breedService = {
  listBySpecies,
}

