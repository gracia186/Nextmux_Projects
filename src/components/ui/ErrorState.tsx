import { AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="card glass" style={{ textAlign: 'center', padding: '40px 24px' }}>
      <div style={{ color: '#fb7185', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
        <AlertTriangle size={34} />
      </div>
      <h3 style={{ marginBottom: 6 }}>Une erreur est survenue</h3>
      <p className="page-subtitle" style={{ marginBottom: onRetry ? 18 : 0, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto' }}>{message}</p>
      {onRetry && (
        <Button variant="ghost" size="sm" icon={<RotateCw size={13} />} onClick={onRetry} style={{ margin: '0 auto' }}>
          Réessayer
        </Button>
      )}
    </div>
  );
}
