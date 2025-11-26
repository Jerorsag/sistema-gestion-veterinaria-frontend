import { Fragment } from 'react'
import { FileText, Pill, Stethoscope, Syringe } from 'lucide-react'

import type { ConsultaDetail } from '@/api/types/histories'
import { formatDateTime } from '@/utils/datetime'

interface HistoryTimelineProps {
  consultations: ConsultaDetail[]
}

export const HistoryTimeline = ({ consultations }: HistoryTimelineProps) => {
  if (!consultations.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--border-subtle-color)] px-6 py-12 text-center text-secondary" style={{ borderWidth: 'var(--border-subtle-width)', borderStyle: 'dashed' }}>
        No hay consultas registradas para esta mascota.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {consultations.map((consult, index) => {
        const hasDivider = index < consultations.length - 1
        return (
          <Fragment key={consult.id}>
            <div className="relative flex gap-4 rounded-2xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)]">
                  <Stethoscope size={18} />
                </span>
                {hasDivider && <span className="mt-2 h-full w-px" style={{ backgroundColor: 'var(--border-subtle-color)' }} />}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-heading">{consult.veterinario_nombre}</h4>
                    <p className="text-sm text-tertiary">{formatDateTime(consult.fecha_consulta)}</p>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-[var(--color-surface-200)] px-3 py-1 text-xs text-secondary border border-[var(--border-subtle-color)]" style={{ borderWidth: 'var(--border-subtle-width)' }}>
                    Consulta #{consult.id}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-sm font-medium text-heading">Diagnóstico</p>
                  <p className="rounded-xl bg-[var(--color-surface-200)] p-3 text-secondary" style={{ boxShadow: 'var(--shadow-soft)' }}>{consult.diagnostico}</p>
                  {consult.descripcion_consulta && (
                    <>
                      <p className="text-sm font-medium text-heading">Descripción de la consulta</p>
                      <p className="rounded-xl bg-[var(--color-surface-200)] p-3 text-secondary" style={{ boxShadow: 'var(--shadow-soft)' }}>{consult.descripcion_consulta}</p>
                    </>
                  )}
                  {consult.notas_adicionales && (
                    <>
                      <p className="text-sm font-medium text-heading">Notas adicionales</p>
                      <p className="rounded-xl bg-[var(--color-surface-200)] p-3 text-secondary" style={{ boxShadow: 'var(--shadow-soft)' }}>{consult.notas_adicionales}</p>
                    </>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <SectionCard
                    icon={<Pill size={16} />}
                    title="Prescripciones"
                    items={consult.prescripciones.map((pres) => ({
                      label: pres.producto_nombre,
                      detail: `${pres.dosis} · ${pres.frecuencia}`,
                    }))}
                  />
                  <SectionCard
                    icon={<FileText size={16} />}
                    title="Exámenes"
                    items={consult.examenes.map((exam) => ({
                      label: exam.tipo,
                      detail: exam.resultados,
                    }))}
                  />
                  <SectionCard
                    icon={<Syringe size={16} />}
                    title="Vacunas"
                    items={consult.vacunas.map((vac) => ({
                      label: vac.nombre_vacuna,
                      detail: vac.observaciones ?? 'Sin observaciones',
                    }))}
                  />
                </div>
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}

interface SectionCardProps {
  icon: React.ReactNode
  title: string
  items: Array<{ label: string; detail: string }>
}

const SectionCard = ({ icon, title, items }: SectionCardProps) => (
  <div className="rounded-2xl bg-[var(--color-surface-200)] p-3" style={{ boxShadow: 'var(--shadow-soft)' }}>
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-heading">
      {icon}
      {title}
    </div>
    {items.length ? (
      <ul className="space-y-2 text-sm">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="rounded-xl bg-surface p-2" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <p className="font-medium text-heading">{item.label}</p>
            <p className="text-xs text-tertiary">{item.detail}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xs text-subtle">Sin registros</p>
    )}
  </div>
)

