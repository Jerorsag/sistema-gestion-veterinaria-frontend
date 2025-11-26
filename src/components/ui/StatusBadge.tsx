import { Badge } from '@/components/ui/Badge'

interface StatusBadgeProps {
  status: 'activo' | 'inactivo' | 'suspendido'
}

const toneMap: Record<StatusBadgeProps['status'], 'success' | 'info' | 'warning'> = {
  activo: 'success',
  inactivo: 'info',
  suspendido: 'warning',
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge tone={toneMap[status]} className="capitalize">
    {status}
  </Badge>
)

