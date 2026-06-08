import { useState, Suspense } from 'react'
import { GUIDES } from './guides.js'
import './Dashboard.css'

export default function Dashboard({ onBack }) {
  const [activeGuideId, setActiveGuideId] = useState('career')

  const findGuideById = (id, guides = GUIDES) => {
    for (const guide of guides) {
      if (guide.id === id) return guide
      if (guide.children) {
        const child = findGuideById(id, guide.children)
        if (child) return child
      }
    }
    return null
  }

  const activeGuide = findGuideById(activeGuideId)
  const ActiveComponent = activeGuide?.component

  const isGuideActive = guide =>
    guide.id === activeGuideId ||
    guide.children?.some(child => child.id === activeGuideId)

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="dashboard-title">📚 My Guides</h1>
          {onBack && (
            <button
              type="button"
              className="counter"
              onClick={onBack}
              style={{ background: '#1a4d2e', fontSize: '0.9rem', padding: '8px 14px' }}
            >
              ← Home
            </button>
          )}
        </div>
        <div className="guides-grid">
          {GUIDES.map(guide => {
            const parentActive = isGuideActive(guide)
            return (
              <div key={guide.id} className="guide-group">
                <button
                  className={`guide-card ${parentActive ? 'active' : ''}`}
                  onClick={() => setActiveGuideId(guide.id)}
                >
                <div className="guide-header">
                  <span className="guide-icon">{guide.icon}</span>
                  <h3>{guide.name}</h3>
                </div>
                <p>{guide.description}</p>
              </button>
              {guide.children && (
                <div className="sub-guide-list">
                  <div className="sub-guide-title">Submenu</div>
                  {guide.children.map(child => (
                    <button
                      key={child.id}
                      className={`guide-card sub ${activeGuideId === child.id ? 'active' : ''}`}
                      onClick={() => setActiveGuideId(child.id)}
                    >
                      <div className="guide-header">
                        <span className="guide-icon">{child.icon}</span>
                        <h3>{child.name}</h3>
                      </div>
                      <p>{child.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
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
