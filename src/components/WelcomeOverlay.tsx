import { useState, useEffect } from 'react'

const AVATARS = [
  '/img-mari/miri-1.png',
  '/img-mari/miri-2.png',
  '/img-mari/miri.3.png',
  '/img-mari/miri-4.png',
  '/img-mari/miri.5.png',
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
  const [visible, setVisible] = useState(false)
  const [phase, setPhase] = useState(0) // 0=avatar, 1=line1, 2=line2, 3=line3
  const [exiting, setExiting] = useState(false)

  const dow = new Date().getDay()
  // Weekends show Friday mood
  const dayIndex = dow === 0 || dow === 6 ? 4 : dow - 1

  useEffect(() => {
    if (!shouldShow()) return
    setVisible(true)
    markShown()

    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1200)
    const t3 = setTimeout(() => setPhase(3), 2200)
    const t4 = setTimeout(() => setExiting(true), 4000)
    const t5 = setTimeout(() => setVisible(false), 4600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  const dismiss = () => {
    setExiting(true)
    setTimeout(() => setVisible(false), 500)
  }

  if (!visible) return null

  const msgs = MESSAGES[dow]
  const avatar = AVATARS[dayIndex]

  return (
    <div className={`welcome-overlay ${exiting ? 'exiting' : ''}`} onClick={dismiss}>
      <div className="welcome-card">
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
      </div>
    </div>
  )
}
