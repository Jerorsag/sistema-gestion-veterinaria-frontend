import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { UserForm } from '@/pages/users/components/UserForm'
import { useUserCreateMutation } from '@/hooks/users'
import type { UserCreatePayload } from '@/api/types/users'

export const UserCreatePage = () => {
  const mutation = useUserCreateMutation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Nuevo usuario</p>
          <h1 className="text-3xl font-semibold">Registro manual</h1>
          <p className="text-sm text-white/70">
            Completa la información y asigna roles/perfiles según corresponda.
          </p>
        </div>
        <Button asChild variant="ghost" startIcon={<ArrowLeft size={18} />}>
          <Link to="/app/usuarios">Volver</Link>
        </Button>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <UserForm
          mode="create"
          onSubmit={(payload) => mutation.mutateAsync(payload as UserCreatePayload)}
          isSubmitting={mutation.isPending}
        />
      </section>
    </div>
  )
}

