import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useConfirmResetMutation } from '@/hooks/auth'

const resetSchema = z
  .object({
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    password2: z.string().min(6, 'Confirma tu contraseña'),
  })
  .refine((values) => values.password === values.password2, {
    path: ['password2'],
    message: 'Las contraseñas deben coincidir',
  })

type ResetValues = z.infer<typeof resetSchema>

export const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const mutation = useConfirmResetMutation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: '',
      password2: '',
    },
  })

  const onSubmit = async (values: ResetValues) => {
    if (!token) return
    await mutation.mutateAsync({ ...values, token })
    navigate('/auth/login')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Nueva contraseña</p>
        <h2 className="mt-2 text-3xl font-semibold">Configura una contraseña segura</h2>
        <p className="text-sm text-white/70">
          El token proviene del enlace enviado por correo. Si ya expiró, solicita uno nuevo.
        </p>
      </div>

      <Input type="password" label="Contraseña" {...register('password')} error={errors.password?.message} />
      <Input
        type="password"
        label="Confirmar contraseña"
        {...register('password2')}
        error={errors.password2?.message}
      />

      <Button type="submit" fullWidth disabled={isSubmitting || mutation.isPending}>
        {isSubmitting || mutation.isPending ? 'Actualizando...' : 'Actualizar contraseña'}
      </Button>

      <div className="text-center text-sm">
        <Link to="/auth/login" className="text-primary hover:text-primary/80">
          Volver al inicio de sesión
        </Link>
      </div>
    </form>
  )
}

