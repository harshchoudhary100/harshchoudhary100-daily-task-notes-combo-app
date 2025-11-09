import { useState } from 'react'
import { TaskAPI } from '../services/api'
import { notify } from './Toast'

export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if (!title) return
    try {
      const res = await TaskAPI.create({ title })
      onCreated(res)
      setTitle('')
      notify('Task added')
    } catch (e) {
      notify(e.response?.data?.message || 'Task add failed')
    }
  }
  return (
    <form className="card" onSubmit={submit}>
      <h3>Add Task</h3>
      <input className="input" placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
      <button className="btn" type="submit">Add</button>
    </form>
  )
}
