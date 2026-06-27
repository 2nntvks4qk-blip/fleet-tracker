import React from 'react'
import { getReminders } from '../components/VehicleCard'

export default function Reminders({ vehicles, services }) {
  if (!vehicles.length) {
    return (
      <div>
        <div className="page-header"><h1 className="page-title">Reminders</h1></div>
        <div className="empty">
          <div className="empty-icon">🔔</div>
          <p className="empty-title">No vehicles added yet</p>
          <p className="empty-body">Add a vehicle to see maintenance reminders.</p>
        </div>
      </div>
    )
  }

  const all = vehicles.flatMap(v => {
    const vehicleServices = services.filter(s => s.vehicle_id === v.id)
    return getReminders(v, vehicleServices).map(r => ({
      ...r,
      vehicleName: `${v.year} ${v.make} ${v.model}`,
    }))
  })

  const overdue = all.filter(r => r.status === 'overdue')
  const due = all.filter(r => r.status === 'due')
  const ok = all.filter(r => r.status === 'ok')

  const icons = { overdue: '⚠', due: '◷', ok: '✓' }
  const iconClass = { overdue: 'reminder-icon-overdue', due: 'reminder-icon-due', ok: 'reminder-icon-ok' }
  const textColor = { overdue: 'var(--danger)', due: 'var(--warning)', ok: 'var(--success)' }

  function Section({ items, title, status }) {
    if (!items.length) return null
    return (
      <div className="card" style={{ marginBottom: '0.75rem' }}>
        <p className="section-label" style={{ marginBottom: '0.25rem' }}>{title}</p>
        {items.map((r, i) => (
          <div key={i} className="reminder-row">
            <div className={`reminder-icon ${iconClass[status]}`} style={{ color: textColor[status] }}>
              {icons[status]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 500, fontSize: 14 }}>{r.type}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.vehicleName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: textColor[status] }}>
                {r.remaining < 0 ? `${Math.abs(r.remaining).toLocaleString()} mi overdue` : `${r.remaining.toLocaleString()} mi away`}
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Next at {r.nextMi.toLocaleString()} mi</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="page-header"><h1 className="page-title">Reminders</h1></div>
      <div className="stats-row" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-tile"><p className="stat-tile-num" style={{ color: 'var(--danger)' }}>{overdue.length}</p><p className="stat-tile-label">Overdue</p></div>
        <div className="stat-tile"><p className="stat-tile-num" style={{ color: 'var(--warning)' }}>{due.length}</p><p className="stat-tile-label">Due soon</p></div>
        <div className="stat-tile"><p className="stat-tile-num" style={{ color: 'var(--success)' }}>{ok.length}</p><p className="stat-tile-label">Up to date</p></div>
      </div>
      <Section items={overdue} title="Overdue" status="overdue" />
      <Section items={due} title="Due soon — within 1,000 miles" status="due" />
      <Section items={ok} title="Up to date" status="ok" />
    </div>
  )
}
