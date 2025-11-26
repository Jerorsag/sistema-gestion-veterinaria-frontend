import { Link } from 'react-router-dom'
import { PawPrint, PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useSessionStore } from '@/core/store/session-store'
import { usePetsFilters, usePetsQuery, useSpeciesQuery } from '@/hooks/pets'
import { formatPetSex } from './components/PetForm'

export const PetsListPage = () => {
  const { filters, updateFilters } = usePetsFilters()
  const { data: species } = useSpeciesQuery()
  const { data: pets, isLoading } = usePetsQuery(filters)
  const userRoles = useSessionStore((state) => state.user?.roles ?? [])
  const canCreate = userRoles.includes('cliente')

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Mascotas</p>
          <h1 className="text-3xl font-semibold">Catálogo de mascotas registradas</h1>
          <p className="text-sm text-white/70">
            Filtra rápidamente por especie o nombre. Los clientes verán solo sus mascotas.
          </p>
        </div>
        {canCreate && (
          <Button startIcon={<PlusCircle size={18} />} asChild>
            <Link to="/app/mascotas/nueva">Registrar mascota</Link>
          </Button>
        )}
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Buscar"
            placeholder="Nombre de la mascota..."
            value={filters.search}
            onChange={(event) => updateFilters({ search: event.target.value })}
          />
          <label className="space-y-2 text-sm text-white/80">
            <span>Especie</span>
            <select
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-base text-white"
              value={filters.especie ?? ''}
              onChange={(event) => {
                const value = event.target.value
                updateFilters({ especie: value ? Number(value) : null })
              }}
            >
              <option value="">Todas</option>
              {species?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : pets && pets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pets.map((pet) => (
              <Card
                key={pet.id}
                className="flex flex-col gap-3 border-white/10 bg-white/5 p-5 backdrop-blur"
                header={
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-primary/20 p-2 text-primary">
                      <PawPrint size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{pet.nombre}</h3>
                      {pet.cliente && <p className="text-xs text-white/60">Propietario: {pet.cliente}</p>}
                    </div>
                  </div>
                }
                footer={
                  <Button asChild variant="ghost" fullWidth>
                    <Link to={`/app/mascotas/${pet.id}`}>Ver detalle</Link>
                  </Button>
                }
              >
                <dl className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <dt>Especie</dt>
                    <dd>{typeof pet.especie === 'string' ? pet.especie : pet.especie?.nombre ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Raza</dt>
                    <dd>{typeof pet.raza === 'string' ? pet.raza : pet.raza?.nombre ?? '—'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Sexo</dt>
                    <dd>{formatPetSex(pet.sexo)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Peso</dt>
                    <dd>{pet.peso ? `${pet.peso} kg` : '—'}</dd>
                  </div>
                </dl>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-12 text-center text-white/60">
            No hay mascotas registradas para los filtros seleccionados.
          </div>
        )}
      </section>
    </div>
  )
}

