import { Calendar, FileText, Pill, Syringe } from 'lucide-react'
import type { ConsultaDetail } from '@/api/types/histories'

interface SectionCardProps {
  icon: React.ReactNode
  title: string
  items: Array<{ label: string; detail?: string }>
}

const SectionCard = ({ icon, title, items }: SectionCardProps) => (
  <div className="rounded-xl bg-surface p-4" style={{ boxShadow: 'var(--shadow-soft)' }}>
    <div className="mb-2 flex items-center gap-2">
      <span className="text-accent">{icon}</span>
      <h4 className="text-sm font-medium text-heading">{title}</h4>
    </div>
    {items.length === 0 ? (
      <p className="text-xs text-secondary">Sin observaciones</p>
    ) : (
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm text-secondary">
            <span className="font-medium text-heading">{item.label}</span>
            {item.detail && <span className="ml-1 text-xs">• {item.detail}</span>}
          </li>
        ))}
      </ul>
    )}
  </div>
)

interface HistoryTimelineProps {
  consultations: ConsultaDetail[]
}

export const HistoryTimeline = ({ consultations }: HistoryTimelineProps) => {
  return (
    <div className="space-y-6">
      {consultations.map((consult) => {
        
        return (
          <div
            key={consult.id}
            className="rounded-2xl bg-surface p-6"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="mb-4 flex items-start justify-between border-b border-[var(--border-subtle-color)] pb-4" style={{ borderWidth: 'var(--border-subtle-width)' }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Calendar className="text-accent" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-heading">
                    {new Date(consult.fecha_consulta).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-secondary">
                    {new Date(consult.fecha_consulta).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center rounded-full bg-[var(--color-surface-200)] px-3 py-1 text-xs text-secondary border border-[var(--border-subtle-color)]" style={{ borderWidth: 'var(--border-subtle-width)' }}>
                Consulta #{consult.id}
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="text-sm font-medium text-heading">Diagnóstico</p>
              <p className="rounded-xl bg-[var(--color-surface-200)] p-3 text-secondary" style={{ boxShadow: 'var(--shadow-soft)' }}>
                {consult.diagnostico}
              </p>
              
              {consult.descripcion_consulta && (
                <>
                  <p className="text-sm font-medium text-heading">Descripción de la consulta</p>
                  <p className="rounded-xl bg-[var(--color-surface-200)] p-3 text-secondary" style={{ boxShadow: 'var(--shadow-soft)' }}>
                    {consult.descripcion_consulta}
                  </p>
                </>
              )}
              
              {consult.notas_adicionales && (
                <>
                  <p className="text-sm font-medium text-heading">Notas adicionales</p>
                  <p className="rounded-xl bg-[var(--color-surface-200)] p-3 text-secondary" style={{ boxShadow: 'var(--shadow-soft)' }}>
                    {consult.notas_adicionales}
                  </p>
                </>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3 mt-4">
              <SectionCard
                icon={<Pill size={16} />}
                title="Prescripciones"
                items={consult.prescripciones?.map((pres) => ({
                  label: pres.producto_descripcion || pres.producto_nombre || 'Medicamento',
                  detail: pres.indicaciones 
                    ? `${pres.cantidad} unidades · ${pres.indicaciones}` 
                    : `${pres.cantidad} unidades`, 
                })) || []}
              />
              
              <SectionCard
                icon={<FileText size={16} />}
                title="Exámenes"
                items={consult.examenes?.map((exam) => ({
                  label: exam.tipo_examen || 'Examen',  
                  detail: exam.descripcion || '',       
                })) || []}
              />
              
              <SectionCard
                icon={<Syringe size={16} />}
                title="Vacunas"
                items={consult.vacunas?.map((vac) => ({
                  label: vac.estado_display || vac.estado || 'Sin estado',  
                  detail: vac.vacunas_descripcion || 'Sin observaciones',  
                })) || []}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}