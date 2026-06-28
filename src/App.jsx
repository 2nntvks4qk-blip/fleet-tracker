import React, { useState, useEffect, useCallback } from 'react'
import { supabase, isAuthenticated, logout } from './lib/supabase'
import Login from './pages/Login'
import Vehicles from './pages/Vehicles'
import ServiceLog from './pages/ServiceLog'
import Reminders from './pages/Reminders'

const TABS = ['vehicles', 'log', 'reminders']
const TAB_LABELS = { vehicles: 'Vehicles', log: 'Service log', reminders: 'Reminders' }

export default function App() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [tab, setTab] = useState('vehicles')
  const [vehicles, setVehicles] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [{ data: v }, { data: s }] = await Promise.all([
      supabase.from('vehicles').select('*').order('year', { ascending: false }),
      supabase.from('services').select('*').order('date', { ascending: false }),
    ])
    setVehicles(v || [])
    setServices(s || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authed) fetchData()
  }, [authed, fetchData])

  if (!authed) return <Login onAuth={() => setAuthed(true)} />

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-dot" />
          Family Garage
        </div>
        <button className="btn-ghost btn-sm" onClick={() => { logout(); setAuthed(false) }}>
          Sign out
        </button>
      </header>

      <main className="main-content">
        <nav className="tabs">
          {TABS.map(t => (
            <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </nav>

        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '3rem 0', textAlign: 'center' }}>Loading…</div>
        ) : (
          <>
            {tab === 'vehicles' && <Vehicles vehicles={vehicles} services={services} onRefresh={fetchData} />}
            {tab === 'log' && <ServiceLog vehicles={vehicles} services={services} onRefresh={fetchData} />}
            {tab === 'reminders' && <Reminders vehicles={vehicles} services={services} />}
          </>
        )}
      </main>
    </div>
  )
}
