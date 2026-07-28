import { useCallback, useEffect, useState } from 'react'
import {
  FaChartBar, FaUsers, FaCalendarDays, FaIndianRupeeSign,
  FaFileExport, FaFileArrowDown, FaArrowTrendUp, FaShirt, FaFilePdf,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import { adminService } from '../services/admin.service'
import { participantService } from '../services/participant.service'
import { MOCK_TSHIRT_SIZES } from '../services/mock.data'
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
  const [dashData, setDashData]     = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [exporting, setExporting]   = useState(false)
  const [tshirtSizes, setTshirtSizes] = useState(MOCK_TSHIRT_SIZES)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [res, partRes] = await Promise.all([
        adminService.getDashboard(),
        participantService.list({ limit: 10000 }).catch(() => ({ registrations: [] })),
      ])
      setDashData(res.data)

      // Compute t-shirt sizes from live data
      const rows = partRes.registrations || []
      if (rows.length > 0) {
        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
        const map = {}
        rows.forEach((r) => { if (r.tshirtSize) map[r.tshirtSize] = (map[r.tshirtSize] || 0) + 1 })
        setTshirtSizes(sizeOrder.map((s) => ({ size: s, count: map[s] || 0 })))
      }
    } catch (err) {
      setError(err.message || 'Failed to load report data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const stats    = dashData?.stats
  const trends   = dashData?.trends
  const catDist  = dashData?.categoryDistribution || []
  const genderDist = dashData?.genderDistribution || []

  const formatINR = (v) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0)

  async function handleExport(type) {
    setExporting(true)
    try {
      if (type === 'csv')   await participantService.exportCSV({})
      if (type === 'excel') await participantService.exportExcel({})
      if (type === 'pdf')   handleExportPDF()
    } catch (err) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  function handleExportPDF() {
    const s = stats || {}
    const lines = [
      `${BRAND.name} — Admin Report`,
      `Generated: ${new Date().toLocaleString('en-IN')}`,
      '',
      '── Key Metrics ──',
      `Total Events:          ${s.totalEvents ?? '—'}`,
      `Total Participants:    ${s.activeParticipants ?? '—'}`,
      `Total Revenue:         ${formatINR(s.totalRevenue)}`,
      `Successful Payments:   ${s.successfulPayments ?? '—'}`,
      `Pending Payments:      ${s.pendingPayments ?? '—'}`,
      '',
      '── T-Shirt Sizes ──',
      ...tshirtSizes.map((s) => `${s.size.padEnd(5)}  ${s.count}`),
      '',
      '── Registrations by Category ──',
      ...catDist.map((c) => `${(c.category || 'Unknown').padEnd(20)}  ${c.count}`),
      '',
      '── Gender Distribution ──',
      ...genderDist.map((g) => `${(g.gender || 'Unknown').padEnd(12)}  ${g.count}`),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `report-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tshirtTotal = tshirtSizes.reduce((s, r) => s + r.count, 0)

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
          <StatBox label="Total Events"      value={loading ? '…' : stats?.totalEvents}           icon={FaCalendarDays}     color="bg-ember/10 text-ember" />
          <StatBox label="Total Participants" value={loading ? '…' : stats?.activeParticipants}    icon={FaUsers}            color="bg-blue-500/10 text-blue-400" />
          <StatBox label="Total Revenue"     value={loading ? '…' : formatINR(stats?.totalRevenue)} icon={FaIndianRupeeSign} color="bg-emerald-500/10 text-emerald-400" />
          <StatBox label="Upcoming Events"   value={loading ? '…' : stats?.upcomingEventsCount}   icon={FaArrowTrendUp}     color="bg-purple-500/10 text-purple-400" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Registration trend */}
          <div className="rounded-xl border border-steel/60 bg-carbon p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-sf-white">
              <FaChartBar className="size-4 text-ember" /> Daily Registration Reports
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
                  <TrendRow key={`${m.year}-${m.month}`} label={`${m.month} ${m.year || ''}`} value={m.value} />
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
              <FaIndianRupeeSign className="size-4 text-emerald-400" /> Revenue Report (Last 12 months)
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
                  <TrendRow key={`${m.year}-${m.month}`} label={`${m.month} ${m.year || ''}`} value={formatINR(m.value)} />
                ))}
                {(!trends?.revenue || trends.revenue.length === 0) && (
                  <p className="text-sm text-muted-dim">No revenue data yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Category-wise report */}
          <div className="rounded-xl border border-steel/60 bg-carbon p-5">
            <h3 className="mb-4 text-sm font-semibold text-sf-white">Category-wise Registration Report</h3>
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

        {/* T-Shirt Size Report */}
        <div className="mt-6 rounded-xl border border-steel/60 bg-carbon p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-sf-white">
            <FaShirt className="size-4 text-ember" />
            Automatic T-Shirt Size Report
            <span className="ml-auto text-xs font-normal text-muted-dim">Total: {tshirtTotal}</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-steel/40">
                  <th className="py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-dim">Size</th>
                  <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-dim">Count</th>
                  <th className="py-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-dim">%</th>
                  <th className="py-2 pl-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-dim">Distribution</th>
                </tr>
              </thead>
              <tbody>
                {tshirtSizes.map((s) => {
                  const pct = tshirtTotal > 0 ? Math.round((s.count / tshirtTotal) * 100) : 0
                  return (
                    <tr key={s.size} className="border-b border-steel/20 last:border-0">
                      <td className="py-2.5 font-mono font-bold text-ember">{s.size}</td>
                      <td className="py-2.5 text-right font-semibold text-sf-white">{s.count}</td>
                      <td className="py-2.5 text-right text-muted-dim">{pct}%</td>
                      <td className="py-2.5 pl-4">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-steel/30">
                          <div className="h-full rounded-full bg-ember transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Stats */}
        <div className="mt-6 rounded-xl border border-steel/60 bg-carbon p-5">
          <h3 className="mb-4 text-sm font-semibold text-sf-white">Payment Statistics</h3>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-8 animate-pulse rounded bg-steel" />)}
            </div>
          ) : (
            <div>
              <TrendRow label="Successful Payments" value={stats?.successfulPayments ?? '—'} />
              <TrendRow label="Pending Payments"    value={stats?.pendingPayments    ?? '—'} />
              <TrendRow label="Failed Payments"     value={stats?.failedPayments     ?? '—'} />
              <TrendRow label="Total Revenue"       value={formatINR(stats?.totalRevenue)} />
            </div>
          )}
        </div>

        {/* Export section */}
        <div className="mt-8 rounded-xl border border-steel/60 bg-carbon p-6">
          <h3 className="mb-2 text-sm font-semibold text-sf-white">Export Reports</h3>
          <p className="mb-4 text-xs text-muted-dim">
            Download all participant and registration data in your preferred format.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleExport('csv')}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-steel bg-obsidian px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-ember/40 hover:bg-steel disabled:opacity-50"
            >
              <FaFileExport size={14} />
              {exporting ? 'Exporting…' : 'All Participants (CSV)'}
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-steel bg-obsidian px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-ember/40 hover:bg-steel disabled:opacity-50"
            >
              <FaFileArrowDown size={14} />
              {exporting ? 'Exporting…' : 'All Participants (Excel)'}
            </button>
            <button
              onClick={() => handleExport('pdf')}
              disabled={exporting}
              className="inline-flex items-center gap-2 rounded-xl border border-steel bg-obsidian px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-red-400/40 hover:text-red-400 disabled:opacity-50"
            >
              <FaFilePdf size={14} />
              {exporting ? 'Exporting…' : 'Summary Report (PDF/TXT)'}
            </button>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default AdminReports
