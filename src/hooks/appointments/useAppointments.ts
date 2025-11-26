import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import type { AxiosError } from 'axios'

import type { AppointmentPayload } from '@/api/types/appointments'
import { appointmentService } from '@/services/appointments'

const getErrorMessage = (error: AxiosError<any>) => {
  const data = error.response?.data
  if (data) {
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message
  }
  return 'Ocurrió un error con las citas.'
}

export const useAppointmentsQuery = () =>
  useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.list,
  })

export const useAppointmentDetailQuery = (id?: string) =>
  useQuery({
    queryKey: ['appointments', 'detail', id],
    queryFn: () => appointmentService.detail(id!),
    enabled: Boolean(id),
  })

export const useAppointmentCreateMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AppointmentPayload) => appointmentService.create(payload),
    onSuccess: () => {
      toast.success('Cita agendada correctamente')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useAppointmentCancelMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number | string) => appointmentService.cancel(id),
    onSuccess: () => {
      toast.success('Cita cancelada')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useAppointmentRescheduleMutation = (id: number | string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fecha_hora: string) => appointmentService.reschedule(id, fecha_hora),
    onSuccess: () => {
      toast.success('Cita reagendada')
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['appointments', 'detail', String(id)] })
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useServicesQuery = () =>
  useQuery({
    queryKey: ['appointment-services'],
    queryFn: appointmentService.services,
    staleTime: 5 * 60 * 1000,
  })

export const useAvailabilityQuery = (veterinarioId?: number | string, fecha?: string) =>
  useQuery({
    queryKey: ['availability', veterinarioId, fecha],
    queryFn: () => appointmentService.availability(veterinarioId!, fecha!),
    enabled: Boolean(veterinarioId && fecha),
  })

