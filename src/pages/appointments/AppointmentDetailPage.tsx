import { useEffect, useState } from 'react'
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarClock, User2, PawPrint, Scissors, RefreshCw, XCircle, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import {
  useAppointmentCancelMutation,
  useAppointmentDetailQuery,
  useAppointmentRescheduleMutation,
  useVeterinariansQuery,
} from '@/hooks/appointments'
import { AvailabilityPicker } from '@/pages/appointments/components/AvailabilityPicker'
import { formatDateTime } from '@/utils/datetime'

export const AppointmentDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) {
    return <Navigate to="/app/citas" replace />
  }

  const { data, isLoading } = useAppointmentDetailQuery(id)
  const cancelMutation = useAppointmentCancelMutation()
  const rescheduleMutation = useAppointmentRescheduleMutation(id)
  const { data: veterinarios, isLoading: vetsLoading } = useVeterinariansQuery()
  const [selectedVet, setSelectedVet] = useState<string>('')
  const [newDateTime, setNewDateTime] = useState<string>('')
  const [activeAction, setActiveAction] = useState<'reschedule' | 'cancel'>('reschedule')

  useEffect(() => {
    if (!selectedVet && (veterinarios?.length ?? 0) > 0) {
      setSelectedVet(String(veterinarios![0].id))
    }
  }, [selectedVet, veterinarios])

  const handleCancel = () => {
    cancelMutation.mutate(id, {
      onSuccess: () => navigate('/app/citas'),
    })
  }

  const handleReschedule = () => {
    if (!newDateTime) return
    rescheduleMutation.mutate(newDateTime, {
      onSuccess: () => {
        setNewDateTime('')
        navigate('/app/citas')
      },
    })
  }

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
          <p className="text-label">Detalle de cita</p>
          <h1 className="text-3xl font-semibold text-heading">{data.mascota_nombre}</h1>
          <p className="text-sm text-secondary">ID #{data.id}</p>
        </div>
        <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
          <Link to="/app/citas">Volver</Link>
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-primary/20 p-2 text-primary">
                <CalendarClock size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-subtle">Fecha y hora</p>
                <p className="text-lg font-semibold text-heading">{formatDateTime(data.fecha_hora)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--color-primary)]/20 p-2 text-[var(--color-primary)]">
                <PawPrint size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-subtle">Mascota</p>
                <p className="text-lg text-heading">{data.mascota_nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--color-secondary)]/20 p-2 text-[var(--color-secondary)]">
                <User2 size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-subtle">Veterinario</p>
                <p className="text-lg text-heading">{data.veterinario_nombre ?? 'Por asignar'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--color-surface-200)] p-2 text-tertiary">
                <Scissors size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-subtle">Servicio</p>
                <p className="text-lg text-heading">{data.servicio_nombre ?? '—'}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-subtle">Acciones rápidas</p>
                <p className="text-lg font-semibold text-heading">Gestiona la cita</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-[var(--color-surface-200)] px-3 py-1 text-xs uppercase tracking-wide text-secondary border border-[var(--border-subtle-color)]" style={{ borderWidth: 'var(--border-subtle-width)' }}>
                {data.estado}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={activeAction === 'reschedule' ? 'primary' : 'ghost'}
                startIcon={<RefreshCw size={16} />}
                onClick={() => setActiveAction('reschedule')}
              >
                Reagendar
              </Button>
              <Button
                variant={activeAction === 'cancel' ? 'primary' : 'ghost'}
                className={clsx(
                  activeAction === 'cancel'
                    ? 'bg-red-500/20 text-red-100 hover:bg-red-500/30'
                    : 'text-red-200 hover:text-red-100',
                )}
                startIcon={<XCircle size={16} />}
                onClick={() => setActiveAction('cancel')}
              >
                Cancelar
              </Button>
            </div>

            {activeAction === 'reschedule' ? (
              <div className="space-y-4">
                <p className="text-sm text-secondary">
                  Selecciona el profesional y el nuevo horario disponible. Los horarios bloqueados se muestran en rojo.
                </p>
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
                      value={selectedVet}
                      onChange={(event) => setSelectedVet(event.target.value)}
                    >
                      <option value="">Selecciona veterinario</option>
                      {(veterinarios ?? []).map((vet) => (
                        <option key={vet.id} value={vet.id}>
                          {vet.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
                <div className="rounded-2xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <p className="text-sm font-semibold text-heading">Nuevo horario</p>
                  <AvailabilityPicker veterinarioId={selectedVet} value={newDateTime} onChange={setNewDateTime} />
                </div>
                <Button
                  startIcon={<RefreshCw size={16} />}
                  disabled={!newDateTime || !selectedVet || rescheduleMutation.isPending}
                  onClick={handleReschedule}
                >
                  {rescheduleMutation.isPending ? 'Reagendando...' : 'Confirmar nuevo horario'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 border border-red-200" style={{ boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)' }}>
                  <AlertTriangle size={18} className="text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">¿Seguro que quieres cancelar?</p>
                    <p className="text-xs text-red-700">
                      Notificaremos al cliente y liberaremos el horario para que otros usuarios puedan agendarlo.
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="border border-red-500/50 bg-red-500/20 text-red-100 hover:bg-red-500/30"
                  startIcon={<XCircle size={16} />}
                  disabled={cancelMutation.isPending}
                  onClick={handleCancel}
                >
                  {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar cita definitivamente'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </section>
    </div>
  )
}

