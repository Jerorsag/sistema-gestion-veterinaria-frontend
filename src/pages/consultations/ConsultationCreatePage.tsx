import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConsultationForm } from '@/pages/consultations/ConsultationForm'

export const ConsultationCreatePage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-label">Registrar consulta</p>
        <h1 className="text-3xl font-semibold text-heading">Nueva consulta</h1>
        <p className="text-description">Completa el formulario con la información del paciente y diagnóstico.</p>
      </div>
      <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
        <Link to="/app/consultas">Volver</Link>
      </Button>
    </div>

    <section className="rounded-3xl bg-surface p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
      <ConsultationForm />
    </section>
  </div>
)

