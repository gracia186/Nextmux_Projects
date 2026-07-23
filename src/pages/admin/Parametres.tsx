import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Save, Settings, Clock3, Shield, FileLock2 } from 'lucide-react';
import { adminApi } from '../../lib/endpoints';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

interface Parametre { id: number; cle: string; valeur: string | null; groupe: string }

const GROUP_META: Record<string, { label: string; icon: ReactNode }> = {
  general: { label: 'Général', icon: <Settings size={16} /> },
  presence: { label: 'Présence', icon: <Clock3 size={16} /> },
  securite: { label: 'Sécurité', icon: <Shield size={16} /> },
  confidentialite: { label: 'Confidentialité', icon: <FileLock2 size={16} /> },
};

const LONG_TEXT_KEYS = ['politique_confidentialite', 'conditions_utilisation'];

export default function AdminParametres() {
  useDashboardHeader('Paramètres', "Configuration générale de l'application");

  const [groups, setGroups] = useState<Record<string, Parametre[]> | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.parametres().then((res) => setGroups(res.data));
  }, []);

  function updateValue(groupe: string, cle: string, valeur: string) {
    setGroups((prev) => {
      if (!prev) return prev;
      return { ...prev, [groupe]: prev[groupe].map((p) => (p.cle === cle ? { ...p, valeur } : p)) };
    });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!groups) return;
    setSaving(true);
    setSaved(false);
    const parametres = Object.entries(groups).flatMap(([groupe, items]) =>
      items.map((p) => ({ cle: p.cle, valeur: p.valeur, groupe }))
    );
    try {
      await adminApi.updateParametres(parametres);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  if (!groups) {
    return <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={130} />)}</div>;
  }

  // Ordre d'affichage stable, même si l'API renvoie les groupes dans un ordre différent.
  const orderedGroups = Object.keys(GROUP_META).filter((g) => groups[g]).concat(Object.keys(groups).filter((g) => !GROUP_META[g]));

  return (
    <form onSubmit={handleSave}>
      {orderedGroups.map((groupe, gi) => {
        const items = groups[groupe];
        const meta = GROUP_META[groupe] ?? { label: groupe, icon: <Settings size={16} /> };
        return (
          <Card className="card" key={groupe} index={gi} style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              {meta.icon} {meta.label}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {items.map((p) =>
                LONG_TEXT_KEYS.includes(p.cle) ? (
                  <div className="field" key={p.cle} style={{ gridColumn: '1 / -1' }}>
                    <label style={{ textTransform: 'capitalize' }}>{p.cle.replace(/_/g, ' ')}</label>
                    <textarea rows={4} value={p.valeur ?? ''} onChange={(e) => updateValue(groupe, p.cle, e.target.value)} />
                  </div>
                ) : null
              )}
              <div className="grid-cols-2">
                {items.filter((p) => !LONG_TEXT_KEYS.includes(p.cle)).map((p) => (
                  <div className="field" key={p.cle}>
                    <label style={{ textTransform: 'capitalize' }}>{p.cle.replace(/_/g, ' ')}</label>
                    <input value={p.valeur ?? ''} onChange={(e) => updateValue(groupe, p.cle, e.target.value)} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        );
      })}
      <Button type="submit" loading={saving} icon={<Save size={15} />}>
        {saved ? 'Enregistré ✓' : 'Enregistrer les modifications'}
      </Button>
    </form>
  );
}
