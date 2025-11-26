import { ArrowLeft, Trash2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { PetForm } from '@/pages/pets/components/PetForm'
import { usePetDeleteMutation, usePetDetailQuery, usePetUpdateMutation } from '@/hooks/pets'

export const PetDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = usePetDetailQuery(id)
  const updateMutation = usePetUpdateMutation(id!)
  const deleteMutation = usePetDeleteMutation()

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label">Mascota</p>
          <h1 className="text-3xl font-semibold text-heading">{data.nombre}</h1>
          <p className="text-sm text-secondary">ID #{data.id}</p>
        </div>

        <div className="flex gap-2">
          <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
            <Link to="/app/mascotas">Volver</Link>
          </Button>
          <Button
            variant="ghost"
            startIcon={<Trash2 size={16} />}
            disabled={deleteMutation.isPending}
            onClick={() => id && deleteMutation.mutate(id)}
          >
            {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>

      <section className="rounded-3xl bg-surface p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <PetForm
          mode="edit"
          initialData={data}
          onSubmit={(payload) => updateMutation.mutateAsync(payload)}
          isSubmitting={updateMutation.isPending}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card header={<p className="text-label">Especie</p>}>
          <p className="text-lg text-heading">{typeof data.especie === 'string' ? data.especie : data.especie?.nombre ?? '—'}</p>
        </Card>
        <Card header={<p className="text-label">Raza</p>}>
          <p className="text-lg text-heading">{typeof data.raza === 'string' ? data.raza : data.raza?.nombre ?? '—'}</p>
        </Card>
        <Card header={<p className="text-label">Propietario</p>}>
          <p className="text-lg text-heading">{data.cliente ?? '—'}</p>
        </Card>
      </section>
    </div>
  )
}

