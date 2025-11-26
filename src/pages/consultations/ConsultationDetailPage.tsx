import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useConsultationConsentMutation, useConsultationDetailQuery } from '@/hooks/consultations'
import { formatDateTime } from '@/utils/datetime'

export const ConsultationDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useConsultationDetailQuery(id)
  const consentMutation = useConsultationConsentMutation()

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Consulta #{data.id}</p>
          <h1 className="text-3xl font-semibold">{data.mascota}</h1>
          <p className="text-sm text-white/70">{formatDateTime(data.fecha_consulta)}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => consentMutation.mutate(data.id)}>
            {consentMutation.isPending ? 'Enviando...' : 'Enviar consentimiento'}
          </Button>
          <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
            <Link to="/app/consultas">Volver</Link>
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Diagnóstico</p>
          <p className="mt-2 text-white">{data.diagnostico}</p>
          {data.notas_adicionales && (
            <>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/40">Notas adicionales</p>
              <p className="text-white/80">{data.notas_adicionales}</p>
            </>
          )}
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Descripción</p>
          <p className="mt-2 text-sm text-white/80">{data.descripcion_consulta}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Veterinario</p>
          <p className="mt-2 text-white">{data.veterinario_nombre}</p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Prescripciones</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {data.prescripciones.map((pres) => (
            <Card key={pres.id}>
              <p className="text-sm font-semibold text-white">{pres.producto_nombre}</p>
              <p className="text-xs text-white/60">{pres.dosis}</p>
              <p className="text-xs text-white/60">{pres.frecuencia}</p>
            </Card>
          ))}
          {data.prescripciones.length === 0 && <p className="text-sm text-white/60">Sin prescripciones registradas.</p>}
        </div>
      </section>
    </div>
  )
}

