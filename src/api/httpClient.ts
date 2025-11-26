import axios, { AxiosError } from 'axios'
import type { AxiosInstance } from 'axios'

import { appConfig } from '@/core/config/app-config'
import { useSessionStore } from '@/core/store/session-store'

const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = useSessionStore.getState().accessToken

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Placeholder: refresh token flow will be handled in the Auth module
    return Promise.reject(error)
  },
)

export { apiClient }

