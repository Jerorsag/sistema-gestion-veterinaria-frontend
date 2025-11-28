import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FileText, PlusCircle, RefreshCw, Eye, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useInvoicesQuery } from '@/hooks/billing'
import { formatDateTime } from '@/utils/datetime'
import type { Invoice } from '@/api/types/billing'
import { useSessionStore } from '@/core/store/session-store'

const statusMap: Record<string, { tone: 'success' | 'warning' | 'info' | 'neutral'; label: string }> = {
  PENDIENTE: { tone: 'warning', label: 'Pendiente' },
  PAGADA: { tone: 'success', label: 'Pagada' },
  ANULADA: { tone: 'info', label: 'Anulada' },
}

export const InvoicesListPage = () => {
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const debouncedSearch = useDebouncedValue(searchValue, 500)

  const user = useSessionStore((state) => state.user)
  const isClient = user?.roles?.includes('cliente') ?? false

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
    </div>
  )
}

