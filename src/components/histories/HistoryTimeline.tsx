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
      <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-white/60">
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
            <div className="relative flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Stethoscope size={18} />
                </span>
                {hasDivider && <span className="mt-2 h-full w-px bg-white/10" />}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{consult.veterinario_nombre}</h4>
                    <p className="text-sm text-white/60">{formatDateTime(consult.fecha_consulta)}</p>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
                    Consulta #{consult.id}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-white/80">
                  <p className="text-sm font-medium text-white">Diagnóstico</p>
                  <p className="rounded-xl bg-white/5 p-3 text-white/80">{consult.diagnostico}</p>
                  {consult.descripcion_consulta && (
                    <>
                      <p className="text-sm font-medium text-white">Descripción de la consulta</p>
                      <p className="rounded-xl bg-white/5 p-3 text-white/80">{consult.descripcion_consulta}</p>
                    </>
                  )}
                  {consult.notas_adicionales && (
                    <>
                      <p className="text-sm font-medium text-white">Notas adicionales</p>
                      <p className="rounded-xl bg-white/5 p-3 text-white/80">{consult.notas_adicionales}</p>
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
  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
      {icon}
      {title}
    </div>
    {items.length ? (
      <ul className="space-y-2 text-sm text-white/80">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="rounded-xl bg-white/5 p-2">
            <p className="font-medium text-white">{item.label}</p>
            <p className="text-xs text-white/60">{item.detail}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-xs text-white/50">Sin registros</p>
    )}
  </div>
)

