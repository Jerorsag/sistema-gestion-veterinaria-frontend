import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'

import type { LoginPayload, RegisterSimplePayload, RegisterStepOnePayload, RegisterVerifyPayload } from '@/api/types/auth'
import { authService, passwordService, profileService } from '@/services/auth'
import { useSessionStore } from '@/core/store/session-store'

const getErrorMessage = (error: AxiosError<any>) => {
  if (error.response?.data) {
    const data = error.response.data as Record<string, unknown>
    if (typeof data.detail === 'string') return data.detail
    if (typeof data.message === 'string') return data.message
    if (Array.isArray(data.non_field_errors) && data.non_field_errors[0]) return String(data.non_field_errors[0])
  }
  return 'Ocurrió un error inesperado.'
}

export const useLoginMutation = () => {
  const setSession = useSessionStore((state) => state.setSession)

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: ({ user, access, refresh }) => {
      setSession({ user, accessToken: access, refreshToken: refresh })
      toast.success(`Bienvenido ${user.nombre_completo}`)
    },
    onError: (error: AxiosError) => {
      toast.error(getErrorMessage(error))
    },
  })
}

export const useLogoutMutation = () => {
  const refreshToken = useSessionStore((state) => state.refreshToken)
  const clearSession = useSessionStore((state) => state.clearSession)

  return useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    },
    onSettled: () => {
      clearSession()
    },
  })
}

export const useRegisterSimpleMutation = () =>
  useMutation({
    mutationFn: (payload: RegisterSimplePayload) => authService.registerSimple(payload),
    onSuccess: () => toast.success('Registro exitoso. Revisa tu correo para confirmar.'),
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })

export const useRegisterStepMutation = () =>
  useMutation({
    mutationFn: (payload: RegisterStepOnePayload) => authService.registerStepOne(payload),
    onSuccess: () => toast.success('Te enviamos un código de verificación. Revisa tu bandeja de entrada.'),
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })

export const useVerifyCodeMutation = () =>
  useMutation({
    mutationFn: (payload: RegisterVerifyPayload) => authService.verifyRegistrationCode(payload),
    onSuccess: () => toast.success('Cuenta verificada. Ya puedes iniciar sesión.'),
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })

export const useResendCodeMutation = () =>
  useMutation({
    mutationFn: (payload: { email: string }) => authService.resendVerificationCode(payload),
    onSuccess: () => toast.success('Nuevo código enviado.'),
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })

export const useRequestResetMutation = () =>
  useMutation({
    mutationFn: (payload: { email: string }) => passwordService.requestReset(payload),
    onSuccess: () => toast.success('Si el correo existe, enviamos un enlace de restablecimiento.'),
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })

export const useConfirmResetMutation = () =>
  useMutation({
    mutationFn: passwordService.confirmReset,
    onSuccess: () => toast.success('Contraseña actualizada correctamente.'),
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })

export const useProfileQuery = () => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)

  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: profileService.getProfile,
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
  })
}

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'profile'], data)
      toast.success('Perfil actualizado')
    },
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })
}

export const useChangePasswordMutation = () =>
  useMutation({
    mutationFn: passwordService.changePassword,
    onSuccess: () => toast.success('Contraseña actualizada'),
    onError: (error: AxiosError) => toast.error(getErrorMessage(error)),
  })

