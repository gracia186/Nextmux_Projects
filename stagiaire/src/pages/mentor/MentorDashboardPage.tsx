import { useAuthStore } from '@/features/auth/store/authStore';

export function MentorDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div style={styles.page}>
      <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold">
        Bienvenue {user?.prenom} {user?.nom}
      </h2>
      <p style={styles.subtitle}>Tableau de bord Mentor</p>

      <div style={styles.grid}>
        <StatCard label="Mes stagiaires" value="—" color="#3b82f6" />
        <StatCard label="Rapports à valider" value="—" color="#f59e0b" />
        <StatCard label="Évaluations à faire" value="—" color="#10b981" />
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Mes stagiaires</h2>
        <p style={styles.empty}>Les stagiaires assignés apparaîtront ici.</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color}` }}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={{ ...styles.cardValue, color }}>{value}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: '2rem' },
  title: { fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' },
  subtitle: { color: '#6b7280', marginBottom: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.25rem',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  cardLabel: { fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem' },
  cardValue: { fontSize: '1.75rem', fontWeight: 700 },
  section: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  sectionTitle: { fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' },
  empty: { color: '#9ca3af', fontSize: '0.9rem' },
};