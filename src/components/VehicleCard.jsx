import React from 'react'

const INTERVALS = [
  { type: 'Oil change', miles: 5000 },
  { type: 'Tire rotation', miles: 7500 },
  { type: 'Air filter', miles: 15000 },
  { type: 'Brake inspection', miles: 20000 },
  { type: 'Transmission service', miles: 30000 },
  { type: 'Spark plugs', miles: 60000 },
]

export function getReminders(vehicle, services) {
  return INTERVALS.map(interval => {
    const last = services.filter(s => s.type === interval.type).sort((a, b) => b.mileage - a.mileage)[0]
    const lastMi = last ? last.mileage : 0
    const nextMi = lastMi + interval.miles
    const remaining = nextMi - vehicle.mileage
    const status = remaining > 1000 ? 'ok' : remaining > 0 ? 'due' : 'overdue'
    return { ...interval, lastMi, nextMi, remaining, status }
  })
}

export default function VehicleCard({ vehicle, services, onEdit }) {
  const recent = [...services].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3)
  const totalSpent = services.reduce((sum, s) => sum + (s.cost || 0), 0)
  const reminders = getReminders(vehicle, services)
  const overdue = reminders.filter(r => r.status === 'overdue').length
  const due = reminders.filter(r => r.status === 'due').length
  const badgeClass = overdue ? 'badge-overdue' : due ? 'badge-due' : 'badge-ok'
  const badgeText = overdue ? `${overdue} overdue` : due ? `${due} due soon` : 'Up to date'

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <p style={{ fontWeight: 600, fontSize: 16 }}>{vehicle.year} {vehicle.make} {vehicle.model}</p>
          {vehicle.color && <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{vehicle.color}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className={`badge ${badgeClass}`}>{badgeText}</span>
          <button className="btn-icon btn-sm" onClick={onEdit} aria-label="Edit vehicle">✎</button>
        </div>
      </div>
      <hr className="divider" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <span className="odometer">{vehicle.mileage.toLocaleString()}</span>
          <span className="odometer-unit">mi</span>
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} logged
        </span>
      </div>
      {recent.length > 0 && (
        <>
          <hr className="divider" />
          <p className="section-label">Recent service</p>
          {recent.map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
              <div>
                <span style={{ fontWeight: 500 }}>{s.type}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{s.date} · {s.mileage.toLocaleString()} mi</span>
              </div>
              <span style={{ color: s.cost ? 'var(--text)' : 'var(--text-muted)' }}>{s.cost ? `$${s.cost}` : 'Free'}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
