import { useState } from 'react'
import { ArrowLeft, History, PackageOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useKardexQuery } from '@/hooks/inventory'
import { formatDateTime } from '@/utils/datetime'

export const InventoryKardexPage = () => {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useKardexQuery(search || undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Inventario</p>
          <h1 className="text-3xl font-semibold">Kardex general</h1>
          <p className="text-sm text-white/70">Movimientos recientes de entrada, salida y ajustes.</p>
        </div>
        <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
          <Link to="/app/inventario">Volver</Link>
        </Button>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <Input label="Buscar" placeholder="Producto o detalle..." value={search} onChange={(event) => setSearch(event.target.value)} />
      </section>

      <section>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((movement) => {
              const isEntry = movement.tipo_movimiento === 'entrada'
              const color =
                movement.tipo_movimiento === 'ajuste' ? 'text-amber-200 bg-amber-500/10' : isEntry ? 'text-emerald-200 bg-emerald-500/10' : 'text-red-200 bg-red-500/10'

              return (
                <Card key={movement.id} className="flex flex-col gap-3 border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`rounded-2xl p-3 ${isEntry ? 'bg-emerald-500/15 text-emerald-300' : movement.tipo_movimiento === 'ajuste' ? 'bg-amber-500/15 text-amber-200' : 'bg-red-500/15 text-red-200'}`}>
                      {isEntry ? <PackageOpen size={18} /> : <History size={18} />}
                    </div>
                    <div>
                      <p className="text-sm text-white/60">{formatDateTime(movement.fecha)}</p>
                      <h3 className="text-lg font-semibold text-white">{movement.producto_nombre}</h3>
                      <p className="text-sm text-white/70">{movement.detalle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm text-white/80">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>{movement.tipo_movimiento}</span>
                    <span>Cantidad: {movement.cantidad} u.</span>
                    {movement.usuario && <span className="text-xs text-white/60">Por: {movement.usuario}</span>}
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-white/60">
            Sin movimientos registrados.
          </div>
        )}
      </section>
    </div>
  )
}

