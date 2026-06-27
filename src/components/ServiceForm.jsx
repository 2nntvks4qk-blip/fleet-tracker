import React, { useState } from 'react'

const SERVICE_TYPES = [
  'Oil change', 'Tire rotation', 'Air filter', 'Cabin air filter',
  'Brake inspection', 'Brake pads', 'Brake fluid flush',
  'Transmission service', 'Coolant flush', 'Spark plugs',
  'Battery replacement', 'Windshield wipers', 'Alignment',
  'Tire replacement', 'Inspection / emissions', 'Other',
]

const today = new Date().toISOString().slice(0, 10)

export default function ServiceForm({ vehicles, onSave, onCancel }) {
  const [form, setForm] = useState({
    vehicle_id: vehicles[0]?.id || '',
    type: SERVICE_TYPES[0],
    date: today,
    mileage: '',
    cost: '',
    notes: '',
  })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.vehicle_id || !form.type) return
    onSave({ ...form, mileage: parseInt(form.mileage) || 0, cost: parseFloat(form.cost) || 0 })
  }

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontWeight: 600, marginBottom: '1rem' }}>Log service</p>
      <div className="form-group" style={{ marginBottom: 12 }}>
        <label className="form-label">Vehicle</label>
        <select value={form.vehicle_id} onChange={e => set('vehicle_id', e.target.value)}>
          {vehicles.map(v => <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>)}
        </select>
      </div>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="form-group">
          <label className="form-label">Service type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}>
            {SERVICE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Mileage at service</label>
          <input type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="50000" min="0" />
        </div>
        <div className="form-group">
          <label className="form-label">Cost ($)</label>
          <input type="number" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0.00" min="0" step="0.01" />
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Notes</label>
        <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Shop name, parts used, observations…" />
      </div>
      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave}>Save record</button>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}
