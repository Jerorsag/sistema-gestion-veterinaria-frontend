import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShieldBan, ShieldCheck, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { UserForm } from '@/pages/users/components/UserForm'
import {
  useUserActionMutation,
  useUserDeleteMutation,
  useUserDetailQuery,
  useUserUpdateMutation,
} from '@/hooks/users'
import type { UserUpdatePayload } from '@/api/types/users'

export const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useUserDetailQuery(id)
  const updateMutation = useUserUpdateMutation(id!)
  const deleteMutation = useUserDeleteMutation()
  const activateMutation = useUserActionMutation('activate')
  const suspendMutation = useUserActionMutation('suspend')

  const initialValues = useMemo(() => {
    if (!data) return undefined
    return {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      username: data.username,
      estado: data.estado,
      roles: data.roles.map((rol) => rol.nombre),
      telefono: data.perfil_cliente?.telefono ?? '',
      direccion: data.perfil_cliente?.direccion ?? '',
    }
  }, [data])

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const isSuspendPending = suspendMutation.isPending && suspendMutation.variables === id
  const isActivatePending = activateMutation.isPending && activateMutation.variables === id

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Usuario</p>
          <h1 className="text-3xl font-semibold">{data.nombre} {data.apellido}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-white/70">
            <span>{data.email}</span>
            <span>•</span>
            <StatusBadge status={data.estado} />
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="ghost" startIcon={<ArrowLeft size={18} />}>
            <Link to="/app/usuarios">Volver</Link>
          </Button>
          {data.estado !== 'activo' ? (
            <Button
              variant="secondary"
              startIcon={<ShieldCheck size={16} />}
              disabled={isActivatePending}
              onClick={() => activateMutation.mutate(id!)}
            >
              {isActivatePending ? 'Activando...' : 'Activar'}
            </Button>
          ) : (
            <Button
              variant="ghost"
              startIcon={<ShieldBan size={16} />}
              disabled={isSuspendPending}
              onClick={() => suspendMutation.mutate(id!)}
            >
              {isSuspendPending ? 'Suspendiendo...' : 'Suspender'}
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold">Información general</h2>
        <UserForm
          mode="edit"
          initialValues={initialValues}
          onSubmit={(payload) => updateMutation.mutateAsync(payload as UserUpdatePayload)}
          isSubmitting={updateMutation.isPending}
        />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-red-200">Zona peligrosa</h3>
        <p className="text-sm text-red-200/70">
          Eliminar al usuario realiza un <em>soft delete</em> en el backend y no se puede recuperar desde la interfaz.
        </p>
        <Button
          variant="ghost"
          startIcon={<Trash2 size={16} />}
          className="mt-4 text-red-300 hover:text-red-100"
          disabled={deleteMutation.isPending}
          onClick={() => id && deleteMutation.mutate(id)}
        >
          {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar usuario'}
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card header={<p className="text-xs uppercase tracking-[0.4em] text-white/40">Roles</p>}>
          <div className="flex flex-wrap gap-2 text-sm text-white/80">
            {data.roles.map((rol) => (
              <span key={rol.id} className="rounded-full bg-white/10 px-3 py-1 capitalize">
                {rol.nombre}
              </span>
            ))}
          </div>
        </Card>
        {data.perfil_cliente && (
          <Card header={<p className="text-xs uppercase tracking-[0.4em] text-white/40">Cliente</p>}>
            <p className="text-sm text-white/70">Teléfono: {data.perfil_cliente.telefono ?? '—'}</p>
            <p className="text-sm text-white/70">Dirección: {data.perfil_cliente.direccion ?? '—'}</p>
          </Card>
        )}
        {data.perfil_veterinario && (
          <Card header={<p className="text-xs uppercase tracking-[0.4em] text-white/40">Veterinario</p>}>
            <p className="text-sm text-white/70">Licencia: {data.perfil_veterinario.licencia ?? '—'}</p>
            <p className="text-sm text-white/70">Especialidad: {data.perfil_veterinario.especialidad ?? '—'}</p>
          </Card>
        )}
      </section>
    </div>
  )
}

