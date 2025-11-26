import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { InventoryProductForm } from '@/pages/inventory/components/InventoryProductForm'

export const InventoryCreatePage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Inventario</p>
        <h1 className="text-3xl font-semibold">Registrar producto</h1>
        <p className="text-sm text-white/70">Define el stock mínimo, precios y códigos de referencia.</p>
      </div>
      <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
        <Link to="/app/inventario">Volver</Link>
      </Button>
    </div>

    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <InventoryProductForm mode="create" />
    </section>
  </div>
)

