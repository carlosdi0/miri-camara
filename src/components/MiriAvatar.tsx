const AVATARS = [
  '/img-mari/miri-1.webp',  // Monday - crying
  '/img-mari/miri-2.webp',  // Tuesday - sad
  '/img-mari/miri.3.webp',  // Wednesday - serious
  '/img-mari/miri-4.webp',  // Thursday - happy
  '/img-mari/miri.5.webp',  // Friday - euphoric
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
