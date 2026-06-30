import { useAuthStore } from '@/features/auth/store/authStore';

export function AdminDashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Bienvenue, {user?.prenom} 👋</h1>
      <p style={styles.subtitle}>Tableau de bord Administrateur</p>

      <div style={styles.grid}>
        <StatCard label="Stagiaires" value="—" color="#3b82f6" />
        <StatCard label="Mentors" value="—" color="#10b981" />
        <StatCard label="Rapports en attente" value="—" color="#f59e0b" />
        <StatCard label="Évaluations" value="—" color="#8b5cf6" />
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
  page: {
    padding: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: '#6b7280',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.25rem',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  cardLabel: {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  cardValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
  },
};