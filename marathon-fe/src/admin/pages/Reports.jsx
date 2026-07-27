import { useCallback, useEffect, useState } from 'react'
import {
  FaChartBar, FaUsers, FaCalendarDays, FaIndianRupeeSign,
  FaFileExport, FaFileArrowDown, FaArrowTrendUp,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import { adminService } from '../services/admin.service'
import { participantService } from '../services/participant.service'
import { BRAND } from '../../config/brand'

function StatBox({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-steel/60 bg-carbon p-4">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs text-muted-dim">{label}</p>
        <p className="mt-0.5 text-xl font-bold text-sf-white">{value ?? '—'}</p>
      </div>
    </div>
  )
}

function TrendRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-steel/30 py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-mono text-sm font-semibold text-sf-white">{value}</span>
    </div>
  )
}

function AdminReports() {
  const [dashData, setDashData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminService.getDashboard()
      setDashData(res.data)
    } catch (err) {
      setError(err.message || 'Failed to load report data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const stats = dashData?.stats
  const trends = dashData?.trends
  const catDist = dashData?.categoryDistribution || []
  const genderDist = dashData?.genderDistribution || []

  const formatINR = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)

  async function handleExportParticipants() {
    setExporting(true)
    try {
      await participantService.exportCSV({})
    } catch (err) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  async function handleExportParticipantsExcel() {
    setExporting(true)
    try {
      await participantService.exportExcel({})
    } catch (err) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <SEO title="Reports" description={`${BRAND.name} analytics and reports`} />
      <PageContainer title="Reports" description="Platform analytics, trends, and data exports">
        {error && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* KPI Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatBox label="Total Events" value={loading ? '…' : stats?.totalEvents} icon={FaCalendarDays} color="bg-ember/10 text-ember" />
          <StatBox label="Total Participants" value={loading ? '…' : stats?.totalParticipants} icon={FaUsers} color="bg-blue-500/10 text-blue-400" />
          <StatBox label="Total Revenue" value={loading ? '…' : formatINR(stats?.totalRevenue)} icon={FaIndianRupeeSign} color="bg-emerald-500/10 text-emerald-400" />
          <StatBox label="Upcoming Events" value={loading ? '…' : stats?.upcomingEventsCount} icon={FaArrowTrendUp} color="bg-purple-500/10 text-purple-400" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Registration trend */}
          <div className="rounded-xl border border-steel/60 bg-carbon p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-sf-white">
              <FaChartBar className="size-4 text-ember" /> Monthly Registrations (Last 12 months)
            </h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-steel" />
                ))}
              </div>
            ) : (
              <div>
                {(trends?.registrations || []).slice(-12).map((m) => (
                  <TrendRow key={`${m.year}-${m.month}`} label={`${m.month} ${m.year}`} value={m.value} />
                ))}
                {(!trends?.registrations || trends.registrations.length === 0) && (
                  <p className="text-sm text-muted-dim">No registration trend data yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Revenue trend */}
          <div className="rounded-xl border border-steel/60 bg-carbon p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-sf-white">
              <FaIndianRupeeSign className="size-4 text-emerald-400" /> Monthly Revenue (Last 12 months)
            </h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-steel" />
                ))}
              </div>
            ) : (
              <div>
                {(trends?.revenue || []).slice(-12).map((m) => (
                  <TrendRow key={`${m.year}-${m.month}`} label={`${m.month} ${m.year}`} value={formatINR(m.value)} />
                ))}
                {(!trends?.revenue || trends.revenue.length === 0) && (
                  <p className="text-sm text-muted-dim">No revenue data yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Category distribution */}
          <div className="rounded-xl border border-steel/60 bg-carbon p-5">
            <h3 className="mb-4 text-sm font-semibold text-sf-white">Registrations by Category</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-steel" />
                ))}
              </div>
            ) : catDist.length > 0 ? (
              <div>
                {catDist.map((c) => (
                  <TrendRow key={c.category} label={c.category || 'Uncategorised'} value={c.count} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-dim">No category data yet.</p>
            )}
          </div>

          {/* Gender distribution */}
          <div className="rounded-xl border border-steel/60 bg-carbon p-5">
            <h3 className="mb-4 text-sm font-semibold text-sf-white">Gender Distribution</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-steel" />
                ))}
              </div>
            ) : genderDist.length > 0 ? (
              <div>
                {genderDist.map((g) => (
                  <TrendRow
                    key={g.gender}
                    label={g.gender.charAt(0).toUpperCase() + g.gender.slice(1)}
                    value={g.count}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-dim">No gender data yet.</p>
            )}
          </div>
        </div>

        {/* Export section */}
        <div className="mt-8 rounded-xl border border-steel/60 bg-carbon p-6">
          <h3 className="mb-4 text-sm font-semibold text-sf-white">Data Exports</h3>
          <p className="mb-4 text-xs text-muted-dim">
            Download all participant data in CSV or Excel format for offline analysis.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportParticipants}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-steel bg-obsidian px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-ember/40 hover:bg-steel disabled:opacity-50"
            >
              <FaFileExport size={14} />
              {exporting ? 'Exporting…' : 'All Participants (CSV)'}
            </button>
            <button
              onClick={handleExportParticipantsExcel}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-steel bg-obsidian px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-ember/40 hover:bg-steel disabled:opacity-50"
            >
              <FaFileArrowDown size={14} />
              {exporting ? 'Exporting…' : 'All Participants (Excel)'}
            </button>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default AdminReports
