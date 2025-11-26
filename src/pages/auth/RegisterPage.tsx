import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/Button'

export const RegisterPage = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">Registro</p>
      <h2 className="text-3xl font-semibold leading-tight">Flujo de auto-registro</h2>
      <p className="text-sm text-white/70">
        Aquí vivirá el formulario público conectado a los endpoints de registro en 1 o 2 pasos. Por ahora solo mostramos un
        placeholder hasta implementar el módulo de autenticación completo.
      </p>
    </div>
    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-white/70">
      <p>
        <strong>Nota:</strong> Este formulario consumirá los endpoints:
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        <li>/auth/register/ → registro directo de cliente</li>
        <li>/auth/registro/ + /auth/verificar/ → flujo en dos pasos con verificación por correo</li>
      </ul>
      <p className="mt-3">
        Una vez implementado el módulo de Auth, este espacio contendrá validaciones con Zod y los formularios anidados que
        pide el backend.
      </p>
    </div>

    <Button asChild variant="ghost">
      <Link to="/auth/login" className="inline-flex items-center gap-2">
        <ArrowLeft size={18} />
        Volver a iniciar sesión
      </Link>
    </Button>
  </div>
)

