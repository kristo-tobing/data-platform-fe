import { getUserInfo } from '../data/mock.js';

export default function TopNav({ user, onLogout, onCreateClick, onNavigate, currentPage }) {
  const { displayName, division } = getUserInfo(user);
  return (
    <div className="topnav">
      <div className="nav-brand" style={{ marginRight: 20 }}>
        <div className="brand-icon">⬢</div>
        <div className="brand-text">Data<span>Platform</span></div>
      </div>

      <div style={{ display: 'flex', gap: 24, height: '100%' }}>
        <div 
          onClick={() => onNavigate && onNavigate('pipelines')}
          style={{ display: 'flex', alignItems: 'center', height: '100%', fontSize: 13, fontWeight: 600, borderBottom: currentPage === 'pipelines' ? '2px solid var(--accent)' : '2px solid transparent', color: currentPage === 'pipelines' ? 'var(--t1)' : 'var(--t2)', cursor: 'pointer', transition: 'all 0.15s' }}
        >
          Pipelines
        </div>
        <div 
          onClick={() => onNavigate && onNavigate('tickets')}
          style={{ display: 'flex', alignItems: 'center', height: '100%', fontSize: 13, fontWeight: 600, borderBottom: currentPage === 'tickets' ? '2px solid var(--accent)' : '2px solid transparent', color: currentPage === 'tickets' ? 'var(--t1)' : 'var(--t2)', cursor: 'pointer', transition: 'all 0.15s' }}
        >
          Tickets
        </div>
      </div>
      
      <div className="nav-search" style={{ marginLeft: 20 }}>
        <input type="text" placeholder="Search tables, datasets..." style={{ padding: '8px 12px', background: 'var(--elevated)', borderRadius: 20 }} />
      </div>
      
      <div className="nav-spacer"></div>
      
      <button className="btn-create" onClick={onCreateClick}>
        <span>＋</span> Create Request
      </button>
      
      <div className="nav-user" onClick={onLogout}>
        <div className="nav-avatar">{user.charAt(0).toUpperCase()}</div>
        <div>
          <div className="nav-uname">{displayName || user}</div>
          <div className="nav-urole" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {division && (
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                padding: '1px 6px', borderRadius: 8,
                background: 'rgba(47,129,247,0.15)', color: 'var(--accent)',
              }}>{division}</span>
            )}
            Data Engineer
          </div>
        </div>
      </div>
    </div>
  );
}
