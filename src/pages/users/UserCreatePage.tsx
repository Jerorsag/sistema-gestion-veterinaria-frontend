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
          <p className="text-label">Nuevo usuario</p>
          <h1 className="text-3xl font-semibold text-heading">Registro manual</h1>
          <p className="text-description">
            Completa la información y asigna roles/perfiles según corresponda.
          </p>
        </div>
        <Button asChild variant="ghost" startIcon={<ArrowLeft size={18} />}>
          <Link to="/app/usuarios">Volver</Link>
        </Button>
      </div>

      <section className="rounded-3xl bg-surface p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <UserForm
          mode="create"
          onSubmit={(payload) => mutation.mutateAsync(payload as UserCreatePayload)}
          isSubmitting={mutation.isPending}
        />
      </section>
    </div>
  )
}

