import { useEffect } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z, type ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useRolesQuery } from '@/hooks/users'
import type { UserCreatePayload, UserUpdatePayload } from '@/api/types/users'

type FormValues = {
  nombre: string
  apellido: string
  email: string
  username: string
  estado: 'activo' | 'inactivo' | 'suspendido'
  roles: string[]
  telefono?: string
  direccion?: string
  password?: string
  password_confirm?: string
}

const buildSchema = (mode: 'create' | 'edit'): ZodType<FormValues> =>
  z
    .object({
      nombre: z.string().min(2, 'Requerido'),
      apellido: z.string().min(2, 'Requerido'),
      email: z.string().email('Correo inválido'),
      username: z.string().min(3, 'Mínimo 3 caracteres'),
      estado: z.enum(['activo', 'inactivo', 'suspendido']),
      roles: z.array(z.string()).min(1, 'Selecciona al menos un rol'),
      telefono: z.string().optional(),
      direccion: z.string().optional(),
      password: z.string().optional(),
      password_confirm: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      const requiresPassword = mode === 'create'
      if (requiresPassword && !values.password) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requerido', path: ['password'] })
      }
      if (requiresPassword && !values.password_confirm) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Requerido', path: ['password_confirm'] })
      }
      if ((values.password || values.password_confirm) && values.password !== values.password_confirm) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Las contraseñas no coinciden', path: ['password_confirm'] })
      }
      if (values.password && values.password.length < 6) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Mínimo 6 caracteres', path: ['password'] })
      }
      if (values.password_confirm && values.password_confirm.length < 6) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Mínimo 6 caracteres', path: ['password_confirm'] })
      }
    }) as ZodType<FormValues>

interface UserFormProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<FormValues>
  onSubmit: (payload: UserCreatePayload | UserUpdatePayload) => Promise<unknown> | unknown
  isSubmitting?: boolean
}

export const UserForm = ({ mode, initialValues, onSubmit, isSubmitting }: UserFormProps) => {
  const schema = buildSchema(mode)
  const resolver = zodResolver(schema as any) as Resolver<FormValues>
  const form = useForm<FormValues>({
    resolver,
    defaultValues: {
      nombre: '',
      apellido: '',
      username: '',
      email: '',
      estado: 'activo',
      roles: ['cliente'],
      telefono: '',
      direccion: '',
      password: '',
      password_confirm: '',
      ...initialValues,
    },
  })

  const { data: roles, isLoading: rolesLoading } = useRolesQuery()

  useEffect(() => {
    if (initialValues) {
      form.reset({
        roles: ['cliente'],
        estado: initialValues.estado ?? 'activo',
        ...initialValues,
      })
    }
  }, [initialValues, form])

  const handleSubmit = form.handleSubmit(async (values) => {
    const payload: UserCreatePayload | UserUpdatePayload = {
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      username: values.username,
      estado: values.estado ?? 'activo',
      roles: values.roles ?? [],
      perfil_cliente: {
        telefono: values.telefono,
        direccion: values.direccion,
      },
    }

    if (mode === 'create') {
      ;(payload as UserCreatePayload).password = values.password as string
      ;(payload as UserCreatePayload).password_confirm = values.password_confirm as string
    }

    await onSubmit(payload)
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Nombre" {...form.register('nombre')} error={form.formState.errors.nombre?.message} />
        <Input label="Apellido" {...form.register('apellido')} error={form.formState.errors.apellido?.message} />
        <Input label="Nombre de usuario" {...form.register('username')} error={form.formState.errors.username?.message} />
        <Input type="email" label="Correo" {...form.register('email')} error={form.formState.errors.email?.message} />
        <label className="space-y-2 text-sm text-white/80">
          <span>Estado</span>
          <select
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
            {...form.register('estado')}
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </label>
        <div className="space-y-2">
          <p className="text-sm text-white/80">Roles</p>
          {rolesLoading ? (
            <Spinner size="sm" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(roles) ? roles : []).map((rol) => {
                const checked = form.watch('roles')?.includes(rol.nombre)
                return (
                  <label
                    key={rol.id}
                    className={`cursor-pointer rounded-full border border-white/10 px-3 py-1 text-sm ${
                      checked ? 'bg-primary/20 text-primary' : 'text-white/70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={rol.nombre}
                      className="sr-only"
                      checked={checked}
                      onChange={(event) => {
                        const current = form.getValues('roles') ?? []
                        if (event.target.checked) {
                          form.setValue('roles', [...current, rol.nombre], { shouldValidate: true })
                        } else {
                          form.setValue(
                            'roles',
                            current.filter((r) => r !== rol.nombre),
                            { shouldValidate: true },
                          )
                        }
                      }}
                    />
                    {rol.nombre}
                  </label>
                )
              })}
            </div>
          )}
          {form.formState.errors.roles && (
            <p className="text-xs text-red-300">{form.formState.errors.roles.message as string}</p>
          )}
        </div>
        <Input label="Teléfono" {...form.register('telefono')} error={form.formState.errors.telefono?.message} />
        <Input label="Dirección" {...form.register('direccion')} error={form.formState.errors.direccion?.message} />
      </div>

      {mode === 'create' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="password"
            label="Contraseña"
            {...form.register('password')}
            error={form.formState.errors.password?.message}
          />
          <Input
            type="password"
            label="Confirmar contraseña"
            {...form.register('password_confirm')}
            error={form.formState.errors.password_confirm?.message}
          />
        </div>
      )}

      {initialValues?.estado && (
        <div className="text-sm text-white/70">
          Estado actual: <StatusBadge status={initialValues.estado as 'activo' | 'inactivo' | 'suspendido'} />
        </div>
      )}

      <Button type="submit" disabled={form.formState.isSubmitting || Boolean(isSubmitting)}>
        {form.formState.isSubmitting || isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
      </Button>
    </form>
  )
}

