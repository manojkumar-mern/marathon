import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft, FaPen, FaTrashCan } from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { eventService } from '../services/event.service'
import { getComputedStatus } from '../utils/constants'
import { BRAND } from '../../config/brand'

function DetailRow({ label, value }) {
  return (
    <div className="flex border-b border-steel/50 py-3">
      <span className="w-44 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-dim">{label}</span>
      <span className="text-sm text-sf-white">{value || '—'}</span>
    </div>
  )
}

function AdminEventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    eventService.getById(id)
      .then(setEvent)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    setDeleting(true)
    try {
      await eventService.remove(id)
      navigate('/admin/events')
    } catch {
      setError('Failed to delete event')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <PageContainer title="Event Details">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-steel" />
          ))}
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer title="Event Details">
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center">
          <p className="text-sm text-red-400">{error}</p>
          <Link to="/admin/events" className="mt-4 inline-block text-sm text-ember hover:underline">← Back to events</Link>
        </div>
      </PageContainer>
    )
  }

  if (!event) return null

  return (
    <>
      <SEO title={event.title} description={`${BRAND.name} event details`} />
      <PageContainer title={event.title} description="Event details and statistics">
        <div className="mb-6 flex items-center gap-3">
          <StatusBadge status={getComputedStatus(event)} />
          {event.featured && (
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">Featured</span>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">General Information</h3>
            <DetailRow label="Event Code" value={event.eventCode} />
            <DetailRow label="Slug" value={event.slug} />
            <DetailRow label="Short Description" value={event.shortDescription} />
            <DetailRow label="Registration Count" value={event.registrationCount ?? '—'} />
          </div>

          <div className="rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Dates &amp; Venue</h3>
            <DetailRow label="Event Date" value={event.eventDate ? new Date(event.eventDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
            <DetailRow label="Registration Opens" value={event.registrationStartDate ? new Date(event.registrationStartDate).toLocaleDateString() : '—'} />
            <DetailRow label="Registration Closes" value={event.registrationEndDate ? new Date(event.registrationEndDate).toLocaleDateString() : '—'} />
            <DetailRow label="Venue" value={event.venue?.name} />
            <DetailRow label="City" value={event.venue?.city} />
            <DetailRow label="State" value={event.venue?.state} />
            <DetailRow label="Country" value={event.venue?.country} />
          </div>

          <div className="rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Contact</h3>
            <DetailRow label="Organizer" value={event.organizer} />
            <DetailRow label="Email" value={event.contactEmail} />
            <DetailRow label="Phone" value={event.contactPhone} />
          </div>

          <div className="rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Race Categories</h3>
            {event.raceCategories?.length > 0 ? (
              <div className="space-y-3">
                {event.raceCategories.map((cat, i) => (
                  <div key={i} className="rounded-lg border border-steel/50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-sf-white">{cat.name}</span>
                      <StatusBadge status={cat.isActive ? 'Active' : 'Inactive'} />
                    </div>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span>{cat.distance}</span>
                      <span className="capitalize">{cat.difficulty}</span>
                      <span>₹{cat.price?.toLocaleString('en-IN')}</span>
                      <span>Max: {cat.maxParticipants}</span>
                      {cat.startTime && <span>Start: {cat.startTime}</span>}
                    </div>
                    {cat.description && <p className="mt-1 text-xs text-muted-dim">{cat.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No categories defined</p>
            )}
          </div>
        </div>

        {event.description && (
          <div className="mt-6 rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Description</h3>
            <p className="text-sm leading-relaxed text-muted">{event.description}</p>
          </div>
        )}

        {event.rules?.length > 0 && (
          <div className="mt-6 rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Race Rules</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted">
              {event.rules.map((rule, i) => <li key={i}>{rule}</li>)}
            </ol>
          </div>
        )}

        {event.faqs?.length > 0 && (
          <div className="mt-6 rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">FAQs</h3>
            <div className="space-y-4">
              {event.faqs.map((faq, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-sf-white">{faq.question}</p>
                  <p className="mt-1 text-sm text-muted">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {event.sponsors?.length > 0 && (
          <div className="mt-6 rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Sponsors</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {event.sponsors.map((sp, i) => (
                <div key={i} className="rounded-lg border border-steel/50 p-3">
                  <p className="text-sm font-medium text-sf-white">{sp.name}</p>
                  <StatusBadge status={sp.tier} />
                  {sp.website && <p className="mt-1 text-xs text-muted-dim truncate">{sp.website}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-steel bg-carbon p-6">
            <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Timestamps</h3>
            <DetailRow label="Created" value={event.createdAt ? new Date(event.createdAt).toLocaleString() : '—'} />
            <DetailRow label="Updated" value={event.updatedAt ? new Date(event.updatedAt).toLocaleString() : '—'} />
          </div>

          {event.bannerImage && (
            <div className="rounded-xl border border-steel bg-carbon p-6">
              <h3 className="mb-4 font-display text-lg font-black italic text-sf-white">Banner</h3>
              <img src={event.bannerImage} alt="Event banner" className="max-h-48 rounded-lg object-cover" />
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Link to="/admin/events" className="inline-flex items-center gap-2 rounded-xl border border-steel px-5 py-3 text-sm font-medium text-muted transition-colors hover:bg-steel hover:text-sf-white">
            <FaArrowLeft size={14} /> Back to Events
          </Link>
          <Link to={`/admin/events/${id}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-steel px-5 py-3 text-sm font-medium text-muted transition-colors hover:bg-steel hover:text-sf-white">
            <FaPen size={14} /> Edit
          </Link>
          <button onClick={() => setShowDelete(true)} className="inline-flex items-center gap-2 rounded-xl border border-red-900/50 px-5 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10">
            <FaTrashCan size={14} /> Delete
          </button>
        </div>
      </PageContainer>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Permanently delete "${event.title}"? This action uses soft delete.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default AdminEventDetails
