import { useEffect, useState } from 'react';

let pushToast = null;
export function notify(text, ms = 2200) {
  if (pushToast) pushToast({ id: Date.now(), text, ms });
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    pushToast = (t) => {
      setToasts(prev => [t, ...prev]);
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== t.id));
      }, t.ms);
    };
    return () => { pushToast = null; };
  }, []);

  return (
    <div style={{ position: 'fixed', right: 18, top: 18, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map(t => (
        <div key={t.id} className="card" style={{ minWidth: 220, padding: 10, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>{t.text}</div>
            <button className="btn" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} style={{ background: 'transparent', padding: 6 }}>✕</button>
          </div>
        </div>
      ))}
    </div>
  );
}
