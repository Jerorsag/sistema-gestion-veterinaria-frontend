import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export const AuthLayout = () => (
  <div className="layout-auth flex min-h-screen items-center justify-center bg-base px-4 py-6">
    <motion.div
      className="w-full max-w-7xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Outlet />
    </motion.div>
  </div>
)

