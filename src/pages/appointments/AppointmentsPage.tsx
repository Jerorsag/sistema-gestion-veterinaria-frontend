import { Link } from 'react-router-dom'
import { CalendarDays, PlusCircle, Stethoscope, Clock, User, Scissors } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { useAppointmentsQuery } from '@/hooks/appointments'
import type { AppointmentSummary } from '@/api/types/appointments'
import { formatDateTime } from '@/utils/datetime'
import { usePermissions } from '@/hooks/permissions'

export const AppointmentsPage = () => {
  const { data, isLoading } = useAppointmentsQuery()
  const { checkPermission } = usePermissions()
  const canCreate = checkPermission('citas', 'canCreate')
  const canCreateConsulta = checkPermission('consultas', 'canCreate')

  const getStatusBadgeTone = (estado: string): 'success' | 'info' | 'danger' | 'warning' | 'neutral' => {
    const estadoUpper = estado.toUpperCase()
    if (estadoUpper === 'COMPLETADA') return 'success'
    if (estadoUpper === 'AGENDADA') return 'info'
    if (estadoUpper === 'CANCELADA') return 'danger'
    if (estadoUpper === 'EN_PROGRESO') return 'warning'
    return 'neutral'
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label">Citas</p>
          <h1 className="text-3xl font-semibold text-[var(--color-text-heading)]">Agenda general</h1>
          <p className="text-description">Visualiza las próximas citas y accede rápidamente a su detalle.</p>
        </div>
        {canCreate && (
          <Button startIcon={<PlusCircle size={18} />} asChild>
            <Link to="/app/citas/nueva">Nueva cita</Link>
          </Button>
        )}
      </header>

      <section>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="rounded-xl bg-white overflow-hidden shadow">
            <div className="divide-y divide-gray-200">
              {data.map((cita: AppointmentSummary) => (
                <div
                  key={cita.id}
                  className="p-5 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="rounded-xl bg-[var(--color-primary)]/10 p-2.5 text-[var(--color-primary)] flex-shrink-0">
                        <CalendarDays size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
                          Cita {cita.id}
                        </p>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{cita.mascota_nombre}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="flex items-center gap-1.5 text-gray-600">
                            <Clock size={14} className="text-gray-500" />
                            {formatDateTime(cita.fecha_hora)}
                          </span>
                          {cita.servicio_nombre && (
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <Scissors size={14} className="text-gray-500" />
                              {cita.servicio_nombre}
                            </span>
                          )}
                          {cita.veterinario_nombre && (
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <User size={14} className="text-gray-500" />
                              {cita.veterinario_nombre}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 md:ml-6">
                      <Badge tone={getStatusBadgeTone(cita.estado)}>
                        {cita.estado}
                      </Badge>
                      <div className="flex items-center gap-2">
                        {!['CANCELADA', 'COMPLETADA'].includes(cita.estado.toUpperCase()) && canCreateConsulta && (
                          <Button 
                            asChild 
                            size="sm"
                            startIcon={<Stethoscope size={16} />}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md transition-all duration-200"
                            title="Generar Consulta"
                          >
                            <Link 
                              to={`/app/consultas/nueva?mascota=${cita.mascota}&servicio=${cita.servicio}&cita=${cita.id}&nombre_servicio=${encodeURIComponent(cita.servicio_nombre || '')}`}
                            >
                              Atender
                            </Link>
                          </Button>
                        )}
                        <Button 
                          asChild 
                          variant="ghost" 
                          size="sm"
                          startIcon={<CalendarDays size={16} className="text-gray-700" />}
                          className="text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Link to={`/app/citas/${cita.id}`}>Ver detalle</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border-subtle-color)] bg-[var(--color-surface-200)]/30 px-6 py-12 text-center">
            <CalendarDays size={48} className="mx-auto mb-4 text-[var(--color-text-muted)] opacity-40" />
            <p className="text-[var(--color-text-secondary)] font-medium">No hay citas registradas</p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">Haz clic en "Nueva cita" para agendar la primera.</p>
          </div>
        )}
      </section>
    </div>
  )
}
