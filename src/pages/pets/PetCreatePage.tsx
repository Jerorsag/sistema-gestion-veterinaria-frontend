import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { PetForm } from '@/pages/pets/components/PetForm'
import { usePetCreateMutation } from '@/hooks/pets'

export const PetCreatePage = () => {
  const mutation = usePetCreateMutation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Registrar mascota</p>
          <h1 className="text-3xl font-semibold">Nueva mascota</h1>
          <p className="text-sm text-white/70">
            Completa la información requerida. Si eres cliente, la mascota quedará asociada a tu perfil.
          </p>
        </div>
        <Button asChild variant="ghost" startIcon={<ArrowLeft size={18} />}>
          <Link to="/app/mascotas">Volver</Link>
        </Button>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <PetForm mode="create" onSubmit={(payload) => mutation.mutateAsync(payload)} isSubmitting={mutation.isPending} />
      </section>
    </div>
  )
}

