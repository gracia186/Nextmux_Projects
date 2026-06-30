/** @format */

import { useState } from "react";
import { useStagiaires } from "../hooks/useStagiaires";
import { useCreateStagiaire } from "../hooks/useCreateStagiaire";
import { useUpdateStagiaire } from "../hooks/useUpdateStagiaire";
import { useDeleteStagiaire } from "../hooks/useDeleteStagiaire";
import { StagiaireForm } from "./StagiaireForm";
import { Stagiaire } from "../types/stagiaire.types";
import { StagiaireFormValues } from "../types/stagiaire.schema";
import { MentorAssignSelect } from "./MentorAssignSelect";

const STATUT_LABELS = {
  en_cours: { label: "En cours", color: "#10b981" },
  termine: { label: "Terminé", color: "#6b7280" },
  abandonne: { label: "Abandonné", color: "#ef4444" },
};

export function StagiaireList() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Stagiaire | null>(null);

  const { data, isLoading, isError } = useStagiaires(page);
  const { mutate: create, isPending: isCreating } = useCreateStagiaire();
  const { mutate: update, isPending: isUpdating } = useUpdateStagiaire();
  const { mutate: remove } = useDeleteStagiaire();

  const handleSubmit = (values: StagiaireFormValues) => {
    if (editing) {
      update(
        { id: editing.id, data: values },
        { onSuccess: () => closeModal() },
      );
    } else {
      create(values, { onSuccess: () => closeModal() });
    }
  };

  const openCreate = () => {
    setEditing(null);
    setShowModal(true);
  };
  const openEdit = (s: Stagiaire) => {
    setEditing(s);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Supprimer ce stagiaire ?")) remove(id);
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError)
    return <p style={{ color: "#ef4444" }}>Erreur lors du chargement.</p>;

  return (
    <div>
      <div style={styles.header}>
        <h2 style={styles.title}>Stagiaires ({data?.meta.total ?? 0})</h2>
        <button style={styles.addBtn} onClick={openCreate}>
          + Ajouter
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            {["Prénom", "Nom", "Email", "Mentor", "Statut", "Actions"].map(
              (h) => (
                <th key={h} style={styles.th}>
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {data?.data.map((s) => (
            <tr key={s.id} style={styles.tr}>
              <td style={styles.td}>{s.prenom}</td>
              <td style={styles.td}>{s.nom}</td>
              <td style={styles.td}>{s.email}</td>
              <td style={styles.td}>
                <MentorAssignSelect stagiaire={s} />
              </td> 
              <td style={styles.td}>
                <span
                  style={{
                    ...styles.badge,
                    color: STATUT_LABELS[s.statut].color,
                  }}>
                  {STATUT_LABELS[s.statut].label}
                </span>
              </td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => openEdit(s)}>
                  Modifier
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(s.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {data && data.meta.last_page > 1 && (
        <div style={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={styles.pageBtn}>
            ← Précédent
          </button>
          <span style={styles.pageInfo}>
            Page {page} / {data.meta.last_page}
          </span>
          <button
            disabled={page === data.meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            style={styles.pageBtn}>
            Suivant →
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              {editing ? "Modifier le stagiaire" : "Nouveau stagiaire"}
            </h3>
            <StagiaireForm
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  title: { fontSize: "1.25rem", fontWeight: 700 },
  addBtn: {
    padding: "0.5rem 1.25rem",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  th: {
    padding: "0.75rem 1rem",
    textAlign: "left",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  tr: { borderBottom: "1px solid #f3f4f6" },
  td: { padding: "0.75rem 1rem", fontSize: "0.9rem", color: "#111827" },
  badge: { fontWeight: 600, fontSize: "0.8rem" },
  editBtn: {
    marginRight: "0.5rem",
    padding: "0.3rem 0.75rem",
    border: "1px solid #3b82f6",
    color: "#3b82f6",
    background: "transparent",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "0.3rem 0.75rem",
    border: "1px solid #ef4444",
    color: "#ef4444",
    background: "transparent",
    borderRadius: "4px",
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
  pageBtn: {
    padding: "0.4rem 1rem",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    cursor: "pointer",
    background: "#fff",
  },
  pageInfo: { fontSize: "0.9rem", color: "#6b7280" },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "2rem",
    width: "100%",
    maxWidth: "540px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  modalTitle: { fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.5rem" },
};
