import { Link } from 'react-router-dom'
import { CalendarDays, ClipboardList, NotebookTabs, PawPrint, Users, PlusCircle } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useSessionStore } from '@/core/store/session-store'
import { usePermissions } from '@/hooks/permissions'
import { usePetsQuery } from '@/hooks/pets'
import { useAppointmentsQuery } from '@/hooks/appointments'
import { useConsultationsQuery } from '@/hooks/consultations'
import { useUsersQuery } from '@/hooks/users'
import type { UserListResponse } from '@/api/types/users'

export const DashboardHome = () => {
  const user = useSessionStore((state) => state.user)
  const { userRoles, isAdmin, navigationItems } = usePermissions()

  // Queries para datos según el rol
  const { data: pets, isLoading: petsLoading } = usePetsQuery({ search: '', especie: null })
  const { data: appointments, isLoading: appointmentsLoading } = useAppointmentsQuery()
  const { data: consultations, isLoading: consultationsLoading } = useConsultationsQuery({})
  const { data: usersData, isLoading: usersLoading } = useUsersQuery({})

  // Normalizar datos de usuarios
  const users = Array.isArray(usersData) ? usersData : (usersData as UserListResponse)?.results ?? []

  // Determinar el rol principal del usuario (prioridad: admin > veterinario > recepcionista > practicante > cliente)
  const primaryRole = isAdmin
    ? 'administrador'
    : userRoles.includes('veterinario')
      ? 'veterinario'
      : userRoles.includes('recepcionista')
        ? 'recepcionista'
        : userRoles.includes('practicante')
          ? 'practicante'
          : userRoles.includes('cliente')
            ? 'cliente'
            : 'usuario'

  const roleLabels: Record<string, string> = {
    administrador: 'Administrador',
    veterinario: 'Veterinario',
    recepcionista: 'Recepcionista',
    practicante: 'Practicante',
    cliente: 'Cliente',
    usuario: 'Usuario',
  }

  // Calcular estadísticas según el rol
  const stats = []
  
  if (isAdmin) {
    stats.push(
      {
        label: 'Usuarios activos',
        value: users ? String(users.length) : '—',
        icon: Users,
        href: '/app/usuarios',
        isLoading: usersLoading,
      },
      {
        label: 'Mascotas registradas',
        value: pets ? String(pets.length) : '—',
        icon: PawPrint,
        href: '/app/mascotas',
        isLoading: petsLoading,
      },
      {
        label: 'Citas agendadas',
        value: appointments ? String(appointments.length) : '—',
        icon: CalendarDays,
        href: '/app/citas',
        isLoading: appointmentsLoading,
      },
      {
        label: 'Consultas realizadas',
        value: consultations ? String(consultations.length) : '—',
        icon: ClipboardList,
        href: '/app/consultas',
        isLoading: consultationsLoading,
      },
    )
  } else if (userRoles.includes('cliente')) {
    // Estadísticas para cliente
    stats.push(
      {
        label: 'Mis mascotas',
        value: pets ? String(pets.length) : '—',
        icon: PawPrint,
        href: '/app/mascotas',
        isLoading: petsLoading,
      },
      {
        label: 'Mis citas',
        value: appointments ? String(appointments.length) : '—',
        icon: CalendarDays,
        href: '/app/citas',
        isLoading: appointmentsLoading,
      },
      {
        label: 'Mis consultas',
        value: consultations ? String(consultations.length) : '—',
        icon: ClipboardList,
        href: '/app/consultas',
        isLoading: consultationsLoading,
      },
      {
        label: 'Historias clínicas',
        value: '—',
        icon: NotebookTabs,
        href: '/app/historias',
        isLoading: false,
      },
    )
  } else {
    // Estadísticas para veterinario, recepcionista, practicante
    stats.push(
      {
        label: 'Mascotas',
        value: pets ? String(pets.length) : '—',
        icon: PawPrint,
        href: '/app/mascotas',
        isLoading: petsLoading,
      },
      {
        label: 'Citas del día',
        value: appointments ? String(appointments.length) : '—',
        icon: CalendarDays,
        href: '/app/citas',
        isLoading: appointmentsLoading,
      },
      {
        label: 'Consultas pendientes',
        value: consultations ? String(consultations.length) : '—',
        icon: ClipboardList,
        href: '/app/consultas',
        isLoading: consultationsLoading,
      },
      {
        label: 'Historias clínicas',
        value: '—',
        icon: NotebookTabs,
        href: '/app/historias',
        isLoading: false,
      },
    )
  }

  // Accesos rápidos según el rol
  const quickActions = navigationItems
    .filter((item) => item.href !== '/app') // Excluir inicio
    .slice(0, 6) // Máximo 6 accesos rápidos

  return (
    <div className="space-y-10">
      {/* Bienvenida personalizada */}
      <div>
        <h1 className="text-3xl font-semibold">
          Bienvenido, {user?.nombre_completo || 'Usuario'}
        </h1>
        <p className="mt-2 text-sm text-secondary">
          Panel de {roleLabels[primaryRole]} • {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, isLoading }) => (
          <Link key={label} to={href}>
              <Card
              className="px-5 py-6 transition-all hover:scale-105 cursor-pointer"
              header={
                <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-subtle">
                  <span>{label}</span>
                  <Icon className="text-tertiary" size={18} />
                </div>
              }
            >
              <div className="flex items-baseline justify-between">
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  <p className="text-4xl font-semibold text-heading">{value}</p>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <Card
        header={
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-subtle">Acceso rápido</p>
            <h3 className="mt-2 text-xl font-semibold">Navega rápidamente</h3>
          </div>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} to={item.href}>
                <div className="group flex items-center gap-3 rounded-xl bg-surface px-4 py-3 transition-all hover:bg-[var(--color-surface-200)] cursor-pointer" style={{ boxShadow: 'var(--shadow-card)' }}>
                  <div className="rounded-lg bg-[var(--color-primary)]/20 p-2 text-[var(--color-primary)] transition-transform group-hover:scale-110">
                    <Icon size={20} />
                  </div>
                  <span className="font-medium text-secondary group-hover:text-primary">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </Card>

      {/* Información específica del rol */}
      {userRoles.includes('cliente') && (
        <Card
          header={
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-subtle">Información</p>
              <h3 className="mt-2 text-xl font-semibold">Tu información</h3>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
                  <PawPrint size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-heading">Mascotas registradas</p>
                  <p className="text-xs text-secondary">
                    {petsLoading ? 'Cargando...' : pets && pets.length > 0 ? `${pets.length} mascota${pets.length !== 1 ? 's' : ''}` : 'No tienes mascotas registradas'}
                  </p>
                </div>
              </div>
              <Button asChild variant="ghost">
                <Link to="/app/mascotas/nueva">
                  <PlusCircle size={16} className="mr-2" />
                  Registrar
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-heading">Próximas citas</p>
                  <p className="text-xs text-secondary">
                    {appointmentsLoading ? 'Cargando...' : appointments && appointments.length > 0 ? `${appointments.length} cita${appointments.length !== 1 ? 's' : ''} agendada${appointments.length !== 1 ? 's' : ''}` : 'No tienes citas agendadas'}
                  </p>
                </div>
              </div>
              <Button asChild variant="ghost">
                <Link to="/app/citas/nueva">
                  <PlusCircle size={16} className="mr-2" />
                  Agendar
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isAdmin && (
        <Card
          header={
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-subtle">Panel administrativo</p>
              <h3 className="mt-2 text-xl font-semibold">Gestiona el sistema</h3>
            </div>
          }
        >
          <p className="text-sm text-secondary">
            Como administrador, tienes acceso completo a todos los módulos del sistema. Usa el menú lateral para navegar entre
            usuarios, mascotas, citas, consultas, historias clínicas, inventario y facturación.
          </p>
        </Card>
      )}
    </div>
  )
}
