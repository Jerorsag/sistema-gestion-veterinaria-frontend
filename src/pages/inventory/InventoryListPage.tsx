import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageSearch, PlusCircle, TrendingDown, TrendingUp, History, X, ChevronDown, ChevronUp } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import {
  useProductsQuery,
  useCategoriesQuery,
  useBrandsQuery,
  useProductDeactivateMutation,
  useKardexQuery,
  useKardexAnularMutation,
} from '@/hooks/inventory'
import { useDisclosure } from '@/hooks/useDisclosure'
import { formatDateTime } from '@/utils/datetime'
import type { InventoryCategory, InventoryBrand } from '@/api/types/inventory'

export const InventoryListPage = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [kardexSearch, setKardexSearch] = useState('')

  const { isOpen: isProductsExpanded, toggle: toggleProducts } = useDisclosure(true)
  const { isOpen: isKardexExpanded, toggle: toggleKardex } = useDisclosure(true)
  const { isOpen: isConfirming, open: openConfirm, close: closeConfirm } = useDisclosure()
  const [movementToAnular, setMovementToAnular] = useState<number | null>(null)

  const { data: categories } = useCategoriesQuery()
  const { data: brands } = useBrandsQuery()
  const { data: products, isLoading, error } = useProductsQuery({
    buscador: search || undefined,
    categoria: category || undefined,
    marca: brand || undefined,
  })
  const { data: kardexMovements, isLoading: isLoadingKardex } = useKardexQuery(kardexSearch || undefined)
  const deactivateMutation = useProductDeactivateMutation()
  const anularKardexMutation = useKardexAnularMutation()

  const handleAnular = (id: number) => {
    setMovementToAnular(id)
    openConfirm()
  }

  const confirmAnular = () => {
    if (movementToAnular) {
      anularKardexMutation.mutate(movementToAnular, {
        onSuccess: () => {
          closeConfirm()
          setMovementToAnular(null)
        },
      })
    }
  }

  const isAnulado = (detalle: string) => detalle && detalle.includes('ANULADO')

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Inventario</p>
          <h1 className="text-3xl font-semibold">Control de insumos</h1>
          <p className="text-sm text-white/70">Monitorea stock, entradas y consumos en tiempo real.</p>
        </div>
        <Button startIcon={<PlusCircle size={16} />} asChild>
          <Link to="/app/inventario/nuevo">Registrar producto</Link>
        </Button>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Buscar" placeholder="Nombre, código..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <label className="space-y-2 text-sm text-white/80">
            <span>Categoría</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Todas</option>
              {categories?.map((cat: InventoryCategory) => (
                <option key={cat.id} value={cat.id}>
                  {cat.descripcion}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/80">
            <span>Marca</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
            >
              <option value="">Todas</option>
              {brands?.map((brandItem: InventoryBrand) => (
                <option key={brandItem.id} value={brandItem.id}>
                  {brandItem.descripcion}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section>
        <button
          onClick={toggleProducts}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
        >
          <span className="text-sm font-semibold text-white/80">
            {isProductsExpanded ? 'Ocultar productos' : 'Mostrar productos'} ({products?.length || 0})
          </span>
          {isProductsExpanded ? <ChevronUp size={20} className="text-white/60" /> : <ChevronDown size={20} className="text-white/60" />}
        </button>

        {isProductsExpanded && (
          <>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Spinner size="lg" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-12 text-center text-red-200">
                <p className="font-semibold">Error al cargar productos</p>
                <p className="text-sm text-red-200/70">Verifica la conexión con el servidor e intenta nuevamente.</p>
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid gap-4">
                {products.map((product) => {
              const stockLevel =
                product.stock_actual <= product.stock_minimo
                  ? 'critico'
                  : product.stock_actual <= product.stock_minimo * 1.5
                    ? 'medio'
                    : 'ok'
              const stockStyle =
                stockLevel === 'critico'
                  ? 'text-red-200 bg-red-500/10'
                  : stockLevel === 'medio'
                    ? 'text-amber-200 bg-amber-500/10'
                    : 'text-emerald-200 bg-emerald-500/10'

              return (
                <Card
                  key={product.id}
                  className="flex flex-col gap-3 border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-primary/15 p-3 text-primary">
                      <PackageSearch size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{product.nombre}</h3>
                      <p className="text-sm text-white/70">{product.descripcion || 'Sin descripción'}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
                        {product.categoria?.descripcion && <span>{product.categoria.descripcion}</span>}
                        {product.marca?.descripcion && <span>{product.marca.descripcion}</span>}
                        <span>Código interno: {product.codigo_interno || '—'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-sm text-white/70">
                    <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs ${stockStyle}`}>
                      Stock: {product.stock_actual} u. (mín {product.stock_minimo})
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="ghost" startIcon={<TrendingUp size={14} />}>
                        <Link to={`/app/inventario/${product.id}`}>Detalle</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-200"
                        startIcon={<TrendingDown size={14} />}
                        disabled={deactivateMutation.isPending}
                        onClick={() => deactivateMutation.mutate(product.id)}
                      >
                        Desactivar
                      </Button>
                    </div>
                  </div>
                </Card>
              )
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-white/60">
                No se encontraron productos con esos filtros.
              </div>
            )}
          </>
        )}
      </section>

      {/* Sección de Kardex */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Historial de movimientos</h2>
            <p className="text-sm text-white/60">Registro de entradas, salidas y ajustes de inventario.</p>
          </div>
          <Button startIcon={<PlusCircle size={16} />} asChild>
            <Link to="/app/inventario/movimientos/nuevo">Registrar movimiento</Link>
          </Button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <Input
            label="Buscar movimientos"
            placeholder="Producto o detalle..."
            value={kardexSearch}
            onChange={(event) => setKardexSearch(event.target.value)}
          />
        </div>

        <button
          onClick={toggleKardex}
          className="mb-4 flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-colors hover:bg-white/[0.05]"
        >
          <span className="text-sm font-semibold text-white/80">
            {isKardexExpanded ? 'Ocultar movimientos' : 'Mostrar movimientos'} ({kardexMovements?.length || 0})
          </span>
          {isKardexExpanded ? <ChevronUp size={20} className="text-white/60" /> : <ChevronDown size={20} className="text-white/60" />}
        </button>

        {isKardexExpanded && (
          <>

            <div>
          {isLoadingKardex ? (
            <div className="flex justify-center py-10">
              <Spinner size="lg" />
            </div>
          ) : kardexMovements && kardexMovements.length > 0 ? (
            <div className="space-y-3">
              {kardexMovements.slice(0, 10).map((movement) => {
                const isEntry = movement.tipo === 'entrada'
                const anulado = isAnulado(movement.detalle)
                const color = anulado
                  ? 'text-gray-400 bg-gray-500/10'
                  : isEntry
                    ? 'text-emerald-200 bg-emerald-500/10'
                    : 'text-red-200 bg-red-500/10'

                return (
                  <Card
                    key={movement.id}
                    className="flex flex-col gap-3 border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-2xl p-3 ${anulado ? 'bg-gray-500/15 text-gray-400' : isEntry ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-200'}`}
                      >
                        {isEntry ? <PackageSearch size={18} /> : <History size={18} />}
                      </div>
                      <div>
                        <p className="text-sm text-white/60">{formatDateTime(movement.fecha)}</p>
                        <h3 className={`text-lg font-semibold ${anulado ? 'text-white/50 line-through' : 'text-white'}`}>
                          {movement.producto_nombre}
                        </h3>
                        <p className={`text-sm ${anulado ? 'text-white/40' : 'text-white/70'}`}>{movement.detalle}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-sm text-white/80">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${color}`}>
                          {anulado ? 'Anulado' : movement.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                        </span>
                        {!anulado && (
                          <Button
                            variant="ghost"
                            startIcon={<X size={14} />}
                            onClick={() => handleAnular(movement.id)}
                            disabled={anularKardexMutation.isPending}
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/10 text-xs px-2 py-1"
                          >
                            Anular
                          </Button>
                        )}
                      </div>
                      <span className={anulado ? 'text-white/40' : ''}>Cantidad: {movement.cantidad} u.</span>
                      {movement.usuario && <span className="text-xs text-white/60">Por: {movement.usuario}</span>}
                    </div>
                  </Card>
                )
              })}
              {kardexMovements.length > 10 && (
                <div className="text-center">
                  <Button variant="ghost" asChild>
                    <Link to="/app/inventario/kardex">Ver todos los movimientos ({kardexMovements.length})</Link>
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-white/60">
              Sin movimientos registrados. Haz clic en "Registrar movimiento" para comenzar.
            </div>
          )}
            </div>
          </>
        )}
      </section>

      {/* Modal de confirmación de anulación */}
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-md space-y-4 p-6">
            <h3 className="text-xl font-semibold text-white">Anular movimiento</h3>
            <p className="text-sm text-white/70">¿Estás seguro de que deseas anular este movimiento? Esta acción revertirá los cambios en el stock.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" onClick={closeConfirm} disabled={anularKardexMutation.isPending}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmAnular} disabled={anularKardexMutation.isPending} startIcon={<X size={16} />}>
                {anularKardexMutation.isPending ? 'Anulando...' : 'Anular movimiento'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

