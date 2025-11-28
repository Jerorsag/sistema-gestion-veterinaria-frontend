import { useMemo, useState } from 'react'
import { Calendar } from 'lucide-react'
import clsx from 'clsx'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAvailabilityQuery } from '@/hooks/appointments'
import { buildClinicISOString } from '@/utils/datetime'

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
    <div className="space-y-4">
      <label className="space-y-2 text-sm text-[var(--color-text-heading)]">
        <span className="font-medium">Fecha</span>
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5">
          <Calendar size={16} className="text-gray-500" />
          <input
            type="date"
            className="w-full bg-transparent text-gray-900 focus:outline-none"
            min={dayjs().format('YYYY-MM-DD')}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </label>

      {isFetching ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-600">
          <Spinner size="sm" />
          Consultando disponibilidad...
        </div>
      ) : veterinarioId ? (
        <div className="space-y-5">
          {[
            { title: 'Jornada mañana', slots: MORNING_SLOTS },
            { title: 'Jornada tarde', slots: AFTERNOON_SLOTS },
          ].map((section) => (
            <div key={section.title} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                  {section.title}
                </span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {section.slots.map((slot) => {
                  const iso = buildClinicISOString(date, slot)
                  const isAvailable = availableSlots.has(slot)
                  const isActive = value === iso

                  return (
                    <Button
                      key={`${section.title}-${slot}`}
                      variant={isActive ? 'primary' : 'ghost'}
                      size="sm"
                      className={clsx(
                        'transition-all',
                        !isAvailable && 'border border-red-300 bg-red-50 text-red-600 line-through opacity-60 cursor-not-allowed',
                      )}
                      disabled={!isAvailable}
                      onClick={() => isAvailable && onChange(iso)}
                      type="button"
                    >
                      {slot}
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-600">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Disponible
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Ocupado
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
          <Calendar size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-600">Selecciona un veterinario para ver horarios disponibles</p>
        </div>
      )}
    </div>
  )
}
