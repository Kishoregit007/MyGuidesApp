import { useState, Suspense } from 'react'
import { GUIDES } from './guides.js'
import './Dashboard.css'

export default function Dashboard({ onBack }) {
  const [activeGuideId, setActiveGuideId] = useState('career')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

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
      <nav className={`dashboard-nav ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-nav-header">
          <div className="dashboard-title-wrap">
            {isSidebarCollapsed ? (
              <div className="dashboard-icon-pill">📚</div>
            ) : (
              <h1 className="dashboard-title">📚 My Guides</h1>
            )}
          </div>
          <div className="dashboard-actions">
            <button
              type="button"
              className="dashboard-toggle"
              onClick={() => setIsSidebarCollapsed(value => !value)}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? '→' : '←'}
            </button>
            {onBack && (
              <button
                type="button"
                className={`dashboard-nav-btn ${isSidebarCollapsed ? 'icon-only' : ''}`}
                onClick={onBack}
                title="Back to home"
                aria-label="Back to home"
              >
                {isSidebarCollapsed ? '🏠' : '← Home'}
              </button>
            )}
          </div>
        </div>

        <div className="guides-grid">
          {GUIDES.map(guide => {
            const parentActive = isGuideActive(guide)
            return (
              <div key={guide.id} className="guide-group">
                <button
                  className={`guide-card ${parentActive ? 'active' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}
                  onClick={() => setActiveGuideId(guide.id)}
                  title={isSidebarCollapsed ? guide.name : undefined}
                  aria-label={guide.name}
                >
                  <div className="guide-header">
                    <span className="guide-icon">{guide.icon}</span>
                    {!isSidebarCollapsed && <h3>{guide.name}</h3>}
                  </div>
                  {!isSidebarCollapsed && <p>{guide.description}</p>}
                </button>
                {guide.children && !isSidebarCollapsed && (
                  <div className="sub-guide-list">
                    <div className="sub-guide-title">Submenu</div>
                    {guide.children.map(child => (
                      <button
                        key={child.id}
                        className={`guide-card sub ${activeGuideId === child.id ? 'active' : ''}`}
                        onClick={() => setActiveGuideId(child.id)}
                        title={child.name}
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
