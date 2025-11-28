import { CreditCard, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { usePaymentMethodsQuery } from '@/hooks/billing/usePayments'

export const PaymentMethodsConfigTab = () => {
  const { data: paymentMethods, isLoading } = usePaymentMethodsQuery()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-text-heading)]">Métodos de Pago</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Consulta los métodos de pago disponibles en el sistema (solo lectura)</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      ) : paymentMethods && paymentMethods.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <CreditCard size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[var(--color-text-heading)]">{method.nombre}</h3>
                  {method.codigo && (
                    <p className="text-sm text-[var(--color-text-muted)]">Código: {method.codigo}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-[var(--color-text-muted)]">
          <Wallet size={48} className="mx-auto mb-4 opacity-40" />
          <p>No hay métodos de pago registrados</p>
        </div>
      )}
    </div>
  )
}

