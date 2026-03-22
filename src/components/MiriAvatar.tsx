const AVATARS = [
  '/img-mari/miri-1.png',  // Monday - crying
  '/img-mari/miri-2.png',  // Tuesday - sad
  '/img-mari/miri.3.png',  // Wednesday - serious
  '/img-mari/miri-4.png',  // Thursday - happy
  '/img-mari/miri.5.png',  // Friday - euphoric
]

interface Props {
  dayIndex: number // 0=Monday, 4=Friday
}

export function MiriAvatar({ dayIndex }: Props) {
  const src = AVATARS[Math.min(4, Math.max(0, dayIndex))]

  return (
    <div className="miri-avatar">
      <img src={src} alt="Miri" />
    </div>
  )
}
