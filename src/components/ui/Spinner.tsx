import clsx from 'clsx';

/**
 * Spinner de marque STAMUX : un "S" toujours droit (jamais de rotation,
 * pour ne pas donner l'impression qu'il est couché). Seul le tracé du
 * contour s'anime en boucle. Taille en px, couleur héritée de currentColor.
 */
export function Spinner({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={clsx('s-spinner', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Chargement"
    >
      <path
        className="s-spinner-track"
        d="M16.8 8.2c-.3-2-2.3-3.2-4.9-3.2-2.9 0-4.9 1.3-4.9 3.1 0 4.6 10.6 2.1 10.6 8.4 0 2.2-2.3 3.9-5.4 3.9-2.8 0-5-1.2-5.4-3.3"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
