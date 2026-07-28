import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaCertificate, FaArrowLeft, FaCheck, FaSpinner, FaTriangleExclamation,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import { certificateService } from '../services/certificate.service'
import { eventService } from '../services/event.service'
import { BRAND } from '../../config/brand'

function AdminCertificateGenerate() {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await eventService.list({ all: 'true', limit: 100 })
      setEvents(res.marathons || [])
    } catch (err) {
      setError(err.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function handleGenerate() {
    if (!selectedEvent) return
    setGenerating(true)
    setError(null)
    setResult(null)
    try {
      const res = await certificateService.generate({ marathonId: selectedEvent })
      setResult(res.data || res)
    } catch (err) {
      setError(err.message || 'Failed to generate certificates')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <>
      <SEO title="Generate Certificates" description={`Generate ${BRAND.name} certificates`} />
      <PageContainer title="Generate Certificates" description="Create certificates for event participants">
        <button
          onClick={() => navigate('/admin/certificates')}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-dim hover:text-sf-white transition-colors"
        >
          <FaArrowLeft size={12} /> Back to Certificates
        </button>

        {error && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="mb-6 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10">
                <FaCheck className="size-4 text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold text-emerald-400">Certificates Generated</p>
                <p className="mt-0.5 text-sm text-emerald-300/80">
                  {result.generated} generated, {result.skipped} skipped (already exist)
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/certificates')}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              <FaCertificate size={12} /> View Certificates
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-steel/60 bg-carbon p-6">
              <h3 className="mb-5 font-display text-lg font-black italic text-sf-white">
                Select Event
              </h3>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-steel/60" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <div className="rounded-lg border border-dashed border-steel/50 p-8 text-center">
                  <FaTriangleExclamation className="mx-auto mb-2 size-5 text-muted-dim" />
                  <p className="text-sm text-muted-dim">No events available. Create an event first.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event) => {
                    const isSelected = selectedEvent === event._id
                    return (
                      <button
                        key={event._id}
                        onClick={() => setSelectedEvent(event._id)}
                        className={`w-full rounded-xl border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-ember/50 bg-ember/5 ring-1 ring-ember/20'
                            : 'border-steel/60 bg-carbon hover:border-steel hover:bg-steel/20'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sf-white">{event.title}</p>
                            <p className="mt-0.5 text-xs text-muted-dim">
                              {event.eventDate
                                ? new Date(event.eventDate).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                  })
                                : 'Date TBD'}
                              {event.venue?.city ? ` — ${event.venue.city}` : ''}
                            </p>
                          </div>
                          {isSelected && <FaCheck className="size-4 text-ember" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-steel/60 bg-carbon p-6 sticky top-20">
              <h3 className="mb-5 font-display text-base font-black italic text-sf-white">
                Summary
              </h3>
              {selectedEvent ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-steel/30 p-3">
                    <p className="text-xs text-muted-dim">Selected Event</p>
                    <p className="mt-1 text-sm font-medium text-sf-white">
                      {events.find((e) => e._id === selectedEvent)?.title || '—'}
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                    <p className="text-xs text-amber-400">
                      Certificates will be generated for all confirmed participants with completed race status.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full rounded-xl bg-ember px-5 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-ember-deep disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <><FaSpinner className="size-4 animate-spin" /> Generating...</>
                    ) : (
                      <><FaCertificate size={14} /> Generate Certificates</>
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-sm text-muted-dim">Select an event to generate certificates.</p>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default AdminCertificateGenerate
