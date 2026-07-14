export default function Toast({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <div style={{ fontSize: 18 }}>{t.type === 'success' ? '✅' : '❌'}</div>
          <div>
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
