import type { PaginatedResponse } from '@/api/types/common'

export interface InventoryProduct {
  id: number
  nombre: string
  descripcion: string
  categoria: {
    id: number
    descripcion: string
  } | null
  marca: {
    id: number
    descripcion: string
  } | null
  stock_actual: number
  stock_minimo: number
  precio_compra: string
  precio_venta: string
  codigo_barras: string | null
  codigo_interno: string | null
  activo: boolean
}

export interface InventoryProductPayload {
  nombre: string
  descripcion?: string
  categoria?: number | null
  marca?: number | null
  stock_minimo?: number
  precio_compra?: number
  precio_venta?: number
  codigo_barras?: string
  codigo_interno?: string
}

export interface InventoryCategory {
  id: number
  descripcion: string
}

export interface InventoryBrand {
  id: number
  descripcion: string
}

export interface KardexMovement {
  id: number
  producto: number
  producto_nombre: string
  tipo_movimiento: 'entrada' | 'salida' | 'ajuste'
  cantidad: number
  detalle: string
  fecha: string
  usuario?: string
}

export type ProductsResponse = PaginatedResponse<InventoryProduct> | InventoryProduct[]
export type KardexResponse = PaginatedResponse<KardexMovement> | KardexMovement[]

