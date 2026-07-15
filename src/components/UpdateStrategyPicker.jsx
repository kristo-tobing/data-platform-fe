import { useState } from 'react';

const APPEND_SQL = `INSERT INTO \`<target_dataset>.<target_table>\`
  (<col_1>, <col_2>, ..., created_at)

SELECT
  <col_1>, <col_2>, ..., created_at
FROM \`<source_dataset>.<source_table>\`

-- Filter: hanya data baru (contoh: kemarin)
WHERE DATE(created_at) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)

-- Dedup: lewati row yang sudah ada di target
  AND id NOT IN (
    SELECT id FROM \`<target_dataset>.<target_table>\`
  )`;

const MERGE_SQL = `MERGE \`<target_dataset>.<target_table>\` AS T
USING (
  SELECT <match_key>, <col_1>, <col_2>, ..., updated_at
  FROM \`<source_dataset>.<source_table>\`
  WHERE DATE(updated_at) >= DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
) AS S
ON T.<match_key> = S.<match_key>

-- Update baris yang sudah ada
WHEN MATCHED THEN
  UPDATE SET
    T.<col_1>    = S.<col_1>,
    T.updated_at = S.updated_at

-- Insert baris baru
WHEN NOT MATCHED BY TARGET THEN
  INSERT (<match_key>, <col_1>, <col_2>, ..., updated_at)
  VALUES (S.<match_key>, S.<col_1>, S.<col_2>, ..., S.updated_at)`;

function ExampleBlock({ sql, onClose }) {
  return (
    <div
      style={{ marginTop: 12 }}
      onClick={e => e.stopPropagation()}
    >
      <pre style={{
        margin: 0,
        padding: '10px 12px',
        borderRadius: 'var(--r-sm)',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10.5,
        color: 'var(--t1)',
        lineHeight: 1.65,
        overflowX: 'auto',
        whiteSpace: 'pre',
        maxHeight: 230,
        overflowY: 'auto',
      }}>
        {sql}
      </pre>
      <div style={{ marginTop: 5, fontSize: 10, color: 'var(--t3)' }}>
        Ganti <code style={{ fontSize: 10 }}>&lt;placeholder&gt;</code> dengan nama tabel &amp; kolom yang sebenarnya.
      </div>
    </div>
  );
}

export default function UpdateStrategyPicker({ value, onChange }) {
  const strategy = value || 'overwrite';
  const [showExample, setShowExample] = useState(null); // 'incremental' | 'merge' | null

  const toggleExample = (e, key) => {
    e.stopPropagation();
    setShowExample(prev => prev === key ? null : key);
  };

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="f-lbl" style={{ marginBottom: 12 }}>Update Strategy <span className="req">*</span></div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Append Card */}
        <div
          onClick={() => onChange('incremental')}
          style={{
            border: `2px solid ${strategy === 'incremental' ? 'var(--accent)' : 'var(--border)'}`,
            backgroundColor: strategy === 'incremental' ? 'var(--active)' : 'var(--surface)',
            borderRadius: 'var(--r-md)',
            padding: 16,
            cursor: 'pointer',
            transition: 'all var(--tr)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t1)' }}>
            <span style={{ fontSize: 16 }}>↻</span> Append (Add New Records)
          </div>
          <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 12 }}>
            New records from your query will be appended to the existing table. Filtering and deduplication logic should be handled within your query.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={e => toggleExample(e, 'incremental')}
              style={{
                padding: '2px 10px', borderRadius: 4,
                fontSize: 10, fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--border)',
                background: showExample === 'incremental' ? 'var(--accent)' : 'transparent',
                color: showExample === 'incremental' ? '#fff' : 'var(--t2)',
                transition: 'all 0.15s',
              }}
            >
              {showExample === 'incremental' ? '▲ Hide Example' : '▼ View Query Example'}
            </button>
          </div>
          {showExample === 'incremental' && <ExampleBlock sql={APPEND_SQL} />}
        </div>

        {/* Merge Card */}
        <div
          onClick={() => onChange('merge')}
          style={{
            border: `2px solid ${strategy === 'merge' ? 'var(--accent)' : 'var(--border)'}`,
            backgroundColor: strategy === 'merge' ? 'var(--active)' : 'var(--surface)',
            borderRadius: 'var(--r-md)',
            padding: 16,
            cursor: 'pointer',
            transition: 'all var(--tr)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t1)' }}>
            <span style={{ fontSize: 16 }}>⇅</span> Merge (Upsert)
          </div>
          <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 12 }}>
            Updates existing rows and inserts new ones. The merge key and any upsert conditions should be defined within your query.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={e => toggleExample(e, 'merge')}
              style={{
                padding: '2px 10px', borderRadius: 4,
                fontSize: 10, fontWeight: 600, cursor: 'pointer',
                border: '1px solid var(--border)',
                background: showExample === 'merge' ? 'var(--accent)' : 'transparent',
                color: showExample === 'merge' ? '#fff' : 'var(--t2)',
                transition: 'all 0.15s',
              }}
            >
              {showExample === 'merge' ? '▲ Hide Example' : '▼ View Query Example'}
            </button>
          </div>
          {showExample === 'merge' && <ExampleBlock sql={MERGE_SQL} />}
        </div>

        {/* Overwrite Card */}
        <div
          onClick={() => onChange('overwrite')}
          style={{
            border: `2px solid ${strategy === 'overwrite' ? 'var(--accent)' : 'var(--border)'}`,
            backgroundColor: strategy === 'overwrite' ? 'var(--active)' : 'var(--surface)',
            borderRadius: 'var(--r-md)',
            padding: 16,
            cursor: 'pointer',
            transition: 'all var(--tr)',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t1)' }}>
            <span style={{ fontSize: 16 }}>✕</span> Overwrite (Replace Entire Table)
          </div>
          <div style={{ fontSize: 12, color: 'var(--t2)', lineHeight: 1.5, marginBottom: 12 }}>
            Deletes the entire table and replaces it completely with your query results. Missing columns in the query will be lost permanently.
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: 'rgba(47,129,247,.1)', color: 'var(--accent)' }}>★ Default</span>
          </div>
        </div>

      </div>

      <div style={{ marginTop: 16, padding: '12px', background: 'rgba(47,129,247,0.1)', border: '1px solid var(--accent)', borderRadius: 'var(--r-sm)', fontSize: 12, color: 'var(--t1)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16 }}>ℹ️</span>
        <div style={{ lineHeight: 1.5 }}>
          <strong>No Backfill Support:</strong> If your pipeline requires a backfill, please create a standard Jira Ticket.
        </div>
      </div>
    </div>
  );
}
