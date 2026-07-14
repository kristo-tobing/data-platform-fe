import { useState, useEffect, useRef } from 'react';

/* ── Categorical Values Editor ──────────────────────────── */
function CategoricalEditor({ values = [], onChange }) {
  const [mode, setMode] = useState('individual'); // 'individual' | 'bulk'
  const [inputVal, setInputVal] = useState('');
  const [bulkText, setBulkText] = useState(values.join('\n'));
  const inputRef = useRef(null);

  const addValue = () => {
    const v = inputVal.trim();
    if (!v || values.includes(v)) { setInputVal(''); return; }
    onChange([...values, v]);
    setInputVal('');
    inputRef.current?.focus();
  };

  const removeValue = (idx) => onChange(values.filter((_, i) => i !== idx));

  const handleBulkImport = () => {
    const parsed = bulkText
      .split(/[\n,]+/)
      .map(v => v.trim())
      .filter(Boolean);
    const unique = [...new Set(parsed)];
    onChange(unique);
    setMode('individual');
  };

  const overLimit = values.length > 50;

  return (
    <div style={{ padding: '12px 14px', background: 'var(--bg)', borderTop: '1px solid var(--border-s)' }}>
      {/* Mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--t2)' }}>Input mode:</span>
        {['individual', 'bulk'].map(m => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); if (m === 'bulk') setBulkText(values.join('\n')); }}
            style={{
              padding: '2px 10px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: '1px solid var(--border)',
              background: mode === m ? 'var(--accent)' : 'transparent',
              color: mode === m ? '#fff' : 'var(--t2)',
              transition: 'all 0.15s',
            }}
          >
            {m === 'individual' ? '＋ Individual' : '⬇ Bulk Paste'}
          </button>
        ))}
        {values.length > 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: overLimit ? 'var(--orange)' : 'var(--t3)' }}>
            {values.length} value{values.length !== 1 ? 's' : ''}
            {overLimit ? ' · consider a lookup table' : ''}
          </span>
        )}
      </div>

      {mode === 'individual' ? (
        <>
          {/* Chip list */}
          {values.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {values.map((v, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 500,
                  background: 'var(--active)', border: '1px solid var(--border)',
                  color: 'var(--t1)', fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {v}
                  <button type="button" onClick={() => removeValue(i)} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--t3)',
                    fontSize: 13, padding: 0, lineHeight: 1, display: 'flex',
                  }}>×</button>
                </span>
              ))}
            </div>
          )}

          {/* Add input */}
          <div style={{ display: 'flex', gap: 6 }}>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addValue())}
              placeholder="Add a value and press Enter"
              style={{
                flex: 1, padding: '5px 8px', borderRadius: 4, fontSize: 11,
                border: '1px solid var(--border)', background: 'var(--elevated)',
                color: 'var(--t1)', fontFamily: "'JetBrains Mono', monospace", outline: 'none',
              }}
            />
            <button type="button" onClick={addValue} style={{
              padding: '5px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff',
            }}>
              Add
            </button>
          </div>

          {overLimit && (
            <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(154,103,0,0.08)', border: '1px solid rgba(154,103,0,0.25)', borderRadius: 4, fontSize: 10, color: 'var(--orange)' }}>
              ⚠ {values.length} values defined. For large lookup sets, consider referencing a dimension table in your SQL query instead.
            </div>
          )}
        </>
      ) : (
        <>
          <textarea
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            rows={6}
            placeholder={'Paste values separated by comma or newline:\n\npending\ncompleted\ncancelled'}
            style={{
              width: '100%', padding: '8px 10px', borderRadius: 4, fontSize: 11,
              border: '1px solid var(--border)', background: 'var(--elevated)',
              color: 'var(--t1)', fontFamily: "'JetBrains Mono', monospace",
              resize: 'vertical', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={handleBulkImport} style={{
              padding: '5px 14px', borderRadius: 4, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff',
            }}>
              Parse &amp; Import →
            </button>
            <span style={{ fontSize: 10, color: 'var(--t3)' }}>
              Supports newline or comma separated values. Duplicates are removed automatically.
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Schema Row ─────────────────────────────────────────── */
function Row({ row, onChange, onDelete, isLocked, expanded, onToggleExpand }) {
  const catValues = row.categorical?.values || [];
  const hasValues = catValues.length > 0;

  return (
    <>
      <tr>
        <td style={{ width: '35%' }}>
          <input className="sb-in" value={row.name} placeholder="column_name" disabled={isLocked}
            onChange={e => onChange({ ...row, name: e.target.value })} />
        </td>
        <td style={{ width: '40%' }}>
          <input className="sb-in" value={row.desc} placeholder="Description" disabled={isLocked}
            onChange={e => onChange({ ...row, desc: e.target.value })} />
        </td>
        <td style={{ width: '17%', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onToggleExpand}
            title={hasValues ? `${catValues.length} values defined` : 'Add categorical values'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s',
              border: `1px solid ${hasValues ? 'rgba(8,82,28,0.3)' : 'var(--border)'}`,
              background: expanded
                ? 'var(--accent)'
                : hasValues
                  ? 'rgba(26,127,55,0.1)'
                  : 'transparent',
              color: expanded ? '#fff' : hasValues ? 'var(--green)' : 'var(--t3)',
            }}
          >
            {hasValues ? `${catValues.length} vals` : '─'}
          </button>
        </td>
        <td style={{ width: '8%', textAlign: 'center' }}>
          {!isLocked && <button className="sb-del" type="button" onClick={onDelete}>×</button>}
          {isLocked && <span style={{ fontSize: 10, color: 'var(--t3)' }}>Locked</span>}
        </td>
      </tr>

      {/* Inline Categorical Editor */}
      {expanded && (
        <tr>
          <td colSpan={4} style={{ padding: 0, border: '1px solid var(--border)' }}>
            <CategoricalEditor
              values={catValues}
              onChange={vals => onChange({ ...row, categorical: { ...(row.categorical || {}), values: vals, enabled: vals.length > 0 } })}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function newRow() {
  return { id: Math.random().toString(36).slice(2), name: '', desc: '', categorical: { enabled: false, values: [] } };
}

/* ── SchemaBuilder ──────────────────────────────────────── */
export default function SchemaBuilder({ value = [], onChange, isUpdate = false }) {
  const [open, setOpen] = useState(value.length > 0);
  const [initialIds, setInitialIds] = useState(() => new Set((value || []).map(r => r.id)));
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    if (isUpdate && initialIds.size === 0 && value.length > 0) {
      setInitialIds(new Set(value.map(r => r.id)));
    }
  }, [isUpdate, value, initialIds.size]);

  const rows = value.length > 0 ? value : [];
  const totalMapped = rows.filter(r => r.categorical?.values?.length > 0).length;

  const updateRow = (idx, updated) => { const next = [...rows]; next[idx] = updated; onChange(next); };
  const deleteRow = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const addRow = () => onChange([...rows, newRow()]);

  const toggleExpand = (rowId) => setExpandedRowId(prev => prev === rowId ? null : rowId);

  return (
    <div style={{ marginTop: 12, paddingBottom: 8 }}>
      <div className="coll-hd" onClick={() => setOpen(o => !o)}>
        <span className={`coll-arr${open ? ' open' : ''}`}>▶</span>
        <span className="coll-lbl"><strong>Schema Definition</strong></span>
        <span className="coll-badge">
          {rows.filter(r => r.name).length > 0
            ? `${rows.filter(r => r.name).length} columns${totalMapped > 0 ? ` · ${totalMapped} mapped` : ''} ✓`
            : 'Optional'}
        </span>
      </div>

      {open && (
        <div style={{ overflowX: 'auto' }}>
          <table className="sb-tbl" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ width: '35%', padding: '8px 12px', textAlign: 'left', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>Column Name</th>
                <th style={{ width: '40%', padding: '8px 12px', textAlign: 'left', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>Description</th>
                <th style={{ width: '17%', padding: '8px 12px', textAlign: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                  Values
                  <span style={{ marginLeft: 4, fontSize: 9, fontWeight: 400, color: 'var(--t3)', textTransform: 'none' }}>categorical</span>
                </th>
                <th style={{ width: '8%', padding: '8px 12px', textAlign: 'center', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <Row
                  key={row.id || idx}
                  row={row}
                  isLocked={isUpdate && initialIds.has(row.id)}
                  expanded={expandedRowId === (row.id || idx)}
                  onChange={r => updateRow(idx, r)}
                  onDelete={() => deleteRow(idx)}
                  onToggleExpand={() => toggleExpand(row.id || idx)}
                />
              ))}
            </tbody>
          </table>
          <button className="btn-addcol" type="button" onClick={addRow} style={{ marginTop: 12 }}>
            ＋ Add Column
          </button>
        </div>
      )}
    </div>
  );
}
