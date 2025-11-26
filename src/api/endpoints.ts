import { appConfig } from '@/core/config/app-config'

type EndpointBuilder = (path?: string) => string

const withBase =
  (path: string): EndpointBuilder =>
  (suffix = '') =>
    `${appConfig.apiUrl}${path}${suffix}`

export const endpoints = {
  auth: {
    login: withBase('/auth/login/'),
    refresh: withBase('/auth/refresh/'),
    logout: withBase('/auth/logout/'),
    verifyToken: withBase('/auth/verify/'),
    register: withBase('/auth/register/'),
    registerStepOne: withBase('/auth/registro/'),
    registerVerify: withBase('/auth/verificar/'),
    registerResend: withBase('/auth/reenviar-codigo/'),
    profile: withBase('/perfil/'),
    changePassword: withBase('/perfil/cambiar-password/'),
    resetPasswordRequest: withBase('/auth/reset-password/request/'),
    resetPasswordConfirm: withBase('/auth/reset-password/confirm/'),
  },
  users: {
    base: withBase('/usuarios/'),
    detail: (id: number | string) => withBase(`/usuarios/${id}/`)(),
    me: withBase('/usuarios/me/'),
    search: withBase('/usuarios/buscar/'),
    stats: withBase('/usuarios/estadisticas/'),
    activate: (id: number | string) => withBase(`/usuarios/${id}/activar/`)(),
    suspend: (id: number | string) => withBase(`/usuarios/${id}/suspender/`)(),
    changePassword: (id: number | string) => withBase(`/usuarios/${id}/cambiar_password/`)(),
  },
  roles: {
    base: withBase('/roles/'),
    users: (roleId: number | string) => withBase(`/roles/${roleId}/usuarios/`)(),
  },
  pets: {
    base: withBase('/mascotas/'),
    detail: (id: number | string) => withBase(`/mascotas/${id}/`)(),
  },
  appointments: {
    base: withBase('/citas/'),
    detail: (id: number | string) => withBase(`/citas/${id}/`)(),
    cancel: (id: number | string) => withBase(`/citas/${id}/cancelar/`)(),
    reschedule: (id: number | string) => withBase(`/citas/${id}/reagendar/`)(),
    availability: withBase('/citas/disponibilidad/'),
    services: withBase('/servicios/'),
  },
}

export type EndpointGroups = typeof endpoints

