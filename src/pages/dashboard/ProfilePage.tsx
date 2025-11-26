import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import {
  useChangePasswordMutation,
  useProfileQuery,
  useUpdateProfileMutation,
} from '@/hooks/auth'

const passwordSchema = z
  .object({
    password_actual: z.string().min(6, 'Ingresa tu contraseña actual'),
    password_nueva: z.string().min(6, 'Mínimo 6 caracteres'),
    password_nueva_confirm: z.string().min(6, 'Confirma la contraseña'),
  })
  .refine((values) => values.password_nueva === values.password_nueva_confirm, {
    path: ['password_nueva_confirm'],
    message: 'Las contraseñas no coinciden',
  })

type PasswordValues = z.infer<typeof passwordSchema>

type ProfileFormValues = {
  nombre: string
  apellido: string
  email: string
  telefono?: string | null
  direccion?: string | null
}

export const ProfilePage = () => {
  const { data, isLoading } = useProfileQuery()
  const updateProfileMutation = useUpdateProfileMutation()
  const changePasswordMutation = useChangePasswordMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: profileErrors, isSubmitting: isSavingProfile },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      direccion: '',
    },
  })

  useEffect(() => {
    if (data) {
      reset({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        telefono: data.perfil_cliente?.telefono ?? '',
        direccion: data.perfil_cliente?.direccion ?? '',
      })
    }
  }, [data, reset])

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isSavingPassword },
    reset: resetPasswordForm,
  } = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password_actual: '',
      password_nueva: '',
      password_nueva_confirm: '',
    },
  })

  const onProfileSubmit = async (values: ProfileFormValues) => {
    await updateProfileMutation.mutateAsync({
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      perfil_cliente: {
        telefono: values.telefono ?? undefined,
        direccion: values.direccion ?? undefined,
      },
    })
  }

  const onPasswordSubmit = async (values: PasswordValues) => {
    await changePasswordMutation.mutateAsync(values)
    resetPasswordForm()
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="space-y-4 rounded-3xl bg-surface p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div>
          <p className="text-label">Perfil</p>
          <h2 className="text-2xl font-semibold text-heading">Datos de cuenta</h2>
        </div>

        <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nombre" {...register('nombre')} error={profileErrors.nombre?.message} />
            <Input label="Apellido" {...register('apellido')} error={profileErrors.apellido?.message} />
            <Input type="email" label="Correo" {...register('email')} error={profileErrors.email?.message} />
            <Input label="Teléfono" {...register('telefono')} error={profileErrors.telefono?.message} />
            <Input
              className="md:col-span-2"
              label="Dirección"
              {...register('direccion')}
              error={profileErrors.direccion?.message}
            />
          </div>

          <Button type="submit" disabled={isSavingProfile || updateProfileMutation.isPending}>
            {isSavingProfile || updateProfileMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </form>
      </section>

      <section className="space-y-4 rounded-3xl bg-surface p-6" style={{ boxShadow: 'var(--shadow-card)' }}>
        <div>
          <p className="text-label">Seguridad</p>
          <h2 className="text-2xl font-semibold text-heading">Actualizar contraseña</h2>
        </div>

        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            type="password"
            label="Contraseña actual"
            {...registerPassword('password_actual')}
            error={passwordErrors.password_actual?.message}
          />
          <Input
            type="password"
            label="Nueva contraseña"
            {...registerPassword('password_nueva')}
            error={passwordErrors.password_nueva?.message}
          />
          <Input
            type="password"
            label="Confirmar nueva contraseña"
            {...registerPassword('password_nueva_confirm')}
            error={passwordErrors.password_nueva_confirm?.message}
          />

          <Button type="submit" variant="secondary" disabled={isSavingPassword || changePasswordMutation.isPending}>
            {isSavingPassword || changePasswordMutation.isPending ? 'Actualizando...' : 'Actualizar contraseña'}
          </Button>
        </form>
      </section>
    </div>
  )
}

