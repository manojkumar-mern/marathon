import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaCertificate, FaCalendarDays, FaLocationDot, FaDownload, FaLock, FaCircleCheck, FaEye, FaMagnifyingGlass } from 'react-icons/fa6'
import SEO from '../components/common/SEO'
import { BRAND } from '../config/brand'
import { useAuth } from '../context/useAuth'
import { certificateService } from '../admin/services/certificate.service'
import { registrationService } from '../services/registration.service'

export default function CertificatesPage() {
  const { isAuthenticated } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || (isAuthenticated ? 'download' : 'verify')

  // Download state
  const [myCertificates, setMyCertificates] = useState([])
  const [loadingCerts, setLoadingCerts] = useState(false)

  // Verify state
  const [certNumber, setCertNumber] = useState('')
  const [verifyError, setVerifyError] = useState('')

  const fetchMyCertificates = useCallback(async () => {
    if (!isAuthenticated) return
    setLoadingCerts(true)
    try {
      const regData = await registrationService.getMyRegistrations()
      const regs = regData.registrations || []

      const certsList = []
      for (const reg of regs) {
        try {
          const statusRes = await certificateService.getStatus(reg._id)
          certsList.push({ reg, status: statusRes.data })
        } catch (err) {
          console.error(`Failed to get certificate status for registration ${reg._id}:`, err)
        }
      }
      setMyCertificates(certsList)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCerts(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (activeTab === 'download') {
      fetchMyCertificates()
    }
  }, [activeTab, fetchMyCertificates])

  const handleVerifySubmit = (e) => {
    e.preventDefault()
    setVerifyError('')
    if (!certNumber.trim()) {
      setVerifyError('Please enter a certificate number.')
      return
    }
    // Call the verify method which opens the verify page in a new window
    certificateService.verify(certNumber.trim())
  }

  return (
    <main className="min-h-screen bg-obsidian py-20 sm:py-28">
      <SEO title="E-Certificates" description={`Download and verify official e-certificates for ${BRAND.name} marathons.`} url="/certificates" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Race Recognition
          </p>
          <h1 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl uppercase">
            E-CERTIFICATES.
          </h1>
        </div>

        {/* Tabs switcher */}
        <div className="mb-10 flex justify-center border-b border-steel/40">
          <div className="flex gap-8">
            <button
              onClick={() => setSearchParams({ tab: 'download' })}
              className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-colors relative ${
                activeTab === 'download' ? 'text-ember' : 'text-muted hover:text-sf-white'
              }`}
            >
              Download Certificate
              {activeTab === 'download' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ember" />
              )}
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'verify' })}
              className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-colors relative ${
                activeTab === 'verify' ? 'text-ember' : 'text-muted hover:text-sf-white'
              }`}
            >
              Verify Certificate
              {activeTab === 'verify' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ember" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'download' ? (
          <div>
            {!isAuthenticated ? (
              <div className="mx-auto max-w-md text-center rounded-3xl border border-steel bg-carbon p-8">
                <FaLock className="mx-auto text-4xl text-ember/60 mb-4" />
                <h3 className="font-display text-xl font-black italic text-sf-white">LOGIN REQUIRED</h3>
                <p className="mt-2 text-sm text-muted">Sign in to view and download your finisher e-certificates.</p>
                <Link
                  to="/login?redirect=/certificates?tab=download"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-2.5 text-xs font-bold uppercase text-white shadow-lg shadow-ember/20 hover:bg-ember-deep transition-all"
                >
                  Sign In Now
                </Link>
              </div>
            ) : loadingCerts ? (
              <div className="flex justify-center py-20">
                <div className="size-8 animate-spin rounded-full border-2 border-ember border-t-transparent" />
              </div>
            ) : myCertificates.length === 0 ? (
              <div className="text-center py-20 rounded-3xl border border-steel/40 bg-carbon/40">
                <FaCertificate className="mx-auto text-4xl text-muted/40 mb-4" />
                <p className="text-sm text-muted">No completed event registrations found under your account.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {myCertificates.map(({ reg, status }) => {
                  const eligible = status?.eligibility === 'eligible'
                  const pending = status?.eligibility === 'pending_results_publish'
                  const cert = status?.certificates?.[0]

                  return (
                    <div key={reg._id} className="rounded-3xl border border-steel bg-carbon p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-muted">
                          <FaCalendarDays className="text-ember text-[10px]" />
                          {new Date(reg.marathon?.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          <span className="h-2 w-px bg-steel" />
                          <FaLocationDot className="text-ember text-[10px]" />
                          {reg.marathon?.venue || 'Venue'}
                        </div>
                        <h3 className="mt-2 font-display text-2xl font-black italic text-sf-white uppercase">
                          {reg.marathon?.title}
                        </h3>
                        <div className="mt-2 text-sm text-muted-dim">
                          Category: <strong className="text-sf-white">{reg.raceCategory?.name}</strong>
                          {cert && (
                            <span className="ml-4">Certificate #: <strong className="font-mono text-ember">{cert.id.substring(0, 8).toUpperCase()}</strong></span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-steel/50 pt-4 md:border-t-0 md:pt-0 flex flex-wrap items-center gap-4">
                        {eligible && cert ? (
                          <>
                            <button
                              onClick={() => certificateService.preview(cert.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-steel bg-obsidian px-5 py-3 text-xs font-bold uppercase tracking-wider text-sf-white transition-colors hover:bg-steel"
                            >
                              <FaEye /> Preview
                            </button>
                            <button
                              onClick={() => certificateService.download(cert.id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-ember px-5 py-3 text-xs font-bold uppercase tracking-wider text-obsidian transition-colors hover:bg-ember-deep"
                            >
                              <FaDownload /> Download PDF
                            </button>
                          </>
                        ) : pending ? (
                          <div className="rounded-xl bg-steel/30 px-4 py-2.5 border border-steel/50 text-center">
                            <span className="block text-xs font-bold uppercase tracking-wider text-muted-dim">Certificate Status</span>
                            <span className="block text-xs text-ember font-semibold mt-0.5">Awaiting Results Release</span>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-steel/30 px-4 py-2.5 border border-steel/50 text-center">
                            <span className="block text-xs font-bold uppercase tracking-wider text-muted-dim">Certificate Status</span>
                            <span className="block text-xs text-muted-dim font-semibold mt-0.5">Not Available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-md">
            <div className="rounded-3xl border border-steel bg-carbon p-8">
              <h3 className="font-display text-xl font-black italic text-sf-white uppercase text-center mb-6">Verify Certificate</h3>
              
              <form onSubmit={handleVerifySubmit} noValidate>
                <div className="mb-5">
                  <label htmlFor="cert-num" className="block text-sm font-medium text-muted mb-2">Certificate Number</label>
                  <input
                    id="cert-num"
                    type="text"
                    value={certNumber}
                    onChange={(e) => {
                      setCertNumber(e.target.value)
                      setVerifyError('')
                    }}
                    placeholder="Enter certificate verification ID..."
                    className="w-full rounded-xl border border-steel bg-obsidian px-4 py-3 text-sm text-sf-white outline-none placeholder:text-muted-dim focus:border-ember transition-colors"
                  />
                  {verifyError && <p className="mt-1.5 text-xs text-red-400" role="alert">{verifyError}</p>}
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:bg-ember-deep active:scale-95 cursor-pointer"
                >
                  <FaMagnifyingGlass /> Verify Certificate
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
