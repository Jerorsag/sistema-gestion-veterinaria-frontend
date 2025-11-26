import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, PlusCircle, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useUsersFilters, useUsersQuery, useUserStatsQuery } from '@/hooks/users'

const estados = [
  { label: 'Todos', value: 'todos' },
  { label: 'Activos', value: 'activo' },
  { label: 'Inactivos', value: 'inactivo' },
  { label: 'Suspendidos', value: 'suspendido' },
]

export const UsersListPage = () => {
  const { filters, updateFilters } = useUsersFilters()
  const [searchValue, setSearchValue] = useState(filters.search ?? '')
  const debouncedSearch = useDebouncedValue(searchValue, 500)

  const queryFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch],
  )

  const { data, isLoading, isFetching } = useUsersQuery(queryFilters)
  const { data: stats } = useUserStatsQuery()

  const handleEstadoChange = (estado: string) => {
    updateFilters({ estado: estado as any, page: 1 })
  }

  const handlePageChange = (page: number) => {
    updateFilters({ page })
  }

  const pageSize = data?.results.length || 1
  const totalPages = data ? Math.max(1, Math.ceil(data.count / pageSize)) : 1

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Usuarios</p>
          <h1 className="text-3xl font-semibold">Gestión de usuarios del SGV</h1>
          <p className="text-sm text-white/70">CRUD completo alineado al backend (roles, estados y perfiles).</p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => updateFilters({})} startIcon={<RefreshCw size={16} />}>
            Refrescar
          </Button>
          <Button asChild startIcon={<PlusCircle size={18} />}>
            <Link to="/app/usuarios/nuevo">Nuevo usuario</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Card header={<p className="text-xs uppercase tracking-[0.3em] text-white/50">Total</p>}>
          <p className="text-3xl font-semibold">{stats?.total_usuarios ?? '--'}</p>
        </Card>
        <Card header={<p className="text-xs uppercase tracking-[0.3em] text-white/50">Activos</p>}>
          <p className="text-3xl font-semibold">{stats?.usuarios_activos ?? '--'}</p>
        </Card>
        <Card header={<p className="text-xs uppercase tracking-[0.3em] text-white/50">Roles</p>}>
          <div className="space-y-1 text-sm text-white/70">
            {stats?.usuarios_por_rol
              ? Object.entries(stats.usuarios_por_rol).map(([rol, total]) => (
                  <div key={rol} className="flex items-center justify-between">
                    <span className="capitalize">{rol}</span>
                    <span>{total}</span>
                  </div>
                ))
              : '---'}
          </div>
        </Card>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
          <Input
            label="Buscar"
            placeholder="Nombre, email, usuario..."
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value)
              updateFilters({ search: event.target.value, page: 1 })
            }}
          />
          <label className="space-y-2 text-sm text-white/80">
            <span>Estado</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
              value={filters.estado ?? 'todos'}
              onChange={(event) => handleEstadoChange(event.target.value)}
            >
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-white/80">
            <span>Orden</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
              value={filters.ordering ?? '-created_at'}
              onChange={(event) => updateFilters({ ordering: event.target.value })}
            >
              <option value="-created_at">Más recientes</option>
              <option value="created_at">Más antiguos</option>
              <option value="nombre">Nombre A-Z</option>
              <option value="-nombre">Nombre Z-A</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead>
                  <tr className="text-sm uppercase tracking-wide text-white/50">
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Correo</th>
                    <th className="px-4 py-3">Roles</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.results.map((usuario) => (
                    <tr key={usuario.id} className="text-sm text-white/80 hover:bg-white/5">
                      <td className="px-4 py-3">
                        <div className="font-semibold">{usuario.nombre_completo}</div>
                        <p className="text-xs text-white/50">@{usuario.username}</p>
                      </td>
                      <td className="px-4 py-3">{usuario.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1 text-xs text-white/70">
                          {usuario.roles.map((rol) => (
                            <span key={rol} className="rounded-full bg-white/10 px-2 py-0.5 capitalize">
                              {rol}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={usuario.estado} />
                      </td>
                      <td className="px-4 py-3">
                        <Button asChild variant="ghost" startIcon={<ChevronRight size={16} />}>
                          <Link to={`/app/usuarios/${usuario.id}`}>Ver detalle</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data && data.results.length === 0 && (
              <p className="py-6 text-center text-white/60">No encontramos usuarios con los filtros seleccionados.</p>
            )}

            {data && data.results.length > 0 && (
              <div className="mt-4 flex items-center justify-between text-sm text-white/70">
                <span>
                  Página {filters.page ?? 1} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    disabled={(filters.page ?? 1) <= 1}
                    onClick={() => handlePageChange((filters.page ?? 1) - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="ghost"
                    disabled={(filters.page ?? 1) >= totalPages}
                    onClick={() => handlePageChange((filters.page ?? 1) + 1)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
      {isFetching && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Spinner size="sm" />
          <span>Actualizando...</span>
        </div>
      )}
    </div>
  )
}

