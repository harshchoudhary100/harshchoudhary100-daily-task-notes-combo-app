import { useState } from 'react';
import { notify } from './Toast';
import Modal from './Modal';
import { useData } from '../context/DataContext';

export default function TaskList() {
  const { tasks, toggleTask, removeTask, updateTask, loading } = useData();
  const [loadingIds, setLoadingIds] = useState([]);
  const [editing, setEditing] = useState(null); // task object or null

  const startLoading = (id) => setLoadingIds(s => [...s, id]);
  const stopLoading = (id) => setLoadingIds(s => s.filter(x => x !== id));

  const onToggle = async (id) => {
    try {
      startLoading(id);
      await toggleTask(id);
      notify('Task updated');
    } catch (e) {
      notify(e?.response?.data?.message || 'Action failed');
    } finally {
      stopLoading(id);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      startLoading(id);
      await removeTask(id);
      notify('Task deleted');
    } catch {
      notify('Delete failed');
    } finally {
      stopLoading(id);
    }
  };

  const openEdit = (task) => setEditing({
    _id: task._id,
    title: task.title || '',
    description: task.description || '',
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0,10) : '',
    priority: task.priority || 'low'
  });

  const saveEdit = async () => {
    if (!editing.title.trim()) return notify('Title required');
    try {
      startLoading(editing._id || 'edit');
      const payload = {
        title: editing.title.trim(),
        description: editing.description,
        priority: editing.priority,
        dueDate: editing.dueDate ? new Date(editing.dueDate).toISOString() : null
      };
      await updateTask(editing._id, payload);
      notify('Task saved');
      setEditing(null);
    } catch (e) {
      notify('Save failed');
    } finally {
      stopLoading(editing._id || 'edit');
    }
  };

  if (loading) return <div className="card center">Loading tasks…</div>;

  return (
    <>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Tasks</h3>

        <div className="list" role="list">
          {(!tasks || tasks.length === 0) && <div className="empty">No tasks yet — add one.</div>}

          {tasks.map(t => {
            const busy = loadingIds.includes(t._id);
            return (
              <div key={t._id} className="item" role="listitem" aria-label={`Task ${t.title}`}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <strong style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</strong>
                    {t.priority && <span className="badge" style={{ background: t.completed ? '#eef6ff' : undefined }}>{t.priority}</span>}
                  </div>
                  {t.description && <div className="meta">{t.description}</div>}
                  {t.dueDate && <div className="meta">Due: {new Date(t.dueDate).toLocaleDateString()}</div>}
                </div>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button
                    className="btn secondary"
                    onClick={() => onToggle(t._id)}
                    disabled={busy}
                    aria-pressed={t.completed}
                  >
                    {busy ? '…' : (t.completed ? 'Undo' : 'Done')}
                  </button>

                  <button className="btn secondary" onClick={() => openEdit(t)} aria-label={`Edit ${t.title}`}>Edit</button>

                  <button
                    className="btn"
                    onClick={() => onDelete(t._id)}
                    style={{ background: 'var(--danger)' }}
                    disabled={busy}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit Task">
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); saveEdit(); }}>
            <label>Title</label>
            <input className="input" value={editing.title} onChange={e => setEditing(prev => ({ ...prev, title: e.target.value }))} />

            <label>Description</label>
            <textarea className="input" rows={3} value={editing.description} onChange={e => setEditing(prev => ({ ...prev, description: e.target.value }))} />

            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Due date</label>
                <input className="input" type="date" value={editing.dueDate || ''} onChange={e => setEditing(prev => ({ ...prev, dueDate: e.target.value }))} />
              </div>
              <div style={{ width: 160 }}>
                <label>Priority</label>
                <select className="input" value={editing.priority} onChange={e => setEditing(prev => ({ ...prev, priority: e.target.value }))}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn" type="submit">Save</button>
              <button type="button" className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
}
