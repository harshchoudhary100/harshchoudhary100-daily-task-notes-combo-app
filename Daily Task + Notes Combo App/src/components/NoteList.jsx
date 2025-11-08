import { useState } from 'react';
import Modal from './Modal';
import { notify } from './Toast';
import { useData } from '../context/DataContext';

export default function NoteList() {
  const { notes, removeNote, updateNote, loading } = useData();
  const [editing, setEditing] = useState(null);
  const [loadingIds, setLoadingIds] = useState([]);

  const start = (id) => setLoadingIds(s => [...s, id]);
  const stop = (id) => setLoadingIds(s => s.filter(x => x !== id));

  const onDelete = async (id) => {
    if (!confirm('Delete this note?')) return;
    try {
      start(id);
      await removeNote(id);
      notify('Note deleted');
    } catch {
      notify('Delete failed');
    } finally {
      stop(id);
    }
  };

  const openEdit = (n) => setEditing({ _id: n._id, title: n.title || '', content: n.content || '' });

  const saveEdit = async () => {
    if (!editing.title.trim()) return notify('Title required');
    try {
      start(editing._id || 'edit');
      await updateNote(editing._id, { title: editing.title.trim(), content: editing.content });
      notify('Note saved');
      setEditing(null);
    } catch {
      notify('Save failed');
    } finally {
      stop(editing._id || 'edit');
    }
  };

  if (loading) return <div className="card center">Loading notes…</div>;

  return (
    <>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Notes</h3>
        <div className="list">
          {(!notes || notes.length === 0) && <div className="empty">No notes yet — add one.</div>}

          {notes.map(n => (
            <div key={n._id} className="item">
              <div>
                <strong>{n.title}</strong>
                <div className="meta" style={{ marginTop: 6 }}>{n.content}</div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn secondary" onClick={() => openEdit(n)}>Edit</button>
                <button className="btn" onClick={() => onDelete(n._id)} style={{ background: 'var(--danger)' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Note">
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
            <label>Title</label>
            <input className="input" value={editing.title} onChange={e => setEditing(prev => ({ ...prev, title: e.target.value }))} />

            <label>Content</label>
            <textarea className="input" rows={6} value={editing.content} onChange={e => setEditing(prev => ({ ...prev, content: e.target.value }))} />

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn" type="submit">Save</button>
              <button type="button" className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
