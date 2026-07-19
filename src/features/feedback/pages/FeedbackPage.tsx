import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/DataDisplay'
import { Textarea } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { StarRating } from '../components/StarRating'
import { useSubmitFeedback } from '../hooks/useFeedback'

export default function FeedbackPage() {
  const submit = useSubmitFeedback()
  const [welcome, setWelcome] = useState(0)
  const [mentorship, setMentorship] = useState(0)
  const [atmosphere, setAtmosphere] = useState(0)
  const [professionalValue, setProfessionalValue] = useState(0)
  const [recommendation, setRecommendation] = useState(0)
  const [comment, setComment] = useState('')
  const [anonymous, setAnonymous] = useState(false)

  const allRated = welcome && mentorship && atmosphere && professionalValue && recommendation

  function submitFeedback() {
    submit.mutate({
      welcome_rating: welcome,
      mentorship_rating: mentorship,
      atmosphere_rating: atmosphere,
      professional_value_rating: professionalValue,
      recommendation_score: recommendation,
      comment: comment || undefined,
      is_anonymous: anonymous,
    })
  }

  if (submit.isSuccess) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h2 className="text-lg font-semibold">Merci pour votre retour !</h2>
        <p className="mt-2 text-sm text-ink-700/60">Votre avis a été enregistré et aidera à améliorer l'expérience des futurs stagiaires.</p>
      </Card>
    )
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Avis de fin de stage</h1>
        <p className="text-sm text-ink-700/60">Votre retour est précieux et ne peut être soumis qu'une seule fois.</p>
      </div>
      <Card>
        <CardHeader title="Votre expérience" />
        <div className="flex flex-col gap-4">
          <StarRating label="Accueil à votre arrivée" value={welcome} onChange={setWelcome} />
          <StarRating label="Qualité du mentorat" value={mentorship} onChange={setMentorship} />
          <StarRating label="Ambiance de travail" value={atmosphere} onChange={setAtmosphere} />
          <StarRating label="Valeur professionnelle acquise" value={professionalValue} onChange={setProfessionalValue} />
          <StarRating label="Recommanderiez-vous NEXTMUX ?" value={recommendation} onChange={setRecommendation} />
          <Textarea label="Commentaire (optionnel)" value={comment} onChange={(e) => setComment(e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-ink-800">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} />
            Soumettre cet avis de manière anonyme
          </label>
          <Button disabled={!allRated} loading={submit.isPending} onClick={submitFeedback}>
            Envoyer mon avis
          </Button>
        </div>
      </Card>
    </div>
  )
}
