import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { PlusCircle, X, Pill, FileText, Syringe, Calendar, PawPrint, Info } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Card } from '@/components/ui/Card'

import { useConsultationCreateMutation } from '@/hooks/consultations'
import { usePetsQuery } from '@/hooks/pets'
import { useProductsQuery } from '@/hooks/inventory'

interface Product {
  id: number
  nombre: string
  stock?: number
}

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

  const { data: productsData, isLoading: isLoadingProducts } = useProductsQuery()

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

      {/* Notificación de cita */}
      {preCitaId && (
        <Card className="border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Atendiendo cita</p>
              <p className="text-sm text-blue-700">
                Se ha seleccionado automáticamente la mascota y el servicio 
                {preNombreServicio ? ` (${preNombreServicio})` : ''}.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* SECCIÓN DATOS GENERALES */}
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-[var(--color-primary)]/10 p-2 text-[var(--color-primary)]">
          <PawPrint size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Datos Generales</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--color-text-heading)]">
          <span className="font-medium">Mascota *</span>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-900 transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 disabled:opacity-70 disabled:bg-gray-100"
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
          {form.formState.errors.mascota && (
            <p className="text-xs text-red-600">{form.formState.errors.mascota.message}</p>
          )}
        </label>

        <Input
          type="date"
          label="Fecha de consulta *"
          {...form.register('fecha_consulta')}
          error={form.formState.errors.fecha_consulta?.message}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Descripción *"
          placeholder="Motivo de la consulta, síntomas observados..."
          {...form.register('descripcion_consulta')}
          error={form.formState.errors.descripcion_consulta?.message}
        />
      </div>

      <div className="mt-4">
        <Input
          label="Diagnóstico *"
          placeholder="Resultado principal de la consulta"
          {...form.register('diagnostico')}
          error={form.formState.errors.diagnostico?.message}
        />
      </div>

      <div className="mt-4">
        <label className="space-y-2 text-sm text-[var(--color-text-heading)]">
          <span className="font-medium">Notas adicionales</span>
          <textarea
            className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
            {...form.register('notas_adicionales')}
            placeholder="Tratamiento recomendado, observaciones adicionales..."
          />
        </label>
      </div>

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
                    <div className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <select
                      className="mt-1 w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface)] px-3 py-2 text-base text-primary focus:border-blue-500 focus:outline-none"
                      style={{ borderWidth: 'var(--border-subtle-width)' }}
                      {...form.register(`prescripciones.${index}.medicamento`)}
                    >
                      <option value="">Selecciona un medicamento</option>
                      {Array.isArray(productos) && productos.map((prod) => (
                        <option key={prod.id} value={String(prod.id)}>
                          {prod.nombre} {prod.stock !== undefined ? `(Stock: ${prod.stock})` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                  {form.formState.errors.prescripciones?.[index]?.medicamento && (
                    <p className="text-xs text-red-600">
                      {form.formState.errors.prescripciones[index]?.medicamento?.message}
                    </p>
                  )}
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input 
                    type="number" 
                    label="Cantidad *" 
                    min="1"
                    placeholder="Ej: 10"
                    {...form.register(`prescripciones.${index}.cantidad`)}
                    error={form.formState.errors.prescripciones?.[index]?.cantidad?.message}
                  />
                  <Input 
                    label="Indicaciones *" 
                    placeholder="Ej: 1 cada 8 horas, con comida..."
                    {...form.register(`prescripciones.${index}.indicaciones`)}
                    error={form.formState.errors.prescripciones?.[index]?.indicaciones?.message}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECCIÓN EXÁMENES */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
            <FileText size={18} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Exámenes</h3>
        </div>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          startIcon={<PlusCircle size={16} />}
          onClick={() => addExamen({ tipo_examen: '', descripcion: '' })}
        >
          Agregar
        </Button>
      </div>
      
      {examenFields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
          <FileText size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600">No se han agregado exámenes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {examenFields.map((field, index) => (
            <div key={field.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-900">Examen #{index + 1}</p>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  startIcon={<X size={14} />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeExamen(index)}
                >
                  Eliminar
                </Button>
              </div>
              
              <div className="space-y-4">
                <label className="space-y-2 text-sm text-[var(--color-text-heading)]">
                  <span className="font-medium">Tipo de examen *</span>
                  <select
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-base text-gray-900 transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
                    {...form.register(`examenes.${index}.tipo_examen`)}
                  >
                    <option value="">Selecciona un tipo de examen</option>
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
                
                <Input 
                  label="Descripción adicional" 
                  placeholder="Detalles específicos del examen..."
                  {...form.register(`examenes.${index}.descripcion`)} 
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SECCIÓN VACUNAS */}
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
          <Syringe size={18} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Estado de Vacunación</h3>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-900">Estado *</label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {ESTADOS_VACUNACION.map((estado) => (
              <label
                key={estado.value}
                className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                  form.watch('vacunas.estado') === estado.value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-[var(--color-primary)]/50'
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
            <p className="mt-2 text-xs text-red-600">{form.formState.errors.vacunas.estado.message}</p>
          )}
        </div>

        {(form.watch('vacunas.estado') === 'PENDIENTE' || form.watch('vacunas.estado') === 'EN_PROCESO') && (
          <div>
            <label className="space-y-2 text-sm text-[var(--color-text-heading)]">
              <span className="font-medium">Descripción de vacunas *</span>
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
                {...form.register('vacunas.vacunas_descripcion')}
                placeholder="Especifique las vacunas pendientes o en proceso..."
              />
              {form.formState.errors.vacunas?.vacunas_descripcion && (
                <p className="text-xs text-red-600">{form.formState.errors.vacunas.vacunas_descripcion.message}</p>
              )}
            </label>
          </div>
        )}

        {(form.watch('vacunas.estado') === 'AL_DIA' || form.watch('vacunas.estado') === 'NINGUNA') && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="text-sm text-gray-700">
              {form.watch('vacunas.estado') === 'AL_DIA' 
                ? '✓ La mascota tiene sus vacunas al día.' 
                : 'No se han aplicado vacunas.'}
            </p>
          </div>
        )}
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => navigate('/app/consultas')}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting || mutation.isPending}
        >
          {form.formState.isSubmitting || mutation.isPending ? 'Guardando...' : 'Registrar consulta'}
        </Button>
      </div>
    </form>
  )
}
