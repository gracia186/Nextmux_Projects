import { useState } from 'react';
import { ProjetForm } from '@/features/projets/components/ProjetForm';
import { ProjetList } from '@/features/projets/components/ProjetList';
import { useCreateProjet } from '@/features/projets/hooks/useCreateProjet';
import { useUpdateProjet } from '@/features/projets/hooks/useUpdateProjet';
import { useAuthStore } from '@/features/auth/store/authStore';
import type { Projet, CreateProjetPayload, UpdateProjetPayload } from '@/features/projets/types/projet.types';

export function MentorProjetsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Projet | null>(null);

  const mentorId = useAuthStore((state) => state.user?.id);

  const { mutate: createProjet, isPending: isCreating } = useCreateProjet();
  const { mutate: updateProjet, isPending: isUpdating } = useUpdateProjet();

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (projet: Projet) => {
    setEditing(projet);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = (payload: CreateProjetPayload | UpdateProjetPayload) => {
    if (editing) {
      updateProjet(
        { id: editing.id, payload: payload as UpdateProjetPayload },
        { onSuccess: () => closeForm() }
      );
    } else {
      createProjet(payload as CreateProjetPayload, { onSuccess: () => closeForm() });
    }
  };

  if (!mentorId) {
    return (
      <div style={styles.page}>
        <p style={styles.loading}>Chargement de vos informations...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Projets créés</h1>
        <button style={styles.addBtn} onClick={openCreate}>
          + Créer un nouveau projet
        </button>
      </div>

      <ProjetList mentorId={String(mentorId)} canDelete={true} onEdit={openEdit} />

      {showForm && (
        <div style={styles.overlay} onClick={closeForm}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editing ? 'Modifier le projet' : 'Nouveau projet'}
              </h3>
              <button style={styles.closeBtn} onClick={closeForm} aria-label="Fermer">
                ✕
              </button>
            </div>
            <ProjetForm
              mentorId={String(mentorId)}
              projet={editing ?? undefined}
              onSubmit={handleSubmit}
              isSubmitting={isCreating || isUpdating}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '2rem', maxWidth: '1100px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.5rem', fontWeight: 700, color: '#111827' },
  addBtn: {
    padding: '0.6rem 1.4rem',
    background: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
  },
  loading: { textAlign: 'center', color: '#6b7280', padding: '3rem 0' },
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '2rem',
    width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  modalTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#111827' },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.1rem', color: '#6b7280', cursor: 'pointer', lineHeight: 1 },
};