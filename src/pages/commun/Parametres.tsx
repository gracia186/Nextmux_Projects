import { useEffect, useState } from 'react';
import { Sun, Moon, FileLock2, ChevronDown } from 'lucide-react';
import { authApi } from '../../lib/endpoints';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

interface Parametre { id: number; cle: string; valeur: string | null; groupe: string }

export default function Parametres() {
  useDashboardHeader('Paramètres', 'Apparence et informations légales');
  const { theme, toggleTheme } = useTheme();
  const [legal, setLegal] = useState<Parametre[] | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  useEffect(() => {
    authApi.parametresPublics().then((res) => setLegal(res.data.confidentialite ?? []));
  }, []);

  return (
    <div>
      <Card className="card" index={0} style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 4 }}>Apparence</h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Choisissez le thème qui vous convient.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="role-pill ring-hover"
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme === 'dark' ? 'rgba(96,165,250,0.14)' : undefined }}
            onClick={() => theme !== 'dark' && toggleTheme()}
          >
            <Moon size={14} /> Sombre
          </button>
          <button
            type="button"
            className="role-pill ring-hover"
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme === 'light' ? 'rgba(96,165,250,0.14)' : undefined }}
            onClick={() => theme !== 'light' && toggleTheme()}
          >
            <Sun size={14} /> Clair
          </button>
        </div>
      </Card>

      <Card className="card" index={1}>
        <h3 style={{ marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileLock2 size={16} /> Confidentialité &amp; conditions
        </h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>Comment vos données sont utilisées dans STAMUX.</p>

        {legal === null ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton height={44} /><Skeleton height={44} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {legal.map((p) => (
              <div key={p.cle} style={{ borderTop: '1px solid var(--glass-border)' }}>
                <button
                  type="button"
                  onClick={() => setOpenKey((k) => (k === p.cle ? null : p.cle))}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'none', border: 'none', color: 'var(--text)', padding: '14px 4px', textAlign: 'left', fontSize: 13.5, fontWeight: 600, textTransform: 'capitalize',
                  }}
                >
                  {p.cle.replace(/_/g, ' ')}
                  <ChevronDown size={15} style={{ transform: openKey === p.cle ? 'rotate(180deg)' : undefined, transition: 'transform .2s var(--ease)' }} />
                </button>
                {openKey === p.cle && (
                  <p className="page-subtitle" style={{ paddingBottom: 14, lineHeight: 1.6 }}>{p.valeur}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
