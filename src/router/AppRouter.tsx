import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'

import { RequireAuth } from '@/core/auth/RequireAuth'
import { AuthLayout } from '@/layout/AuthLayout'
import { DashboardLayout } from '@/layout/DashboardLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { RegisterStepPage } from '@/pages/auth/RegisterStepPage'
import { RegisterVerifyPage } from '@/pages/auth/RegisterVerifyPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { DashboardHome } from '@/pages/dashboard/DashboardHome'
import { ProfilePage } from '@/pages/dashboard/ProfilePage'
import { LandingRedirect } from '@/pages/misc/LandingRedirect'
import { NotFoundPage } from '@/pages/misc/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingRedirect />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'register/step', element: <RegisterStepPage /> },
      { path: 'register/verify', element: <RegisterVerifyPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password/:token', element: <ResetPasswordPage /> },
    ],
  },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: 'perfil', element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export const AppRouter = () => <RouterProvider router={router} />

