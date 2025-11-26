import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { ConsultationForm } from '@/pages/consultations/ConsultationForm'

export const ConsultationCreatePage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Registrar consulta</p>
        <h1 className="text-3xl font-semibold">Nueva consulta</h1>
        <p className="text-sm text-white/70">Completa el formulario con la información del paciente y diagnóstico.</p>
      </div>
      <Button asChild variant="ghost" startIcon={<ArrowLeft size={16} />}>
        <Link to="/app/consultas">Volver</Link>
      </Button>
    </div>

    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <ConsultationForm />
    </section>
  </div>
)

