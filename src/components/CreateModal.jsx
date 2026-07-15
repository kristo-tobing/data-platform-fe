import { useState, useEffect } from 'react';
import LabelPicker from './LabelPicker.jsx';
import SchedulePicker from './SchedulePicker.jsx';
import UpdateStrategyPicker from './UpdateStrategyPicker.jsx';
import QueryConsole from './QueryConsole.jsx';
import SchemaBuilder from './SchemaBuilder.jsx';
import StatusBadge from './StatusBadge.jsx';
import { DATASETS, peekNextId } from '../data/mock.js';
import { extractColumnsFromSql } from '../utils/sqlParser.js';

export default function CreateModal({ open, user: currentUser, onClose, onSubmit, addToast, datasets, getLatestTicket }) {
  const [user, setUser] = useState(currentUser);
  const [ticketName, setTicketName] = useState('');
  const [opLabel, setOpLabel] = useState('Create');
  const [domainLabels, setDomainLabels] = useState(['collection']);
  const [desc, setDesc] = useState('');
  const [ds, setDs] = useState('');
  const [tblSelect, setTblSelect] = useState('');
  const [newTbl, setNewTbl] = useState('');
  
  const [updateStrategy, setUpdateStrategy] = useState('overwrite');
  const [schedule, setSchedule] = useState({});
  const [sql, setSql] = useState('');
  const [schema, setSchema] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [queryValid, setQueryValid] = useState(false);

  useEffect(() => {
    if (!open) return;
    
    const cols = extractColumnsFromSql(sql);
    setSchema(prev => {
      let next = [...prev];
      let changed = false;
      
      if (opLabel === 'Create') {
        const originalLength = next.length;
        // Keep rows that have no name (manual entries) OR that exist in the SQL query
        next = next.filter(row => !row.name || cols.includes(row.name));
        if (next.length !== originalLength) changed = true;
      }
      
      const existingNames = new Set(next.filter(r => r.name).map(r => r.name));
      for (const c of cols) {
        if (!existingNames.has(c)) {
          next.push({ id: Math.random().toString(36).slice(2), name: c, desc: '' });
          changed = true;
        }
      }
      
      return changed ? next : prev;
    });
  }, [sql, opLabel, open]);

  if (!open) return null;

  const activeDs = datasets.find(d => d.id === ds);
  const existingTables = activeDs ? activeDs.tables : [];
  
  const handleDatasetChange = (e) => {
    setDs(e.target.value);
    setTblSelect('');
    setNewTbl('');
    setOpLabel('Create');
  };

  const handleTableChange = (e) => {
    const val = e.target.value;
    setTblSelect(val);
    if (val !== 'NEW' && val !== '') {
      // Pre-fill from latest ticket if it exists
      const latest = getLatestTicket(val);
      if (latest) {
        setTicketName(latest.name || '');
        setUser(latest.requester || currentUser);
        setDomainLabels(latest.domainLabels || ['collection']);
        setDesc(latest.desc || '');
        setUpdateStrategy(latest.updateStrategy || 'overwrite');
        setSchedule({
          freq: latest.freq || 'daily', time: latest.time || '06:00',
          timezone: latest.timezone || 'UTC', endDate: latest.endDate || '2026-12-31',
          days: ['1'], dom: '1', custom: latest.schedule || '0 6 * * *',
        });
        setSql(latest.sql || '');
        setSchema(latest.schema || []);
        addToast('success', 'Form pre-filled', `Loaded latest config from ${val}`);
      }
      setOpLabel('Update');
    } else {
      setNewTbl('');
      setOpLabel('Create');
    }
  };

  const finalTbl = tblSelect === 'NEW' ? newTbl : tblSelect;

  const handleSubmit = () => {
    if (!ticketName || !user || !desc || !ds || !finalTbl || !sql.trim()) {
      addToast('error', 'Missing fields', 'Please fill in all required fields including the Query.');
      return;
    }
    if (!queryValid) {
      addToast('error', 'Validation Failed', 'Please run validation and ensure no blocker errors exist.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({ name: ticketName, requester: user, operation: opLabel, domainLabels, desc, dataset: ds, table: finalTbl, updateStrategy, ...schedule, sql, schema });
      setSubmitting(false);
      onClose();
      addToast('success', 'Ticket submitted!', `New ticket created for ${finalTbl}`);
    }, 1400);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target.className === 'modal-overlay' && onClose()}>
      <div className="modal">
        <div className="modal-hd">
          <div className="modal-hd-icon">✨</div>
          <div>
            <div className="modal-title">Create Request</div>
            <div className="modal-sub">Submit a new BigQuery pipeline ticket</div>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Ticket ID:</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, fontWeight: 700, color: 'var(--t1)' }}>{peekNextId()}</span>
            <div style={{ width: 1, height: 12, background: 'var(--border)', margin: '0 8px' }}></div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--t2)' }}>Initial Status:</span>
            <StatusBadge status="OPEN" />
          </div>

          <div className="f-sec">Request Details</div>
          <div className="f-row full">
            <div className="f-grp">
              <label className="f-lbl">Ticket Name <span className="req">*</span></label>
              <input type="text" value={ticketName} onChange={e => setTicketName(e.target.value)} placeholder="e.g. Daily Sales Pipeline" />
            </div>
          </div>
          <div className="f-row">
            <div className="f-grp">
              <label className="f-lbl">User <span className="req">*</span></label>
              <input type="text" value={user} disabled style={{ backgroundColor: 'var(--surface)', color: 'var(--t3)', cursor: 'not-allowed', border: '1px solid var(--border)' }} />
            </div>
            <div className="f-grp">
              <label className="f-lbl">Operation <span className="req">*</span></label>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={opLabel === 'Create' ? {background:'var(--accent)', color:'#fff', padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'1px solid var(--accent)'} : {padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'1px solid var(--border)', color:'var(--t2)', opacity:0.5}}>Create</div>
                <div style={opLabel === 'Update' ? {background:'#d29922', color:'#fff', padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'1px solid #d29922'} : {padding:'5px 14px', borderRadius:20, fontSize:12, fontWeight:600, border:'1px solid var(--border)', color:'var(--t2)', opacity:0.5}}>Update</div>
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
                <select value={ds} onChange={handleDatasetChange} style={{ flex: 1 }}>
                  <option value="">— Select dataset —</option>
                  {DATASETS.filter(d => !d.locked).map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
                </select>
                <span className="unit-sep">.</span>
                <select value={tblSelect} onChange={handleTableChange} style={{ flex: 2 }} disabled={!ds}>
                  <option value="">— Select table —</option>
                  {existingTables.map(t => <option key={t} value={t}>{t}</option>)}
                  <option disabled>──────────</option>
                  <option value="NEW">＋ New table…</option>
                </select>
              </div>
              {tblSelect === 'NEW' && (
                <div style={{ marginTop: 10 }}>
                  <input placeholder="Enter new table name..." value={newTbl} onChange={e => setNewTbl(e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }} autoFocus />
                </div>
              )}
              <div className="unit-preview">{ds && finalTbl ? `→ ${ds}.${finalTbl}` : ''}</div>
            </div>
          </div>

          <div className="f-sec">Schedule &amp; Execution</div>
          <UpdateStrategyPicker value={updateStrategy} onChange={setUpdateStrategy} />
          <SchedulePicker value={schedule} onChange={setSchedule} />

          <QueryConsole 
            value={sql} 
            onChange={setSql} 
            dataset={ds} 
            table={finalTbl} 
            required 
            onValidationComplete={setQueryValid} 
          />
          <SchemaBuilder value={schema} onChange={setSchema} isUpdate={opLabel === 'Update'} />
        </div>

        <div className="modal-ft">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={submitting || !queryValid}>
            {submitting ? <><div className="spinner"></div> Submitting…</> : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
