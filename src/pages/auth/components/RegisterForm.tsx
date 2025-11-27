import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { UserPlus, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useRegisterStepMutation } from '@/hooks/auth'

const registerSchema = z
  .object({
    nombre: z.string().min(2, 'Ingresa tu nombre'),
    apellido: z.string().min(2, 'Ingresa tu apellido'),
    username: z.string().min(4, 'Mínimo 4 caracteres'),
    email: z.string().email('Correo inválido'),
    telefono: z.string().optional(),
    direccion: z.string().optional(),
    password: z.string().min(6, 'Mínimo 6 caracteres'),
    password_confirm: z.string().min(6, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirm'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const navigate = useNavigate()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const mutation = useRegisterStepMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      username: '',
      email: '',
      telefono: '',
      direccion: '',
      password: '',
      password_confirm: '',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    await mutation.mutateAsync(values)
    navigate(`/auth/register/verify?email=${encodeURIComponent(values.email)}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">Crea tu cuenta</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Registro seguro en 2 pasos con verificación
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
              <User size={18} />
            </div>
            <Input
              className="pl-10"
              placeholder="Nombre"
              {...register('nombre')}
              error={errors.nombre?.message}
            />
          </div>
          <Input placeholder="Apellido" {...register('apellido')} error={errors.apellido?.message} />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
            <User size={18} />
          </div>
          <Input
            className="pl-10"
            placeholder="Nombre de usuario"
            {...register('username')}
            error={errors.username?.message}
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
            <Mail size={18} />
          </div>
          <Input
            type="email"
            className="pl-10"
            placeholder="Correo electrónico"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] transition-colors hover:opacity-70"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
            <Lock size={18} />
          </div>
          <Input
            type={showPasswordConfirm ? 'text' : 'password'}
            className="pl-10 pr-10"
            placeholder="Confirmar contraseña"
            {...register('password_confirm')}
            error={errors.password_confirm?.message}
          />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] transition-colors hover:opacity-70"
            aria-label={showPasswordConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {showAdvanced && (
          <>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
                <Phone size={18} />
              </div>
              <Input
                className="pl-10"
                placeholder="Teléfono (opcional)"
                {...register('telefono')}
                error={errors.telefono?.message}
              />
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)]">
                <MapPin size={18} />
              </div>
              <Input
                className="pl-10"
                placeholder="Dirección (opcional)"
                {...register('direccion')}
                error={errors.direccion?.message}
              />
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full text-left text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-secondary)] transition-colors"
        >
          {showAdvanced ? 'Ocultar' : 'Mostrar'} campos opcionales
        </button>
      </div>

      <Button type="submit" fullWidth disabled={isSubmitting || mutation.isPending} startIcon={<UserPlus size={18} />}>
        {isSubmitting || mutation.isPending ? 'Creando cuenta...' : 'Registrarse'}
      </Button>

      <p className="text-center text-xs text-[var(--color-text-tertiary)]">
        Al registrarte, recibirás un código de verificación en tu correo
      </p>
    </form>
  )
}

