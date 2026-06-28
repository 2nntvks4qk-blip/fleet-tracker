import React, { useState } from 'react'
import { checkPassword } from '../lib/supabase'
import logo from '../logo.svg'

export default function Login({ onAuth }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (checkPassword(pw)) {
      onAuth()
    } else {
      setError('Incorrect password.')
      setPw('')
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-title">
          <img src={logo} alt="Family Garage" style={{ width: 36, height: 36 }} />
          Family Garage
        </div>
        <p className="login-sub">Family vehicle maintenance log</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="Enter password"
              autoFocus
            />
            {error && <p className="login-error">{error}</p>}
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
