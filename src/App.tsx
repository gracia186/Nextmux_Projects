import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../src/lib/queryClient'
import { ToastContainer } from '../src/components/ui/ToastContainer'
import { ProtectedRoute, GuestRoute } from '../src/routes/ProtectedRoute'
import { RootRedirect } from '../src/routes/RootRedirect'
import { AppLayout } from '../src/layouts/AppLayout'
import { useAuthStore } from '../src/store/authStore'

import LoginPage from '../src/features/auth/pages/LoginPage'
import ForgotPasswordPage from '../src/features/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from '../src/features/auth/pages/ResetPasswordPage'
import AcceptInvitationPage from '../src/features/auth/pages/AcceptInvitationPage'

import AdminDashboardPage from '../src/features/stats/pages/AdminDashboardPage'
import MentorDashboardPage from '../src/features/stats/pages/MentorDashboardPage'
import InternDashboardPage from '../src/features/stats/pages/InternDashboardPage'
import StatsPage from '../src/features/stats/pages/StatsPage'

import UsersListPage from '../src/features/users/pages/UsersListPage'
import UserDetailPage from '../src/features/users/pages/UserDetailPage'

import AttendanceDashboardPage from '../src/features/attendance/pages/AttendanceDashboardPage'
import InternAttendancePage from '../src/features/attendance/pages/InternAttendancePage'

import ReportsListPage from '../src/features/reports/pages/ReportsListPage'
import ProjectsListPage from '../src/features/projects/pages/ProjectsListPage'
import ProjectDetailPage from '../src/features/projects/pages/ProjectDetailPage'
import DocumentsPage from '../src/features/documents/pages/DocumentsPage'
import EventsListPage from '../src/features/events/pages/EventsListPage'
import FeedbackPage from '../src/features/feedback/pages/FeedbackPage'
import ProfilePage from '../src/features/profile/pages/ProfilePage'
import NotFoundPage from '../src/pages/NotFoundPage'

function RoleSplitAttendance() {
  const role = useAuthStore((s) => s.user?.role)
  return role === 'intern' ? <InternAttendancePage /> : <AttendanceDashboardPage />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public / guest-only routes */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
          <Route path="/invitation/:token" element={<GuestRoute><AcceptInvitationPage /></GuestRoute>} />

          {/* Authenticated app shell */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<RootRedirect />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <UsersListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute roles={['admin']}>
                  <UserDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stats"
              element={
                <ProtectedRoute roles={['admin']}>
                  <StatsPage />
                </ProtectedRoute>
              }
            />
            

            <Route
              path="/mentor"
              element={
                <ProtectedRoute roles={['mentor']}>
                  <MentorDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/intern"
              element={
                <ProtectedRoute roles={['intern']}>
                  <InternDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute roles={['intern']}>
                  <FeedbackPage />
                </ProtectedRoute>
              }
            />

            {/* Shared across roles, content adapts internally */}
            <Route path="/attendance" element={<RoleSplitAttendance />} />
            <Route path="/reports" element={<ReportsListPage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/events" element={<EventsListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </QueryClientProvider>
  )
}
