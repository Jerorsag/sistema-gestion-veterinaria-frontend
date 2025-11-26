import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { KardexMovementForm } from './components/KardexMovementForm'
import { useKardexCreateMutation } from '@/hooks/inventory'

export const KardexMovementCreatePage = () => {
  const navigate = useNavigate()
  const createMutation = useKardexCreateMutation()

  const handleSubmit = async (data: Parameters<typeof createMutation.mutateAsync>[0]) => {
    await createMutation.mutateAsync(data, {
      onSuccess: () => {
        navigate('/app/inventario')
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Inventario</p>
          <h1 className="text-3xl font-semibold">Registrar movimiento</h1>
          <p className="text-sm text-white/70">Registra una entrada o salida de inventario manualmente.</p>
        </div>
        <Button variant="ghost" startIcon={<ArrowLeft size={16} />} onClick={() => navigate('/app/inventario')}>
          Volver
        </Button>
      </div>

      <KardexMovementForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
    </div>
  )
}

