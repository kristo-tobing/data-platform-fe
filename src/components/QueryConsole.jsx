import { useState } from 'react';

export default function QueryConsole({ value = '', onChange, dataset, table, required = false }) {
  const [dryResult, setDryResult] = useState(null);
  const [runningDry, setRunningDry] = useState(false);
  const [open, setOpen] = useState(required || !!value);
  const [dryBytes, setDryBytes] = useState(0);
  const [dryCost, setDryCost] = useState(0);

  const handleDryRun = () => {
    setRunningDry(true);
    setDryResult(null);
    setTimeout(() => {
      setRunningDry(false);
      const pii = value.toLowerCase().includes('customer_id') || value.toLowerCase().includes('email') || value.toLowerCase().includes('phone');
      const bytes = Math.floor(Math.random() * 500) + 100;
      setDryBytes(bytes);
      setDryCost((bytes * 0.005).toFixed(4));
      setDryResult(pii ? 'warn' : 'ok');
    }, 800);
  };

  return (
    <div style={{ marginTop: 18 }}>
      <div className="coll-hd" onClick={() => setOpen(o => !o)}>
        <span className={`coll-arr${open ? ' open' : ''}`}>▶</span>
        <span className="coll-lbl"><strong>Query Console</strong></span>
        <span className="coll-badge" style={required && !value ? { color: 'var(--red)', borderColor: 'var(--red)' } : {}}>
          {required ? (value ? 'Included ✓' : 'Required *') : (value ? 'Included ✓' : 'Optional')}
        </span>
      </div>

      {open && (
        <div>
          {/* Target table info */}
          {dataset && table && table !== 'NEW' && (
            <div style={{ padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderBottom: 'none', fontSize: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 14 }}>
                  <strong>Target:</strong> <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--accent)' }}>{dataset}.{table}</span>
                </div>
              </div>
              <div style={{ fontWeight: 600, marginBottom: 4, color: 'var(--t2)' }}>Table Columns (Schema):</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid var(--border)' }}>
                <thead style={{ background: 'var(--surface)', textAlign: 'left' }}>
                  <tr>
                    <th style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>Field name</th>
                    <th style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>Type</th>
                    <th style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>Mode</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: "'JetBrains Mono',monospace" }}>
                  <tr>
                    <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>id</td>
                    <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)', color: 'var(--accent)' }}>STRING</td>
                    <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>REQUIRED</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>status</td>
                    <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)', color: 'var(--accent)' }}>STRING</td>
                    <td style={{ padding: '4px 8px', borderBottom: '1px solid var(--border)' }}>NULLABLE</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '4px 8px' }}>created_at</td>
                    <td style={{ padding: '4px 8px', color: 'var(--accent)' }}>TIMESTAMP</td>
                    <td style={{ padding: '4px 8px' }}>REQUIRED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <div className="m-monaco">
            <div className="m-bar">
              <div className="m-tab"><span className="m-tab-icon">◈</span> query.sql</div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <button className="m-btn clr" type="button" onClick={() => { onChange(''); setDryResult(null); }}>✕ Clear</button>
                <button className="m-btn dry" type="button" onClick={handleDryRun} disabled={runningDry}>
                  {runningDry ? '⏳ Checking…' : '▶ Dry Run'}
                </button>
              </div>
            </div>
            <textarea
              className="m-editor"
              value={value}
              onChange={e => { onChange(e.target.value); setDryResult(null); }}
              spellCheck={false}
              placeholder="-- Write your BigQuery SQL here…"
            />
            <div className="m-statusbar">
              BigQuery Dialect
              <span style={{ marginLeft: 16, color: 'var(--accent)' }}>LIMIT 100 enforced</span>
              <span style={{ marginLeft: 'auto' }}>SQL · UTF-8</span>
            </div>
          </div>

          <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(210,153,34,0.1)', border: '1px solid #d29922', borderRadius: 4, fontSize: 11, color: 'var(--t1)' }}>
            <strong>💡 Tip:</strong> Consider filtering on partitioned columns (like <code>created_at</code>) in your WHERE clause to minimize bytes scanned and reduce query costs.
          </div>

          {dryResult === 'ok' && (
            <div className="dr-result ok show">
              <div className="dr-icon">✓</div>
              <div>
                <div className="dr-title">Dry Run Passed</div>
                <div className="dr-detail"><strong>Status:</strong> Passed &nbsp;|&nbsp; <strong>Scanned:</strong> {dryBytes} MB &nbsp;|&nbsp; <strong>Est. Cost:</strong> ${dryCost} &nbsp;|&nbsp; <strong>PII:</strong> None &nbsp;|&nbsp; <strong>Syntax:</strong> Valid</div>
              </div>
            </div>
          )}
          {dryResult === 'warn' && (
            <div className="dr-result warn show">
              <div className="dr-icon">⚠</div>
              <div>
                <div className="dr-title">Dry Run Warning</div>
                <div className="dr-detail"><strong>Status:</strong> Warning &nbsp;|&nbsp; <strong>Scanned:</strong> {dryBytes} MB &nbsp;|&nbsp; <strong>Est. Cost:</strong> ${dryCost} &nbsp;|&nbsp; <strong>PII:</strong> Detected</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
