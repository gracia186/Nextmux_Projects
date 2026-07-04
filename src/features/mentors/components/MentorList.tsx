import { useState } from 'react';
import { useMentors } from '../hooks/useMentors';
import { useCreateMentor } from '../hooks/useCreateMentor';
import { useUpdateMentor } from '../hooks/useUpdateMentor';
import { useDeleteMentor } from '../hooks/useDeleteMentor';
import { MentorForm } from './MentorForm';
import { Mentor } from '../types/mentor.types';
import { MentorFormValues } from '../types/mentor.schema';
import {Pencil , Trash2} from 'lucide-react';
export function MentorList() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Mentor | null>(null);

  const { data, isLoading, isError } = useMentors(page);
  const { mutate: create, isPending: isCreating } = useCreateMentor();
  const { mutate: update, isPending: isUpdating } = useUpdateMentor();
  const { mutate: remove } = useDeleteMentor();

  const handleSubmit = (values: MentorFormValues) => {
    if (editing) {
      update({ id: editing.id, data: values }, { onSuccess: () => closeModal() });
    } else {
      create(values, { onSuccess: () => closeModal() });
    }
  };

  const openCreate = () => { setEditing(null); setShowModal(true); };
  const openEdit = (m: Mentor) => { setEditing(m); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleDelete = (id: number) => {
    if (window.confirm('Supprimer ce mentor ?')) remove(id);
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p style={{ color: '#ef4444' }}>Erreur lors du chargement.</p>;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Mentors ({data?.meta.total ?? 0})</h2>
        <button style={styles.addBtn} onClick={openCreate}>+ Ajouter</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            {['Prénom', 'Nom', 'Email', 'Spécialité', 'Stagiaires', 'Actions'].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.data.map((m) => (
            <tr key={m.id} style={styles.tr}>
              <td style={styles.td}>{m.prenom}</td>
              <td style={styles.td}>{m.nom}</td>
              <td style={styles.td}>{m.email}</td>
              <td style={styles.td}>{m.specialite}</td>
              <td style={styles.td}>{m.nbStagiaires}</td>
              <td style={styles.td}>
                <button
                            onClick={() => openEdit(m)}
                            className="p-1.5 rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          >
                            {/* Icône crayon */}
                            <Pencil className="w-4 h-4" />
                          </button>
                          {/* Bouton de suppression : ouvre la confirmation */}
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-1.5 rounded-lg text-dark-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            {/* Icône poubelle */}
                            <Trash2 className="w-4 h-4" />
                          </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data && data.meta.last_page > 1 && (
        <div style={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} style={styles.pageBtn}>← Précédent</button>
          <span style={styles.pageInfo}>Page {page} / {data.meta.last_page}</span>
          <button disabled={page === data.meta.last_page} onClick={() => setPage((p) => p + 1)} style={styles.pageBtn}>Suivant →</button>
        </div>
      )}

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{editing ? 'Modifier le mentor' : 'Nouveau mentor'}</h3>
            <MentorForm
              defaultValues={editing ?? undefined}
              onSubmit={handleSubmit}
              isPending={isCreating || isUpdating}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  title: { fontSize: '1.25rem', fontWeight: 700 },
  addBtn: { padding: '0.5rem 1.25rem', backgroundImage:'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)',
      color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  th: { padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#6b7280', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#111827' },
  editBtn: { marginRight: '0.5rem', padding: '0.3rem 0.75rem', border: '1px solid #3b82f6', color: '#3b82f6', background: 'transparent', borderRadius: '4px', cursor: 'pointer' },
  deleteBtn: { padding: '0.3rem 0.75rem', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent', borderRadius: '4px', cursor: 'pointer' },
  pagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1rem' },
  pageBtn: { padding: '0.4rem 1rem', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', background: '#fff' },
  pageInfo: { fontSize: '0.9rem', color: '#6b7280' },
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 },
  modal: { backgroundColor: '#fff', borderRadius: '10px', padding: '2rem', width: '100%', maxWidth: '540px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' },
};