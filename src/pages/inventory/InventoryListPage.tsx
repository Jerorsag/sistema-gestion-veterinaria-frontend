import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PackageSearch, PlusCircle, TrendingDown, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'
import { useProductsQuery, useCategoriesQuery, useBrandsQuery, useProductDeactivateMutation } from '@/hooks/inventory'
import type { InventoryCategory, InventoryBrand } from '@/api/types/inventory'

export const InventoryListPage = () => {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')

  const { data: categories } = useCategoriesQuery()
  const { data: brands } = useBrandsQuery()
  const { data: products, isLoading, error } = useProductsQuery({
    buscador: search || undefined,
    categoria: category || undefined,
    marca: brand || undefined,
  })
  const deactivateMutation = useProductDeactivateMutation()

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
      </section>
    </div>
  )
}

