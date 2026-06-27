import React, { useState } from 'react'
import VehicleCard from '../components/VehicleCard'
import VehicleForm from '../components/VehicleForm'
import { supabase } from '../lib/supabase'

export default function Vehicles({ vehicles, services, onRefresh }) {
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(null)

  async function handleAdd(form) {
    await supabase.from('vehicles').insert([form])
    setAdding(false)
    onRefresh()
  }

  async function handleEdit(form) {
    await supabase.from('vehicles').update(form).eq('id', editing.id)
    setEditing(null)
    onRefresh()
  }

  async function handleDelete() {
    await supabase.from('services').delete().eq('vehicle_id', editing.id)
    await supabase.from('vehicles').delete().eq('id', editing.id)
    setEditing(null)
    onRefresh()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Vehicles</h1>
        {!adding && !editing && (
          <button className="btn-primary btn-sm" onClick={() => setAdding(true)}>+ Add vehicle</button>
        )}
      </div>

      {adding && <VehicleForm onSave={handleAdd} onCancel={() => setAdding(false)} />}
      {editing && (
        <VehicleForm initial={editing} onSave={handleEdit} onDelete={handleDelete} onCancel={() => setEditing(null)} />
      )}

      {vehicles.length === 0 && !adding && (
        <div className="empty">
          <div className="empty-icon">🚗</div>
          <p className="empty-title">No vehicles yet</p>
          <p className="empty-body">Add your first vehicle to start tracking.</p>
        </div>
      )}

      {vehicles.map(v => (
        <VehicleCard
          key={v.id}
          vehicle={v}
          services={services.filter(s => s.vehicle_id === v.id)}
          onEdit={() => { setAdding(false); setEditing(v) }}
        />
      ))}
    </div>
  )
}
