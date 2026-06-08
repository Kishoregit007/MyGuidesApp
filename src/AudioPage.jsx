import { useMemo } from 'react'

export default function AudioPage({ onBack }) {
  const audios = useMemo(
    () => [
      {
        title: 'Bitwise math and Java HashMap architecture',
        src: new URL('./Audio/Bitwise_math_and_Java_HashMap_architecture.m4a', import.meta.url).href
      },
      {
        title: 'Java HashMap Collisions कैसे काम करते हैं',
        src: new URL('./Audio/Java_HashMap_Collisions_कैसे_काम_करते_हैं.m4a', import.meta.url).href
      },
      {
        title: 'ଜେଭିଏମ୍ ଜେଆରଇ ଏବଂ ଜେଡିକେ ର ଭିତର କଥା',
        src: new URL('./Audio/ଜେଭିଏମ୍_ଜେଆରଇ_ଏବଂ_ଜେଡିକେ_ର_ଭିତର_କଥା.m4a', import.meta.url).href
      },
      {
        title: 'DSA - Arrays & Strings',
        src: new URL('./Audio/M01-DSA-Arrays_Strings.m4a', import.meta.url).href
      },
      {
        title: 'DSA - Linked List',
        src: new URL('./Audio/M02-DSA-LinkedList.m4a', import.meta.url).href
      }
    ],
    []
  )

  return (
    <div style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      <button
        type="button"
        className="counter"
        onClick={onBack}
        style={{ marginBottom: '24px', background: '#1a4d2e' }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: '16px' }}>🎧 My Audios</h1>
      <p style={{ marginBottom: '24px', color: '#555' }}>
        Tap any file to play it in the browser. Your audio files are loaded from the local `src/Audio` folder.
      </p>

      <div style={{ display: 'grid', gap: '20px' }}>
        {audios.map((audio) => (
          <div
            key={audio.src}
            style={{
              padding: '18px',
              border: '1px solid #d4d4d4',
              borderRadius: '10px',
              background: '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
            }}
          >
            <h3 style={{ margin: '0 0 10px', fontSize: '18px' }}>{audio.title}</h3>
            <audio controls src={audio.src} style={{ width: '100%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
