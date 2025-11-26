import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useBrandsQuery, useCategoriesQuery, useProductCreateMutation, useProductUpdateMutation } from '@/hooks/inventory'
import type { InventoryProduct, InventoryProductPayload, InventoryCategory, InventoryBrand } from '@/api/types/inventory'

const schema = z.object({
  nombre: z.string().min(3, 'El nombre es obligatorio'),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
  marca: z.string().optional(),
  stock_minimo: z.string().optional(),
  precio_compra: z.string().optional(),
  precio_venta: z.string().optional(),
  codigo_barras: z.string().optional(),
  codigo_interno: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface InventoryProductFormProps {
  mode: 'create' | 'edit'
  product?: InventoryProduct
}

export const InventoryProductForm = ({ mode, product }: InventoryProductFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: product?.nombre ?? '',
      descripcion: product?.descripcion ?? '',
      categoria: product?.categoria?.id ? String(product.categoria.id) : '',
      marca: product?.marca?.id ? String(product.marca.id) : '',
      stock_minimo: product?.stock_minimo ? String(product.stock_minimo) : '',
      precio_compra: product?.precio_compra ?? '',
      precio_venta: product?.precio_venta ?? '',
      codigo_barras: product?.codigo_barras ?? '',
      codigo_interno: product?.codigo_interno ?? '',
    },
  })

  const { data: categories } = useCategoriesQuery()
  const { data: brands } = useBrandsQuery()

  const createMutation = useProductCreateMutation()
  const updateMutation = useProductUpdateMutation(product?.id ?? 0)
  const isEditing = mode === 'edit'
  const isSubmitting = form.formState.isSubmitting || createMutation.isPending || updateMutation.isPending

  const payloadFromValues = (values: FormValues): InventoryProductPayload => ({
    nombre: values.nombre,
    descripcion: values.descripcion,
    categoria: values.categoria ? Number(values.categoria) : undefined,
    marca: values.marca ? Number(values.marca) : undefined,
    stock_minimo: values.stock_minimo ? Number(values.stock_minimo) : undefined,
    precio_compra: values.precio_compra ? Number(values.precio_compra) : undefined,
    precio_venta: values.precio_venta ? Number(values.precio_venta) : undefined,
    codigo_barras: values.codigo_barras,
    codigo_interno: values.codigo_interno,
  })

  const onSubmit = async (values: FormValues) => {
    const payload = payloadFromValues(values)
    if (isEditing && product) {
      await updateMutation.mutateAsync(payload)
    } else {
      await createMutation.mutateAsync(payload)
      form.reset()
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre" {...form.register('nombre')} error={form.formState.errors.nombre?.message} />
        <Input label="Código interno" {...form.register('codigo_interno')} />
        <Input label="Código de barras" {...form.register('codigo_barras')} />
        <Input label="Stock mínimo" type="number" min="0" {...form.register('stock_minimo')} />
        <Input label="Precio compra" type="number" step="0.01" {...form.register('precio_compra')} />
        <Input label="Precio venta" type="number" step="0.01" {...form.register('precio_venta')} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-white/80">
          <span>Categoría</span>
          <select
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
            value={form.watch('categoria')}
            onChange={(event) => form.setValue('categoria', event.target.value)}
          >
            <option value="">Sin categoría</option>
            {categories?.map((category: InventoryCategory) => (
              <option key={category.id} value={category.id}>
                {category.descripcion}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-white/80">
          <span>Marca</span>
          <select
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
            value={form.watch('marca')}
            onChange={(event) => form.setValue('marca', event.target.value)}
          >
            <option value="">Sin marca</option>
            {brands?.map((brand: InventoryBrand) => (
              <option key={brand.id} value={brand.id}>
                {brand.descripcion}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm text-white/80">
        <span>Descripción</span>
        <textarea
          className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
          {...form.register('descripcion')}
          placeholder="Notas sobre el producto, proveedor, presentaciones..."
        />
      </label>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Registrar producto'}
      </Button>
    </form>
  )
}

