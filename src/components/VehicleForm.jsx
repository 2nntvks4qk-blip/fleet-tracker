import React, { useState } from 'react'

const BLANK = { year: new Date().getFullYear(), make: '', model: '', color: '', mileage: '' }

export default function VehicleForm({ initial, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(initial || BLANK)
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.make.trim() || !form.model.trim()) return
    onSave({ ...form, year: parseInt(form.year), mileage: parseInt(form.mileage) || 0 })
  }

  return (
    <div className="card" style={{ marginBottom: '1.5rem' }}>
      <p style={{ fontWeight: 600, marginBottom: '1rem' }}>{initial ? 'Edit vehicle' : 'Add vehicle'}</p>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="form-group">
          <label className="form-label">Year</label>
          <input type="number" value={form.year} onChange={e => set('year', e.target.value)} min="1900" max="2099" />
        </div>
        <div className="form-group">
          <label className="form-label">Make</label>
          <input type="text" value={form.make} onChange={e => set('make', e.target.value)} placeholder="Toyota" />
        </div>
        <div className="form-group">
          <label className="form-label">Model</label>
          <input type="text" value={form.model} onChange={e => set('model', e.target.value)} placeholder="Camry" />
        </div>
        <div className="form-group">
          <label className="form-label">Color</label>
          <input type="text" value={form.color} onChange={e => set('color', e.target.value)} placeholder="Silver" />
        </div>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Current mileage</label>
        <input type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="0" min="0" />
      </div>
      <div className="form-actions">
        <button className="btn-primary" onClick={handleSave}>{initial ? 'Save changes' : 'Add vehicle'}</button>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        {initial && onDelete && (
          <button className="btn-danger-ghost btn-sm" style={{ marginLeft: 'auto' }}
            onClick={() => { if (window.confirm('Delete this vehicle and all its records?')) onDelete() }}>
            Delete vehicle
          </button>
        )}
      </div>
    </div>
  )
}
