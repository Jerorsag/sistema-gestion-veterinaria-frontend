import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'

// UI Components
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

// Hooks
import { useConsultationCreateMutation } from '@/hooks/consultations'
import { usePetsQuery } from '@/hooks/pets'
// ✅ CORRECCIÓN IMPORTANTE: Usamos el hook exacto que indicaste
import { useProductsQuery } from '@/hooks/inventory'

// Definición de tipo local para el Producto (para que TypeScript no se queje)
interface Product {
  id: number
  nombre: string
  stock?: number
}

// Esquema de Validación
const schema = z.object({
  mascota: z.string().min(1, 'Selecciona una mascota'),
  fecha_consulta: z.string().min(1, 'Selecciona una fecha'),
  descripcion_consulta: z.string().min(10, 'Describe la consulta'),
  diagnostico: z.string().min(4, 'Ingrese un diagnóstico'),
  notas_adicionales: z.string().optional(),
  servicio: z.string().optional(),
  cita: z.string().optional(),
  prescripciones: z
    .array(
      z.object({
        // Se valida como string porque el valor del <select> es texto
        producto: z.string().min(1, 'Selecciona un producto'),
        dosis: z.string().min(1, 'Dosis requerida'),
        frecuencia: z.string().min(1, 'Frecuencia requerida'),
      }),
    )
    .optional(),
})

type FormValues = z.infer<typeof schema>

export const ConsultationForm = () => {
  const [searchParams] = useSearchParams()

  // 1. Obtener parámetros de URL (si viene de una Cita)
  const preMascotaId = searchParams.get('mascota') || ''
  const preServicioId = searchParams.get('servicio') || ''
  const preCitaId = searchParams.get('cita') || ''
  const preNombreServicio = searchParams.get('nombre_servicio') || ''

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mascota: preMascotaId,
      servicio: preServicioId,
      cita: preCitaId,
      fecha_consulta: new Date().toISOString().slice(0, 10),
      descripcion_consulta: '',
      diagnostico: '',
      notas_adicionales: '',
      prescripciones: [],
    },
  })

  const {
    fields: prescriptionFields,
    append: addPrescription,
    remove: removePrescription,
  } = useFieldArray({
    control: form.control,
    name: 'prescripciones',
  })

  // 2. Cargar Datos Externos
  const { data: pets } = usePetsQuery({ search: '', especie: null })
  
  // ✅ USAMOS EL HOOK CORRECTO
  const { data: productsData, isLoading: isLoadingProducts } = useProductsQuery()

  // Normalización de datos segura:
  // Si 'productsData' es un array, lo usamos. Si viene paginado (.results), usamos eso. Si es null, array vacío.
  const productos: Product[] = Array.isArray(productsData)
    ? productsData
    : (productsData as any)?.results || []

  const mutation = useConsultationCreateMutation()

  // 3. Manejo del Envío
  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync({
      mascota: Number(values.mascota),
      fecha_consulta: values.fecha_consulta,
      descripcion_consulta: values.descripcion_consulta,
      diagnostico: values.diagnostico,
      notas_adicionales: values.notas_adicionales,
      // Enviar campos opcionales convertidos
      servicio: values.servicio ? Number(values.servicio) : null,
      cita: values.cita ? Number(values.cita) : null,
      prescripciones: values.prescripciones?.map((pres) => ({
        // Convertir el ID del producto de string a número para el backend
        producto: Number(pres.producto),
        dosis: pres.dosis,
        frecuencia: pres.frecuencia,
        duracion_dias: 1, 
      })),
    })
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
      {/* Campos ocultos para mantener referencia a la Cita/Servicio */}
      <input type="hidden" {...form.register('cita')} />
      <input type="hidden" {...form.register('servicio')} />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Aviso visual si viene de Cita */}
        {preCitaId && (
          <div className="col-span-2 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
             <span className="font-semibold">Atendiendo Cita:</span> 
             Se ha seleccionado automáticamente la mascota y el servicio 
             {preNombreServicio ? ` (${preNombreServicio})` : ''}.
          </div>
        )}

        <label className="space-y-2 text-sm text-primary">
          <span>Mascota</span>
          <select
            className="w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-4 py-2 text-base text-primary disabled:opacity-70"
            style={{ borderWidth: 'var(--border-subtle-width)' }}
            disabled={!!preMascotaId}
            value={form.watch('mascota')}
            onChange={(event) => form.setValue('mascota', event.target.value)}
          >
            <option value="">Selecciona una mascota</option>
            {pets?.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nombre}
              </option>
            ))}
          </select>
          {form.formState.errors.mascota && <p className="text-xs text-red-600">{form.formState.errors.mascota.message}</p>}
        </label>

        <Input
          type="date"
          label="Fecha consulta"
          {...form.register('fecha_consulta')}
          error={form.formState.errors.fecha_consulta?.message}
        />
      </div>

      <Input
        label="Descripción"
        placeholder="Motivo de la consulta, síntomas..."
        {...form.register('descripcion_consulta')}
        error={form.formState.errors.descripcion_consulta?.message}
      />

      <Input
        label="Diagnóstico"
        placeholder="Resultado principal de la consulta"
        {...form.register('diagnostico')}
        error={form.formState.errors.diagnostico?.message}
      />

      <Input
        label="Notas adicionales"
        placeholder="Tratamiento recomendado, observaciones..."
        {...form.register('notas_adicionales')}
        error={form.formState.errors.notas_adicionales?.message}
      />

      {/* Sección de Prescripciones con Selector de Productos */}
      <section className="rounded-2xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-heading">Prescripciones</h3>
          <Button type="button" variant="ghost" onClick={() => addPrescription({ producto: '', dosis: '', frecuencia: '' })}>
            Agregar
          </Button>
        </div>
        
        {prescriptionFields.length === 0 ? (
          <p className="text-sm text-secondary">No se han agregado prescripciones.</p>
        ) : (
          <div className="space-y-3">
            {prescriptionFields.map((field, index) => (
              <div key={field.id} className="rounded-xl bg-[var(--color-surface-200)] p-3" style={{ boxShadow: 'var(--shadow-soft)' }}>
                
                <label className="mb-2 block text-sm text-primary">
                  Producto del Inventario
                  {isLoadingProducts ? (
                    <div className="mt-1 text-xs text-secondary">Cargando productos...</div>
                  ) : (
                    <select
                      className="mt-1 w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface)] px-3 py-2 text-base text-primary focus:border-blue-500 focus:outline-none"
                      style={{ borderWidth: 'var(--border-subtle-width)' }}
                      {...form.register(`prescripciones.${index}.producto`)}
                    >
                      <option value="">Seleccione un medicamento...</option>
                      
                      {/* Renderizado seguro con ?.map para evitar errores si la lista es undefined */}
                      {productos?.map((prod) => (
                        <option key={prod.id} value={String(prod.id)}>
                          {prod.nombre} {prod.stock !== undefined ? `(Stock: ${prod.stock})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </label>

                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <Input label="Dosis" {...form.register(`prescripciones.${index}.dosis`)} />
                  <Input label="Frecuencia" {...form.register(`prescripciones.${index}.frecuencia`)} />
                </div>
                
                <Button type="button" variant="ghost" className="mt-2 text-red-600 hover:text-red-700" onClick={() => removePrescription(index)}>
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Button type="submit" disabled={form.formState.isSubmitting || mutation.isPending}>
        {form.formState.isSubmitting || mutation.isPending ? 'Guardando...' : 'Registrar consulta'}
      </Button>
    </form>
  )
}