import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthAPI } from '../services/api'
import { notify } from '../components/Toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await AuthAPI.login(email, password)
      notify('Welcome back!')
      nav('/tasks')
    } catch (e) {
      notify(e.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{maxWidth:420}}>
      <div className="card">
        <h2 style={{marginTop:0}}>Login</h2>
        <form onSubmit={submit}>
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <div style={{display:'flex', gap:8, marginTop:12}}>
            <button className="btn" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
            <Link to="/register" className="btn secondary" style={{display:'inline-flex', alignItems:'center', justifyContent:'center'}}>Create account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
