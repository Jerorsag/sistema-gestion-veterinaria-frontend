import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Calendar, Filter } from 'lucide-react'

import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useConsultationsQuery } from '@/hooks/consultations'
import { usePetsQuery } from '@/hooks/pets'
import { formatDateTime } from '@/utils/datetime'

export const ConsultationsListPage = () => {
  const [query, setQuery] = useState('')
  const [petFilter, setPetFilter] = useState<string>('')

  const filters = useMemo(() => ({ search: '', especie: null as number | null }), [])
  const { data: pets } = usePetsQuery(filters)

  const { data: consultations, isLoading } = useConsultationsQuery({
    search: query || undefined,
    mascota: petFilter ? Number(petFilter) : undefined,
  })

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Consultas</p>
          <h1 className="text-3xl font-semibold">Historial clínico activo</h1>
          <p className="text-sm text-white/70">Revisa y gestiona las consultas recientes de cada paciente.</p>
        </div>
        <Button asChild>
          <Link to="/app/consultas/nueva">Nueva consulta</Link>
        </Button>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Buscar" placeholder="Mascota, diagnóstico..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <label className="space-y-2 text-sm text-white/80">
            <span>Mascota</span>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              <Filter size={16} className="text-white/60" />
              <select
                className="w-full bg-transparent text-white focus:outline-none"
                value={petFilter}
                onChange={(event) => setPetFilter(event.target.value)}
              >
                <option value="">Todas</option>
                {pets?.map((pet) => (
                  <option key={pet.id} value={pet.id}>
                    {pet.nombre}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </section>

      <section>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : consultations && consultations.length > 0 ? (
          <div className="space-y-3">
            {consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/40">Consulta #{consultation.id}</p>
                  <h3 className="text-lg font-semibold text-white">{consultation.mascota_nombre}</h3>
                  <p className="text-sm text-white/60">{consultation.veterinario_nombre}</p>
                  <div className="mt-2 flex gap-4 text-xs text-white/60">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} />
                      {formatDateTime(consultation.fecha_consulta)}
                    </span>
                    <span>{consultation.diagnostico}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/70">
                    {consultation.estado_vacunacion}
                  </span>
                  <Button asChild variant="ghost">
                    <Link to={`/app/consultas/${consultation.id}`}>Ver detalle</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-white/60">
            No hay consultas con esos filtros.
          </div>
        )}
      </section>
    </div>
  )
}

