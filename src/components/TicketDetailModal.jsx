import React from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function TicketDetailModal({ open, ticket, onClose }) {
  if (!open || !ticket) return null;

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 800 }}>
        <div className="modal-hd">
          <div className="modal-hd-icon">📄</div>
          <div>
            <div className="modal-title">{ticket.name}</div>
            <div className="modal-sub" style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent)', fontWeight: 600 }}>{ticket.id}</span>
              •
              <span>{ticket.dataset}.{ticket.table}</span>
              •
              <StatusBadge status={ticket.status} size="sm" />
            </div>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
          {ticket.status === 'REJECTED' && ticket.rejectComment && (
            <div style={{ padding: 12, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6, color: 'var(--red)', fontSize: 13 }}>
              <strong>Rejection Reason:</strong> {ticket.rejectComment}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Requester</div>
              <div style={{ fontSize: 14, color: 'var(--t1)' }}>{ticket.requester}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Date</div>
              <div style={{ fontSize: 14, color: 'var(--t1)' }}>{ticket.date}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Operation</div>
              <div style={{ fontSize: 14, color: 'var(--t1)' }}>{ticket.operation}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Divisions</div>
              <div style={{ fontSize: 14, color: 'var(--t1)', display: 'flex', gap: 4 }}>
                {ticket.domainLabels?.length ? ticket.domainLabels.map(l => (
                  <span key={l} style={{ padding: '2px 6px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, textTransform: 'capitalize' }}>{l}</span>
                )) : '-'}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Pipeline Description</div>
            <div style={{ fontSize: 14, color: 'var(--t1)', padding: 12, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6 }}>
              {ticket.desc || '-'}
            </div>
          </div>

          {ticket.operation === 'Update' && ticket.reason && (
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Reason to Change</div>
              <div style={{ fontSize: 14, color: 'var(--t1)', padding: 12, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6 }}>
                {ticket.reason}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Update Strategy</div>
              <div style={{ fontSize: 14, color: 'var(--t1)', textTransform: 'capitalize' }}>{ticket.updateStrategy || '-'}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Schedule</div>
              <div style={{ fontSize: 14, color: 'var(--t1)' }}>{ticket.freq || 'daily'} at {ticket.time || '00:00'} ({ticket.timezone || 'UTC'})</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>SQL Query</div>
            <div className="m-monaco" style={{ height: 'auto', minHeight: 100 }}>
              <textarea 
                className="m-editor" 
                value={ticket.sql} 
                disabled 
                style={{ height: 150, color: 'var(--t1)' }} 
              />
            </div>
          </div>

        </div>
        <div className="modal-ft">
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
