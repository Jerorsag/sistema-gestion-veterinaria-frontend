import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

import type { RefreshResponse } from '@/api/types/auth'
import { appConfig } from '@/core/config/app-config'
import { useSessionStore } from '@/core/store/session-store'

type AxiosRequestConfigWithRetry = AxiosRequestConfig & { _retry?: boolean }

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

let refreshPromise: Promise<string | null> | null = null

const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken, setTokens, clearSession } = useSessionStore.getState()
  if (!refreshToken) {
    return null
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<RefreshResponse>(`${appConfig.apiUrl}/auth/refresh/`, { refresh: refreshToken })
      .then((response) => {
        const { access, refresh } = response.data
        setTokens({ accessToken: access, refreshToken: refresh ?? refreshToken })
        return access
      })
      .catch(() => {
        clearSession()
        return null
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry | undefined
    const status = error.response?.status
    const requestUrl = originalRequest?.url ?? ''

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !requestUrl.includes('/auth/login') &&
      !requestUrl.includes('/auth/refresh/')
    ) {
      originalRequest._retry = true
      const newAccessToken = await refreshAccessToken()

      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      }
    }

    return Promise.reject(error)
  },
)

export { apiClient }

