import { useMemo } from 'react'
import type { Location } from 'react-router-dom'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { z } from 'zod'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useSessionStore } from '@/core/store/session-store'
import type { UserRole } from '@/core/types/auth'

const loginSchema = z.object({
  username: z.string().min(2, 'Ingresa un usuario válido'),
  password: z.string().min(4, 'La contraseña es requerida'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useSessionStore((state) => state.setSession)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const redirectPath = useMemo(() => {
    const state = location.state as { from?: Location }
    return state?.from?.pathname ?? '/app'
  }, [location.state])

  const onSubmit = async (values: LoginFormValues) => {
    const mockRoles: UserRole[] = ['administrador']
    const mockUser = {
      id: 0,
      username: values.username,
      email: `${values.username}@sgv.dev`,
      nombre_completo: 'Usuario Demo',
      roles: mockRoles,
    }

    setSession({
      user: mockUser,
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    })

    toast.success('Sesión local iniciada (modo base)')
    navigate(redirectPath, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Bienvenido</p>
        <h2 className="mt-2 text-3xl font-semibold">Inicia sesión</h2>
        <p className="mt-2 text-sm text-white/70">
          Este formulario aún no se conecta al backend. Usa la acción de &ldquo;sesión local&rdquo; para habilitar el dashboard
          durante la fase base.
        </p>
      </div>

      <Input label="Usuario" placeholder="correo@sgv.com" {...register('username')} error={errors.username?.message} />

      <Input
        type="password"
        label="Contraseña"
        placeholder="••••••••"
        {...register('password')}
        error={errors.password?.message}
      />

      <Button type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Ingresando...' : 'Iniciar sesión local'}
      </Button>

      <p className="text-center text-sm text-white/70">
        ¿No tienes cuenta?{' '}
        <Link to="/auth/register" className="font-semibold text-primary hover:text-primary/80">
          Regístrate
        </Link>
      </p>
    </form>
  )
}

