import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft, FaPen, FaBan, FaCheck, FaXmark, FaUser,
  FaEnvelope, FaPhone, FaMars, FaVenus, FaCakeCandles,
  FaKitMedical, FaShirt, FaTag, FaCalendar, FaHashtag,
  FaLocationDot, FaMapPin, FaCircleInfo, FaCreditCard, FaGlobe,
  FaTrashCan,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import ErrorState from '../components/ErrorState'
import { participantService } from '../services/participant.service'
import { BRAND } from '../../config/brand'

const statusOptions = ['pending', 'confirmed', 'cancelled', 'withdrawn']
const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function DetailField({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-muted-dim/60" />}
      <div className="min-w-0">
        <div className="text-xs text-muted-dim">{label}</div>
        <div className="text-sm text-sf-white break-words">{value || '—'}</div>
      </div>
    </div>
  )
}

function DetailSection({ title, children }) {
  return (
    <div className="rounded-xl border border-steel/60 bg-carbon p-5">
      <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-dim/70">{title}</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  )
}

function EditForm({ participant, onSaved, onCancel }) {
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (participant) {
      setForm({
        runnerDetails: participant.runnerDetails ? { ...participant.runnerDetails } : {},
        status: participant.status || 'pending',
        tshirtSize: participant.tshirtSize || '',
        isCheckedIn: participant.isCheckedIn || false,
        isCompleted: participant.isCompleted || false,
        bibNumber: participant.bibNumber || '',
      })
      setError(null)
    }
  }, [participant])

  function handleChange(field, value) {
    if (field.startsWith('runner.')) {
      const key = field.split('.')[1]
      setForm((prev) => ({ ...prev, runnerDetails: { ...prev.runnerDetails, [key]: value } }))
    } else {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const payload = {
        runnerDetails: form.runnerDetails,
        status: form.status,
        tshirtSize: form.tshirtSize,
        isCheckedIn: form.isCheckedIn,
        isCompleted: form.isCompleted,
        bibNumber: form.bibNumber,
      }
      await participantService.update(participant._id, payload)
      onSaved?.()
    } catch (err) {
      setError(err.message || 'Failed to update participant')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-steel/60 bg-carbon p-5">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-dim/70">Runner Details</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-muted-dim">Full Name</label>
            <input
              type="text"
              value={form.runnerDetails?.fullName || ''}
              onChange={(e) => handleChange('runner.fullName', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-dim">Email</label>
            <input
              type="email"
              value={form.runnerDetails?.email || ''}
              onChange={(e) => handleChange('runner.email', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-dim">Phone</label>
            <input
              type="tel"
              value={form.runnerDetails?.phone || ''}
              onChange={(e) => handleChange('runner.phone', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-dim">Gender</label>
            <select
              value={form.runnerDetails?.gender || ''}
              onChange={(e) => handleChange('runner.gender', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-dim">Date of Birth</label>
            <input
              type="date"
              value={form.runnerDetails?.dateOfBirth ? form.runnerDetails.dateOfBirth.slice(0, 10) : ''}
              onChange={(e) => handleChange('runner.dateOfBirth', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-steel/60 bg-carbon p-5">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-dim/70">Registration Details</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-muted-dim">Status</label>
            <select
              value={form.status || 'pending'}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-dim">T-Shirt Size</label>
            <select
              value={form.tshirtSize || ''}
              onChange={(e) => handleChange('tshirtSize', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            >
              <option value="">Select</option>
              {tshirtSizes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-dim">Bib Number</label>
            <input
              type="text"
              value={form.bibNumber || ''}
              onChange={(e) => handleChange('bibNumber', e.target.value)}
              className="w-full rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50 focus:ring-1 focus:ring-ember/20"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-steel/60 bg-carbon p-5">
        <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-dim/70">Check-in & Completion</h4>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-sf-white">
            <input
              type="checkbox"
              checked={form.isCheckedIn || false}
              onChange={(e) => handleChange('isCheckedIn', e.target.checked)}
              className="rounded border-steel/60 bg-obsidian text-ember outline-none focus:ring-2 focus:ring-ember/30 focus:ring-offset-0"
            />
            Checked In
          </label>
          <label className="flex items-center gap-2 text-sm text-sf-white">
            <input
              type="checkbox"
              checked={form.isCompleted || false}
              onChange={(e) => handleChange('isCompleted', e.target.checked)}
              className="rounded border-steel/60 bg-obsidian text-ember outline-none focus:ring-2 focus:ring-ember/30 focus:ring-offset-0"
            />
            Race Completed
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-steel/60 px-4 py-2 text-sm font-medium text-muted-dim transition-colors hover:bg-steel/40 hover:text-sf-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-obsidian transition-colors hover:bg-amber-600 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function ParticipantProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(false)

  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchParticipant = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await participantService.getById(id)
      setParticipant(data)
    } catch (err) {
      setError(err.message || 'Failed to load participant')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchParticipant() }, [fetchParticipant])

  async function handleCancel() {
    if (!cancelTarget) return
    setCancelling(true)
    try {
      await participantService.cancelRegistration(cancelTarget._id, 'Cancelled by admin')
      setCancelTarget(null)
      fetchParticipant()
    } catch {
      setError('Failed to cancel registration')
    } finally {
      setCancelling(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await participantService.remove(deleteTarget._id)
      navigate('/admin/participants')
    } catch {
      setError('Failed to delete participant')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <>
        <SEO title="Participant" description="Loading..." />
        <PageContainer title="Participant Profile">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-steel/60" />
            ))}
          </div>
        </PageContainer>
      </>
    )
  }

  if (error) {
    return (
      <>
        <SEO title="Error" description="Failed to load participant" />
        <PageContainer title="Participant Profile">
          <ErrorState message={error} onRetry={fetchParticipant} />
          <div className="mt-4">
            <Link
              to="/admin/participants"
              className="inline-flex items-center gap-2 text-sm text-muted-dim hover:text-sf-white transition-colors"
            >
              <FaArrowLeft size={12} /> Back to Participants
            </Link>
          </div>
        </PageContainer>
      </>
    )
  }

  if (!participant) {
    return (
      <>
        <SEO title="Not Found" description="Participant not found" />
        <PageContainer title="Participant Profile">
          <div className="rounded-xl border border-steel/60 bg-carbon p-8 text-center">
            <p className="text-muted-dim">Participant not found</p>
            <Link
              to="/admin/participants"
              className="mt-4 inline-flex items-center gap-2 text-sm text-ember hover:text-amber-500 transition-colors"
            >
              <FaArrowLeft size={12} /> Back to Participants
            </Link>
          </div>
        </PageContainer>
      </>
    )
  }

  const p = participant

  if (editing) {
    return (
      <>
        <SEO title="Edit Participant" description={`Editing ${p.runnerDetails?.fullName}`} />
        <PageContainer
          title={`Edit: ${p.runnerDetails?.fullName}`}
          description={`${p.registrationNumber} · ${p.marathon?.title}`}
        >
          <div className="mb-6">
            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-2 text-sm text-muted-dim hover:text-sf-white transition-colors"
            >
              <FaArrowLeft size={12} /> Back to profile
            </button>
          </div>
          <EditForm participant={p} onSaved={fetchParticipant} onCancel={() => setEditing(false)} />
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <SEO title={p.runnerDetails?.fullName || 'Participant'} description={`Profile for ${p.runnerDetails?.fullName}`} />
      <PageContainer
        title={p.runnerDetails?.fullName || 'Participant Profile'}
        description={`${p.registrationNumber || ''} · ${p.marathon?.title || ''}`}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/admin/participants"
            className="inline-flex items-center gap-2 text-sm text-muted-dim hover:text-sf-white transition-colors"
          >
            <FaArrowLeft size={12} /> Back to Participants
          </Link>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-steel/60 px-3 py-2 text-xs font-medium text-muted-dim transition-colors hover:bg-steel/40 hover:text-sf-white"
            >
              <FaPen size={11} /> Edit
            </button>
            {p.status !== 'cancelled' && (
              <button
                onClick={() => setCancelTarget(p)}
                className="inline-flex items-center gap-2 rounded-lg border border-amber-600/40 px-3 py-2 text-xs font-medium text-amber-400 transition-colors hover:bg-amber-950/20"
              >
                <FaBan size={11} /> Cancel Registration
              </button>
            )}
            <button
              onClick={() => setDeleteTarget(p)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-600/40 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-950/20"
            >
              <FaTrashCan size={11} /> Delete
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <DetailSection title="Registration">
            <DetailField icon={FaHashtag} label="Registration #" value={p.registrationNumber} />
            <DetailField icon={FaCalendar} label="Registered On" value={p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'} />
            <DetailField icon={FaTag} label="Bib Number" value={p.bibNumber} />
            <DetailField icon={FaCircleInfo} label="Status" value={<StatusBadge status={p.status} />} />
          </DetailSection>

          <DetailSection title="Runner">
            <DetailField icon={FaUser} label="Full Name" value={p.runnerDetails?.fullName} />
            <DetailField icon={FaEnvelope} label="Email" value={p.runnerDetails?.email} />
            <DetailField icon={FaPhone} label="Phone" value={p.runnerDetails?.phone} />
            <DetailField icon={p.runnerDetails?.gender === 'male' ? FaMars : p.runnerDetails?.gender === 'female' ? FaVenus : FaUser} label="Gender" value={p.runnerDetails?.gender ? p.runnerDetails.gender.charAt(0).toUpperCase() + p.runnerDetails.gender.slice(1) : '—'} />
            <DetailField icon={FaCakeCandles} label="Date of Birth" value={p.runnerDetails?.dateOfBirth ? new Date(p.runnerDetails.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
          </DetailSection>

          <DetailSection title="Event & Category">
            <DetailField icon={FaCalendar} label="Event" value={p.marathon?.title} />
            <DetailField icon={FaShirt} label="Race Category" value={p.raceCategory?.name} />
            <DetailField icon={FaLocationDot} label="Distance" value={p.raceCategory?.distance} />
            <DetailField icon={FaShirt} label="T-Shirt Size" value={p.tshirtSize} />
          </DetailSection>

          {p.emergencyContact && (
            <DetailSection title="Emergency Contact">
              <DetailField icon={FaUser} label="Name" value={p.emergencyContact.fullName} />
              <DetailField icon={FaPhone} label="Phone" value={p.emergencyContact.phone} />
              <DetailField icon={FaCircleInfo} label="Relationship" value={p.emergencyContact.relationship} />
            </DetailSection>
          )}

          {p.address && (
            <DetailSection title="Address">
              <DetailField icon={FaMapPin} label="Street" value={p.address.street} />
              <DetailField icon={FaLocationDot} label="City" value={p.address.city} />
              <DetailField icon={FaLocationDot} label="State" value={p.address.state} />
              <DetailField icon={FaHashtag} label="Pincode" value={p.address.pincode} />
              <DetailField icon={FaGlobe} label="Country" value={p.address.country} />
            </DetailSection>
          )}

          {p.medicalInfo && (
            <DetailSection title="Medical Info">
              <DetailField icon={FaKitMedical} label="Conditions" value={p.medicalInfo.hasMedicalConditions ? p.medicalInfo.conditions || 'Yes' : 'None reported'} />
              <DetailField icon={FaKitMedical} label="Allergies" value={p.medicalInfo.allergies || '—'} />
              <DetailField icon={FaKitMedical} label="Blood Group" value={p.medicalInfo.bloodGroup || '—'} />
              <DetailField icon={FaKitMedical} label="Emergency Medication" value={p.medicalInfo.emergencyMedication || '—'} />
            </DetailSection>
          )}

          <DetailSection title="Payment">
            <DetailField icon={FaCreditCard} label="Amount" value={p.payment?.amount ? `₹${p.payment.amount.toLocaleString('en-IN')}` : '—'} />
            <DetailField icon={FaCreditCard} label="Status" value={<StatusBadge status={p.payment?.status || 'pending'} />} />
            <DetailField icon={FaHashtag} label="Method" value={p.payment?.method ? p.payment.method.charAt(0).toUpperCase() + p.payment.method.slice(1) : '—'} />
            <DetailField icon={FaHashtag} label="Transaction ID" value={p.payment?.transactionId} />
            <DetailField icon={FaCalendar} label="Paid At" value={p.payment?.paidAt ? new Date(p.payment.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'} />
          </DetailSection>

          <DetailSection title="Check-in">
            <DetailField icon={FaCheck} label="Checked In" value={p.isCheckedIn ? 'Yes' : 'No'} />
            {p.checkedInAt && (
              <DetailField icon={FaCalendar} label="Checked In At" value={new Date(p.checkedInAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
            )}
            <DetailField icon={FaCheck} label="Race Completed" value={p.isCompleted ? 'Yes' : 'No'} />
            {p.completedAt && (
              <DetailField icon={FaCalendar} label="Completed At" value={new Date(p.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} />
            )}
          </DetailSection>
        </div>
      </PageContainer>

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
        title="Cancel Registration"
        message={`Are you sure you want to cancel the registration for "${cancelTarget?.runnerDetails?.fullName}"?`}
        confirmLabel="Cancel Registration"
        variant="danger"
        loading={cancelling}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Registration"
        message={`Are you sure you want to delete the registration for "${deleteTarget?.runnerDetails?.fullName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default ParticipantProfile
