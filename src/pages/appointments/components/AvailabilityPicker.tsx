import { useMemo, useState } from 'react'
import { Calendar } from 'lucide-react'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAvailabilityQuery } from '@/hooks/appointments'
import { buildClinicISOString } from '@/utils/datetime' // <--- IMPORTANTE: La nueva utilidad

interface AvailabilityPickerProps {
  veterinarioId?: number | string
  value?: string
  onChange: (isoString: string) => void
}

const MORNING_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
const AFTERNOON_SLOTS = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']

export const AvailabilityPicker = ({ veterinarioId, value, onChange }: AvailabilityPickerProps) => {
  // Mantenemos la fecha seleccionada en formato simple YYYY-MM-DD
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const { data: slots, isFetching } = useAvailabilityQuery(veterinarioId, date)
  const availableSlots = useMemo(() => new Set(slots ?? []), [slots])

  return (
    <div className="space-y-3">
      <label className="space-y-2 text-sm text-primary">
        <span>Fecha</span>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border-subtle-color)] bg-[var(--color-surface-200)] px-3 py-2" style={{ borderWidth: 'var(--border-subtle-width)', borderStyle: 'var(--border-subtle-style)' }}>
          <Calendar size={16} className="text-tertiary" />
          <input
            type="date"
            className="w-full bg-transparent text-primary focus:outline-none"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </label>

      {isFetching ? (
        <div className="flex items-center gap-2 text-sm text-secondary">
          <Spinner size="sm" />
          Consultando disponibilidad...
        </div>
      ) : veterinarioId ? (
        <div className="space-y-4">
          {[
            { title: 'Jornada mañana', slots: MORNING_SLOTS },
            { title: 'Jornada tarde', slots: AFTERNOON_SLOTS },
          ].map((section) => (
            <div key={section.title} className="space-y-2">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-subtle">
                <span className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle-color)' }} />
                {section.title}
                <span className="h-px flex-1" style={{ backgroundColor: 'var(--border-subtle-color)' }} />
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {section.slots.map((slot) => {
                  // SSOT FIX: Construimos el ISO string manualmente con el offset fijo (-05:00)
                  // Esto garantiza que "08:00" sea "08:00 AM Colombia" y no "08:00 AM Browser Local Time"
                  const iso = buildClinicISOString(date, slot)
                  
                  // Verificamos disponibilidad
                  // Nota: El backend debe devolver los slots disponibles en formato 'HH:mm' o similar
                  // Si slots trae strings completos ISO, ajusta esta línea.
                  // Asumiendo que slots es array de horas ['08:00', '09:00']
                  const isAvailable = availableSlots.has(slot)
                  
                  // Comparamos el valor actual seleccionado
                  const isActive = value === iso

                  return (
                    <Button
                      key={`${section.title}-${slot}`}
                      variant={isActive ? 'primary' : 'ghost'}
                      className={clsx(
                        'border transition-all',
                        isAvailable
                          ? 'border-[var(--border-subtle-color)] hover:border-[var(--color-primary)]/50'
                          : 'border-red-300 bg-red-50 text-red-600 line-through opacity-60',
                      )}
                      style={{
                        borderWidth: isAvailable ? 'var(--border-subtle-width)' : '1px',
                        borderStyle: 'var(--border-subtle-style)',
                        boxShadow: isActive ? 'var(--shadow-soft)' : 'none',
                      }}
                      disabled={!isAvailable}
                      // Al hacer click, enviamos el ISO string ya formateado correctamente
                      onClick={() => isAvailable && onChange(iso)}
                      type="button" // Importante para no enviar formulario si está dentro de uno
                    >
                      {slot}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 text-xs text-secondary">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" /> Disponible
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" /> Ocupado
            </span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-secondary">Selecciona un veterinario y una fecha para ver horarios disponibles.</p>
      )}
    </div>
  )
}