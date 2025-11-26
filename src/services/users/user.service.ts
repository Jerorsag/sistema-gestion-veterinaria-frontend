import { apiClient } from '@/api/httpClient'
import { endpoints } from '@/api/endpoints'
import type {
  UserChangePasswordPayload,
  UserCreatePayload,
  UserDetail,
  UserListResponse,
  UserQueryParams,
  UserStats,
  UserUpdatePayload,
} from '@/api/types/users'

type MessageResponse = {
  detail?: string
  message?: string
  [key: string]: unknown
}

const list = async (params: UserQueryParams) => {
  const { data } = await apiClient.get<UserListResponse>(endpoints.users.base(), {
    params: {
      search: params.search,
      estado: params.estado && params.estado !== 'todos' ? params.estado : undefined,
      ordering: params.ordering,
      page: params.page,
      'usuario_roles__rol__nombre': params.rol,
    },
  })
  return data
}

const retrieve = async (id: number | string) => {
  const { data } = await apiClient.get<UserDetail>(endpoints.users.detail(id))
  return data
}

const create = async (payload: UserCreatePayload) => {
  const { data } = await apiClient.post<UserDetail>(endpoints.users.base(), payload)
  return data
}

const update = async (id: number | string, payload: UserUpdatePayload) => {
  const { data } = await apiClient.patch<UserDetail>(endpoints.users.detail(id), payload)
  return data
}

const remove = async (id: number | string) => {
  await apiClient.delete(endpoints.users.detail(id))
}

const activate = async (id: number | string) => {
  const { data } = await apiClient.post<MessageResponse>(endpoints.users.activate(id))
  return data
}

const suspend = async (id: number | string) => {
  const { data } = await apiClient.post<MessageResponse>(endpoints.users.suspend(id))
  return data
}

const changePassword = async (id: number | string, payload: UserChangePasswordPayload) => {
  const { data } = await apiClient.post<MessageResponse>(endpoints.users.changePassword(id), payload)
  return data
}

const stats = async () => {
  const { data } = await apiClient.get<UserStats>(endpoints.users.stats())
  return data
}

export const userService = {
  list,
  retrieve,
  create,
  update,
  remove,
  activate,
  suspend,
  changePassword,
  stats,
}

