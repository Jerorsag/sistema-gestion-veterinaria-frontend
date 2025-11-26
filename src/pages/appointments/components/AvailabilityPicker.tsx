import { useState } from 'react'
import { Calendar } from 'lucide-react'
import dayjs from 'dayjs'

import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useAvailabilityQuery } from '@/hooks/appointments'

interface AvailabilityPickerProps {
  veterinarioId?: number | string
  value?: string
  onChange: (isoString: string) => void
}

export const AvailabilityPicker = ({ veterinarioId, value, onChange }: AvailabilityPickerProps) => {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const { data: slots, isFetching } = useAvailabilityQuery(veterinarioId, date)

  return (
    <div className="space-y-3">
      <label className="space-y-2 text-sm text-white/80">
        <span>Fecha</span>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
          <Calendar size={16} className="text-white/60" />
          <input
            type="date"
            className="w-full bg-transparent text-white focus:outline-none"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
      </label>

      {isFetching ? (
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Spinner size="sm" />
          Consultando disponibilidad...
        </div>
      ) : slots && slots.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {slots.map((slot) => {
            const iso = dayjs(`${date}T${slot}`).toISOString()
            const isActive = value === iso
            return (
              <Button
                key={slot}
                variant={isActive ? 'primary' : 'ghost'}
                className="border border-white/10"
                onClick={() => onChange(iso)}
              >
                {slot}
              </Button>
            )
          })}
        </div>
      ) : (
        <p className="text-sm text-white/70">Selecciona un veterinario y una fecha para ver horarios disponibles.</p>
      )}
    </div>
  )
}

