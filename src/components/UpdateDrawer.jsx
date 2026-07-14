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

export default function UpdateDrawer({ open, dataset, table, tickets, onClose, onSubmit, addToast }) {
  const [activeTicket, setActiveTicket] = useState(null);

  const [ticketName, setTicketName] = useState('');
  const [user, setUser] = useState('');
  const [domainLabels, setDomainLabels] = useState([]);
  const [desc, setDesc] = useState('');
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
    setDs(t.dataset || dataset);
    setTbl(t.table || table);
    setUpdateStrategy(t.updateStrategy || 'overwrite');
    setSchedule(scheduleFromTicket(t));
    setSql(t.sql || '');
    setSchema(t.schema || []);
  };

  const handleSubmit = () => {
    if (!ticketName || !user || !desc || !ds || !tbl) {
      addToast('error', 'Missing fields', 'Please fill in Name, User, Description, Dataset, and Table.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ name: ticketName, requester: user, operation: 'Update', domainLabels, desc, dataset: ds, table: tbl, updateStrategy, ...schedule, sql, schema });
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
                    <label className="f-lbl">Domain Labels <span className="req">*</span></label>
                    <LabelPicker selected={domainLabels} onChange={setDomainLabels} />
                  </div>
                </div>
                <div className="f-row full">
                  <div className="f-grp">
                    <label className="f-lbl">Description <span className="req">*</span></label>
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
              </div>
            )}
          </>
        )}
      </div>

      <div className="drawer-ft">
        <div className="drawer-ref">
          {activeTicket ? `Editing: ${activeTicket.id} · ${activeTicket.date}` : ''}
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={submitting || tickets.length === 0}>
          {submitting ? <><div className="spinner"></div> Submitting…</> : 'Submit Request'}
        </button>
      </div>
    </div>
  );
}
