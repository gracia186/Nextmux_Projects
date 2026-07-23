import { useEffect, useState } from 'react';
import { Sun, Moon, Bell, FileLock2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

interface Parametre { cle: string; valeur: string | null }

export default function StagiaireParametres() {
  useDashboardHeader('Paramètres', 'Apparence, notifications et confidentialité');
  const { theme, toggleTheme } = useTheme();
  const [confidentialite, setConfidentialite] = useState<Parametre[] | null>(null);
  const [notifPresence, setNotifPresence] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);

  useEffect(() => {
    api.get('/stagiaire/dashboard').catch(() => null); // garde le token frais
    fetchConfidentialite();
    setNotifPresence(localStorage.getItem('stamux_notif_presence') !== 'false');
    setNotifMessages(localStorage.getItem('stamux_notif_messages') !== 'false');
  }, []);

  async function fetchConfidentialite() {
    try {
      // Les paramètres de confidentialité sont publics en lecture pour tous les rôles côté contenu,
      // mais l'endpoint est réservé admin : on utilise donc un texte de repli si l'accès est refusé.
      const res = await api.get('/admin/parametres');
      setConfidentialite(res.data.confidentialite ?? []);
    } catch {
      setConfidentialite([]);
    }
  }

  function toggleNotif(key: 'presence' | 'messages', value: boolean) {
    if (key === 'presence') {
      setNotifPresence(value);
      localStorage.setItem('stamux_notif_presence', String(value));
    } else {
      setNotifMessages(value);
      localStorage.setItem('stamux_notif_messages', String(value));
    }
  }

  return (
    <div>
      <Card className="card" index={0} style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />} Apparence
        </h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Choisissez le thème de l'interface.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" className={`role-pill ring-hover${theme === 'dark' ? ' is-active' : ''}`} onClick={() => theme !== 'dark' && toggleTheme()}>
            <Moon size={13} style={{ marginRight: 6 }} /> Sombre
          </button>
          <button type="button" className={`role-pill ring-hover${theme === 'light' ? ' is-active' : ''}`} onClick={() => theme !== 'light' && toggleTheme()}>
            <Sun size={13} style={{ marginRight: 6 }} /> Clair
          </button>
        </div>
      </Card>

      <Card className="card" index={1} style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Bell size={16} /> Notifications
        </h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Choisissez ce qui vous est signalé (stocké sur cet appareil).</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13.5 }}>
            Rappels de pointage
            <input type="checkbox" checked={notifPresence} onChange={(e) => toggleNotif('presence', e.target.checked)} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13.5 }}>
            Nouveaux messages
            <input type="checkbox" checked={notifMessages} onChange={(e) => toggleNotif('messages', e.target.checked)} />
          </label>
        </div>
      </Card>

      <Card className="card" index={2}>
        <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileLock2 size={16} /> Confidentialité
        </h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Comment vos données sont utilisées sur STAMUX.</p>
        {confidentialite === null ? (
          <Skeleton height={80} />
        ) : confidentialite.length === 0 ? (
          <p className="page-subtitle">
            STAMUX collecte uniquement les données nécessaires au suivi de votre stage (présences, projets,
            rapports, documents). Ces informations sont visibles par votre mentor et l'administration uniquement.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {confidentialite.map((p) => (
              <div key={p.cle}>
                <strong style={{ fontSize: 12.5, textTransform: 'capitalize', color: 'var(--text-muted)' }}>{p.cle.replace(/_/g, ' ')}</strong>
                <p style={{ fontSize: 13.5, marginTop: 4, lineHeight: 1.6 }}>{p.valeur}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
