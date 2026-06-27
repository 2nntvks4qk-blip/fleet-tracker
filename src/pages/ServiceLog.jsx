import React, { useState } from 'react'
import ServiceForm from '../components/ServiceForm'
import { supabase } from '../lib/supabase'

export default function ServiceLog({ vehicles, services, onRefresh }) {
  const [adding, setAdding] = useState(false)

  async function handleAdd(form) {
    const vehicle = vehicles.find(v => v.id === form.vehicle_id)
    await supabase.from('services').insert([form])
    if (vehicle && form.mileage > vehicle.mileage) {
      await supabase.from('vehicles').update({ mileage: form.mileage }).eq('id', form.vehicle_id)
    }
    setAdding(false)
    onRefresh()
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this service record?')) return
    await supabase.from('services').delete().eq('id', id)
    onRefresh()
  }

  const sorted = [...services].sort((a, b) => new Date(b.date) - new Date(a.date))
  const grouped = {}
  sorted.forEach(s => {
    const month = s.date.slice(0, 7)
    if (!grouped[month]) grouped[month] = []
    grouped[month].push(s)
  })

  const vehicleName = (id) => {
    const v = vehicles.find(v => v.id === id)
    return v ? `${v.year} ${v.make} ${v.model}` : 'Unknown'
  }

  const monthLabel = (ym) => new Date(ym + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Service log</h1>
        {!adding && vehicles.length > 0 && (
          <button className="btn-primary btn-sm" onClick={() => setAdding(true)}>+ Log service</button>
        )}
      </div>

      {adding && <ServiceForm vehicles={vehicles} onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {services.length === 0 && !adding && (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p className="empty-title">No service records yet</p>
          <p className="empty-body">Log your first service to start the history.</p>
        </div>
      )}

      {Object.entries(grouped).map(([month, records]) => (
        <div key={month}>
          <p className="log-month-label">{monthLabel(month)}</p>
          {records.map(s => (
            <div key={s.id} className="log-item">
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="log-type">{s.type}</p>
                <p className="log-meta">{vehicleName(s.vehicle_id)} · {s.mileage.toLocaleString()} mi · {s.date}</p>
                {s.notes && <p className="log-meta" style={{ fontStyle: 'italic', marginTop: 2 }}>{s.notes}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span className="log-cost">{s.cost ? `$${Number(s.cost).toFixed(2)}` : 'Free'}</span>
                <button className="btn-icon btn-sm" style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)', fontSize: 13 }}
                  onClick={() => handleDelete(s.id)} aria-label="Delete record">✕</button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
