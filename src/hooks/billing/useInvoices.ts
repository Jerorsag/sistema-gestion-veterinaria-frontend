import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { invoiceService } from '@/services/billing/invoice.service'
import type { Invoice, InvoiceCreatePayload, PaymentInvoicePayload } from '@/api/types/billing'

interface InvoiceFilters {
  search?: string
  estado?: string
  cliente?: number | string
  page?: number
  ordering?: string
}

const QUERY_KEYS = {
  all: ['invoices'] as const,
  lists: () => [...QUERY_KEYS.all, 'list'] as const,
  list: (filters?: InvoiceFilters) => [...QUERY_KEYS.lists(), filters] as const,
  details: () => [...QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number | string) => [...QUERY_KEYS.details(), id] as const,
}

export const useInvoicesQuery = (filters?: InvoiceFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.list(filters),
    queryFn: () => invoiceService.list(filters),
  })
}

export const useInvoiceDetailQuery = (id: number | string | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.detail(id!),
    queryFn: () => invoiceService.detail(id!),
    enabled: !!id,
    retry: 1,
  })
}

export const useInvoiceCreateMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: InvoiceCreatePayload) => invoiceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Factura creada correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Error al crear la factura')
    },
  })
}

export const useInvoiceCreateFromAppointmentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentId: number | string) => invoiceService.createFromAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Factura creada desde cita correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Error al crear factura desde cita')
    },
  })
}

export const useInvoiceCreateFromConsultationMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (consultationId: number | string) => invoiceService.createFromConsultation(consultationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      toast.success('Factura creada desde consulta correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Error al crear factura desde consulta')
    },
  })
}

export const useInvoicePayMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ invoiceId, payload }: { invoiceId: number | string; payload: PaymentInvoicePayload }) =>
      invoiceService.pay(invoiceId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(variables.invoiceId) })
      toast.success('Factura pagada correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Error al pagar la factura')
    },
  })
}

export const useInvoiceCancelMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (invoiceId: number | string) => invoiceService.cancel(invoiceId),
    onSuccess: (_, invoiceId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(invoiceId) })
      toast.success('Factura anulada correctamente')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Error al anular la factura')
    },
  })
}

export const useInvoiceSendEmailMutation = () => {
  return useMutation({
    mutationFn: (invoiceId: number | string) => invoiceService.sendEmail(invoiceId),
    onSuccess: () => {
      toast.success('Factura enviada por correo electrónico')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Error al enviar el correo')
    },
  })
}

