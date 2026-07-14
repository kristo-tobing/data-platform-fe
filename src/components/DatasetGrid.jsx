import { useState } from 'react';
import StatusBadge from './StatusBadge.jsx';

function TableCard({ ds, tbl, tickets, isSelected, onClick }) {
  const latest = tickets[0];
  const status = latest ? latest.status : (tbl.latestStatus || 'CLOSED');
  const count = tickets.length;

  return (
    <div className={`tbl-card ${isSelected ? 'selected' : ''}`} onClick={() => onClick(ds.id, tbl.name)}>
      <div className="tc-top">
        <div className="tc-icon">⬡</div>
        <div>
          <div className="tc-name">{tbl.name}</div>
          <div className="tc-ds">{ds.id}</div>
        </div>
      </div>
      <div className="tc-foot">
        <StatusBadge status={status} size="sm" />
        <span className="tc-cnt">{count} ticket{count !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}

export default function DatasetGrid({ datasets, getTicketsForTable, selectedTable, onCardClick }) {
  const [collapsed, setCollapsed] = useState({});

  const toggle = (id) => setCollapsed(p => ({ ...p, [id]: !p[id] }));

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {datasets.map(ds => {
        const isCollapsed = collapsed[ds.id] || ds.locked;
        return (
          <div key={ds.id} className="ds-section">
            <div className="ds-section-hd" onClick={() => toggle(ds.id)}>
              <span className={`ds-arrow ${isCollapsed ? 'closed' : 'open'}`}>▼</span>
              <span className={`ds-dot ${ds.locked ? 'locked' : 'ok'}`}></span>
              <span className="ds-title"><span className="ds-title-name">{ds.id}</span></span>
              <span className="ds-pill">{ds.locked ? '🔒 No Access' : `${ds.tables.length} table${ds.tables.length !== 1 ? 's' : ''}`}</span>
              {ds.locked && <span className="ds-locked">Restricted</span>}
            </div>
            
            <div className="tbl-grid" style={{ display: isCollapsed ? 'none' : 'grid' }}>
              {!ds.locked && ds.tables.map(tblName => {
                const tickets = getTicketsForTable(tblName);
                return (
                  <TableCard 
                    key={tblName} 
                    ds={ds} 
                    tbl={{ name: tblName, latestStatus: tickets[0]?.status || 'CLOSED' }}
                    tickets={tickets}
                    isSelected={selectedTable === tblName}
                    onClick={onCardClick}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
