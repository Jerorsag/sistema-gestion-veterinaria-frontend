import { apiClient } from '@/api/httpClient'
import { endpoints } from '@/api/endpoints'

export interface RoleOption {
  id: number
  nombre: string
  descripcion?: string
}

const list = async () => {
  const { data } = await apiClient.get<RoleOption[]>(endpoints.roles.base())
  return data
}

export const roleService = {
  list,
}

