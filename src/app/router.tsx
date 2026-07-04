import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';

import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { MentorLayout } from '@/shared/components/layout/MentorLayout';
import { StagiaireLayout } from '@/shared/components/layout/StagiaireLayout';

import { LoginPage } from '@/pages/auth/LoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { MentorDashboardPage } from '@/pages/mentor/MentorDashboardPage';
import { StagiaireDashboardPage } from '@/pages/stagiaire/StagiaireDashboardPage';
// page liée au dashboard admin
import { AdminStagiairesPage } from '@/pages/admin/AdminStagiairesPage';
import { AdminMentorsPage } from '@/pages/admin/AdminMentorsPage';
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage';
// page liée au dashboard stagiaire
import { StagiaireRapportsPage } from '@/pages/stagiaire/StagiaireRapportPage';
import { StagiairePresencePage } from '@/pages/stagiaire/StagiairePresencePage';
import { DemandesPage } from '@/pages/stagiaire/DemandesPages';



// page liée au dashboard mentor
import { MentorStagiairePage } from '@/pages/mentor/MentorStagiairePage';
import { MentorRapportPage } from '@/pages/mentor/MentorRapportPage';
export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          {/* on ajoutera /admin/users, /admin/stagiaires... ici plus tard */}
          <Route path="stagiaires" element={<AdminStagiairesPage />} />
          <Route path="Mentors" element={<AdminMentorsPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MentorDashboardPage />} />
          <Route path="stagiaires" element={<MentorStagiairePage />} />
            <Route path="rapports" element={<MentorRapportPage />} />
          </Route>

        <Route
          path="/stagiaire"
          element={
            <ProtectedRoute allowedRoles={['stagiaire']}>
              <StagiaireLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StagiaireDashboardPage />} />
          <Route path="rapports" element={<StagiaireRapportsPage />} />
          <Route path="presences" element={<StagiairePresencePage />} />
          <Route path="demandes" element={<DemandesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />

        
      </Routes>
    </BrowserRouter>
  );
}