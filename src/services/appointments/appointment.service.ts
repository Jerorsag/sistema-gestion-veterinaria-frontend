import { apiClient } from '@/api/httpClient'
import { endpoints } from '@/api/endpoints'
import type {
  AppointmentPayload,
  AppointmentSummary,
  AvailabilityResponse,
  ServiceItem,
} from '@/api/types/appointments'

// Tipado para el payload de reagendar
interface ReschedulePayload {
  fecha_hora: string;
}

const list = async () => {
  const { data } = await apiClient.get<AppointmentSummary[] | { results: AppointmentSummary[] }>(
    endpoints.appointments.base(),
  )
  // Verificación más segura de TS para paginación de DRF
  if (Array.isArray(data)) return data
  if (data && 'results' in data) return data.results
  return []
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
  // Definimos el objeto payload explícitamente para asegurar el formato JSON correcto
  const payload: ReschedulePayload = { fecha_hora }
  const { data } = await apiClient.post<AppointmentSummary>(endpoints.appointments.reschedule(id), payload)
  return data
}

const services = async () => {
  const { data } = await apiClient.get<ServiceItem[] | { results: ServiceItem[] }>(
    endpoints.appointments.services(),
  )
  if (Array.isArray(data)) return data
  if (data && 'results' in data) return data.results as ServiceItem[]
  return []
}

const availability = async (veterinarioId: number | string, fecha: string) => {
  const { data } = await apiClient.get<AvailabilityResponse>(endpoints.appointments.availability(), {
    params: { veterinario_id: veterinarioId, fecha },
  })
  return data.horarios_disponibles
}

const availableForInvoice = async () => {
  const { data } = await apiClient.get<AppointmentSummary[] | { results: AppointmentSummary[] }>(
    endpoints.appointments.availableForInvoice(),
  )
  // Verificación más segura de TS para paginación de DRF
  if (Array.isArray(data)) return data
  if (data && 'results' in data) return data.results
  return []
}

export const appointmentService = {
  list,
  create,
  detail,
  cancel,
  reschedule,
  services,
  availability,
  availableForInvoice,
}