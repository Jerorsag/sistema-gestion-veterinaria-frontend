export interface AppointmentSummary {
  id: number
  mascota_nombre: string
  veterinario_nombre: string | null
  servicio_nombre: string | null
  fecha_hora: string
  estado: string
}

export interface AppointmentPayload {
  mascota_id: number | string
  veterinario_id: number | string
  servicio_id: number | string
  fecha_hora: string
  observaciones?: string
}

export interface ServiceItem {
  id: number
  nombre: string
  costo: string
}

export interface AvailabilityResponse {
  horarios_disponibles: string[]
}

