import { useState } from 'react'
import { NoteAPI } from '../services/api'
import { notify } from './Toast'

export default function NoteForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return notify('Title is required')
    setSaving(true)
    try {
      const res = await NoteAPI.create({ title: title.trim(), content })
      onCreated(res)
      setTitle(''); setContent('')
      notify('Note saved')
    } catch {
      notify('Save failed')
    } finally { setSaving(false) }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3 style={{marginTop:0}}>Add Note</h3>
      <label>Title</label>
      <input className="input" placeholder="Note title" value={title} onChange={e=>setTitle(e.target.value)} />
      <label>Content</label>
      <textarea className="input" rows={4} placeholder="Write note..." value={content} onChange={e=>setContent(e.target.value)} />
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Note'}</button>
        <button type="button" className="btn secondary" onClick={()=>{ setTitle(''); setContent('') }}>Clear</button>
      </div>
    </form>
  )
}
