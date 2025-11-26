import { CalendarDays, PawPrint, Stethoscope, Users } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const stats = [
  { label: 'Usuarios activos', value: '128', icon: Users, trend: '+8.2%' },
  { label: 'Mascotas registradas', value: '342', icon: PawPrint, trend: '+3.1%' },
  { label: 'Citas agendadas', value: '64', icon: CalendarDays, trend: '+12%' },
  { label: 'Consultas abiertas', value: '21', icon: Stethoscope, trend: 'Estable' },
]

export const DashboardHome = () => (
  <div className="space-y-10">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, trend }) => (
        <Card
          key={label}
          className="bg-gradient-to-br from-white/[0.08] to-white/[0.02] px-5 py-6"
          header={
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-white/40">
              <span>{label}</span>
              <Icon className="text-white/50" size={18} />
            </div>
          }
        >
          <div className="flex items-baseline justify-between">
            <p className="text-4xl font-semibold">{value}</p>
            <Badge tone={trend.includes('-') ? 'warning' : 'success'}>{trend}</Badge>
          </div>
        </Card>
      ))}
    </div>

    <Card
      header={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Próximos pasos</p>
            <h3 className="text-xl font-semibold">Arquitectura lista para módulos</h3>
          </div>
        </div>
      }
    >
      <p className="text-sm text-white/70">
        El proyecto ya cuenta con routing, layouts responsivos, providers globales y manejo centralizado de sesión. A partir de
        esta base integraremos el módulo de autenticación completo y luego los restantes, siguiendo el plan incremental
        definido.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
        <li>Hook `useSessionStore` con persistencia lista para tokens reales.</li>
        <li>Instancias de Axios y endpoints alineadas al backend Django.</li>
        <li>Componentes UI reutilizables para formularios y cards.</li>
        <li>Layouts responsivos con micro animaciones y variables CSS.</li>
      </ul>
    </Card>
  </div>
)

