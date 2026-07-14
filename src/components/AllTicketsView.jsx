import { useState, useMemo } from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function AllTicketsView({ tickets }) {
  const allTickets = useMemo(() => {
    let list = [];
    Object.keys(tickets).forEach(table => {
      tickets[table].forEach(t => {
        list.push({ ...t, table });
      });
    });
    return list;
  }, [tickets]);

  const [filterDs, setFilterDs] = useState('');
  const [filterTbl, setFilterTbl] = useState('');
  const [filterReq, setFilterReq] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const uniqueDatasets = useMemo(() => Array.from(new Set(allTickets.map(t => t.dataset).filter(Boolean))).sort(), [allTickets]);
  const uniqueTables = useMemo(() => Array.from(new Set(allTickets.map(t => t.table).filter(Boolean))).sort(), [allTickets]);
  const uniqueRequesters = useMemo(() => Array.from(new Set(allTickets.map(t => t.requester).filter(Boolean))).sort(), [allTickets]);

  const filteredTickets = useMemo(() => {
    let res = allTickets;
    if (filterDs) res = res.filter(t => (t.dataset || '') === filterDs);
    if (filterTbl) res = res.filter(t => (t.table || '') === filterTbl);
    if (filterReq) res = res.filter(t => (t.requester || '') === filterReq);
    if (filterStatus) res = res.filter(t => (t.status || '').toLowerCase() === filterStatus.toLowerCase());

    res.sort((a, b) => {
      const dA = new Date(a.date).getTime();
      const dB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dB - dA : dA - dB;
    });

    return res;
  }, [allTickets, filterDs, filterTbl, filterReq, filterStatus, sortOrder]);

  return (
    <div>
      <div className="page-title">All Tickets</div>
      <div className="page-sub">View and filter all submitted tickets across the platform.</div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={filterDs} onChange={e => setFilterDs(e.target.value)} style={{ width: 180 }}>
          <option value="">All Datasets</option>
          {uniqueDatasets.map(ds => <option key={ds} value={ds}>{ds}</option>)}
        </select>
        <select value={filterTbl} onChange={e => setFilterTbl(e.target.value)} style={{ width: 220 }}>
          <option value="">All Tables</option>
          {uniqueTables.map(tbl => <option key={tbl} value={tbl}>{tbl}</option>)}
        </select>
        <select value={filterReq} onChange={e => setFilterReq(e.target.value)} style={{ width: 160 }}>
          <option value="">All Requesters</option>
          {uniqueRequesters.map(req => <option key={req} value={req}>{req}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 160 }}>
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="DONE">Done</option>
        </select>
        <button className="btn-ghost" onClick={() => setSortOrder(s => s === 'desc' ? 'asc' : 'desc')}>
          Sort Date {sortOrder === 'desc' ? '↓' : '↑'}
        </button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflowX: 'auto' }}>
        <table className="history-list" style={{ marginBottom: 0 }}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Dataset</th>
              <th>Table</th>
              <th>Requester</th>
              <th>Date</th>
              <th>Status</th>
              <th>Jira Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(t => (
              <tr key={t.id}>
                <td style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{t.name || 'Untitled Ticket'}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--t3)' }}>{t.id}</span>
                </td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{t.dataset}</td>
                <td style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--accent)' }}>{t.table}</td>
                <td>{t.requester}</td>
                <td>{t.date}</td>
                <td><StatusBadge status={t.status} size="sm" /></td>
                <td>
                  <a href={`https://jira.company.com/browse/${t.id}`} target="_blank" rel="noreferrer" style={{ color: 'var(--link)', textDecoration: 'none', fontWeight: 600, fontSize: 12 }}>
                    View in Jira ↗
                  </a>
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: 'var(--t3)' }}>No tickets match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
