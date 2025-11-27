import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { usePetsQuery } from '@/hooks/pets'
import {
  useAppointmentCreateMutation,
  useServicesQuery,
  useVeterinariansQuery,
} from '@/hooks/appointments'
import { AvailabilityPicker } from '@/pages/appointments/components/AvailabilityPicker'
import type { AppointmentPayload } from '@/api/types/appointments'

const schema = z.object({
  mascota_id: z.string().min(1, 'Selecciona una mascota'),
  veterinario_id: z.string().min(1, 'Selecciona un veterinario'),
  servicio_id: z.string().min(1, 'Selecciona un servicio'),
  fecha_hora: z.string().min(1, 'Selecciona un horario'),
  observaciones: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export const AppointmentForm = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mascota_id: '',
      veterinario_id: '',
      servicio_id: '',
      fecha_hora: '',
      observaciones: '',
    },
  })

  // Filtros memoizados para pets (opcionalmente vacío para traer todos)
  const petsFilters = useMemo(() => ({ search: '', especie: null as number | null }), [])
  const petsQuery = usePetsQuery(petsFilters)
  
  const { data: services, isLoading: servicesLoading } = useServicesQuery()
  const { data: veterinarios, isLoading: vetsLoading } = useVeterinariansQuery()
  
  const mutation = useAppointmentCreateMutation()
  
  // Watchers para estado del formulario
  const selectedMascota = form.watch('mascota_id')
  const selectedVeterinario = form.watch('veterinario_id')
  const selectedServicio = form.watch('servicio_id')
  const selectedFecha = form.watch('fecha_hora')

  // Resetear el horario si cambia el veterinario (porque su disponibilidad es distinta)
  useEffect(() => {
    form.setValue('fecha_hora', '')
  }, [selectedVeterinario, form])

  const onSubmit = async (values: FormValues) => {
    // Construimos el payload
    // IMPORTANTE: values.fecha_hora ya viene con el formato correcto del AvailabilityPicker
    // (Ej: "2023-11-27T08:00:00-05:00"). NO lo modificamos.
    const payload: AppointmentPayload = {
      mascota_id: parseInt(values.mascota_id),
      veterinario_id: parseInt(values.veterinario_id),
      servicio_id: parseInt(values.servicio_id),
      fecha_hora: values.fecha_hora,
      observaciones: values.observaciones,
    }
    
    await mutation.mutateAsync(payload)
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Selector de Mascota */}
        <label className="space-y-2 text-sm text-primary">
          <span>Mascota</span>
          <select
            className="w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-4 py-2 text-base text-primary"
            style={{
              borderWidth: 'var(--border-subtle-width)',
              borderStyle: 'var(--border-subtle-style)',
            }}
            value={selectedMascota}
            onChange={(event) => form.setValue('mascota_id', event.target.value)}
          >
            <option value="">Selecciona mascota</option>
            {petsQuery.data?.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nombre}
              </option>
            ))}
          </select>
          {form.formState.errors.mascota_id && (
            <p className="text-xs text-red-600">{form.formState.errors.mascota_id.message}</p>
          )}
        </label>

        {/* Selector de Veterinario */}
        <label className="space-y-2 text-sm text-primary">
          <span>Veterinario</span>
          {vetsLoading ? (
            <div className="flex min-h-[42px] items-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <select
              className="w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-4 py-2 text-base text-primary"
              style={{
                borderWidth: 'var(--border-subtle-width)',
                borderStyle: 'var(--border-subtle-style)',
              }}
              value={selectedVeterinario}
              onChange={(event) => form.setValue('veterinario_id', event.target.value)}
            >
              <option value="">Selecciona veterinario</option>
              {(veterinarios ?? []).map((vet) => (
                <option key={vet.id} value={vet.id}>
                  {vet.nombre}
                </option>
              ))}
            </select>
          )}
          {form.formState.errors.veterinario_id && (
            <p className="text-xs text-red-600">{form.formState.errors.veterinario_id.message}</p>
          )}
        </label>

        {/* Selector de Servicio */}
        <label className="space-y-2 text-sm text-primary md:col-span-2">
          <span>Servicio</span>
          {servicesLoading ? (
            <div className="flex min-h-[42px] items-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <select
              className="w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-4 py-2 text-base text-primary"
              style={{
                borderWidth: 'var(--border-subtle-width)',
                borderStyle: 'var(--border-subtle-style)',
              }}
              value={selectedServicio}
              onChange={(event) => form.setValue('servicio_id', event.target.value)}
            >
              <option value="">Selecciona servicio</option>
              {(services ?? []).map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nombre} (${service.costo})
                </option>
              ))}
            </select>
          )}
          {form.formState.errors.servicio_id && (
            <p className="text-xs text-red-600">{form.formState.errors.servicio_id.message}</p>
          )}
        </label>
      </div>

      {/* Picker de Disponibilidad */}
      <div className="rounded-2xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
        <p className="text-sm font-semibold text-heading">Selecciona horario disponible</p>
        <AvailabilityPicker
          veterinarioId={selectedVeterinario}
          value={selectedFecha}
          onChange={(datetime) => form.setValue('fecha_hora', datetime)}
        />
        {form.formState.errors.fecha_hora && (
          <p className="text-xs text-red-600">{form.formState.errors.fecha_hora.message}</p>
        )}
      </div>

      <Input
        label="Observaciones"
        placeholder="Motivo, información adicional"
        {...form.register('observaciones')}
        error={form.formState.errors.observaciones?.message}
      />

      <Button type="submit" disabled={form.formState.isSubmitting || mutation.isPending}>
        {form.formState.isSubmitting || mutation.isPending ? 'Agendando...' : 'Agendar cita'}
      </Button>
    </form>
  )
}