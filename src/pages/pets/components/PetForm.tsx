import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useBreedsQuery, useSpeciesQuery } from '@/hooks/pets'
import type { Pet, PetPayload } from '@/api/types/pets'

const sexOptions = [
  { label: 'Macho', value: 'macho' },
  { label: 'Hembra', value: 'hembra' },
  { label: 'No definido', value: 'desconocido' },
]

const schema = z.object({
  nombre: z.string().min(2, 'El nombre es requerido'),
  sexo: z.string().min(1, 'Selecciona el sexo'),
  especieId: z.union([z.number(), z.literal('')]),
  razaId: z.union([z.number(), z.literal('')]),
  fecha_nacimiento: z.string().optional(),
  peso: z.string().optional(),
})

type PetFormValues = z.infer<typeof schema>

interface PetFormProps {
  mode: 'create' | 'edit'
  initialData?: Pet
  onSubmit: (payload: PetPayload) => Promise<unknown> | unknown
  isSubmitting?: boolean
}

export const PetForm = ({ mode, initialData, onSubmit, isSubmitting }: PetFormProps) => {
  const form = useForm<PetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: initialData?.nombre ?? '',
      sexo: initialData?.sexo ?? sexOptions[0].value,
      especieId: '' as const,
      razaId: '' as const,
      fecha_nacimiento: initialData?.fecha_nacimiento ?? '',
      peso: initialData?.peso ? String(initialData.peso) : '',
    },
  })

  const selectedSpecies = form.watch('especieId')

  useEffect(() => {
    // Reset breed when species changes
    form.setValue('razaId', '' as const)
  }, [selectedSpecies, form])

  const { data: species, isLoading: speciesLoading } = useSpeciesQuery()
  const speciesIdNumber = typeof selectedSpecies === 'number' ? selectedSpecies : undefined
  const { data: breeds, isLoading: breedsLoading } = useBreedsQuery(speciesIdNumber)

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: PetPayload = {
      nombre: values.nombre,
      sexo: values.sexo,
      especie: values.especieId === '' ? null : Number(values.especieId),
      raza: values.razaId === '' ? null : Number(values.razaId),
      fecha_nacimiento: values.fecha_nacimiento || null,
      peso: values.peso ? Number(values.peso) : null,
    }

    await onSubmit(payload)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre" {...form.register('nombre')} error={form.formState.errors.nombre?.message} />

        <label className="space-y-2 text-sm text-white/80">
          <span>Sexo</span>
          <select
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
            {...form.register('sexo')}
          >
            {sexOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-white/80">
          <span>Especie</span>
          {speciesLoading ? (
            <div className="flex min-h-[42px] items-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
              value={form.watch('especieId')}
              onChange={(event) => {
                const value = event.target.value
                form.setValue('especieId', value ? Number(value) : '')
              }}
            >
              <option value="">Selecciona especie</option>
              {species?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          )}
        </label>

        <label className="space-y-2 text-sm text-white/80">
          <span>Raza</span>
          {breedsLoading && speciesIdNumber ? (
            <div className="flex min-h-[42px] items-center">
              <Spinner size="sm" />
            </div>
          ) : (
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
              value={form.watch('razaId')}
              onChange={(event) => {
                const value = event.target.value
                form.setValue('razaId', value ? Number(value) : '')
              }}
              disabled={!speciesIdNumber}
            >
              <option value="">Selecciona raza</option>
              {(breeds ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          )}
        </label>

        <Input
          type="date"
          label="Fecha de nacimiento"
          {...form.register('fecha_nacimiento')}
          error={form.formState.errors.fecha_nacimiento?.message}
        />

        <Input
          type="number"
          step="0.1"
          label="Peso (kg)"
          {...form.register('peso')}
          error={form.formState.errors.peso?.message}
        />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting || isSubmitting}>
        {form.formState.isSubmitting || isSubmitting
          ? 'Guardando mascota...'
          : mode === 'create'
            ? 'Registrar mascota'
            : 'Guardar cambios'}
      </Button>
    </form>
  )
}

