import { useEffect, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Save, KeyRound, X, Plus, FolderKanban, CheckSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi, stagiaireApi } from '../../lib/endpoints';
import { apiErrorMessage } from '../../lib/api';
import type { Projet, Tache } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatutBadge } from '../../components/ui/Badge';
import { useDashboardHeader } from '../../components/layout/DashboardLayout';

export default function Profil() {
  useDashboardHeader('Mon profil', 'Informations personnelles et sécurité du compte');
  const { user } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [passwords, setPasswords] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // ── Compétences (stagiaire uniquement) ──────────────────
  const [competences, setCompetences] = useState<string[]>(user?.stagiaire?.competences ?? []);
  const [newCompetence, setNewCompetence] = useState('');
  const [savingCompetences, setSavingCompetences] = useState(false);

  // ── Résumé projets/tâches (stagiaire uniquement) ────────
  const [projets, setProjets] = useState<Projet[] | null>(null);
  const [taches, setTaches] = useState<Tache[] | null>(null);

  useEffect(() => {
    if (user?.role !== 'stagiaire') return;
    stagiaireApi.projets({ per_page: 5 }).then((res) => setProjets(res.data.data));
    stagiaireApi.taches({ per_page: 5, statut: 'a_faire' }).then((res) => setTaches(res.data.data));
  }, [user?.role]);

  if (!user) return null;

  const initials = user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  async function handleProfileSave(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaved(false);
    try {
      await authApi.updateProfile({ name, phone });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSave(e: FormEvent) {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordError(null);
    setPasswordSaved(false);
    try {
      await authApi.updatePassword(passwords.current_password, passwords.password, passwords.password_confirmation);
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err) {
      setPasswordError(apiErrorMessage(err, 'Impossible de changer le mot de passe.'));
    } finally {
      setSavingPassword(false);
    }
  }

  function addCompetence(e: KeyboardEvent<HTMLInputElement> | FormEvent) {
    e.preventDefault();
    const value = newCompetence.trim();
    if (!value || competences.includes(value)) return;
    const next = [...competences, value];
    setCompetences(next);
    setNewCompetence('');
    persistCompetences(next);
  }

  function removeCompetence(value: string) {
    const next = competences.filter((c) => c !== value);
    setCompetences(next);
    persistCompetences(next);
  }

  async function persistCompetences(list: string[]) {
    setSavingCompetences(true);
    try {
      await stagiaireApi.updateCompetences(list);
    } finally {
      setSavingCompetences(false);
    }
  }

  return (
    <div>
      <div className="grid-cols-2">
        <Card className="card" index={0}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div className="avatar" style={{ width: 52, height: 52, fontSize: 17 }}>{initials}</div>
            <div>
              <h3>{user.name}</h3>
              <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>{user.role} · {user.email}</p>
            </div>
          </div>
          <form onSubmit={handleProfileSave}>
            <div className="field">
              <label>Nom complet</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>Téléphone</label>
              <input value={phone ?? ''} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={user.email} disabled />
            </div>
            <Button type="submit" loading={savingProfile} icon={<Save size={15} />}>
              {profileSaved ? 'Enregistré ✓' : 'Enregistrer'}
            </Button>
          </form>
        </Card>

        <Card className="card" index={1}>
          <h3 style={{ marginBottom: 4 }}>Sécurité</h3>
          <p className="page-subtitle" style={{ marginBottom: 18 }}>Changez votre mot de passe régulièrement.</p>
          <form onSubmit={handlePasswordSave}>
            <div className="field">
              <label>Mot de passe actuel</label>
              <input type="password" required value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} />
            </div>
            <div className="field">
              <label>Nouveau mot de passe</label>
              <input type="password" required minLength={8} value={passwords.password} onChange={(e) => setPasswords({ ...passwords, password: e.target.value })} />
            </div>
            <div className="field">
              <label>Confirmer le mot de passe</label>
              <input type="password" required value={passwords.password_confirmation} onChange={(e) => setPasswords({ ...passwords, password_confirmation: e.target.value })} />
            </div>
            {passwordError && <p style={{ color: '#fb7185', fontSize: 12.5, marginBottom: 12 }}>{passwordError}</p>}
            <Button type="submit" variant="ghost" loading={savingPassword} icon={<KeyRound size={15} />}>
              {passwordSaved ? 'Mot de passe modifié ✓' : 'Changer le mot de passe'}
            </Button>
          </form>
        </Card>
      </div>

      {user.role === 'stagiaire' && (
        <>
          <Card className="card" style={{ marginTop: 16 }} index={2}>
            <h3 style={{ marginBottom: 4 }}>Compétences</h3>
            <p className="page-subtitle" style={{ marginBottom: 14 }}>
              Ajoutées à votre profil, visibles par votre mentor. {savingCompetences && '· enregistrement…'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {competences.map((c) => (
                <span key={c} className="badge badge-info" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {c}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeCompetence(c)} />
                </span>
              ))}
              {competences.length === 0 && <span className="page-subtitle">Aucune compétence renseignée pour le moment.</span>}
            </div>
            <form onSubmit={addCompetence} style={{ display: 'flex', gap: 8 }}>
              <input
                placeholder="Ex : React, Laravel, Figma…"
                value={newCompetence}
                onChange={(e) => setNewCompetence(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: 10, padding: '10px 12px', color: 'var(--text)' }}
              />
              <Button type="submit" size="sm" icon={<Plus size={14} />}>Ajouter</Button>
            </form>
          </Card>

          <div className="grid-cols-2" style={{ marginTop: 16 }}>
            <Card className="card" index={3}>
              <h3 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FolderKanban size={16} /> Mes projets
              </h3>
              {projets === null ? (
                <p className="page-subtitle">Chargement…</p>
              ) : projets.length === 0 ? (
                <p className="page-subtitle">Aucun projet en cours.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {projets.map((p) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                      <span>{p.titre}</span>
                      <StatutBadge statut={p.statut} />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="card" index={4}>
              <h3 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckSquare size={16} /> Tâches à faire
              </h3>
              {taches === null ? (
                <p className="page-subtitle">Chargement…</p>
              ) : taches.length === 0 ? (
                <p className="page-subtitle">Aucune tâche en attente 🎉</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {taches.map((t) => (
                    <div key={t.id} style={{ fontSize: 13 }}>{t.titre}</div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
