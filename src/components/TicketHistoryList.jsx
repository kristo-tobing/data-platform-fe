import StatusBadge from './StatusBadge.jsx';

export default function TicketHistoryList({ tickets, selectedId, onSelect }) {
  if (!tickets || tickets.length === 0) {
    return <div style={{ fontSize: 11, color: 'var(--t3)', padding: '5px 0' }}>No tickets</div>;
  }

  const displayTickets = tickets.length > 5 ? tickets.slice(0, 3) : tickets;
  const hiddenCount = tickets.length - displayTickets.length;

  return (
    <div style={{ overflowX: 'auto', marginBottom: 20 }}>
      <table className="history-list">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Date</th>
            <th>Status</th>
            <th>Requester</th>
          </tr>
        </thead>
        <tbody>
          {displayTickets.map(t => (
            <tr 
              key={t.id} 
              className={t.id === selectedId ? 'active' : ''}
              onClick={() => onSelect(t)}
            >
              <td style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontWeight: 600, color: t.id === selectedId ? 'var(--t1)' : 'var(--t2)' }}>{t.name || 'Untitled Ticket'}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--t3)' }}>{t.id}</span>
              </td>
              <td>{t.date}</td>
              <td><StatusBadge status={t.status} size="sm" /></td>
              <td>{t.requester}</td>
            </tr>
          ))}
          {hiddenCount > 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', fontSize: 11, color: 'var(--t3)', padding: '12px', background: 'var(--surface)' }}>
                ... and {hiddenCount} older tickets hidden
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
