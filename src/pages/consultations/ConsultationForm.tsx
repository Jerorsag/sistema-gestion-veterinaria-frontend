import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

import { useConsultationCreateMutation } from '@/hooks/consultations'
import { usePetsQuery } from '@/hooks/pets'
import { useProductsQuery } from '@/hooks/inventory' // ✅ Importación solicitada

// Definimos la interfaz localmente para evitar errores si no está en types
interface Product {
  id: number
  nombre: string
  stock?: number
}

// --- ESQUEMA ACTUALIZADO ---
const schema = z.object({
  mascota: z.string().min(1, 'Selecciona una mascota'),
  fecha_consulta: z.string().min(1, 'Selecciona una fecha'),
  descripcion_consulta: z.string().min(10, 'Describe la consulta'),
  diagnostico: z.string().min(4, 'Ingrese un diagnóstico'),
  notas_adicionales: z.string().optional(),
  servicio: z.string().optional(),
  cita: z.string().optional(),
  
  // ✅ Estructura corregida según el backend
  prescripciones: z
    .array(
      z.object({
        medicamento: z.string().min(1, 'Selecciona un medicamento'), // Se captura como string del select
        cantidad: z.string().min(1, 'Indique la cantidad'),          // Se captura como string del input
        indicaciones: z.string().min(1, 'Escriba las indicaciones'),
      }),
    )
    .optional(),
    
  examenes: z
    .array(
      z.object({
        tipo_examen: z.string().min(1, 'Selecciona un tipo de examen'),
        descripcion: z.string().optional(),
      }),
    )
    .optional(),
    
  vacunas: z.object({
    estado: z.string().min(1, 'Selecciona el estado de vacunación'),
    vacunas_descripcion: z.string().optional(),
  }).optional(),
}).refine((data) => {
  if (data.vacunas?.estado === 'PENDIENTE' || data.vacunas?.estado === 'EN_PROCESO') {
    return !!data.vacunas?.vacunas_descripcion && data.vacunas.vacunas_descripcion.trim().length > 0
  }
  return true
}, {
  message: 'Debe especificar las vacunas cuando el estado es Pendiente o En proceso',
  path: ['vacunas', 'vacunas_descripcion']
})

type FormValues = z.infer<typeof schema>

const TIPOS_EXAMEN = [
  { value: 'HEMOGRAMA', label: 'Hemograma completo' },
  { value: 'QUIMICA_SANGUINEA', label: 'Química sanguínea' },
  { value: 'URINALISIS', label: 'Urianálisis' },
  { value: 'COPROLOGICO', label: 'Coprológico' },
  { value: 'RAYOS_X', label: 'Rayos X' },
  { value: 'ECOGRAFIA', label: 'Ecografía' },
  { value: 'CITOLOGIA', label: 'Citología' },
  { value: 'BIOPSIA', label: 'Biopsia' },
  { value: 'ELECTROCARDIOGRAMA', label: 'Electrocardiograma' },
  { value: 'OTRO', label: 'Otro' },
]

const ESTADOS_VACUNACION = [
  { value: 'AL_DIA', label: 'Al día' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'NINGUNA', label: 'Ninguna' },
]

export const ConsultationForm = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

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
      examenes: [],
      vacunas: {
        estado: '',
        vacunas_descripcion: '',
      },
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

  const {
    fields: examenFields,
    append: addExamen,
    remove: removeExamen,
  } = useFieldArray({
    control: form.control,
    name: 'examenes',
  })

  const { data: pets } = usePetsQuery({ search: '', especie: null })
  
  // Hook de productos
  const { data: productsData, isLoading: isLoadingProducts } = useProductsQuery()

  // Manejo seguro del array de productos
  const productos: Product[] = Array.isArray(productsData)
    ? productsData
    : (productsData as any)?.results || []

  const mutation = useConsultationCreateMutation()

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync({
      mascota: Number(values.mascota),
      fecha_consulta: values.fecha_consulta,
      descripcion_consulta: values.descripcion_consulta,
      diagnostico: values.diagnostico,
      notas_adicionales: values.notas_adicionales,
      servicio: values.servicio ? Number(values.servicio) : null,
      cita: values.cita ? Number(values.cita) : null,
      
      prescripciones: values.prescripciones?.map((pres) => ({
        medicamento: pres.medicamento ? Number(pres.medicamento) : null,
        cantidad: Number(pres.cantidad),
        indicaciones: pres.indicaciones,
      })),
      
      examenes: values.examenes?.map((examen) => ({
        tipo_examen: examen.tipo_examen,
        descripcion: examen.descripcion || '',
      })),
      
      vacunas: values.vacunas?.estado ? {
        estado: values.vacunas.estado,
        vacunas_descripcion: values.vacunas.vacunas_descripcion || '',
      } : undefined,
    } as any) // 'as any' temporal para evitar error de tipos si no has actualizado types.ts
    
    form.reset()
    navigate('/app/historias')
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      
      <input type="hidden" {...form.register('cita')} />
      <input type="hidden" {...form.register('servicio')} />

      {/* --- SECCIÓN DATOS GENERALES --- */}
      <div className="grid gap-4 md:grid-cols-2">
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

      {/* --- SECCIÓN PRESCRIPCIONES CORREGIDA --- */}
      <section className="rounded-2xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-heading">Prescripciones</h3>
          <Button type="button" variant="ghost" onClick={() => addPrescription({ medicamento: '', cantidad: '', indicaciones: '' })}>
            Agregar
          </Button>
        </div>
        
        {prescriptionFields.length === 0 ? (
          <p className="text-sm text-secondary">No se han agregado prescripciones.</p>
        ) : (
          <div className="space-y-3">
            {prescriptionFields.map((field, index) => (
              <div key={field.id} className="rounded-xl bg-[var(--color-surface-200)] p-3" style={{ boxShadow: 'var(--shadow-soft)' }}>
                
                {/* Campo: Medicamento (antes Producto) */}
                <label className="mb-2 block text-sm text-primary">
                  Medicamento
                  {isLoadingProducts ? (
                    <div className="mt-1 text-xs text-secondary">Cargando productos...</div>
                  ) : (
                    <select
                      className="mt-1 w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface)] px-3 py-2 text-base text-primary focus:border-blue-500 focus:outline-none"
                      style={{ borderWidth: 'var(--border-subtle-width)' }}
                      {...form.register(`prescripciones.${index}.medicamento`)}
                    >
                      <option value="">Seleccione un medicamento...</option>
                      {/* Renderizado seguro */}
                      {Array.isArray(productos) && productos.map((prod) => (
                        <option key={prod.id} value={String(prod.id)}>
                          {prod.nombre} {prod.stock !== undefined ? `(Stock: ${prod.stock})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </label>

                {/* Campos: Cantidad e Indicaciones */}
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <Input 
                    type="number" // Input numérico para cantidad
                    label="Cantidad" 
                    {...form.register(`prescripciones.${index}.cantidad`)} 
                  />
                  <Input 
                    label="Indicaciones" 
                    placeholder="Ej: 1 cada 8 horas..."
                    {...form.register(`prescripciones.${index}.indicaciones`)} 
                  />
                </div>
                
                <Button type="button" variant="ghost" className="mt-2 text-red-600 hover:text-red-700" onClick={() => removePrescription(index)}>
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- SECCIÓN EXÁMENES --- */}
      <section className="rounded-2xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-heading">Exámenes</h3>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => addExamen({ tipo_examen: '', descripcion: '' })}
          >
            Agregar
          </Button>
        </div>
        {examenFields.length === 0 ? (
          <p className="text-sm text-secondary">No se han agregado exámenes.</p>
        ) : (
          <div className="space-y-3">
            {examenFields.map((field, index) => (
              <div 
                key={field.id} 
                className="rounded-xl bg-[var(--color-surface-200)] p-3" 
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <label className="space-y-2 text-sm text-primary">
                  <span>Tipo de examen</span>
                  <select
                    className="w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-4 py-2 text-base text-primary"
                    style={{
                      borderWidth: 'var(--border-subtle-width)',
                      borderStyle: 'var(--border-subtle-style)',
                    }}
                    {...form.register(`examenes.${index}.tipo_examen`)}
                  >
                    <option value="">Selecciona un examen</option>
                    {TIPOS_EXAMEN.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </option>
                    ))}
                  </select>
                  {form.formState.errors.examenes?.[index]?.tipo_examen && (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.examenes[index]?.tipo_examen?.message}
                    </p>
                  )}
                </label>
                
                <div className="mt-2">
                  <Input 
                    label="Descripción adicional" 
                    placeholder="Detalles del examen..." 
                    {...form.register(`examenes.${index}.descripcion`)} 
                  />
                </div>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="mt-2 text-red-600 hover:text-red-700" 
                  onClick={() => removeExamen(index)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- SECCIÓN VACUNAS --- */}
      <section className="rounded-2xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
        <h3 className="mb-3 font-semibold text-heading">Estado de Vacunación</h3>
        <div className="space-y-4">
          <label className="space-y-2 text-sm text-primary">
            <span>Estado *</span>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {ESTADOS_VACUNACION.map((estado) => (
                <label
                  key={estado.value}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 transition-all ${
                    form.watch('vacunas.estado') === estado.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 font-semibold text-[var(--color-primary)]'
                      : 'border-[var(--border-subtle-color)] hover:border-[var(--color-primary)]/50'
                  }`}
                >
                  <input
                    type="radio"
                    value={estado.value}
                    {...form.register('vacunas.estado')}
                    className="sr-only"
                  />
                  {estado.label}
                </label>
              ))}
            </div>
            {form.formState.errors.vacunas?.estado && (
              <p className="text-xs text-red-600">{form.formState.errors.vacunas.estado.message}</p>
            )}
          </label>

          {(form.watch('vacunas.estado') === 'PENDIENTE' || form.watch('vacunas.estado') === 'EN_PROCESO') && (
            <label className="space-y-2 text-sm text-primary">
              <span>Descripción de vacunas {form.watch('vacunas.estado') === 'PENDIENTE' || form.watch('vacunas.estado') === 'EN_PROCESO' ? '*' : ''}</span>
              <textarea
                className="min-h-[100px] w-full rounded-xl border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-4 py-3 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                style={{
                  borderWidth: 'var(--border-subtle-width)',
                  borderStyle: 'var(--border-subtle-style)',
                }}
                {...form.register('vacunas.vacunas_descripcion')}
                placeholder="Especifique las vacunas pendientes o en proceso..."
              />
              {form.formState.errors.vacunas?.vacunas_descripcion && (
                <p className="text-xs text-red-600">{form.formState.errors.vacunas.vacunas_descripcion.message}</p>
              )}
            </label>
          )}

          {(form.watch('vacunas.estado') === 'AL_DIA' || form.watch('vacunas.estado') === 'NINGUNA') && (
            <p className="text-sm text-secondary">
              {form.watch('vacunas.estado') === 'AL_DIA' 
                ? '✓ La mascota tiene sus vacunas al día.' 
                : 'No se han aplicado vacunas.'}
            </p>
          )}
        </div>
      </section>

      <Button type="submit" disabled={form.formState.isSubmitting || mutation.isPending}>
        {form.formState.isSubmitting || mutation.isPending ? 'Guardando...' : 'Registrar consulta'}
      </Button>
    </form>
  )
}