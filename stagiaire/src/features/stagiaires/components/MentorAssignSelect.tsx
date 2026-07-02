import { useMentors } from '@/features/mentors/hooks/useMentors';
import { useAssignMentor } from '../hooks/useAssignMentor';
import { Stagiaire } from '../types/stagiaire.types';

interface MentorAssignSelectProps {
  stagiaire: Stagiaire;
}

export function MentorAssignSelect({ stagiaire }: MentorAssignSelectProps) {
  const { data: mentorsData, isLoading } = useMentors();
  const { mutate: assignMentor, isPending } = useAssignMentor();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const mentorId = value === '' ? null : Number(value);
    assignMentor({ stagiaireId: stagiaire.id, mentorId });
  };

  if (isLoading) return <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>...</span>;

  return (
    <select
      style={styles.select}
      value={stagiaire.mentorId ?? ''}
      onChange={handleChange}
      disabled={isPending}
    >
      <option value="">— Aucun mentor —</option>
      {mentorsData?.data.map((mentor) => (
        <option key={mentor.id} value={mentor.id}>
          {mentor.prenom} {mentor.nom}
        </option>
      ))}
    </select>
  );
}

const styles: Record<string, React.CSSProperties> = {
  select: {
    padding: '0.3rem 0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    fontSize: '0.85rem',
    backgroundColor: '#fff',
     color: '#111827',
    cursor: 'pointer',
  },
};