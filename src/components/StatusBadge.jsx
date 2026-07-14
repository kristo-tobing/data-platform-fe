import { STATUSES } from '../data/mock.js';

export default function StatusBadge({ status, size = 'md' }) {
  const s = STATUSES[status] || STATUSES.OPEN;
  const dot = size === 'sm' ? 6 : 8;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: size === 'sm' ? '2px 8px' : '4px 12px',
      borderRadius: 12, fontWeight: 700,
      fontSize: size === 'sm' ? 10 : 11,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: dot, height: dot, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}
