import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { AppointmentForm } from '@/pages/appointments/components/AppointmentForm'

export const AppointmentCreatePage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-label">Agendar cita</p>
        <h1 className="text-3xl font-semibold text-heading">Nueva cita veterinaria</h1>
        <p className="text-description">Elige mascota, profesional, servicio y horario disponible.</p>
      </div>
      <Button asChild variant="ghost" startIcon={<ArrowLeft size={18} />}>
        <Link to="/app/citas">Volver</Link>
      </Button>
    </div>

    <section className="rounded-3xl bg-surface p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
      <AppointmentForm />
    </section>
  </div>
)

