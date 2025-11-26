import { ArrowLeft, ClipboardList, Edit3 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { InventoryProductForm } from '@/pages/inventory/components/InventoryProductForm'
import { useProductDetailQuery } from '@/hooks/inventory'

export const InventoryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useProductDetailQuery(id)

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label">Inventario</p>
          <h1 className="text-3xl font-semibold text-heading">{data.nombre}</h1>
          <p className="text-sm text-secondary">{data.descripcion || 'Sin descripción'}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" startIcon={<ClipboardList size={14} />}>
            <Link to="/app/inventario/kardex">Ver Kardex</Link>
          </Button>
          <Button asChild variant="ghost" startIcon={<ArrowLeft size={14} />}>
            <Link to="/app/inventario">Volver</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-label">Stock</p>
          <p className="mt-2 text-2xl font-semibold text-heading">{data.stock_actual} u.</p>
          <p className="text-sm text-secondary">Mínimo configurado: {data.stock_minimo}</p>
        </Card>
        <Card>
          <p className="text-label">Precios</p>
          <p className="mt-2 text-sm text-primary">Compra: ${data.precio_compra}</p>
          <p className="text-sm text-primary">Venta: ${data.precio_venta}</p>
        </Card>
        <Card>
          <p className="text-label">Identificadores</p>
          <p className="mt-2 text-sm text-primary">Código interno: {data.codigo_interno || '—'}</p>
          <p className="text-sm text-primary">Código barras: {data.codigo_barras || '—'}</p>
        </Card>
      </section>

      <section className="rounded-3xl bg-surface p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="mb-4 flex items-center gap-2 text-heading">
          <Edit3 size={16} />
          <p className="font-semibold">Actualizar información</p>
        </div>
        <InventoryProductForm mode="edit" product={data} />
      </section>
    </div>
  )
}

