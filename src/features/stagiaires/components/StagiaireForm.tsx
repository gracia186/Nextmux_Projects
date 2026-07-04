import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stagiaireSchema, StagiaireFormValues } from '../types/stagiaire.schema';
import { Stagiaire } from '../types/stagiaire.types';

interface StagiaireFormProps {
  defaultValues?: Partial<Stagiaire>;
  onSubmit: (values: StagiaireFormValues) => void;
  isPending: boolean;
  onCancel: () => void;
}

export function StagiaireForm({ defaultValues, onSubmit, isPending, onCancel }: StagiaireFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<StagiaireFormValues>({
    resolver: zodResolver(stagiaireSchema),
    defaultValues: {
      nom: defaultValues?.nom ?? '',
      prenom: defaultValues?.prenom ?? '',
      email: defaultValues?.email ?? '',
      telephone: defaultValues?.telephone ?? '',
      dateDebut: defaultValues?.dateDebut ?? '',
      dateFin: defaultValues?.dateFin ?? '',
      mentorId: defaultValues?.mentorId ?? null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      <div style={styles.row}>
        <Field label="Prénom" error={errors.prenom?.message}>
          <input style={styles.input} {...register('prenom')} placeholder="Prénom" />
        </Field>
        <Field label="Nom" error={errors.nom?.message}>
          <input style={styles.input} {...register('nom')} placeholder="Nom" />
        </Field>
      </div>

      <Field label="Email" error={errors.email?.message}>
        <input style={styles.input} type="email" {...register('email')} placeholder="email@exemple.com" />
      </Field>

      <Field label="Téléphone" error={errors.telephone?.message}>
        <input style={styles.input} {...register('telephone')} placeholder="+229 XX XX XX XX" />
      </Field>

      <div style={styles.row}>
        <Field label="Date de début" error={errors.dateDebut?.message}>
          <input style={styles.input} type="date" {...register('dateDebut')} />
        </Field>
        <Field label="Date de fin" error={errors.dateFin?.message}>
          <input style={styles.input} type="date" {...register('dateFin')} />
        </Field>
      </div>

      <div style={styles.actions}>
        <button type="button" style={styles.cancelBtn} onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" style={styles.submitBtn} disabled={isPending}>
          {isPending ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
      {error && <span style={styles.error}>{error}</span>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  field: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#374151' },
  input: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '0.9rem',
    outline: 'none',
  },
  error: { fontSize: '0.8rem', color: '#ef4444' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' },
  cancelBtn: {
    padding: '0.5rem 1.25rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    background: '#fff',
    cursor: 'pointer',
    fontWeight:600,
    color:'black'
  },
  submitBtn: {
    padding: '0.5rem 1.25rem',
    border: 'none',
    borderRadius: '6px',
    backgroundImage: 'linear-gradient(135deg, #78B3A6 0%, #6E9D96 40%, #556F7B 70%, #3E425D 100%)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
};