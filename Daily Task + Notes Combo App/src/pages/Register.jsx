import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthAPI } from '../services/api'
import { notify } from '../components/Toast'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await AuthAPI.register(name, email, password)
      notify('Registered — please login')
      setTimeout(()=>nav('/login'), 700)
    } catch (e) {
      notify(e.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{maxWidth:420}}>
      <div className="card">
        <h2 style={{marginTop:0}}>Create account</h2>
        <form onSubmit={submit}>
          <label>Name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Sign up'}</button>
            <Link to="/login" className="btn secondary">Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
