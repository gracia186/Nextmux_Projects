import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';

import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import AdminDashboard from './pages/admin/Dashboard';
import AdminAnalytiques from './pages/admin/Analytiques';
import AdminStagiaires from './pages/admin/Stagiaires';
import AdminMentors from './pages/admin/Mentors';
import AdminEntreprises from './pages/admin/Entreprises';
import AdminDepartements from './pages/admin/Departements';
import AdminUtilisateurs from './pages/admin/Utilisateurs';
import AdminParametres from './pages/admin/Parametres';
import AdminNotifications from './pages/admin/Notifications';
import AdminPublications from './pages/admin/Publications';
import AdminSoutenances from './pages/admin/Soutenances';
import AdminDemandes from './pages/admin/Demandes';

import MentorDashboard from './pages/mentor/Dashboard';
import MentorStagiaires from './pages/mentor/Stagiaires';
import MentorPresences from './pages/mentor/Presences';
import MentorProjets from './pages/mentor/Projets';
import MentorRapports from './pages/mentor/Rapports';
import MentorMessagerie from './pages/mentor/Messagerie';
import MentorDemandes from './pages/mentor/Demandes';
import MentorAvis from './pages/mentor/Avis';

import StagiaireDashboard from './pages/stagiaire/Dashboard';
import StagiairePresences from './pages/stagiaire/Presences';
import StagiaireProjets from './pages/stagiaire/Projets';
import StagiaireTaches from './pages/stagiaire/Taches';
import StagiaireRapports from './pages/stagiaire/Rapports';
import StagiaireDocuments from './pages/stagiaire/Documents';
import StagiaireMessagerie from './pages/stagiaire/Messagerie';
import StagiaireAvis from './pages/stagiaire/Avis';

import Profil from './pages/commun/Profil';
import Parametres from './pages/commun/Parametres';
import Annonces from './pages/commun/Annonces';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<RootRedirect />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="analytiques" element={<AdminAnalytiques />} />
          <Route path="stagiaires" element={<AdminStagiaires />} />
          <Route path="mentors" element={<AdminMentors />} />
          <Route path="departements" element={<AdminDepartements />} />
          <Route path="entreprises" element={<AdminEntreprises />} />
          <Route path="utilisateurs" element={<AdminUtilisateurs />} />
          <Route path="parametres" element={<AdminParametres />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="publications" element={<AdminPublications />} />
          <Route path="soutenances" element={<AdminSoutenances />} />
          <Route path="demandes-documents" element={<AdminDemandes />} />
          <Route path="profil" element={<Profil />} />
        </Route>

        <Route
          path="/mentor"
          element={
            <ProtectedRoute role="mentor">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MentorDashboard />} />
          <Route path="stagiaires" element={<MentorStagiaires />} />
          <Route path="presences" element={<MentorPresences />} />
          <Route path="projets" element={<MentorProjets />} />
          <Route path="rapports" element={<MentorRapports />} />
          <Route path="demandes-documents" element={<MentorDemandes />} />
          <Route path="avis" element={<MentorAvis />} />
          <Route path="annonces" element={<Annonces />} />
          <Route path="messagerie" element={<MentorMessagerie />} />
          <Route path="profil" element={<Profil />} />
          <Route path="parametres" element={<Parametres />} />
        </Route>

        <Route
          path="/stagiaire"
          element={
            <ProtectedRoute role="stagiaire">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StagiaireDashboard />} />
          <Route path="presences" element={<StagiairePresences />} />
          <Route path="projets" element={<StagiaireProjets />} />
          <Route path="taches" element={<StagiaireTaches />} />
          <Route path="rapports" element={<StagiaireRapports />} />
          <Route path="documents" element={<StagiaireDocuments />} />
          <Route path="avis" element={<StagiaireAvis />} />
          <Route path="annonces" element={<Annonces />} />
          <Route path="messagerie" element={<StagiaireMessagerie />} />
          <Route path="profil" element={<Profil />} />
          <Route path="parametres" element={<Parametres />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
