import { apiClient } from '@/api/httpClient'
import { endpoints } from '@/api/endpoints'
import type { Payment, PaymentCreatePayload, PaymentListResponse, PaymentMethod } from '@/api/types/billing'

interface PaymentQueryParams {
  factura?: number
  page?: number
}

const list = async (params: PaymentQueryParams = {}) => {
  const queryParams: Record<string, unknown> = {
    factura: params.factura,
    page: params.page,
  }

  // Limpiar parámetros undefined
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === undefined || queryParams[key] === '') {
      delete queryParams[key]
    }
  })

  const { data } = await apiClient.get<PaymentListResponse | Payment[]>(endpoints.billing.payments, {
    params: queryParams,
  })

  // Normalizar respuesta
  if (Array.isArray(data)) {
    return data
  }

  return data.results || []
}

const create = async (payload: PaymentCreatePayload) => {
  const { data } = await apiClient.post<Payment>(endpoints.billing.payments, payload)
  return data
}

const getPaymentMethods = async () => {
  const { data } = await apiClient.get<PaymentMethod[]>(endpoints.billing.paymentMethods())
  return data
}

export const paymentService = {
  list,
  create,
  getPaymentMethods,
}

