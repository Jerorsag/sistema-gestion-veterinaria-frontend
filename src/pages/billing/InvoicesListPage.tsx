import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, PlusCircle, RefreshCw, ChevronRight, Stethoscope, Calendar } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useInvoicesQuery, useInvoiceCreateFromConsultationMutation, useInvoiceCreateFromAppointmentMutation } from '@/hooks/billing'
import { useConsultationsQuery } from '@/hooks/consultations'
import { useAppointmentsQuery } from '@/hooks/appointments'
import { formatDateTime } from '@/utils/datetime'
import type { Invoice } from '@/api/types/billing'
import { useSessionStore } from '@/core/store/session-store'
import { useDisclosure } from '@/hooks/useDisclosure'

const statusMap: Record<string, { tone: 'success' | 'warning' | 'info' | 'neutral'; label: string }> = {
  PENDIENTE: { tone: 'warning', label: 'Pendiente' },
  PAGADA: { tone: 'success', label: 'Pagada' },
  ANULADA: { tone: 'info', label: 'Anulada' },
}

export const InvoicesListPage = () => {
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const debouncedSearch = useDebouncedValue(searchValue, 500)
  const generateInvoiceModal = useDisclosure()
  const [invoiceSourceType, setInvoiceSourceType] = useState<'consulta' | 'cita'>('consulta')

  const user = useSessionStore((state) => state.user)
  const isClient = user?.roles?.includes('cliente') ?? false

  // Queries para consultas y citas
  const { data: consultations, isLoading: consultationsLoading } = useConsultationsQuery({})
  const { data: appointments, isLoading: appointmentsLoading } = useAppointmentsQuery()
  
  // Mutations para crear facturas
  const createFromConsultationMutation = useInvoiceCreateFromConsultationMutation()
  const createFromAppointmentMutation = useInvoiceCreateFromAppointmentMutation()

  const filters = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      estado: statusFilter !== 'todos' ? statusFilter : undefined,
      cliente: isClient && user?.id ? String(user.id) : undefined,
      ordering: '-fecha',
    }),
    [debouncedSearch, statusFilter, isClient, user?.id],
  )

  const { data, isLoading, isFetching, refetch, error } = useInvoicesQuery(filters)

  const invoices: Invoice[] = data?.results || []


  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
  }

  const handleGenerateFromConsultation = async (consultationId: number) => {
    try {
      const invoice = await createFromConsultationMutation.mutateAsync(consultationId)
      generateInvoiceModal.close()
      navigate(`/app/facturacion/${invoice.id}`)
    } catch (error) {
      // El error ya se maneja en el hook con toast
    }
  }

  const handleGenerateFromAppointment = async (appointmentId: number) => {
    try {
      const invoice = await createFromAppointmentMutation.mutateAsync(appointmentId)
      generateInvoiceModal.close()
      navigate(`/app/facturacion/${invoice.id}`)
    } catch (error) {
      // El error ya se maneja en el hook con toast
    }
  }

  // Normalizar appointments a array (el servicio ya lo normaliza, pero por seguridad)
  const appointmentsList = useMemo(() => {
    if (!appointments) return []
    return appointments
  }, [appointments])

  // Normalizar consultations a array (el servicio ya lo normaliza, pero por seguridad)
  const consultationsList = useMemo(() => {
    if (!consultations) return []
    return consultations
  }, [consultations])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label">Facturación</p>
          <h1 className="text-3xl font-semibold text-heading">Gestión de facturas</h1>
          <p className="text-description">
            {isClient
              ? 'Visualiza tus facturas y realiza pagos'
              : 'Administra facturas, pagos y recibos del sistema'}
          </p>
        </div>
        <div className="flex gap-3">
          {!isClient && (
            <Button
              variant="primary"
              onClick={generateInvoiceModal.open}
              startIcon={<PlusCircle size={18} />}
            >
              Generar factura
            </Button>
          )}
          <Button variant="ghost" onClick={() => refetch()} startIcon={<RefreshCw size={16} className="text-black" />}>
            Refrescar
          </Button>
        </div>
      </header>

      <section className="rounded-3xl bg-surface p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <Input
            label="Buscar"
            placeholder="Buscar por número, cliente..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <label className="space-y-2 text-sm text-primary">
            <span>Estado</span>
            <select
              className="w-full rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-4 py-2 text-base text-primary transition-all focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30"
              style={{
                borderWidth: 'var(--border-subtle-width)',
                borderStyle: 'var(--border-subtle-style)',
              }}
              value={statusFilter}
              onChange={(event) => handleStatusChange(event.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADA">Pagada</option>
              <option value="ANULADA">Anulada</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-3xl bg-surface p-5" style={{ boxShadow: 'var(--shadow-card)' }}>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
            <p className="font-medium">Error al cargar facturas</p>
            <p className="text-sm">
              {error instanceof Error ? error.message : typeof error === 'string' ? error : 'Error desconocido'}
            </p>
            {error && typeof error === 'object' && 'response' in error && (
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify((error as any).response?.data, null, 2)}
              </pre>
            )}
          </div>
        )}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="text-sm uppercase tracking-wide text-subtle">
                  <th className="px-4 py-3">Cliente</th>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle-color)' }}>
                {invoices.map((invoice) => {
                  const status = statusMap[invoice.estado] || { tone: 'neutral' as const, label: invoice.estado }
                  return (
                    <tr
                      key={invoice.id}
                      className="text-sm text-secondary hover:bg-[var(--color-surface-200)]/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-primary">
                        <span className="font-medium text-[var(--color-text-heading)]">
                          {invoice.cliente_nombre || (typeof invoice.cliente === 'string' ? invoice.cliente : `Cliente #${invoice.cliente}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-primary">{formatDateTime(invoice.fecha)}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-heading">
                          ${typeof invoice.total === 'number' ? invoice.total.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : Number(invoice.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone={status.tone}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button asChild variant="ghost" startIcon={<ChevronRight size={16} className="text-[var(--color-text-heading)]" />}>
                          <Link to={`/app/facturacion/${invoice.id}`}>Ver detalle</Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[var(--border-subtle-color)] px-6 py-12 text-center text-secondary" style={{ borderWidth: 'var(--border-subtle-width)', borderStyle: 'dashed' }}>
            <FileText size={48} className="mx-auto mb-4 text-[var(--color-muted)] opacity-40" />
            <p className="text-lg font-medium text-heading">No hay facturas registradas</p>
            <p className="text-sm text-secondary mt-2">
              {isClient ? 'No tienes facturas pendientes' : 'Comienza creando una nueva factura'}
            </p>
            {!isLoading && data && data.count === 0 && (
              <p className="text-xs text-[var(--color-text-muted)] mt-4">
                Total de facturas: {data.count}
              </p>
            )}
          </div>
        )}

        {isFetching && !isLoading && (
          <div className="mt-4 flex justify-center">
            <Spinner size="sm" />
          </div>
        )}
      </section>

      {/* Modal para generar factura */}
      <Modal
        isOpen={generateInvoiceModal.isOpen}
        onClose={generateInvoiceModal.close}
        title="Generar factura"
        size="lg"
      >
        <div className="space-y-6">
          {/* Selector de tipo */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-heading)] mb-2">
              Seleccionar origen
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={invoiceSourceType === 'consulta' ? 'primary' : 'ghost'}
                onClick={() => setInvoiceSourceType('consulta')}
                startIcon={<Stethoscope size={16} />}
                className="w-full"
              >
                Desde consulta
              </Button>
              <Button
                variant={invoiceSourceType === 'cita' ? 'primary' : 'ghost'}
                onClick={() => setInvoiceSourceType('cita')}
                startIcon={<Calendar size={16} />}
                className="w-full"
              >
                Desde cita
              </Button>
            </div>
          </div>

          {/* Lista de consultas */}
          {invoiceSourceType === 'consulta' && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">
                Selecciona una consulta
              </h3>
              {consultationsLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner size="lg" />
                </div>
              ) : consultationsList.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-text-muted)]">
                  <Stethoscope size={48} className="mx-auto mb-4 opacity-40" />
                  <p>No hay consultas disponibles</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {consultationsList.map((consultation) => (
                    <Card
                      key={consultation.id}
                      className="p-4 hover:bg-[var(--color-surface-200)] transition-colors cursor-pointer"
                      onClick={() => handleGenerateFromConsultation(consultation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[var(--color-text-heading)]">
                              Consulta #{consultation.id}
                            </h4>
                            <Badge tone="info">{consultation.total_prescripciones} prescripción(es)</Badge>
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                            <span className="font-medium">Mascota:</span> {consultation.mascota_nombre}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                            <span className="font-medium">Veterinario:</span> {consultation.veterinario_nombre}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            <span className="font-medium">Fecha:</span> {formatDateTime(consultation.fecha_consulta)}
                          </p>
                          {consultation.diagnostico && (
                            <p className="text-sm text-[var(--color-text-muted)] mt-2">
                              <span className="font-medium">Diagnóstico:</span> {consultation.diagnostico}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleGenerateFromConsultation(consultation.id)
                          }}
                          disabled={createFromConsultationMutation.isPending}
                        >
                          {createFromConsultationMutation.isPending ? 'Generando...' : 'Generar'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Lista de citas */}
          {invoiceSourceType === 'cita' && (
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-text-heading)] mb-4">
                Selecciona una cita
              </h3>
              {appointmentsLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner size="lg" />
                </div>
              ) : appointmentsList.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-text-muted)]">
                  <Calendar size={48} className="mx-auto mb-4 opacity-40" />
                  <p>No hay citas disponibles</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {appointmentsList.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="p-4 hover:bg-[var(--color-surface-200)] transition-colors cursor-pointer"
                      onClick={() => handleGenerateFromAppointment(appointment.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[var(--color-text-heading)]">
                              Cita #{appointment.id}
                            </h4>
                            <Badge
                              tone={
                                appointment.estado === 'COMPLETADA'
                                  ? 'success'
                                  : appointment.estado === 'CANCELADA'
                                  ? 'info'
                                  : 'warning'
                              }
                            >
                              {appointment.estado}
                            </Badge>
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                            <span className="font-medium">Mascota:</span> {appointment.mascota_nombre}
                          </p>
                          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                            <span className="font-medium">Servicio:</span> {appointment.servicio_nombre || 'Sin servicio'}
                          </p>
                          {appointment.veterinario_nombre && (
                            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                              <span className="font-medium">Veterinario:</span> {appointment.veterinario_nombre}
                            </p>
                          )}
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            <span className="font-medium">Fecha:</span> {formatDateTime(appointment.fecha_hora)}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleGenerateFromAppointment(appointment.id)
                          }}
                          disabled={createFromAppointmentMutation.isPending || !appointment.servicio_nombre}
                        >
                          {createFromAppointmentMutation.isPending ? 'Generando...' : 'Generar'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

