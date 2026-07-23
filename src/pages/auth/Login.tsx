import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@stamux.local' },
  { role: 'Mentor', email: 'mentor@stamux.local' },
  { role: 'Stagiaire', email: 'stagiaire@stamux.local' },
];

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-screen">
      <motion.div
        className="glass glass-strong login-panel"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="login-brand">
          <div className="brand-mark" style={{ width: 44, height: 44, fontSize: 18 }}>S</div>
          <div className="brand-text">
            <strong style={{ fontSize: 18 }}>STAMUX</strong>
            <span>Internship OS</span>
          </div>
        </div>

        <h2 style={{ fontSize: 21, marginBottom: 6 }}>Bon retour 👋</h2>
        <p className="page-subtitle" style={{ marginBottom: 22 }}>
          Connectez-vous pour accéder à votre espace.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Adresse email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)' }} />
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@stamux.local"
                style={{ paddingLeft: 34 }}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)' }} />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: 34 }}
              />
            </div>
            <Link to="/mot-de-passe-oublie" style={{ fontSize: 12, color: 'var(--text-muted)', display: 'inline-block', marginTop: 8 }}>
              Mot de passe oublié ?
            </Link>
          </div>

          {error && (
            <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 14 }}>{error}</p>
          )}

          <Button type="submit" loading={submitting} icon={<LogIn size={15} />} style={{ width: '100%' }}>
            Se connecter
          </Button>
        </form>

        <p className="page-subtitle" style={{ marginTop: 18, marginBottom: 8 }}>Comptes de démonstration</p>
        <div className="role-pill-row">
          {DEMO_ACCOUNTS.map((acc) => (
            <button
              type="button"
              key={acc.role}
              className="role-pill ring-hover"
              onClick={() => {
                setEmail(acc.email);
                setPassword('password');
              }}
            >
              {acc.role}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
