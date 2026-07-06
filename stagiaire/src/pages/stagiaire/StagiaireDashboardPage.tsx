/** @format */

import { useAuthStore } from "@/features/auth/store/authStore";
import { useMentors } from "@/features/mentors/hooks/useMentors";
import { useRapports } from "@/features/rapports/hooks/useRapports";
import { useEffect, useState } from "react";

export function StagiaireDashboardPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const user = useAuthStore((state) => state.user);
  const { data: mentorData } = useMentors(1);
  const nom = mentorData?.data[0]?.nom ?? "—";
  const prenom =
    mentorData?.data[0]?.prenom ?? "Aucun mentor assigné pour le moment";
  // Récupération de la liste des mentors via TanStack Query
  const { data: rapportsData } = useRapports();

  // Nombre total de stagiaires depuis meta.total
  const totalRapports = rapportsData?.meta.total ?? "—";
  const totalRapportsValides =
    rapportsData?.data.filter((r) => r.statut === "valide").length ?? 0;
  return (
    <div style={{ ...styles.page, padding: isMobile ? "1rem" : "2rem" }}>
      <h2 className="relative left-1/2 -translate-x-1/2 text-lg sm:text-xl font-semibold">
        Bienvenue {user?.prenom} {user?.nom}
      </h2>

      <div
        style={{
          ...styles.grid,
          gridTemplateColumns: isMobile
            ? "1fr"
            : "repeat(auto-fill, minmax(180px, 1fr))",
          gap: isMobile ? "0.75rem" : "1rem",
        }}>
        <StatCard
          label="Rapports soumis"
          value={String(totalRapports)}
          color="#3b82f6"
        />
        <StatCard
          label="Rapports validés"
          value={String(totalRapportsValides)}
          color="#10b981"
        />
        <StatCard label="Évaluations reçues" value="—" color="#8b5cf6" />
      </div>

      <div style={{ ...styles.section, padding: isMobile ? "1rem" : "1.5rem" }}>
        <h2 style={styles.sectionTitle}>Mon mentor</h2>
        <p style={styles.empty}>
          {nom} {prenom}
        </p>
      </div>

      <div
        style={{
          ...styles.section,
          marginTop: "1rem",
          padding: isMobile ? "1rem" : "1.5rem",
        }}>
        <h2 style={styles.sectionTitle}>Mes derniers rapports</h2>
        <p style={styles.empty}>Aucun rapport soumis pour le moment.</p>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        ...styles.card,
        borderLeft: `4px solid ${color}`,
        padding: isMobile ? "1rem" : "1.25rem",
      }}>
      <p
        style={{
          ...styles.cardLabel,
          fontSize: isMobile ? "0.75rem" : "0.85rem",
        }}>
        {label}
      </p>
      <p
        style={{
          ...styles.cardValue,
          color,
          fontSize: isMobile ? "1.5rem" : "1.75rem",
        }}>
        {value}
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "2rem" },
  title: { fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" },
  subtitle: { color: "#6b7280", marginBottom: "2rem" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "1.25rem",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  cardLabel: { fontSize: "0.85rem", color: "#6b7280", marginBottom: "0.5rem" },
  cardValue: { fontSize: "1.75rem", fontWeight: 700 },
  section: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  },
  sectionTitle: { fontSize: "1rem", fontWeight: 600, marginBottom: "1rem" },
  empty: { color: "#9ca3af", fontSize: "0.9rem" },
};
