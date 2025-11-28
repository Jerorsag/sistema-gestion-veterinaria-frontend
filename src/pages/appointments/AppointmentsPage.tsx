import { Link } from 'react-router-dom'
import { CalendarDays, PlusCircle, Stethoscope } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useAppointmentsQuery } from '@/hooks/appointments'
import type { AppointmentSummary } from '@/api/types/appointments'
import { formatDateTime } from '@/utils/datetime'
import { usePermissions } from '@/hooks/permissions'

export const AppointmentsPage = () => {
  const { data, isLoading } = useAppointmentsQuery()
  const { checkPermission } = usePermissions()
  const canCreate = checkPermission('citas', 'canCreate')
  const canCreateConsulta = checkPermission('consultas', 'canCreate')

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label">Citas</p>
          <h1 className="text-3xl font-semibold text-heading">Agenda general</h1>
          <p className="text-description">Visualiza las próximas citas y accede rápidamente a su detalle.</p>
        </div>
        {canCreate && (
          <Button startIcon={<PlusCircle size={18} />} asChild>
            <Link to="/app/citas/nueva">Nueva cita</Link>
          </Button>
        )}
      </header>

      <section className="rounded-3xl bg-surface p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((cita: AppointmentSummary) => (
              <Card
                key={cita.id}
                className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[var(--color-primary)]/20 p-2 text-[var(--color-primary)]">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-heading">{cita.mascota_nombre}</h3>
                    <p className="text-sm text-secondary">
                      {formatDateTime(cita.fecha_hora)} · {cita.servicio_nombre ?? '—'}
                    </p>
                    <p className="text-xs text-tertiary">Veterinario: {cita.veterinario_nombre ?? 'Por asignar'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {cita.estado === 'COMPLETADA' && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs uppercase tracking-wide text-green-800 border border-green-200">
                      {cita.estado}
                    </span>
                  )}

                  {cita.estado === 'AGENDADA' && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs uppercase tracking-wide text-blue-800 border border-blue-200">
                      {cita.estado}
                    </span>
                  )}

                  {cita.estado === 'CANCELADA' && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs uppercase tracking-wide text-red-800 border border-red-200">
                      {cita.estado}
                    </span>
                  )}

                  {cita.estado === 'EN_PROGRESO' && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs uppercase tracking-wide text-yellow-800 border border-yellow-200">
                      {cita.estado}
                    </span>
                  )}

                  {!['COMPLETADA', 'AGENDADA', 'CANCELADA', 'EN_PROGRESO'].includes(cita.estado) && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs uppercase tracking-wide text-gray-800 border border-gray-200">
                      {cita.estado}
                    </span>
                  )}

                  {!['CANCELADA', 'COMPLETADA'].includes(cita.estado.toUpperCase()) && canCreateConsulta && (
                    <Button 
                      asChild 
                      variant="ghost" 
                      className="text-blue-600 border border-blue-200 hover:bg-blue-50"
                      title="Generar Consulta"
                    >
                      <Link 
                        to={`/app/consultas/nueva?mascota=${cita.mascota}&servicio=${cita.servicio}&cita=${cita.id}&nombre_servicio=${encodeURIComponent(cita.servicio_nombre || '')}`}
                      >
                        <Stethoscope size={16} className="mr-2"/>
                        Atender
                      </Link>
                    </Button>
                  )}
              
                  <Button asChild variant="ghost">
                    <Link to={`/app/citas/${cita.id}`}>Ver detalle</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border-subtle-color)] px-6 py-12 text-center text-secondary" style={{ borderWidth: 'var(--border-subtle-width)', borderStyle: 'dashed' }}>
            No hay citas registradas por ahora.
          </div>
        )}
      </section>
    </div>
  )
}
