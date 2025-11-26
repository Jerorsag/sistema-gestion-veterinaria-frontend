import { apiClient } from '@/api/httpClient'
import { endpoints } from '@/api/endpoints'
import type {
  AppointmentPayload,
  AppointmentSummary,
  AvailabilityResponse,
  ServiceItem,
} from '@/api/types/appointments'

const list = async () => {
  const { data } = await apiClient.get<AppointmentSummary[]>(endpoints.appointments.base())
  return data
}

const create = async (payload: AppointmentPayload) => {
  const { data } = await apiClient.post<AppointmentSummary>(endpoints.appointments.base(), payload)
  return data
}

const detail = async (id: number | string) => {
  const { data } = await apiClient.get<AppointmentSummary>(endpoints.appointments.detail(id))
  return data
}

const cancel = async (id: number | string) => {
  const { data } = await apiClient.post<AppointmentSummary>(endpoints.appointments.cancel(id))
  return data
}

const reschedule = async (id: number | string, fecha_hora: string) => {
  const { data } = await apiClient.post<AppointmentSummary>(endpoints.appointments.reschedule(id), {
    fecha_hora,
  })
  return data
}

const services = async () => {
  const { data } = await apiClient.get<ServiceItem[]>(endpoints.appointments.services())
  return data
}

const availability = async (veterinarioId: number | string, fecha: string) => {
  const { data } = await apiClient.get<AvailabilityResponse>(endpoints.appointments.availability(), {
    params: {
      veterinario_id: veterinarioId,
      fecha,
    },
  })
  return data.horarios_disponibles
}

export const appointmentService = {
  list,
  create,
  detail,
  cancel,
  reschedule,
  services,
  availability,
}

