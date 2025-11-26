import { Link } from 'react-router-dom'
import { CalendarDays, PlusCircle } from 'lucide-react'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useAppointmentsQuery } from '@/hooks/appointments'
import { useSessionStore } from '@/core/store/session-store'

export const AppointmentsPage = () => {
  const { data, isLoading } = useAppointmentsQuery()
  const userRoles = useSessionStore((state) => state.user?.roles ?? [])
  const canCreate = userRoles.includes('cliente')

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Citas</p>
          <h1 className="text-3xl font-semibold">Agenda general</h1>
          <p className="text-sm text-white/70">Visualiza las próximas citas y accede rápidamente a su detalle.</p>
        </div>
        {canCreate && (
          <Button startIcon={<PlusCircle size={18} />} asChild>
            <Link to="/app/citas/nueva">Nueva cita</Link>
          </Button>
        )}
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="space-y-3">
            {data.map((cita) => (
              <Card
                key={cita.id}
                className="flex flex-col gap-3 border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-primary/20 p-2 text-primary">
                    <CalendarDays size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{cita.mascota_nombre}</h3>
                    <p className="text-sm text-white/70">
                      {dayjs(cita.fecha_hora).format('DD MMM YYYY, HH:mm')} · {cita.servicio_nombre ?? '—'}
                    </p>
                    <p className="text-xs text-white/60">Veterinario: {cita.veterinario_nombre ?? 'Por asignar'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
                    {cita.estado}
                  </span>
                  <Button asChild variant="ghost">
                    <Link to={`/app/citas/${cita.id}`}>Ver detalle</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-white/60">
            No hay citas registradas por ahora.
          </div>
        )}
      </section>
    </div>
  )
}

