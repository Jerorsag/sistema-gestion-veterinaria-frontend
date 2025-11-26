import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export const AuthLayout = () => (
  <div className="layout-auth min-h-screen bg-gradient-to-b from-surface to-black px-4 py-10 text-white">
    <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[1.1fr_0.9fr]">
      <motion.section
        className="rounded-3xl border border-white/5 bg-white/5 p-10 backdrop-blur-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.5em] text-white/40">SGV</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">
          Gestiona cada interacción veterinaria con una experiencia moderna.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-white/70">
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
              <dt className="text-sm uppercase tracking-[0.3em] text-white/40">{item.label}</dt>
              <dd className="text-2xl font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      </motion.section>

      <motion.section
        className="rounded-3xl border border-white/10 bg-surface px-6 py-8 shadow-2xl shadow-black/40 backdrop-blur-3xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Outlet />
      </motion.section>
    </div>
  </div>
)

