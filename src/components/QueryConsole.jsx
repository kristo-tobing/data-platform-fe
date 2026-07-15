import { useState, useEffect } from 'react';

const validationChecksDef = [
  { id: 'syntax', name: 'Syntax Validation', isBlocker: true },
  { id: 'existence', name: 'Table & Object Existence', isBlocker: true },
  { id: 'schema', name: 'Schema Validation', isBlocker: true },
  { id: 'parameter', name: 'Parameter Check', isBlocker: true },
  { id: 'cost', name: 'Cost Estimation', isBlocker: false },
  { id: 'pii', name: 'PII & Naming Convention', isBlocker: false },
  { id: 'reference', name: 'Table Reference Check', isBlocker: false },
  { id: 'categorical', name: 'Column Categorical Mapping', isBlocker: false }
];

export default function QueryConsole({ value = '', onChange, dataset, table, required = false, onValidationComplete }) {
  const [open, setOpen] = useState(required || !!value);
  const [runningDry, setRunningDry] = useState(false);
  const [checkResults, setCheckResults] = useState(null);
  const [simMode, setSimMode] = useState('demo-error');

  useEffect(() => {
    setCheckResults(null);
    if (onValidationComplete) onValidationComplete(false);
  }, [value]);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const handleDryRun = async () => {
    if (!value.trim()) return;
    setRunningDry(true);
    if (onValidationComplete) onValidationComplete(false);

    let results = validationChecksDef.map(c => ({ ...c, status: 'pending', detail: 'Pending' }));
    setCheckResults([...results]);

    let hasBlockerError = false;

    for (let i = 0; i < results.length; i++) {
      const check = results[i];

      if (hasBlockerError) {
        results[i] = { ...check, status: 'pending', detail: 'Skipped' };
        setCheckResults([...results]);
        continue;
      }

      results[i] = { ...check, status: 'running', detail: 'Running...' };
      setCheckResults([...results]);

      await sleep(300 + Math.random() * 200);

      let status = 'success';
      let detail = 'Passed';

      if (check.id === 'syntax' && simMode === 'demo-error') {
        status = 'error';
        detail = 'Failed (Syntax Error)';
      } else if (!check.isBlocker) {
        if (check.id === 'cost' && (simMode === 'demo-error' || simMode === 'demo-warning')) {
          status = 'warning';
          detail = 'High Cost Warning';
        } else if (check.id === 'pii' && (simMode === 'demo-error' || simMode === 'demo-warning')) {
          status = 'warning';
          detail = 'PII Detected';
        } else if (check.id === 'reference' && (simMode === 'demo-error' || simMode === 'demo-warning')) {
          status = 'warning';
          detail = 'Uses other division table';
        }
      }

      results[i] = { ...check, status, detail };
      setCheckResults([...results]);

      if (status === 'error' && check.isBlocker) {
        hasBlockerError = true;
      }
    }

    setRunningDry(false);
    if (onValidationComplete) {
      onValidationComplete(!hasBlockerError);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '◈';
      case 'running': return '⏳';
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return '◈';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--green)';
      case 'warning': return '#d29922';
      case 'error': return 'var(--red)';
      case 'running': return 'var(--accent)';
      default: return 'var(--t3)';
    }
  };

  return (
    <div style={{ marginTop: 18 }}>
      <div className="coll-hd" onClick={() => setOpen(o => !o)}>
        <span className={`coll-arr${open ? ' open' : ''}`}>▶</span>
        <span className="coll-lbl"><strong>Query Console &amp; Validation</strong></span>
        <span className="coll-badge" style={required && !value ? { color: 'var(--red)', borderColor: 'var(--red)' } : {}}>
          {required ? (value ? 'Included ✓' : 'Required *') : (value ? 'Included ✓' : 'Optional')}
        </span>
      </div>

      {open && (
        <div>
          {dataset && table && table !== 'NEW' && (
            <div style={{ padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderBottom: 'none', fontSize: 12 }}>
              <div style={{ fontSize: 14, marginBottom: 12 }}>
                <strong>Target:</strong> <span style={{ fontFamily: "'JetBrains Mono',monospace", color: 'var(--accent)' }}>{dataset}.{table}</span>
              </div>
            </div>
          )}

          <div className="m-monaco">
            <div className="m-bar">
              <div className="m-tab"><span className="m-tab-icon">◈</span> query.sql</div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <select 
                  value={simMode} 
                  onChange={e => setSimMode(e.target.value)}
                  style={{ background: 'var(--surface)', color: 'var(--t2)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, padding: '2px 6px' }}
                >
                  <option value="demo-error">Demo: Error + Warning</option>
                  <option value="demo-warning">Demo: Warnings Only</option>
                  <option value="demo-pass">Demo: All Passed</option>
                </select>
                <button className="m-btn clr" type="button" onClick={() => onChange('')}>✕ Clear</button>
                <button className="m-btn dry" type="button" onClick={handleDryRun} disabled={runningDry || !value.trim()}>
                  {runningDry ? '⏳ Running Validation…' : '▶ Run Validation'}
                </button>
              </div>
            </div>
            <textarea
              className="m-editor"
              value={value}
              onChange={e => onChange(e.target.value)}
              spellCheck={false}
              placeholder="-- Write your BigQuery SQL here…"
            />
            <div className="m-statusbar">
              BigQuery Dialect
              <span style={{ marginLeft: 16, color: 'var(--accent)' }}>Validation enforced</span>
              <span style={{ marginLeft: 'auto' }}>SQL · UTF-8</span>
            </div>
          </div>

          <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(210,153,34,0.1)', border: '1px solid #d29922', borderRadius: 4, fontSize: 11, color: 'var(--t1)' }}>
            <strong>💡 Tip:</strong> Validation must pass without mandatory errors to submit. Warnings are allowed.
          </div>

          {checkResults && (
            <div style={{ marginTop: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontWeight: 600, fontSize: 13, background: 'rgba(255,255,255,0.02)' }}>
                Validation Results
              </div>
              <div>
                {checkResults.map(check => (
                  <div key={check.id} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: 13 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ color: getStatusColor(check.status), fontWeight: 'bold', width: 20, textAlign: 'center' }}>
                        {getStatusIcon(check.status)}
                      </div>
                      <div style={{ color: check.status === 'pending' ? 'var(--t3)' : 'var(--t1)' }}>
                        {check.name}
                        {check.isBlocker && (
                          <span style={{ marginLeft: 8, fontSize: 10, padding: '2px 6px', background: 'rgba(255,255,255,0.1)', borderRadius: 4, color: 'var(--t3)' }}>
                            MANDATORY
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: 12, fontWeight: 600, 
                      color: getStatusColor(check.status),
                      background: check.status !== 'pending' ? `color-mix(in srgb, ${getStatusColor(check.status)} 15%, transparent)` : 'rgba(255,255,255,0.05)',
                      padding: '2px 8px', borderRadius: 12
                    }}>
                      {check.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
