import React, { useState } from 'react';
import TopNav from '../components/TopNav.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import CreateModal from '../components/CreateModal.jsx';
import TicketDetailModal from '../components/TicketDetailModal.jsx';
import Toast from '../components/Toast.jsx';
import { useTickets } from '../hooks/useTickets.js';
import { useToast } from '../hooks/useToast.js';
import { getUserInfo } from '../data/mock.js';

export default function TicketsPage({ user, onLogout, onNavigate }) {
  const { datasets, tickets, getLatestTicket, submitTicket } = useTickets();
  const { toasts, addToast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewTicket, setViewTicket] = useState(null);
  const [filterTable, setFilterTable] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const userInfo = getUserInfo(user);
  const division = userInfo.division;

  const allTickets = Object.values(tickets).flat();

  const uniqueTables = Array.from(new Set(allTickets.map(t => t.table))).sort();

  const filteredTickets = allTickets.filter(t => {
    if (filterTable && t.table !== filterTable) return false;
    return true;
  });

  const sortedTickets = filteredTickets.sort((a, b) => {
    const dateDiff = sortOrder === 'desc' 
      ? new Date(b.date) - new Date(a.date) 
      : new Date(a.date) - new Date(b.date);
    return dateDiff !== 0 ? dateDiff : b.id.localeCompare(a.id);
  });

  return (
    <div className="page">
      <TopNav
        user={user}
        onLogout={onLogout}
        onCreateClick={() => setCreateOpen(true)}
        onNavigate={onNavigate}
        currentPage="tickets"
      />
      <div className="home-body">
        <main className="ds-main" style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
          <div className="page-title">All Requested Tickets</div>
          <div className="page-sub">View and track the status of all pipeline requests across divisions.</div>
          
          <div style={{ display: 'flex', gap: 16, marginTop: 24, alignItems: 'center' }}>
            <select
              value={filterTable}
              onChange={e => setFilterTable(e.target.value)}
              style={{ width: 260, padding: '8px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--t1)' }}
            >
              <option value="">All Target Tables</option>
              {uniqueTables.map(tbl => <option key={tbl} value={tbl}>{tbl}</option>)}
            </select>

            <button 
              onClick={() => setSortOrder(o => o === 'desc' ? 'asc' : 'desc')}
              style={{ padding: '8px 16px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--t1)', cursor: 'pointer' }}
            >
              Sort Date: {sortOrder === 'desc' ? 'Newest First ↓' : 'Oldest First ↑'}
            </button>
          </div>

          <div style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t2)' }}>Ticket ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t2)' }}>Ticket Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t2)' }}>Target Table</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t2)' }}>Requester</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t2)' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--t2)' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {sortedTickets.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: 'var(--t3)' }}>No tickets found.</td>
                  </tr>
                ) : (
                  sortedTickets.map(t => (
                    <tr 
                      key={t.id} 
                      onClick={() => setViewTicket(t)}
                      style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent)' }}>{t.id}</td>
                      <td style={{ padding: '12px 16px', color: 'var(--t1)' }}>{t.name}</td>
                      <td style={{ padding: '12px 16px' }}><span style={{ padding: '2px 6px', background: 'var(--bg)', borderRadius: 4, border: '1px solid var(--border)', fontSize: 12 }}>{t.dataset}.{t.table}</span></td>
                      <td style={{ padding: '12px 16px', color: 'var(--t2)' }}>{t.requester}</td>
                      <td style={{ padding: '12px 16px' }}><StatusBadge status={t.status} size="sm" /></td>
                      <td style={{ padding: '12px 16px', color: 'var(--t3)' }}>{t.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <CreateModal
        open={createOpen}
        user={user}
        onClose={() => setCreateOpen(false)}
        onSubmit={submitTicket}
        addToast={addToast}
        datasets={datasets}
        getLatestTicket={getLatestTicket}
      />
      <TicketDetailModal
        open={!!viewTicket}
        ticket={viewTicket}
        onClose={() => setViewTicket(null)}
      />
      <Toast toasts={toasts} />
    </div>
  );
}
