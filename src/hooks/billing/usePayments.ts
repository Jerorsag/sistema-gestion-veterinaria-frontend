import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { paymentService } from '@/services/billing/payment.service'
import type { Payment, PaymentCreatePayload, PaymentMethod } from '@/api/types/billing'

interface PaymentFilters {
  factura?: number
  page?: number
}

const QUERY_KEYS = {
  all: ['payments'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: PaymentFilters) => [...QUERY_KEYS.lists(), filters] as const,
  methods: () => [...QUERY_KEYS.all, 'methods'] as const,
}

export const usePaymentsQuery = (filters?: PaymentFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => paymentService.list(filters),
  })
}

export const usePaymentMethodsQuery = () => {
  return useQuery<PaymentMethod[], Error>({
    queryKey: QUERY_KEYS.methods(),
    queryFn: () => paymentService.getPaymentMethods(),
  })
}

export const usePaymentCreateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: PaymentCreatePayload) => paymentService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
    },
  })
}

