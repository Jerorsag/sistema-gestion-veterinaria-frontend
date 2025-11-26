import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export const AuthLayout = () => (
  <div className="layout-auth min-h-screen bg-base px-4 py-10 text-[#2D2D2D]">
    <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
      <motion.section
        className="rounded-3xl border border-[var(--color-border)] bg-surface p-10 shadow-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-[var(--color-muted)]">SGV</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#2D2D2D]">
          Gestiona cada interacción veterinaria con una experiencia moderna.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-[var(--color-muted)]">
          Este panel conectará módulos administrativos, clínicos y operativos del backend Django. Inicia sesión
          para desbloquear las funciones del Sistema de Gestión Veterinaria.
        </p>

        <dl className="mt-10 grid gap-6 md:grid-cols-2">
          {[
            { label: 'Módulos conectados', value: '+8' },
            { label: 'Procesos automatizados', value: '20+' },
            { label: 'Alertas operativas', value: 'Tiempo real' },
            { label: 'Diseño', value: 'Responsive' },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">{item.label}</dt>
              <dd className="text-2xl font-semibold text-[#2D2D2D]">{item.value}</dd>
            </div>
          ))}
        </dl>
      </motion.section>

      <motion.section
        className="rounded-3xl border border-[var(--color-border)] bg-surface px-6 py-8 shadow-soft"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Outlet />
      </motion.section>
    </div>
  </div>
)

