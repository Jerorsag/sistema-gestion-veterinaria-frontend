import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { AppointmentForm } from '@/pages/appointments/components/AppointmentForm'

export const AppointmentCreatePage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Agendar cita</p>
        <h1 className="text-3xl font-semibold">Nueva cita veterinaria</h1>
        <p className="text-sm text-white/70">Elige mascota, profesional, servicio y horario disponible.</p>
      </div>
      <Button asChild variant="ghost" startIcon={<ArrowLeft size={18} />}>
        <Link to="/app/citas">Volver</Link>
      </Button>
    </div>

    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <AppointmentForm />
    </section>
  </div>
)

