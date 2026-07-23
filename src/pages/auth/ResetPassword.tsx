import { useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2 } from 'lucide-react';
import { authApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import { Button } from '../../components/ui/Button';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';

  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword({ token, email, password, password_confirmation: confirmation });
      setDone(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(apiErrorMessage(err, 'Lien invalide ou expiré.'));
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="login-screen">
        <motion.div className="glass glass-strong login-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p style={{ marginBottom: 16 }}>Ce lien est invalide ou incomplet.</p>
          <Link to="/mot-de-passe-oublie" className="btn btn-primary btn-sm">Demander un nouveau lien</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <motion.div className="glass glass-strong login-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ marginBottom: 6 }}>Définir votre mot de passe</h1>
        <p className="page-subtitle" style={{ marginBottom: 24 }}>Pour le compte <strong>{email}</strong></p>

        {done ? (
          <div style={{ textAlign: 'center', color: 'var(--success)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={30} />
            <p style={{ fontSize: 13.5, color: 'var(--text)' }}>Mot de passe défini ! Redirection vers la connexion…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Nouveau mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)' }} />
                <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>
            <div className="field">
              <label>Confirmer le mot de passe</label>
              <input type="password" required value={confirmation} onChange={(e) => setConfirmation(e.target.value)} />
            </div>
            {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 14 }}>{error}</p>}
            <Button type="submit" loading={loading} style={{ width: '100%' }}>Définir le mot de passe</Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
