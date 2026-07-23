import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import { Button } from '../../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Une erreur est survenue."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <motion.div className="glass glass-strong login-panel" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 style={{ marginBottom: 6 }}>Mot de passe oublié</h1>
        <p className="page-subtitle" style={{ marginBottom: 24 }}>
          Entrez votre email, nous vous enverrons un lien de réinitialisation.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ marginBottom: 20, fontSize: 13.5 }}>
              Si un compte existe avec <strong>{email}</strong>, un email vient de lui être envoyé.
            </p>
            <Link to="/login" className="btn btn-ghost btn-sm" style={{ display: 'inline-flex' }}>
              <ArrowLeft size={14} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-faint)' }} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: 36 }} />
              </div>
            </div>
            {error && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 14 }}>{error}</p>}
            <Button type="submit" loading={loading} style={{ width: '100%', marginBottom: 14 }}>
              Envoyer le lien
            </Button>
            <Link to="/login" style={{ fontSize: 12.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
              <ArrowLeft size={13} /> Retour à la connexion
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
