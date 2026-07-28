import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaArrowLeft, FaDownload, FaEnvelope, FaCertificate,
  FaCheck, FaRegClock, FaTrashCan, FaPrint,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { certificateService } from '../services/certificate.service'
import { BRAND } from '../../config/brand'

function formatTime(seconds) {
  if (seconds == null) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

function AdminCertificateDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [emailing, setEmailing] = useState(false)
  const [emailed, setEmailed] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchCert = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await certificateService.getById(id)
      setCert(data)
    } catch (err) {
      setError(err.message || 'Failed to load certificate')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchCert() }, [fetchCert])

  async function handleEmail() {
    setEmailing(true)
    setError(null)
    try {
      await certificateService.sendEmail(id)
      setEmailed(true)
      setCert((prev) => ({ ...prev, status: 'emailed' }))
    } catch (err) {
      setError(err.message || 'Failed to send email')
    } finally {
      setEmailing(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await certificateService.remove(id)
      navigate('/admin/certificates')
    } catch {
      setError('Failed to delete certificate')
      setDeleting(false)
    }
  }

  function handlePreview() {
    certificateService.preview(id)
  }

  if (loading) {
    return (
      <>
        <SEO title="Certificate" description={`${BRAND.name} certificate details`} />
        <PageContainer title="Certificate">
          <div className="space-y-4">
            <div className="h-64 animate-pulse rounded-xl border border-steel/60 bg-carbon" />
            <div className="h-32 animate-pulse rounded-xl border border-steel/60 bg-carbon" />
          </div>
        </PageContainer>
      </>
    )
  }

  if (error && !cert) {
    return (
      <>
        <SEO title="Certificate" description={`${BRAND.name} certificate details`} />
        <PageContainer title="Certificate">
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => navigate('/admin/certificates')}
              className="mt-4 text-sm text-ember hover:underline"
            >Back to Certificates</button>
          </div>
        </PageContainer>
      </>
    )
  }

  const eventDate = cert?.eventDate
    ? new Date(cert.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  return (
    <>
      <SEO title="Certificate" description={`${BRAND.name} certificate details`} />
      <PageContainer title="Certificate" description={`${cert?.certificateNumber || ''}`}>
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

        {emailed && (
          <div className="mb-6 rounded-lg border border-emerald-900/50 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-400">
            Certificate emailed to {cert?.participant?.email}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Certificate info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-xl border border-steel/60 bg-carbon p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-ember/10">
                    <FaCertificate className="size-4 text-ember" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-black italic text-sf-white">Certificate Details</h3>
                    <p className="text-xs text-muted-dim">{cert?.certificateNumber}</p>
                  </div>
                </div>
                <StatusBadge status={cert?.status || 'pending'} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-steel/20 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">Participant</p>
                  <p className="mt-1 text-sm font-semibold text-sf-white">{cert?.participant?.fullName || '—'}</p>
                  <p className="text-xs text-muted-dim">{cert?.participant?.email || ''}</p>
                </div>
                <div className="rounded-lg bg-steel/20 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">Event</p>
                  <p className="mt-1 text-sm font-semibold text-sf-white">{cert?.marathon?.title || '—'}</p>
                  <p className="text-xs text-muted-dim">{eventDate}</p>
                </div>
                <div className="rounded-lg bg-steel/20 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">Category</p>
                  <p className="mt-1 text-sm text-sf-white">
                    {cert?.raceCategory?.name || '—'}
                    {cert?.raceCategory?.distance ? ` (${cert.raceCategory.distance})` : ''}
                  </p>
                </div>
                <div className="rounded-lg bg-steel/20 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">Bib Number</p>
                  <p className="mt-1 font-mono text-sm text-sf-white">{cert?.bibNumber || '—'}</p>
                </div>
                <div className="rounded-lg bg-steel/20 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">Finish Time</p>
                  <p className="mt-1 font-mono text-lg font-bold text-ember">{formatTime(cert?.finishTime)}</p>
                </div>
                <div className="rounded-lg bg-steel/20 p-3.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">Generated At</p>
                  <p className="mt-1 text-sm text-sf-white">
                    {cert?.generatedAt
                      ? new Date(cert.generatedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })
                      : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {cert?.qrCode && (
              <div className="rounded-xl border border-steel/60 bg-carbon p-6">
                <h3 className="mb-4 font-display text-base font-black italic text-sf-white">Verification</h3>
                <div className="flex items-center gap-6">
                  <img src={cert.qrCode} alt="QR Code" className="size-28 rounded-lg border border-steel/60" />
                  <div>
                    <p className="text-sm text-muted-dim">
                      Scan this QR code to verify the authenticity of this certificate.
                    </p>
                    <p className="mt-2 text-xs text-muted-dim">
                      Certificate #: <span className="font-mono text-ember">{cert.certificateNumber}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions sidebar */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-xl border border-steel/60 bg-carbon p-5 sticky top-20">
              <h3 className="mb-4 font-display text-base font-black italic text-sf-white">Actions</h3>
              <div className="space-y-3">
                <button onClick={handlePreview}
                  className="w-full flex items-center gap-3 rounded-lg border border-steel/60 bg-steel/20 px-4 py-3 text-sm font-medium text-sf-white transition-colors hover:bg-steel/40"
                >
                  <FaPrint className="size-4 text-muted-dim" />
                  View / Print Certificate
                </button>
                <button onClick={handleEmail} disabled={emailing}
                  className="w-full flex items-center gap-3 rounded-lg border border-steel/60 bg-steel/20 px-4 py-3 text-sm font-medium text-sf-white transition-colors hover:bg-steel/40 disabled:opacity-50"
                >
                  {emailing ? (
                    <><FaRegClock className="size-4 text-muted-dim animate-spin" /> Sending...</>
                  ) : (
                    <><FaEnvelope className="size-4 text-muted-dim" /> Email to Participant</>
                  )}
                </button>
                {emailed && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-500/5 px-4 py-2">
                    <FaCheck className="size-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400">Email sent</span>
                  </div>
                )}
                <hr className="border-steel/40" />
                <button onClick={() => setShowDelete(true)}
                  className="w-full flex items-center gap-3 rounded-lg border border-red-900/30 bg-red-950/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/20"
                >
                  <FaTrashCan className="size-4" />
                  Delete Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message={`Remove certificate for "${cert?.participant?.fullName || 'this participant'}"? This permanently removes the record.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default AdminCertificateDetail
