import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { Spinner } from './ui/Spinner';

export function ProtectedRoute({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="login-screen">
        <Spinner size={32} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}`} replace />;

  return <>{children}</>;
}
