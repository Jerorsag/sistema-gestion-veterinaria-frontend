import { ArrowLeft, Stethoscope, Calendar, User, FileText, Pill, Syringe, ClipboardList, Mail, Phone, MapPin } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
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

  // Helper para obtener el nombre de la mascota
  // El backend puede devolver mascota como número (ID) o como string (nombre)
  const mascotaNombre = typeof data.mascota === 'string' 
    ? data.mascota 
    : typeof data.mascota === 'object' && data.mascota?.nombre
    ? data.mascota.nombre
    : data.datos_personales?.nombre?.split(' ')[0] || 'Mascota'

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-label">Consultas</p>
          <h1 className="text-3xl font-semibold text-[var(--color-text-heading)]">{mascotaNombre}</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-[var(--color-text-secondary)]">{formatDateTime(data.fecha_consulta)}</p>
            {data.veterinario_nombre && (
              <p className="text-sm text-[var(--color-text-secondary)]">Por: {data.veterinario_nombre}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            onClick={() => consentMutation.mutate(data.id)}
            disabled={consentMutation.isPending}
          >
            {consentMutation.isPending ? 'Enviando...' : 'Enviar consentimiento'}
          </Button>
          <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} className="text-gray-700" />}>
            <Link to="/app/consultas">Volver</Link>
          </Button>
        </div>
      </header>

      {/* Información principal */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
              <FileText size={20} />
            </div>
            <p className="text-label font-medium">Diagnóstico</p>
          </div>
          <p className="text-base font-semibold text-gray-900">{data.diagnostico}</p>
          {data.notas_adicionales && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Notas adicionales</p>
              <p className="text-sm text-gray-700">{data.notas_adicionales}</p>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-purple-100 p-2.5 text-purple-600">
              <ClipboardList size={20} />
            </div>
            <p className="text-label font-medium">Descripción</p>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{data.descripcion_consulta}</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
              <User size={20} />
            </div>
            <p className="text-label font-medium">Veterinario</p>
          </div>
          <p className="text-base font-semibold text-gray-900">{data.veterinario_nombre}</p>
          {data.datos_personales && (
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <p className="text-xs text-gray-500 mb-2">Datos de contacto</p>
              {data.datos_personales.nombre && (
                <p className="text-sm text-gray-700">{data.datos_personales.nombre}</p>
              )}
              {data.datos_personales.telefono && (
                <p className="text-sm text-gray-700 flex items-center gap-1.5">
                  <Phone size={14} className="text-gray-500" />
                  {data.datos_personales.telefono}
                </p>
              )}
              {data.datos_personales.direccion && (
                <p className="text-sm text-gray-700 flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-500" />
                  {data.datos_personales.direccion}
                </p>
              )}
            </div>
          )}
        </Card>
      </section>

      {/* Prescripciones */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-xl bg-[var(--color-primary)]/10 p-2 text-[var(--color-primary)]">
            <Pill size={18} />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text-heading)]">Prescripciones</h2>
        </div>
        {data.prescripciones && data.prescripciones.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.prescripciones.map((pres) => (
              <Card key={pres.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600 flex-shrink-0">
                    <Pill size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">{pres.producto_nombre}</h3>
                    {pres.producto_descripcion && (
                      <p className="text-xs text-gray-500 mb-2">{pres.producto_descripcion}</p>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Cantidad:</span> {pres.cantidad} unidades
                      </p>
                      {pres.indicaciones && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Indicaciones:</span> {pres.indicaciones}
                        </p>
                      )}
                      {pres.stock_disponible !== undefined && (
                        <p className={`text-xs ${pres.stock_disponible < pres.cantidad ? 'text-red-600' : 'text-gray-500'}`}>
                          Stock disponible: {pres.stock_disponible}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--border-subtle-color)] bg-[var(--color-surface-200)]/30 px-6 py-8 text-center">
            <Pill size={32} className="mx-auto mb-3 text-[var(--color-text-muted)] opacity-40" />
            <p className="text-sm text-[var(--color-text-secondary)]">Sin prescripciones registradas</p>
          </div>
        )}
      </section>

      {/* Exámenes */}
      {data.examenes && data.examenes.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-[var(--color-primary)]/10 p-2 text-[var(--color-primary)]">
              <ClipboardList size={18} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-heading)]">Exámenes</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.examenes.map((exam) => (
              <Card key={exam.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600 flex-shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {exam.tipo_examen || exam.tipo || 'Examen'}
                    </h3>
                    {exam.descripcion && (
                      <p className="text-sm text-gray-700">{exam.descripcion}</p>
                    )}
                    {exam.resultados && (
                      <p className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Resultados:</span> {exam.resultados}
                      </p>
                    )}
                    {exam.fecha_programada && (
                      <p className="text-xs text-gray-500 mt-2">
                        Fecha programada: {formatDateTime(exam.fecha_programada)}
                      </p>
                    )}
                    {exam.estado && (
                      <Badge tone={exam.estado === 'COMPLETADO' ? 'success' : exam.estado === 'PENDIENTE' ? 'warning' : 'neutral'} className="mt-2">
                        {exam.estado}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Vacunas */}
      {data.vacunas && data.vacunas.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-xl bg-[var(--color-primary)]/10 p-2 text-[var(--color-primary)]">
              <Syringe size={18} />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text-heading)]">Vacunas</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {data.vacunas.map((vac) => (
              <Card key={vac.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 flex-shrink-0">
                    <Syringe size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {vac.nombre_vacuna || vac.estado_display || vac.estado || 'Vacuna'}
                    </h3>
                    <div className="space-y-1">
                      {vac.fecha_aplicacion && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Fecha de aplicación:</span> {formatDateTime(vac.fecha_aplicacion)}
                        </p>
                      )}
                      {vac.proxima_fecha && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Próxima fecha:</span> {formatDateTime(vac.proxima_fecha)}
                        </p>
                      )}
                      {vac.observaciones && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Observaciones:</span> {vac.observaciones}
                        </p>
                      )}
                      {vac.vacunas_descripcion && (
                        <p className="text-sm text-gray-700 mt-2">{vac.vacunas_descripcion}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
