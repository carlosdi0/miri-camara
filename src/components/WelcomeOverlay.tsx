import { useState, useEffect, useCallback } from 'react'

const AVATARS = [
  '/img-mari/miri-1.webp',
  '/img-mari/miri-2.webp',
  '/img-mari/miri.3.webp',
  '/img-mari/miri-4.webp',
  '/img-mari/miri.5.webp',
]

const MESSAGES: Record<number, [string, string, string]> = {
  1: ['Lunes...', 'Venga, que la semana acaba de empezar.', 'Tú puedes'],
  2: ['Martes.', 'Ya llevas un día hecho.', '¡Sigue así!'],
  3: ['Miércoles.', 'Ya estás en el ecuador.', '¡Mitad de semana!'],
  4: ['Jueves.', '¡Casi lo tienes!', 'Mañana es viernes.'],
  5: ['¡¡VIERNES!!', '¡Lo has conseguido!', '¡A disfrutar!'],
  6: ['¡Sábado!', 'Descansa, te lo mereces.', '¡Disfruta el finde!'],
  0: ['¡Domingo!', 'Recarga pilas.', '¡Mañana volvemos!'],
}

const WELCOME_SHOWN_KEY = 'miri-welcome-last'

function shouldShow(): boolean {
  const today = new Date().toISOString().split('T')[0]
  const last = localStorage.getItem(WELCOME_SHOWN_KEY)
  return last !== today
}

function markShown() {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem(WELCOME_SHOWN_KEY, today)
}

type Stage = 'name-input' | 'welcome' | 'hidden'

interface Props {
  username: string
  onSaveName: (name: string) => void
  isMiri: boolean
}

export function WelcomeOverlay({ username, onSaveName, isMiri }: Props) {
  const [stage, setStage] = useState<Stage>(() => {
    if (!username) return 'name-input'
    if (shouldShow()) return 'welcome'
    return 'hidden'
  })
  const [phase, setPhase] = useState(-1)
  const [exiting, setExiting] = useState(false)
  const [nameInput, setNameInput] = useState('')

  const dow = new Date().getDay()
  const dayIndex = dow === 0 || dow === 6 ? 4 : dow - 1

  const dismiss = useCallback(() => {
    if (exiting) return
    setExiting(true)
    setTimeout(() => setStage('hidden'), 600)
  }, [exiting])

  const handleNameSubmit = useCallback(() => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    onSaveName(trimmed)
    if (shouldShow()) {
      setStage('welcome')
    } else {
      setStage('hidden')
    }
  }, [nameInput, onSaveName])

  useEffect(() => {
    if (stage !== 'welcome') return
    markShown()
    setPhase(-1)

    const timers = [
      setTimeout(() => setPhase(0), 100),
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3200),
    ]

    return () => timers.forEach(clearTimeout)
  }, [stage])

  if (stage === 'hidden') return null

  const msgs = MESSAGES[dow]
  const avatar = AVATARS[dayIndex]
  const cheer = dow === 1 ? `${msgs[2]}, ${username || 'tú'}.` : msgs[2]

  if (stage === 'name-input') {
    return (
      <div className="welcome-overlay">
        <div className="welcome-card" onClick={(e) => e.stopPropagation()}>
          <div className="welcome-texts">
            <div className="welcome-day show">¡Hola!</div>
            <div className="welcome-msg show">¿Cómo te llamas?</div>
          </div>
          <form
            className="name-input-form"
            onSubmit={(e) => { e.preventDefault(); handleNameSubmit() }}
          >
            <input
              className="name-input-field"
              type="text"
              autoFocus
              placeholder="Tu nombre..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <button
              type="submit"
              className="welcome-dismiss"
              disabled={!nameInput.trim()}
            >
              Empezar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className={`welcome-overlay ${exiting ? 'exiting' : ''}`} onClick={dismiss}>
      <div className="welcome-card" onClick={(e) => e.stopPropagation()}>
        {isMiri && (
          <img
            src={avatar}
            alt="Miri"
            className={`welcome-avatar ${phase >= 0 ? 'show' : ''}`}
          />
        )}
        <div className="welcome-texts">
          <div className={`welcome-day ${phase >= 1 ? 'show' : ''}`}>
            {msgs[0]}
          </div>
          <div className={`welcome-msg ${phase >= 2 ? 'show' : ''}`}>
            {msgs[1]}
          </div>
          <div className={`welcome-cheer ${phase >= 3 ? 'show' : ''}`}>
            {cheer}
          </div>
        </div>
        {phase >= 3 && (
          <button className="welcome-dismiss" onClick={dismiss}>
            ¡Vamos allá!
          </button>
        )}
      </div>
    </div>
  )
}
