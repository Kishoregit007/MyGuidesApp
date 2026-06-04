import { useState, Suspense } from 'react'
import { GUIDES } from './guides.js'
import './Dashboard.css'

export default function Dashboard() {
  const [activeGuideId, setActiveGuideId] = useState('career')

  const activeGuide = GUIDES.find(guide => guide.id === activeGuideId)
  const ActiveComponent = activeGuide?.component

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1 className="dashboard-title">📚 My Guides</h1>
        <div className="guides-grid">
          {GUIDES.map(guide => (
            <button
              key={guide.id}
              className={`guide-card ${activeGuideId === guide.id ? 'active' : ''}`}
              onClick={() => setActiveGuideId(guide.id)}
            >
              <div className="guide-header">
                <span className="guide-icon">{guide.icon}</span>
                <h3>{guide.name}</h3>
              </div>
              <p>{guide.description}</p>
            </button>
          ))}
        </div>
      </nav>

      <main className="dashboard-content">
        <Suspense fallback={<div className="dashboard-loading">Loading guide...</div>}>
          {ActiveComponent ? <ActiveComponent /> : <div>Select a guide</div>}
        </Suspense>
      </main>
    </div>
  )
}
