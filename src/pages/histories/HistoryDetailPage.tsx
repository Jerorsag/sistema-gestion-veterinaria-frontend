import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, PawPrint, User, FileText, Calendar, Phone, Mail } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
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

  const vaccinationTone = data.estado_vacunacion_actual === 'completa' ? 'success' : 'warning'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label">Historias clínicas</p>
          <h1 className="text-3xl font-semibold text-[var(--color-text-heading)]">{data.mascota_datos.nombre}</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-[var(--color-text-secondary)]">{data.propietario.nombre_completo}</p>
            <Badge tone={vaccinationTone}>
              {data.estado_vacunacion_actual === 'completa' ? 'Vacunación completa' : 'Vacunación pendiente'}
            </Badge>
          </div>
        </div>
        <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} className="text-gray-700" />}>
          <Link to="/app/historias">Volver al listado</Link>
        </Button>
      </header>

      {/* Información principal */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary)]">
              <PawPrint size={20} />
            </div>
            <p className="text-label font-medium">Datos de la mascota</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Especie</p>
              <p className="text-sm font-medium text-gray-900">{data.mascota_datos.especie ?? 'Sin especificar'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Raza</p>
              <p className="text-sm font-medium text-gray-900">{data.mascota_datos.raza ?? 'Sin especificar'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Edad</p>
              <p className="text-sm font-medium text-gray-900">{data.mascota_datos.edad ? `${data.mascota_datos.edad} años` : 'Sin registro'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Peso</p>
              <p className="text-sm font-medium text-gray-900">{data.mascota_datos.peso ? `${data.mascota_datos.peso} kg` : '—'}</p>
            </div>
            {data.mascota_datos.sexo && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Sexo</p>
                <p className="text-sm font-medium text-gray-900">{data.mascota_datos.sexo === 'M' ? 'Macho' : data.mascota_datos.sexo === 'H' ? 'Hembra' : data.mascota_datos.sexo}</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
              <User size={20} />
            </div>
            <p className="text-label font-medium">Propietario</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Nombre completo</p>
              <p className="text-sm font-medium text-gray-900">{data.propietario.nombre_completo}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Mail size={14} className="text-gray-500" />
                {data.propietario.email}
              </p>
            </div>
            {data.propietario.telefono && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                  <Phone size={14} className="text-gray-500" />
                  {data.propietario.telefono}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
              <FileText size={20} />
            </div>
            <p className="text-label font-medium">Resumen</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Consultas totales</p>
              <p className="text-2xl font-semibold text-gray-900">{data.consultas.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Última actualización</p>
              <p className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-500" />
                {formatDateTime(data.fecha_actualizacion)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Fecha de creación</p>
              <p className="text-sm font-medium text-gray-900">{formatDateTime(data.fecha_creacion)}</p>
            </div>
          </div>
        </Card>
      </section>

      {/* Historial de consultas */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-[var(--color-primary)]/10 p-2 text-[var(--color-primary)]">
            <FileText size={18} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-heading)]">Historial de consultas</h2>
        </div>
        <HistoryTimeline consultations={data.consultas} />
      </section>
    </div>
  )
}
