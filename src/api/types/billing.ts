/**
 * Tipos TypeScript para el módulo de Facturación
 */

export type InvoiceStatus = 'PENDIENTE' | 'PAGADA' | 'ANULADA'

export interface InvoiceDetail {
  id?: number
  producto?: number | null
  producto_nombre?: string | null // Nombre del producto si está disponible
  servicio?: number | null
  servicio_nombre?: string | null // Nombre del servicio si está disponible
  descripcion: string
  cantidad: number
  precio_unitario: number | string
  subtotal?: number | string
}

export interface Invoice {
  id: number
  estado: InvoiceStatus
  cliente: number | string
  cliente_nombre?: string // Nombre del cliente para mostrar
  cita?: number | null
  consulta?: number | null
  fecha: string
  subtotal?: number | string
  impuestos?: number | string
  total: number | string
  pagada?: boolean
  detalles?: InvoiceDetail[]
  pagos?: Payment[] // Lista de pagos asociados
}

export interface InvoiceCreatePayload {
  cita?: number | null
  consulta?: number | null
  detalles: Omit<InvoiceDetail, 'id' | 'subtotal'>[]
}

export interface InvoiceSummary {
  id: number
  estado: InvoiceStatus
  cliente: number | string
  cliente_nombre?: string
  fecha: string
  total: number
  pagada: boolean
}

export interface PaymentMethod {
  id: number
  nombre: string
  codigo: string
}

export interface Payment {
  id: number
  factura: number
  metodo: number | PaymentMethod
  metodo_nombre?: string // Nombre del método de pago
  monto: number | string
  fecha: string
  aprobado: boolean
  referencia?: string | null
}

export interface PaymentCreatePayload {
  metodo_pago: number
  monto: number | string
  referencia?: string
}

export interface PaymentInvoicePayload {
  metodo_pago: number
  monto: number | string
  referencia?: string
}

export interface InvoiceListResponse {
  count: number
  next: string | null
  previous: string | null
  results: Invoice[]
}

export interface PaymentListResponse {
  count?: number
  next?: string | null
  previous?: string | null
  results?: Payment[]
}

