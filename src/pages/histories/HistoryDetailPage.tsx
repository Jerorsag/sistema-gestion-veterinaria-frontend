import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { HistoryTimeline } from '@/components/histories/HistoryTimeline'
import { useHistoryDetailQuery } from '@/hooks/histories'
import { formatDateTime } from '@/utils/datetime'

export const HistoryDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useHistoryDetailQuery(id)

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
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Historia #{data.id}</p>
          <h1 className="text-3xl font-semibold">{data.mascota_datos.nombre}</h1>
          <p className="text-sm text-white/70">{data.propietario.nombre_completo}</p>
        </div>
        <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
          <Link to="/app/historias">Volver al listado</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Datos de la mascota</p>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            <p>
              <span className="text-white/60">Especie:</span> {data.mascota_datos.especie ?? 'Sin especificar'}
            </p>
            <p>
              <span className="text-white/60">Raza:</span> {data.mascota_datos.raza ?? 'Sin especificar'}
            </p>
            <p>
              <span className="text-white/60">Edad:</span> {data.mascota_datos.edad ?? 'Sin registro'} años
            </p>
            <p>
              <span className="text-white/60">Peso:</span> {data.mascota_datos.peso ? `${data.mascota_datos.peso} kg` : '—'}
            </p>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Propietario</p>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            <p>{data.propietario.nombre_completo}</p>
            <p>{data.propietario.email}</p>
            <p>{data.propietario.telefono ?? 'Sin teléfono registrado'}</p>
          </div>
        </Card>

        <Card>
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Resumen</p>
          <div className="mt-3 space-y-2 text-sm text-white/80">
            <p>
              <span className="text-white/60">Consultas totales:</span> {data.consultas.length}
            </p>
            <p>
              <span className="text-white/60">Última actualización:</span> {formatDateTime(data.fecha_actualizacion)}
            </p>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Historial de consultas</h2>
        <HistoryTimeline consultations={data.consultas} />
      </section>
    </div>
  )
}

