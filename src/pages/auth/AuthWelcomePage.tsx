import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserPlus, Heart, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'

import { LoginForm } from './components/LoginForm'
import { RegisterForm } from './components/RegisterForm'

type ViewMode = 'welcome' | 'login' | 'register'

export const AuthWelcomePage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('welcome')
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null)

  // En móvil, usar toggle directo sin hover
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="auth-welcome-container relative h-[calc(100vh-4rem)] w-full overflow-hidden rounded-[var(--radius-card)] bg-surface" style={{ boxShadow: 'var(--shadow-card)' }}>
      {/* Modo móvil con toggle */}
      {isMobile ? (
        <div className="h-full space-y-6 p-6">
          {/* Toggle Switch para móvil */}
          <div className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-surface-200)] p-1" style={{ boxShadow: 'var(--shadow-soft)' }}>
            <button
              onClick={() => setViewMode('login')}
              className={clsx(
                'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300',
                viewMode === 'login'
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-text-secondary)]',
              )}
              style={viewMode === 'login' ? { boxShadow: 'var(--shadow-primary)' } : {}}
            >
              <LogIn size={18} />
              <span>Iniciar sesión</span>
            </button>
            <button
              onClick={() => setViewMode('register')}
              className={clsx(
                'flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300',
                viewMode === 'register'
                  ? 'bg-[var(--color-secondary)] text-white'
                  : 'text-[var(--color-text-secondary)]',
              )}
              style={viewMode === 'register' ? { boxShadow: 'var(--shadow-orange)' } : {}}
            >
              <UserPlus size={18} />
              <span>Registrarse</span>
            </button>
          </div>

          {/* Formulario según modo */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {viewMode === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <LoginForm />
                </motion.div>
              )}
              {viewMode === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <RegisterForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Modo desktop con hover reveal - Pantalla completa */
        <div className="relative grid h-full grid-cols-2 gap-0 overflow-hidden">
          {/* Panel izquierdo - Login - Colores morados */}
          <motion.div
            className="group relative flex h-full flex-col items-center justify-center overflow-hidden p-8 text-center"
            onMouseEnter={() => setHoveredSide('left')}
            onMouseLeave={() => setHoveredSide(null)}
            style={{
              background: hoveredSide === 'left' 
                ? 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-accent-lavender-light) 100%)'
                : 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-accent-lavender-light) 100%)',
            }}
          >
            <AnimatePresence mode="wait">
              {hoveredSide === 'left' ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full max-w-md"
                >
                  <LoginForm />
                </motion.div>
              ) : (
                <motion.div
                  key="login-welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="space-y-6"
                >
                  <motion.div 
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)]/20"
                    animate={{ scale: hoveredSide === null ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <LogIn size={40} className="text-[var(--color-primary)]" />
                  </motion.div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">¡Bienvenido de nuevo!</h3>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                      Ya tienes cuenta, inicia sesión
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-[var(--color-text-tertiary)]">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                      <span>Acceso rápido y seguro</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                      <span>Gestiona tus mascotas</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Divisor central con icono */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full bg-surface transition-all"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <Heart size={24} className="text-[var(--color-secondary)]" />
            </div>
          </div>

          {/* Panel derecho - Registro - Colores naranjas */}
          <motion.div
            className="group relative flex h-full flex-col items-center justify-center overflow-hidden p-8 text-center"
            onMouseEnter={() => setHoveredSide('right')}
            onMouseLeave={() => setHoveredSide(null)}
            style={{
              background: hoveredSide === 'right'
                ? 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-accent-peach) 100%)'
                : 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-200) 100%)',
            }}
          >
            <AnimatePresence mode="wait">
              {hoveredSide === 'right' ? (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="w-full max-w-md"
                >
                  <RegisterForm />
                </motion.div>
              ) : (
                <motion.div
                  key="register-welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="space-y-6"
                >
                  <motion.div 
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-secondary)]/20"
                    animate={{ scale: hoveredSide === null ? [1, 1.05, 1] : 1 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  >
                    <UserPlus size={40} className="text-[var(--color-secondary)]" />
                  </motion.div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-[var(--color-text-heading)]">¡Únete a nosotros!</h3>
                    <p className="text-lg text-[var(--color-text-secondary)]">
                      No tienes cuenta, regístrate
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-[var(--color-text-tertiary)]">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-[var(--color-secondary)]" />
                      <span>Registro en 2 pasos</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-[var(--color-secondary)]" />
                      <span>Verificación por correo</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} className="text-[var(--color-secondary)]" />
                      <span>Comienza ahora</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  )
}
