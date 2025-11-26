import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useConsultationCreateMutation } from '@/hooks/consultations'
import { usePetsQuery } from '@/hooks/pets'

const schema = z.object({
  mascota: z.string().min(1, 'Selecciona una mascota'),
  fecha_consulta: z.string().min(1, 'Selecciona una fecha'),
  descripcion_consulta: z.string().min(10, 'Describe la consulta'),
  diagnostico: z.string().min(4, 'Ingrese un diagnóstico'),
  notas_adicionales: z.string().optional(),
  prescripciones: z
    .array(
      z.object({
        producto_nombre: z.string().min(1, 'Producto requerido'),
        dosis: z.string().min(1, 'Dosis requerida'),
        frecuencia: z.string().min(1, 'Frecuencia requerida'),
      }),
    )
    .optional(),
})

type FormValues = z.infer<typeof schema>

export const ConsultationForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mascota: '',
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

  const { data: pets } = usePetsQuery({ search: '', especie: null })
  const mutation = useConsultationCreateMutation()

  const onSubmit = async (values: FormValues) => {
    await mutation.mutateAsync({
      mascota: Number(values.mascota),
      fecha_consulta: values.fecha_consulta,
      descripcion_consulta: values.descripcion_consulta,
      diagnostico: values.diagnostico,
      notas_adicionales: values.notas_adicionales,
      prescripciones: values.prescripciones?.map((pres) => ({
        producto: 0,
        dosis: pres.dosis,
        frecuencia: pres.frecuencia,
        duracion_dias: 1,
      })),
    })
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-white/80">
          <span>Mascota</span>
          <select
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
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
          {form.formState.errors.mascota && <p className="text-xs text-red-300">{form.formState.errors.mascota.message}</p>}
        </label>

        <Input
          type="date"
          label="Fecha consulta"
          value={form.watch('fecha_consulta')}
          onChange={(event) => form.setValue('fecha_consulta', event.target.value)}
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

      <section className="rounded-2xl border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-white">Prescripciones</h3>
          <Button type="button" variant="ghost" onClick={() => addPrescription({ producto_nombre: '', dosis: '', frecuencia: '' })}>
            Agregar
          </Button>
        </div>
        {prescriptionFields.length === 0 ? (
          <p className="text-sm text-white/60">No se han agregado prescripciones.</p>
        ) : (
          <div className="space-y-3">
            {prescriptionFields.map((field, index) => (
              <div key={field.id} className="rounded-xl border border-white/10 p-3">
                <Input label="Producto" {...form.register(`prescripciones.${index}.producto_nombre`)} />
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  <Input label="Dosis" {...form.register(`prescripciones.${index}.dosis`)} />
                  <Input label="Frecuencia" {...form.register(`prescripciones.${index}.frecuencia`)} />
                </div>
                <Button type="button" variant="ghost" className="mt-2 text-red-200" onClick={() => removePrescription(index)}>
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

