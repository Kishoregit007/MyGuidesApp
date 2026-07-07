import { useMemo } from 'react'
import './AudioPage.css'

export default function AudioPage({ onBack }) {
  const audios = useMemo(
    () => [
        {
            title: 'Inside of JVM, JRE, JDK - Java Platform Explained',
            src: new URL('./Audio/JVM_JRE_JDK_Inside.m4a', import.meta.url).href
        },
        {
            title: 'Real World Best Practices of JVM, JRE, JDK',
            src: new URL('./Audio/RWBP-JVM_JRE_JDK.m4a', import.meta.url).href
        },
        {
            title: 'Bitwise math and Java HashMap architecture',
            src: new URL('./Audio/Bitwise_math_and_Java_HashMap_architecture.m4a', import.meta.url).href
        },
        {
            title: 'Java HashMap Collisions कैसे काम करते हैं',
            src: new URL('./Audio/Java_HashMap_Collisions_कैसे_काम_करते_हैं.m4a', import.meta.url).href
        },
        {
            title: 'M01.1-DSA - Arrays & Strings',
            src: new URL('./Audio/M01.1-DSA-Arrays_Strings.m4a', import.meta.url).href
        },
        {
            title: 'M01.2-RWBP - Arrays & Strings',
            src: new URL('./Audio/M01.2-RWBP-Arrays_Strings.m4a', import.meta.url).href
        },
        {
            title: 'M02.1-DSA - Linked List',
            src: new URL('./Audio/M02.1-DSA-LinkedList.m4a', import.meta.url).href
        },
        {
            title: 'M02.2-RWBP - Linked List',
            src: new URL('./Audio/M02.2-RWBP-LinkedList.m4a', import.meta.url).href
        },
        {
            title: 'M03.1-DSA - Stacks & Queues',
            src: new URL('./Audio/M03.1-DSA-Stacks_&_Queues.m4a', import.meta.url).href
        },
        {
            title: 'M03.2-RWBP - Stacks & Queues',
            src: new URL('./Audio/M03.2-RWBP-Stacks_&_Queues.m4a', import.meta.url).href
        },
        {
            title: 'M04.1-DSA - Trees (Binary & BST)',
            src: new URL('./Audio/M04.1-DSA-Trees-Binary & BST.m4a', import.meta.url).href
        },
        {
            title: 'M04.2-RWBP - Trees (Binary & BST)',
            src: new URL('./Audio/M04.2-RWBP-BinaryTree_ServerCrash.m4a', import.meta.url).href
        },
        {
            title: 'M05.1-DSA - Heaps & Priority Queues',
            src: new URL('./Audio/M05.1-DSA-Heaps-PriorityQ.m4a', import.meta.url).href
        },
        {
            title: 'M05.2-RWBP - Heaps & Priority Queues',
            src: new URL('./Audio/M05.2-RWBP-Heaps-PriorityQ.m4a', import.meta.url).href
        },
        {
            title: 'M06.1-DSA - Hashing',
            src: new URL('./Audio/M06.1-DSA-Hashing-data-searching.m4a', import.meta.url).href
        },
        {
            title: 'M06.2-RWBP - Hashing',
            src: new URL('./Audio/M06.2-DSA-HashTables-OpenAddressing-SeparateChaining.m4a', import.meta.url).href
        },
        {
            title: 'M07.1-DSA - Graphs (BFS & DFS)',
            src: new URL('./Audio/M07.1-DSA-Graphs-BFSDFS.m4a', import.meta.url).href
        },
        {
            title: 'M07.2-RWBP - Graphs (BFS & DFS)',
            src: new URL('./Audio/M07.2-RWBP-Graphs.m4a', import.meta.url).href
        },
        {
            title: 'M08.1-DSA - DP Patterns 1 (knapsack, LCS)',
            src: new URL('./Audio/M08.1-DSA-DP1.m4a', import.meta.url).href
        },
    ],
    []
  )

  return (
    <div className="audio-page">
      <button
        type="button"
        className="counter"
        onClick={onBack}
        style={{ marginBottom: '16px', background: '#1a4d2e' }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: '12px' }}>🎧 My Audios</h1>
      <p style={{ marginBottom: '18px', color: '#555' }}>
        Tap any file to play it in the browser. Your audio files are loaded from the local `src/Audio` folder.
      </p>

      <div style={{ display: 'grid', gap: '16px' }}>
        {audios.map((audio) => (
          <div key={audio.src} className="audio-card">
            <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>{audio.title}</h3>
            <audio controls src={audio.src} />
          </div>
        ))}
      </div>
    </div>
  )
}
