export type UserRole = 'administrador' | 'veterinario' | 'practicante' | 'recepcionista' | 'cliente'

export interface SessionUser {
  id: number
  username: string
  email: string
  nombre_completo: string
  roles: UserRole[]
}

