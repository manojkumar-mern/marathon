import { api } from '../../services/api'

async function silentFallback(defaultValue) {
  if (import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') return defaultValue
  throw new Error('Backend unavailable')
}

export const participantService = {
  async list(params = {}) {
    try {
      const clean = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== '' && v !== undefined && v !== null),
      )
      const q = new URLSearchParams(clean).toString()
      const res = await api.get(`/registrations${q ? `?${q}` : ''}`)
      return res.data
    } catch {
      return silentFallback({ registrations: [], total: 0 })
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/registrations/${id}`)
      return res.data.registration
    } catch {
      return silentFallback(null)
    }
  },

  async update(id, data) {
    const res = await api.patch(`/registrations/${id}`, data)
    return res.data.registration
  },

  async remove(id) {
    await api.delete(`/registrations/${id}`)
  },

  async bulkUpdate(ids, data) {
    await Promise.all(ids.map((id) => api.patch(`/registrations/${id}`, data)))
  },

  async cancelRegistration(id, reason) {
    const res = await api.patch(`/registrations/${id}`, {
      status: 'cancelled',
      cancellationReason: reason || '',
    })
    return res.data.registration
  },

  async exportCSV(params = {}) {
    const res = await this.list({ ...params, limit: 10000 })
    const rows = res.registrations || []
    const headers = [
      'Registration #', 'Status', 'Runner Name', 'Email', 'Phone', 'Gender', 'Date of Birth',
      'Event', 'Category', 'Distance', 'T-Shirt', 'Bib #',
      'Payment Status', 'Amount', 'Transaction ID',
      'Checked In', 'Race Completed',
      'Emergency Contact', 'Emergency Phone', 'Relationship',
      'Address Street', 'City', 'State', 'Pincode', 'Country',
      'Medical Conditions', 'Allergies', 'Blood Group',
      'Registered At',
    ]
    const csvRows = [headers.join(',')]
    for (const r of rows) {
      const esc = (v) => {
        const s = String(v ?? '')
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
      }
      csvRows.push([
        esc(r.registrationNumber),
        esc(r.status),
        esc(r.runnerDetails?.fullName),
        esc(r.runnerDetails?.email),
        esc(r.runnerDetails?.phone),
        esc(r.runnerDetails?.gender),
        esc(r.runnerDetails?.dateOfBirth ? new Date(r.runnerDetails.dateOfBirth).toLocaleDateString('en-IN') : ''),
        esc(r.marathon?.title),
        esc(r.raceCategory?.name),
        esc(r.raceCategory?.distance),
        esc(r.tshirtSize),
        esc(r.bibNumber),
        esc(r.payment?.status),
        r.payment?.amount != null ? String(r.payment.amount) : '',
        esc(r.payment?.transactionId),
        r.isCheckedIn ? 'Yes' : 'No',
        r.isCompleted ? 'Yes' : 'No',
        esc(r.emergencyContact?.fullName),
        esc(r.emergencyContact?.phone),
        esc(r.emergencyContact?.relationship),
        esc(r.address?.street),
        esc(r.address?.city),
        esc(r.address?.state),
        esc(r.address?.pincode),
        esc(r.address?.country),
        esc(r.medicalInfo?.hasMedicalConditions ? r.medicalInfo.conditions || 'Yes' : 'No'),
        esc(r.medicalInfo?.allergies),
        esc(r.medicalInfo?.bloodGroup),
        esc(r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : ''),
      ].join(','))
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `participants-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  },

  async exportExcel(params = {}) {
    const res = await this.list({ ...params, limit: 10000 })
    const rows = res.registrations || []
    const esc = (v) => {
      const s = String(v ?? '')
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
    }
    const xlsRows = [
      [
        'Registration#', 'Status', 'RunnerName', 'Email', 'Phone', 'Gender', 'DOB',
        'Event', 'Category', 'Distance', 'TShirt', 'BibNo',
        'PaymentStatus', 'Amount', 'TransactionID',
        'CheckedIn', 'RaceCompleted',
        'EmergencyContact', 'EmergencyPhone', 'Relationship',
        'Street', 'City', 'State', 'Pincode', 'Country',
        'MedicalConditions', 'Allergies', 'BloodGroup',
        'RegisteredAt',
      ].join(','),
    ]
    for (const r of rows) {
      xlsRows.push([
        esc(r.registrationNumber),
        esc(r.status),
        esc(r.runnerDetails?.fullName),
        esc(r.runnerDetails?.email),
        esc(r.runnerDetails?.phone),
        esc(r.runnerDetails?.gender),
        esc(r.runnerDetails?.dateOfBirth ? new Date(r.runnerDetails.dateOfBirth).toISOString().slice(0, 10) : ''),
        esc(r.marathon?.title),
        esc(r.raceCategory?.name),
        esc(r.raceCategory?.distance),
        esc(r.tshirtSize),
        esc(r.bibNumber),
        esc(r.payment?.status),
        r.payment?.amount != null ? String(r.payment.amount) : '',
        esc(r.payment?.transactionId),
        r.isCheckedIn ? 'Yes' : 'No',
        r.isCompleted ? 'Yes' : 'No',
        esc(r.emergencyContact?.fullName),
        esc(r.emergencyContact?.phone),
        esc(r.emergencyContact?.relationship),
        esc(r.address?.street),
        esc(r.address?.city),
        esc(r.address?.state),
        esc(r.address?.pincode),
        esc(r.address?.country),
        esc(r.medicalInfo?.hasMedicalConditions ? r.medicalInfo.conditions || 'Yes' : 'No'),
        esc(r.medicalInfo?.allergies),
        esc(r.medicalInfo?.bloodGroup),
        esc(r.createdAt ? new Date(r.createdAt).toISOString().slice(0, 10) : ''),
      ].join(','))
    }
    const bom = '\uFEFF'
    const blob = new Blob([bom + xlsRows.join('\n')], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `participants-${new Date().toISOString().slice(0, 10)}.xls`
    a.click()
    URL.revokeObjectURL(url)
  },
}
