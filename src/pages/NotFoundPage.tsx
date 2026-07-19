import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F4F6FB] text-center">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <p className="text-ink-700/60">Cette page n'existe pas.</p>
      <Link to="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  )
}
