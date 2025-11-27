import { useState, useMemo } from 'react'
import type { Location } from 'react-router-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LogIn, Lock, User, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useLoginMutation } from '@/hooks/auth'

const loginSchema = z.object({
  username: z.string().min(2, 'Ingresa un usuario válido'),
  password: z.string().min(4, 'La contraseña es requerida'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const loginMutation = useLoginMutation()
  const [showPassword, setShowPassword] = useState(false)

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
    await loginMutation.mutateAsync(values)
    navigate(redirectPath, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">Inicia sesión</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Ingresa tus credenciales para acceder
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]">
            <User size={18} />
          </div>
          <Input
            className="pl-10"
            placeholder="Usuario o correo"
            {...register('username')}
            error={errors.username?.message}
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)]">
            <Lock size={18} />
          </div>
          <Input
            type={showPassword ? 'text' : 'password'}
            className="pl-10 pr-10"
            placeholder="Contraseña"
            {...register('password')}
            error={errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-primary)] transition-colors hover:opacity-70"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <Button type="submit" fullWidth disabled={isSubmitting} startIcon={<LogIn size={18} />}>
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>

      <p className="text-center text-sm">
        <a
          href="/auth/forgot-password"
          className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary)]"
        >
          ¿Olvidaste tu contraseña?
        </a>
      </p>
    </form>
  )
}

