import React, { useState } from 'react'
import ServiceForm from '../components/ServiceForm'
import { supabase } from '../lib/supabase'

export default function ServiceLog({ vehicles, services, onRefresh }) {
  const [adding, setAdding] = useState(false)
  const [filterVehicle, setFilterVehicle] = useState('all')

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

  const vehicleName = (id) => {
    const v = vehicles.find(v => v.id === id)
    return v ? `${v.year} ${v.make} ${v.model}` : 'Unknown'
  }

  const monthLabel = (ym) => new Date(ym + '-02').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Filter services by selected vehicle
  const filtered = filterVehicle === 'all'
    ? services
    : services.filter(s => s.vehicle_id === filterVehicle)

  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date))
  const grouped = {}
  sorted.forEach(s => {
    const month = s.date.slice(0, 7)
    if (!grouped[month]) grouped[month] = []
    grouped[month].push(s)
  })

  const totalCost = filtered.reduce((sum, s) => sum + (s.cost || 0), 0)

  // Print handler — opens a clean print window
  function handlePrint() {
    const vehicle = vehicles.find(v => v.id === filterVehicle)
    const title = vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} — Service Log` : 'All Vehicles — Service Log'

    const rows = sorted.map(s => `
      <tr>
        <td>${s.date}</td>
        <td>${s.mileage.toLocaleString()} mi</td>
        <td>${filterVehicle === 'all' ? vehicleName(s.vehicle_id) + ' — ' : ''}${s.type}</td>
        <td>${s.notes || '—'}</td>
        <td style="text-align:right">${s.cost ? '$' + Number(s.cost).toFixed(2) : 'Free'}</td>
      </tr>
    `).join('')

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, sans-serif; font-size: 13px; color: #111; padding: 2rem; }
          h1 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
          .meta { font-size: 12px; color: #666; margin-bottom: 1.5rem; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; padding: 8px 10px; border-bottom: 2px solid #e5e7eb; }
          td { padding: 8px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
          tr:last-child td { border-bottom: none; }
          .total { margin-top: 1.5rem; text-align: right; font-size: 14px; font-weight: 600; }
          .footer { margin-top: 2rem; font-size: 11px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 1rem; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <p class="meta">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · ${sorted.length} record${sorted.length !== 1 ? 's' : ''}</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mileage</th>
              <th>Service</th>
              <th>Notes</th>
              <th style="text-align:right">Cost</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="total">Total: $${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p class="footer">Family Garage · Printed ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `

    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 500)
  }

  // CSV export handler
  function handleExport() {
    const vehicle = vehicles.find(v => v.id === filterVehicle)
    const filename = vehicle
      ? `${vehicle.year}-${vehicle.make}-${vehicle.model}-service-log.csv`.replace(/\s+/g, '-')
      : 'service-log.csv'

    const headers = ['Date', 'Vehicle', 'Service Type', 'Mileage', 'Cost', 'Notes']
    const rows = sorted.map(s => [
      s.date,
      vehicleName(s.vehicle_id),
      s.type,
      s.mileage,
      s.cost ? Number(s.cost).toFixed(2) : '0.00',
      s.notes ? `"${s.notes.replace(/"/g, '""')}"` : ''
    ].join(','))

    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Service log</h1>
        {!adding && vehicles.length > 0 && (
          <button className="btn-primary btn-sm" onClick={() => setAdding(true)}>+ Log service</button>
        )}
      </div>

      {adding && <ServiceForm vehicles={vehicles} onSave={handleAdd} onCancel={() => setAdding(false)} />}

      {/* Filter + export bar */}
      {vehicles.length > 0 && services.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            value={filterVehicle}
            onChange={e => setFilterVehicle(e.target.value)}
            style={{ flex: 1, minWidth: 160, maxWidth: 280 }}
          >
            <option value="all">All vehicles</option>
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.year} {v.make} {v.model}</option>
            ))}
          </select>

          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
            <button className="btn-ghost btn-sm" onClick={handleExport} title="Export as CSV">
              ↓ Export CSV
            </button>
            <button className="btn-ghost btn-sm" onClick={handlePrint} title="Print service log">
              ⎙ Print
            </button>
          </div>
        </div>
      )}

      {/* Summary strip */}
      {filtered.length > 0 && (
        <div style={{ display: 'flex', gap: 16, marginBottom: '1rem', fontSize: 13, color: 'var(--text-muted)' }}>
          <span>{filtered.length} records</span>
          <span>·</span>
          <span>${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total</span>
        </div>
      )}

      {services.length === 0 && !adding && (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p className="empty-title">No service records yet</p>
          <p className="empty-body">Log your first service to start the history.</p>
        </div>
      )}

      {filtered.length === 0 && services.length > 0 && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <p className="empty-title">No records for this vehicle</p>
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
