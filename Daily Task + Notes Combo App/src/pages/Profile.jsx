
import { useState, useEffect } from 'react';
import api from '../services/api';
import { notify } from '../components/Toast'; // adjust path if needed

export default function Profile() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [filePreview, setFilePreview] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // keep avatar in sync if localStorage user changes elsewhere
    const onStorage = (e) => {
      if (e.key === 'user') {
        try { const u = JSON.parse(e.newValue || 'null'); setUser(u); setAvatar(u?.avatar || ''); setFilePreview(u?.avatar || ''); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const onFileChange = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 1024 * 1024 * 5) { // 5MB
      notify('File too large (max 5MB)');
      return;
    }

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('avatar', f);

      // axios instance `api` should include Authorization header (setAuthToken called at app start)
      const { data } = await api.post('/upload/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      const avatarUrl = data.avatar || data.user?.avatar;
      if (!avatarUrl) throw new Error('Upload succeeded but no avatar returned');

      // update local storage and local state
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      u.avatar = avatarUrl;
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      setAvatar(avatarUrl);
      setFilePreview(avatarUrl);
      notify('Avatar uploaded');
    } catch (err) {
      console.error('Avatar upload error', err);
      notify(err?.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
      // reset input value so same file can be selected again if needed
      e.target.value = '';
    }
  };

  const onRemoveAvatar = async () => {
    if (!confirm('Remove avatar?')) return;
    try {
      // if you want server-side removal route, call it here. For now just clear locally:
      const u = user ? { ...user, avatar: '' } : null;
      localStorage.setItem('user', JSON.stringify(u));
      setUser(u);
      setAvatar('');
      setFilePreview('');
      notify('Avatar removed (local)');
    } catch (err) {
      notify('Could not remove avatar');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900 }}>
      <div className="card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 999, overflow: 'hidden', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {filePreview ? (
              <img src={filePreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ fontSize: 28, fontWeight: 700, color: '#374151' }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <div>
            <h2 style={{ margin: 0 }}>{user?.name || 'Your profile'}</h2>
            <div style={{ color: 'var(--muted)' }}>{user?.email || '—'}</div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <label className="btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {uploading ? 'Uploading…' : 'Upload avatar'}
                <input type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
              </label>

              <button className="btn secondary" onClick={onRemoveAvatar}>Remove</button>
            </div>
          </div>
        </div>

        <div style={{ marginLeft: 'auto', minWidth: 220 }}>
          <h4 style={{ marginTop: 0 }}>Account</h4>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>
            <div><strong>Logged in as</strong></div>
            <div>{user?.email || 'Not signed in'}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }} className="card">
        <h3 style={{ marginTop: 0 }}>Preferences</h3>
        <p style={{ color: 'var(--muted)' }}>Profile settings will be added here (username, password change, etc.).</p>
      </div>
    </div>
  );
}
