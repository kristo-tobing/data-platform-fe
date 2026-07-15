import { useState, useEffect } from 'react';
import LabelPicker from './LabelPicker.jsx';
import SchedulePicker from './SchedulePicker.jsx';
import { scheduleFromTicket } from '../utils/scheduleUtils.js';
import UpdateStrategyPicker from './UpdateStrategyPicker.jsx';
import QueryConsole from './QueryConsole.jsx';
import SchemaBuilder from './SchemaBuilder.jsx';
import TicketHistoryList from './TicketHistoryList.jsx';
import { DATASETS, peekNextId } from '../data/mock.js';
import { extractColumnsFromSql } from '../utils/sqlParser.js';

export default function UpdateDrawer({ open, dataset, table, tickets, onClose, onSubmit, addToast, readOnly }) {
  const [activeTicket, setActiveTicket] = useState(null);

  const [ticketName, setTicketName] = useState('');
  const [user, setUser] = useState('');
  const [domainLabels, setDomainLabels] = useState([]);
  const [desc, setDesc] = useState('');
  const [reason, setReason] = useState('');
  const [ds, setDs] = useState('');
  const [tbl, setTbl] = useState('');
  const [updateStrategy, setUpdateStrategy] = useState('overwrite');
  const [schedule, setSchedule] = useState({});
  const [sql, setSql] = useState('');
  const [schema, setSchema] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const cols = extractColumnsFromSql(sql);
    setSchema(prev => {
      let next = [...prev];
      let changed = false;

      const existingNames = new Set(next.filter(r => r.name).map(r => r.name));
      for (const c of cols) {
        if (!existingNames.has(c)) {
          next.push({ id: Math.random().toString(36).slice(2), name: c, desc: '' });
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [sql, open]);


  // Initialize form when drawer opens or table changes
  useEffect(() => {
    if (open && tickets.length > 0) {
      loadTicket(tickets[0]);
    }
  }, [open, table, tickets]); // eslint-disable-line

  const loadTicket = (t) => {
    setActiveTicket(t);
    setTicketName(t.name || '');
    setUser(t.requester || '');
    setDomainLabels(t.domainLabels || ['collection']);
    setDesc(t.desc || '');
    setReason(t.reason || '');
    setDs(t.dataset || dataset);
    setTbl(t.table || table);
    setUpdateStrategy(t.updateStrategy || 'overwrite');
    setSchedule(scheduleFromTicket(t));
    setSql(t.sql || '');
    setSchema(t.schema || []);
  };

  const handleSubmit = () => {
    if (!ticketName || !user || !desc || !ds || !tbl || !reason) {
      addToast('error', 'Missing fields', 'Please fill in Name, User, Reason to change, Description, Dataset, and Table.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ name: ticketName, requester: user, operation: 'Update', domainLabels, desc, reason, dataset: ds, table: tbl, updateStrategy, ...schedule, sql, schema });
      setSubmitting(false);
      addToast('success', 'Update submitted!', `New ticket created for ${tbl}`);
    }, 1300);
  };

  return (
    <div className={`ticket-drawer ${open ? 'open' : ''}`}>
      <div className="drawer-hd">
        <div className="drawer-top">
          <div className="drawer-bc">
            <span>{ds || dataset}</span><span className="bc-sep">/</span><span className="bc-tbl">{tbl || table}</span>
          </div>
          <button className="drawer-close" onClick={onClose}>✕</button>
        </div>
      </div>

      <div className="drawer-body">
        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--t3)' }}>
            No tickets yet for this table.
          </div>
        ) : (
          <>
            <TicketHistoryList
              tickets={tickets}
              selectedId={activeTicket?.id}
              onSelect={loadTicket}
            />

            {activeTicket && (
              <div style={{ marginTop: 24 }}>
                {activeTicket.status === 'REJECTED' && (
                  <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 6, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16 }}>❌</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', marginBottom: 4 }}>Reviewer Comment</div>
                      <div style={{ fontSize: 13, color: 'var(--t1)', lineHeight: 1.4 }}>{activeTicket.rejectComment || 'Ticket was rejected by reviewer.'}</div>
                    </div>
                  </div>
                )}

                {readOnly ? (
                  <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="info-banner" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--t2)' }}>
                      <span>👁️</span>
                      <span>Viewing in <strong>Read-Only</strong> mode. You can only edit datasets in your division.</span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Requester</div>
                        <div style={{ fontSize: 14, color: 'var(--t1)' }}>{activeTicket.requester}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Date</div>
                        <div style={{ fontSize: 14, color: 'var(--t1)' }}>{activeTicket.date}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Operation</div>
                        <div style={{ fontSize: 14, color: 'var(--t1)' }}>{activeTicket.operation}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Divisions</div>
                        <div style={{ fontSize: 14, color: 'var(--t1)', display: 'flex', gap: 4 }}>
                          {activeTicket.domainLabels?.length ? activeTicket.domainLabels.map(l => (
                            <span key={l} style={{ padding: '2px 6px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, textTransform: 'capitalize' }}>{l}</span>
                          )) : '-'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Pipeline Description</div>
                      <div style={{ fontSize: 14, color: 'var(--t1)', padding: 12, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6 }}>
                        {activeTicket.desc || '-'}
                      </div>
                    </div>

                    {activeTicket.operation === 'Update' && activeTicket.reason && (
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Reason to Change</div>
                        <div style={{ fontSize: 14, color: 'var(--t1)', padding: 12, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6 }}>
                          {activeTicket.reason}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Update Strategy</div>
                        <div style={{ fontSize: 14, color: 'var(--t1)', textTransform: 'capitalize' }}>{activeTicket.updateStrategy || '-'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>Schedule</div>
                        <div style={{ fontSize: 14, color: 'var(--t1)' }}>{activeTicket.freq || 'daily'} at {activeTicket.time || '00:00'} ({activeTicket.timezone || 'UTC'})</div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: 12, color: 'var(--t3)', marginBottom: 4 }}>SQL Query</div>
                      <div className="m-monaco" style={{ height: 'auto', minHeight: 100 }}>
                        <textarea 
                          className="m-editor" 
                          value={activeTicket.sql} 
                          disabled 
                          style={{ height: 150, color: 'var(--t1)' }} 
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="info-banner">
                      <span>✏️</span>
                      <span>Editing <strong>{activeTicket.id}</strong> · Changes will create a new update ticket (<strong>{peekNextId()}</strong>).</span>
                    </div>

                    <div className="f-sec">Request Details</div>
                    <div className="f-row full">
                      <div className="f-grp">
                        <label className="f-lbl">Ticket Name <span className="req">*</span></label>
                        <input type="text" value={ticketName} onChange={e => setTicketName(e.target.value)} />
                      </div>
                    </div>
                    <div className="f-row">
                      <div className="f-grp">
                        <label className="f-lbl">User <span className="req">*</span></label>
                        <input type="text" value={user} onChange={e => setUser(e.target.value)} />
                      </div>
                      <div className="f-grp">
                        <label className="f-lbl">Operation <span className="req">*</span></label>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <div style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid var(--border)', color: 'var(--t2)', opacity: 0.5 }}>Create</div>
                          <div style={{ background: '#d29922', color: '#fff', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid #d29922' }}>Update</div>
                        </div>
                      </div>
                    </div>
                    <div className="f-row full">
                      <div className="f-grp">
                        <label className="f-lbl">Division <span className="req">*</span></label>
                        <LabelPicker selected={domainLabels} onChange={setDomainLabels} />
                      </div>
                    </div>
                    <div className="f-row full">
                      <div className="f-grp">
                        <label className="f-lbl">Reason to Change <span className="req">*</span></label>
                        <textarea rows={2} value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain why this pipeline needs to be updated..." />
                      </div>
                    </div>
                    <div className="f-row full">
                      <div className="f-grp">
                        <label className="f-lbl">Pipeline Description <span className="req">*</span></label>
                        <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
                      </div>
                    </div>

                    <div className="f-sec">Target Unit</div>
                    <div className="f-row full">
                      <div className="f-grp">
                        <label className="f-lbl">Dataset &amp; Table <span className="req">*</span></label>
                        <div className="unit-row">
                          <select value={ds} onChange={e => setDs(e.target.value)} style={{ flex: 1 }}>
                            <option value="">— Select dataset —</option>
                            {DATASETS.filter(d => !d.locked).map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
                          </select>
                          <span className="unit-sep">.</span>
                          <input style={{ flex: 2, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }} value={tbl} onChange={e => setTbl(e.target.value)} />
                        </div>
                        <div className="unit-preview">{ds && tbl ? `→ ${ds}.${tbl}` : ''}</div>
                      </div>
                    </div>

                    <div className="f-sec">Schedule &amp; Execution</div>
                    <UpdateStrategyPicker value={updateStrategy} onChange={setUpdateStrategy} />
                    <SchedulePicker value={schedule} onChange={setSchedule} />

                    <QueryConsole value={sql} onChange={setSql} dataset={ds} table={tbl} required />
                    <SchemaBuilder value={schema} onChange={setSchema} isUpdate={true} />
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="drawer-ft">
        <div className="drawer-ref">
          {activeTicket ? (readOnly ? `Viewing: ${activeTicket.id} · ${activeTicket.date}` : `Editing: ${activeTicket.id} · ${activeTicket.date}`) : ''}
        </div>
        {!readOnly && (
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting || tickets.length === 0}>
            {submitting ? <><div className="spinner"></div> Submitting…</> : 'Submit Request'}
          </button>
        )}
      </div>
    </div>
  );
}
