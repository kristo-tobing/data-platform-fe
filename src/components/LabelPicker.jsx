import { useState } from 'react';
import { LABELS as defaultLabels } from '../data/mock.js';

export default function LabelPicker({ selected = [], onChange }) {
  const [customLabels, setCustomLabels] = useState([]);
  const allLabels = [...defaultLabels, ...customLabels];
  
  const toggle = (id) => {
    if (selected.includes(id)) onChange(selected.filter(l => l !== id));
    else onChange([...selected, id]);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {allLabels.map(l => {
        const active = selected.includes(l.id);
        return (
          <button
            key={l.id}
            type="button"
            onClick={() => toggle(l.id)}
            style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', transition: 'all .15s', userSelect: 'none',
              background: active ? l.bg : 'var(--bg)',
              border: `1px solid ${active ? l.color : 'var(--border)'}`,
              color: active ? l.color : 'var(--t2)',
            }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
