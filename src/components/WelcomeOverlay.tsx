import { useState, useEffect, useCallback } from 'react'

const AVATARS = [
  '/img-mari/miri-1.webp',
  '/img-mari/miri-2.webp',
  '/img-mari/miri.3.webp',
  '/img-mari/miri-4.webp',
  '/img-mari/miri.5.webp',
]

const MESSAGES: Record<number, [string, string, string]> = {
  1: ['Lunes...', 'Venga, que la semana acaba de empezar.', 'Tú puedes, Miri.'],
  2: ['Martes.', 'Ya llevas un día hecho.', '¡Sigue así!'],
  3: ['Miércoles.', 'Ya estás en el ecuador.', '¡Mitad de semana!'],
  4: ['Jueves.', '¡Casi lo tienes!', 'Mañana es viernes.'],
  5: ['¡¡VIERNES!!', '¡Lo has conseguido!', '¡A disfrutar!'],
  6: ['¡Sábado!', 'Descansa, te lo mereces.', '¡Disfruta el finde!'],
  0: ['¡Domingo!', 'Recarga pilas.', '¡Mañana volvemos!'],
}

const STORAGE_KEY = 'miri-welcome-last'

function shouldShow(): boolean {
  const today = new Date().toISOString().split('T')[0]
  const last = localStorage.getItem(STORAGE_KEY)
  return last !== today
}

function markShown() {
  const today = new Date().toISOString().split('T')[0]
  localStorage.setItem(STORAGE_KEY, today)
}

export function WelcomeOverlay() {
  const [visible, setVisible] = useState(() => shouldShow())
  const [phase, setPhase] = useState(-1)
  const [exiting, setExiting] = useState(false)

  const dow = new Date().getDay()
  const dayIndex = dow === 0 || dow === 6 ? 4 : dow - 1

  const dismiss = useCallback(() => {
    if (exiting) return
    setExiting(true)
    setTimeout(() => setVisible(false), 600)
  }, [exiting])

  useEffect(() => {
    if (!visible) return
    markShown()

    const timers = [
      setTimeout(() => setPhase(0), 100),
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3200),
    ]

    return () => timers.forEach(clearTimeout)
  }, [visible])

  if (!visible) return null

  const msgs = MESSAGES[dow]
  const avatar = AVATARS[dayIndex]

  return (
    <div className={`welcome-overlay ${exiting ? 'exiting' : ''}`} onClick={dismiss}>
      <div className="welcome-card" onClick={(e) => e.stopPropagation()}>
        <img
          src={avatar}
          alt="Miri"
          className={`welcome-avatar ${phase >= 0 ? 'show' : ''}`}
        />
        <div className="welcome-texts">
          <div className={`welcome-day ${phase >= 1 ? 'show' : ''}`}>
            {msgs[0]}
          </div>
          <div className={`welcome-msg ${phase >= 2 ? 'show' : ''}`}>
            {msgs[1]}
          </div>
          <div className={`welcome-cheer ${phase >= 3 ? 'show' : ''}`}>
            {msgs[2]}
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
