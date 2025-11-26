import { Link } from 'react-router-dom'
import { Filter } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { HistoryCard } from '@/components/histories/HistoryCard'
import { useHistoriesQuery } from '@/hooks/histories'
import { usePetsQuery } from '@/hooks/pets'
import { usePermissions } from '@/hooks/permissions'

export const HistoriesListPage = () => {
  const [query, setQuery] = useState('')
  const [selectedPet, setSelectedPet] = useState<string>('')
  const { hasRole } = usePermissions()

  const { data: histories, isLoading } = useHistoriesQuery({
    search: query || undefined,
    mascota: selectedPet ? Number(selectedPet) : undefined,
  })

  const petFilters = useMemo(() => ({ search: '', especie: null as number | null }), [])
  const { data: pets } = usePetsQuery(petFilters)

  // El backend ya filtra automáticamente por cliente, pero solo mostramos sus mascotas en el selector
  const clientPets = useMemo(() => {
    // Si es cliente, solo mostrar sus mascotas (el backend ya las filtra)
    // Si no es cliente, mostrar todas (para admin, veterinario, etc.)
    return pets || []
  }, [pets])

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Historias clínicas</p>
          <h1 className="text-3xl font-semibold">Seguimiento completo de pacientes</h1>
          <p className="text-sm text-white/70">
            {hasRole('cliente')
              ? 'Revisa el historial clínico completo de tus mascotas.'
              : 'Consulta, filtra y analiza la evolución de cada mascota en tu clínica.'}
          </p>
        </div>
        {!hasRole('cliente') && (
          <Button asChild>
            <Link to="/app/citas/nueva">Agendar nueva consulta</Link>
          </Button>
        )}
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <div className={`grid gap-4 ${hasRole('cliente') ? 'md:grid-cols-1' : 'md:grid-cols-3'}`}>
          <Input
            label="Buscar"
            placeholder={hasRole('cliente') ? 'Buscar en historias de tus mascotas...' : 'Mascota o propietario...'}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {!hasRole('cliente') && (
            <label className="space-y-2 text-sm text-white/80">
              <span>Mascota</span>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                <Filter size={16} className="text-white/60" />
                <select
                  className="w-full bg-transparent text-white focus:outline-none"
                  value={selectedPet}
                  onChange={(event) => setSelectedPet(event.target.value)}
                >
                  <option value="">Todas</option>
                  {clientPets?.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </label>
          )}
        </div>
      </section>

      <section>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" />
          </div>
        ) : histories && histories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {histories.map((history) => (
              <HistoryCard key={history.id} history={history} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-white/60">
            No encontramos historias clínicas con esos filtros.
          </div>
        )}
      </section>
    </div>
  )
}

