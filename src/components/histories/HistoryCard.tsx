import { Link } from 'react-router-dom'
import { ArrowRight, Stethoscope, Syringe } from 'lucide-react'
import clsx from 'clsx'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ClinicalHistorySummary } from '@/api/types/histories'
import { formatDateTime } from '@/utils/datetime'

interface HistoryCardProps {
  history: ClinicalHistorySummary
}

export const HistoryCard = ({ history }: HistoryCardProps) => (
  <Card className="flex flex-col gap-4 border-white/10 bg-white/[0.04] p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Historia #{history.id}</p>
        <h3 className="text-xl font-semibold">{history.mascota.nombre}</h3>
        <p className="text-sm text-white/70">{history.propietario_nombre}</p>
      </div>
      <span
        className={clsx(
          'rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide',
          history.estado_vacunacion_actual === 'completa'
            ? 'bg-emerald-500/20 text-emerald-200'
            : 'bg-amber-500/20 text-amber-200',
        )}
      >
        {history.estado_vacunacion_display}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-3 text-sm text-white/70">
      <div className="flex items-center gap-2">
        <Stethoscope size={16} className="text-primary" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Consultas</p>
          <p className="text-base text-white">{history.total_consultas}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Syringe size={16} className="text-secondary" />
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">Última consulta</p>
          <p className="text-base text-white">
            {history.ultima_consulta_fecha ? formatDateTime(history.ultima_consulta_fecha) : 'Sin registros'}
          </p>
        </div>
      </div>
    </div>

    <Button asChild variant="ghost" endIcon={<ArrowRight size={16} />} className="justify-between text-white/80">
      <Link to={`/app/historias/${history.id}`}>Ver historia completa</Link>
    </Button>
  </Card>
)

