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
import { UsersListPage } from '@/pages/users/UsersListPage'
import { UserDetailPage } from '@/pages/users/UserDetailPage'
import { UserCreatePage } from '@/pages/users/UserCreatePage'
import { PetsListPage } from '@/pages/pets/PetsListPage'
import { PetCreatePage } from '@/pages/pets/PetCreatePage'
import { PetDetailPage } from '@/pages/pets/PetDetailPage'
import { AppointmentsPage } from '@/pages/appointments/AppointmentsPage'
import { AppointmentCreatePage } from '@/pages/appointments/AppointmentCreatePage'
import { AppointmentDetailPage } from '@/pages/appointments/AppointmentDetailPage'
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
      { path: 'usuarios', element: <UsersListPage /> },
      { path: 'usuarios/nuevo', element: <UserCreatePage /> },
      { path: 'usuarios/:id', element: <UserDetailPage /> },
      { path: 'mascotas', element: <PetsListPage /> },
      { path: 'mascotas/nueva', element: <PetCreatePage /> },
      { path: 'mascotas/:id', element: <PetDetailPage /> },
      { path: 'citas', element: <AppointmentsPage /> },
      { path: 'citas/nueva', element: <AppointmentCreatePage /> },
      { path: 'citas/:id', element: <AppointmentDetailPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export const AppRouter = () => <RouterProvider router={router} />

