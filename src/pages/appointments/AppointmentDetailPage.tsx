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
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Detalle de cita</p>
          <h1 className="text-3xl font-semibold">{data.mascota_nombre}</h1>
          <p className="text-sm text-white/70">ID #{data.id}</p>
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
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Fecha y hora</p>
                <p className="text-lg font-semibold">{formatDateTime(data.fecha_hora)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2 text-white">
                <PawPrint size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Mascota</p>
                <p className="text-lg">{data.mascota_nombre}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2 text-white">
                <User2 size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Veterinario</p>
                <p className="text-lg">{data.veterinario_nombre ?? 'Por asignar'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 p-2 text-white">
                <Scissors size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Servicio</p>
                <p className="text-lg">{data.servicio_nombre ?? '—'}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Acciones rápidas</p>
                <p className="text-lg font-semibold">Gestiona la cita</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
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
                <p className="text-sm text-white/70">
                  Selecciona el profesional y el nuevo horario disponible. Los horarios bloqueados se muestran en rojo.
                </p>
                <label className="space-y-2 text-sm text-white/80">
                  <span>Veterinario</span>
                  {vetsLoading ? (
                    <div className="flex min-h-[42px] items-center">
                      <Spinner size="sm" />
                    </div>
                  ) : (
                    <select
                      className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
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
                <div className="rounded-2xl border border-white/10 p-4">
                  <p className="text-sm font-semibold text-white">Nuevo horario</p>
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
                <div className="flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-100">
                  <AlertTriangle size={18} />
                  <div>
                    <p className="text-sm font-semibold">¿Seguro que quieres cancelar?</p>
                    <p className="text-xs text-red-200">
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

