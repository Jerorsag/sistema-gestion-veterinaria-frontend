import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PackageSearch } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useProductsQuery } from '@/hooks/inventory'
import type { KardexMovementPayload } from '@/api/types/inventory'

const schema = z.object({
  tipo: z.enum(['entrada', 'salida'], {
    message: 'Selecciona el tipo de movimiento',
  }),
  producto: z.string().min(1, 'Selecciona un producto'),
  cantidad: z.string().min(1, 'La cantidad es obligatoria'),
  detalle: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface KardexMovementFormProps {
  onSubmit: (data: KardexMovementPayload) => void | Promise<void>
  isLoading?: boolean
  defaultValues?: Partial<FormValues>
}

export const KardexMovementForm = ({ onSubmit, isLoading = false, defaultValues }: KardexMovementFormProps) => {
  const { data: products, isLoading: loadingProducts } = useProductsQuery({})

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: defaultValues?.tipo || 'entrada',
      producto: defaultValues?.producto ? String(defaultValues.producto) : '',
      cantidad: defaultValues?.cantidad ? String(defaultValues.cantidad) : '',
      detalle: defaultValues?.detalle || '',
    },
  })

  const tipo = watch('tipo')
  const productoIdStr = watch('producto')
  const productoId = productoIdStr ? Number(productoIdStr) : undefined
  const selectedProduct = productoId ? products?.find((p) => p.id === productoId) : undefined

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    }
  }, [defaultValues, reset])

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      tipo: data.tipo,
      producto: Number(data.producto),
      cantidad: Number(data.cantidad),
      detalle: data.detalle || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Información del movimiento</h2>
          <p className="text-sm text-white/60">Registra una entrada o salida de inventario</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Tipo de movimiento *</span>
            <select
              {...register('tipo', { valueAsNumber: false })}
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white transition-colors hover:border-white/20 focus:border-white/30 focus:outline-none"
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
            {errors.tipo && <p className="text-xs text-red-400">{errors.tipo.message}</p>}
          </label>

          <label className="space-y-2 text-sm text-white/80">
            <span>Producto *</span>
            {loadingProducts ? (
              <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2">
                <Spinner size="sm" />
              </div>
            ) : (
            <select
              {...register('producto')}
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white transition-colors hover:border-white/20 focus:border-white/30 focus:outline-none"
            >
                <option value="">Selecciona un producto</option>
                {products
                  ?.filter((p) => p.activo)
                  .map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.nombre} {product.codigo_interno && `(${product.codigo_interno})`} - Stock: {product.stock_actual}
                    </option>
                  ))}
              </select>
            )}
            {errors.producto && <p className="text-xs text-red-400">{errors.producto.message}</p>}
          </label>
        </div>

        {selectedProduct && (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-300">
                <PackageSearch size={18} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-white">{selectedProduct.nombre}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
                  <span>Stock actual: {selectedProduct.stock_actual}</span>
                  <span>Stock mínimo: {selectedProduct.stock_minimo}</span>
                  {selectedProduct.codigo_interno && <span>Código: {selectedProduct.codigo_interno}</span>}
                </div>
                {tipo === 'salida' && selectedProduct.stock_actual < Number(watch('cantidad') || 0) && (
                  <p className="text-xs text-amber-400">⚠️ Stock insuficiente para esta cantidad</p>
                )}
                {tipo === 'salida' && selectedProduct.stock_actual <= selectedProduct.stock_minimo && (
                  <p className="text-xs text-red-400">⚠️ El stock está por debajo del mínimo</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/80">
            <span>Cantidad *</span>
              <Input
              type="number"
              min="1"
              step="1"
              {...register('cantidad')}
              placeholder="Ej: 10"
              error={errors.cantidad?.message}
            />
          </label>
        </div>

        <label className="block space-y-2 text-sm text-white/80">
          <span>Detalle (opcional)</span>
          <textarea
            {...register('detalle')}
            rows={3}
            placeholder="Describe el motivo del movimiento..."
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white transition-colors placeholder:text-white/40 hover:border-white/20 focus:border-white/30 focus:outline-none"
          />
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
        <Button type="submit" disabled={isLoading || loadingProducts} startIcon={isLoading ? <Spinner size="sm" /> : null}>
          {isLoading ? 'Registrando...' : 'Registrar movimiento'}
        </Button>
      </div>
    </form>
  )
}

