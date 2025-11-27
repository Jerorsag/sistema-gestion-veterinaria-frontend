export interface AppointmentSummary {
  id: number
  mascota_nombre: string
  mascota: number
  veterinario_nombre: string | null
  servicio_nombre: string | null
  servicio: number
  fecha_hora: string
  estado: string
  consulta_id?: number | null 

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

