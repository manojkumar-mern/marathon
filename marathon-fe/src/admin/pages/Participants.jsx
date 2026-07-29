import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUsers, FaCircleCheck, FaClock, FaCircleXmark,
  FaEye, FaTrashCan, FaFileExport, FaFileArrowDown, FaShirt,
  FaCertificate, FaDownload,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { participantService } from '../services/participant.service'
import { certificateService } from '../services/certificate.service'
import { MOCK_TSHIRT_SIZES } from '../services/mock.data'
import useTableState from '../hooks/useTableState'
import { BRAND } from '../../config/brand'

/* ── Columns ─────────────────────────────────────────────────────── */
const columns = [
  {
    key: 'registrationNumber',
    label: 'Reg #',
    render: (val) => (
      <span className="font-mono text-xs text-ember">{val || '—'}</span>
    ),
  },
  {
    key: 'bibNumber',
    label: 'Bib #',
    render: (val) => (
      <span className="font-mono text-xs font-semibold text-sf-white">{val || 'TBD'}</span>
    ),
  },
  {
    key: 'runnerDetails',
    label: 'Participant',
    render: (val, row) => (
      <div>
        <p className="text-sm font-medium text-sf-white">
          {val?.fullName || row.user?.fullName || '—'}
        </p>
        <p className="text-xs text-muted-dim">
          {val?.email || row.user?.email || ''}
        </p>
      </div>
    ),
  },
  {
    key: 'marathon',
    label: 'Event',
    render: (val) => (
      <span className="max-w-[160px] truncate text-sm text-sf-white" title={val?.title}>
        {val?.title || '—'}
      </span>
    ),
  },
  {
    key: 'raceCategory',
    label: 'Category',
    render: (val) => (
      <span className="text-xs text-muted">{val?.name || '—'}</span>
    ),
  },
  {
    key: 'tshirtSize',
    label: 'T-Shirt',
    render: (val) => (
      <span className="inline-flex items-center rounded-full bg-steel/40 px-2 py-0.5 text-xs font-semibold text-sf-white">
        {val || '—'}
      </span>
    ),
  },
  {
    key: 'payment',
    label: 'Amount',
    render: (val) =>
      val?.amount != null
        ? new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
          }).format(val.amount)
        : '—',
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'payment',
    label: 'Payment',
    render: (val) => <StatusBadge status={val?.status || 'pending'} />,
  },
  {
    key: 'createdAt',
    label: 'Registered',
    sortable: true,
    render: (val) =>
      val
        ? new Date(val).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '—',
  },
]

/* ── Filter config ───────────────────────────────────────────────── */
const filterConfig = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['pending', 'confirmed', 'cancelled', 'withdrawn'],
  },
]

/* ── Summary card ────────────────────────────────────────────────── */
function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-steel bg-carbon p-4">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">{label}</p>
        <p className="mt-0.5 font-display text-2xl font-black text-sf-white">{value ?? '—'}</p>
      </div>
    </div>
  )
}

/* ── T-Shirt Size Report ─────────────────────────────────────────── */
function TshirtSizeReport({ rows }) {
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

  // Compute from live data if available, else use mock
  const sizeMap = useMemo(() => {
    if (rows && rows.length > 0) {
      const map = {}
      rows.forEach((r) => {
        const sz = r.tshirtSize || 'N/A'
        map[sz] = (map[sz] || 0) + 1
      })
      return map
    }
    const map = {}
    MOCK_TSHIRT_SIZES.forEach((s) => { map[s.size] = s.count })
    return map
  }, [rows])

  const sizes = sizeOrder.map((sz) => ({ size: sz, count: sizeMap[sz] || 0 }))
  const total = sizes.reduce((s, r) => s + r.count, 0)

  return (
    <div className="mt-8 rounded-xl border border-steel bg-carbon p-6">
      <div className="mb-4 flex items-center gap-2">
        <FaShirt className="size-4 text-ember" />
        <h3 className="text-sm font-semibold text-sf-white">T-Shirt Size Report</h3>
        <span className="ml-auto text-xs text-muted-dim">Total: {total}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {sizes.map((s) => {
          const pct = total > 0 ? Math.round((s.count / total) * 100) : 0
          return (
            <div
              key={s.size}
              className="flex flex-col items-center rounded-xl border border-steel/60 bg-obsidian p-3 text-center"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-ember">{s.size}</span>
              <span className="mt-1 text-2xl font-black text-sf-white">{s.count}</span>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-steel/40">
                <div
                  className="h-full rounded-full bg-ember"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="mt-1 text-[10px] text-muted-dim">{pct}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────── */
function AdminParticipants() {
  const navigate = useNavigate()
  const {
    search, setSearch,
    filters, setFilters,
    sort, setSort,
    page, setPage,
    rowsPerPage, setRowsPerPage,
  } = useTableState()

  const [data, setData] = useState({ registrations: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [exporting, setExporting] = useState(false)
  // Cache all rows (unfiltered) for the T-shirt size report
  const [allRows, setAllRows] = useState([])

  const fetchParticipants = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: rowsPerPage }
      if (search) params.search = search
      if (filters.status) params.status = filters.status
      if (sort.key) params.sort = sort.direction === 'asc' ? sort.key : `-${sort.key}`

      const res = await participantService.list(params)
      setData(res)

      // For the T-shirt report, also fetch all (no filters)
      if (!search && !filters.status) {
        const allRes = await participantService.list({ limit: 10000 })
        setAllRows(allRes.registrations || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load participants')
    } finally {
      setLoading(false)
    }
  }, [search, filters, sort, page, rowsPerPage])

  useEffect(() => { fetchParticipants() }, [fetchParticipants])
  useEffect(() => { setPage(1) }, [search, filters, setPage])

  // Compute summary counts from current page data
  const counts = useMemo(() => {
    const rows = data.registrations || []
    return {
      confirmed: rows.filter((r) => r.status === 'confirmed').length,
      pending:   rows.filter((r) => r.status === 'pending').length,
      cancelled: rows.filter((r) => r.status === 'cancelled').length,
    }
  }, [data.registrations])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await participantService.remove(deleteTarget._id)
      setDeleteTarget(null)
      fetchParticipants()
    } catch (err) {
      setError(err.message || 'Failed to delete registration')
    } finally {
      setDeleting(false)
    }
  }

  const [actionLoading, setActionLoading] = useState(false)

  async function handleGenerateCertificate(row) {
    setActionLoading(true)
    try {
      const res = await certificateService.generate({ registrationId: row._id, type: 'finisher' })
      alert(`Successfully generated certificate for ${row.runnerDetails?.fullName || 'participant'}!`)
      fetchParticipants()
    } catch (err) {
      alert(err.message || 'Failed to generate certificate. Ensure results are published first.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleViewCertificate(row) {
    setActionLoading(true)
    try {
      const res = await certificateService.list({ search: row.registrationNumber })
      if (res.certificates && res.certificates.length > 0) {
        certificateService.preview(res.certificates[0]._id)
      } else {
        alert('No certificate generated yet for this participant.')
      }
    } catch (err) {
      alert('Error fetching certificate details.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDownloadCertificate(row) {
    setActionLoading(true)
    try {
      const res = await certificateService.list({ search: row.registrationNumber })
      if (res.certificates && res.certificates.length > 0) {
        certificateService.download(res.certificates[0]._id)
      } else {
        alert('No certificate generated yet for this participant.')
      }
    } catch (err) {
      alert('Error downloading certificate.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleExportCSV() {
    setExporting(true)
    try {
      const params = {}
      if (search) params.search = search
      if (filters.status) params.status = filters.status
      await participantService.exportCSV(params)
    } catch (err) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  async function handleExportExcel() {
    setExporting(true)
    try {
      const params = {}
      if (search) params.search = search
      if (filters.status) params.status = filters.status
      await participantService.exportExcel(params)
    } catch (err) {
      setError(err.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <SEO title="Participants" description={`Manage ${BRAND.name} participant registrations`} />
      <PageContainer
        title="Participants"
        description="View, search, filter, and manage all participant registrations"
      >
        {/* Summary strip */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total Registered"
            value={data.total}
            icon={FaUsers}
            color="bg-ember/10 text-ember"
          />
          <SummaryCard
            label="Confirmed"
            value={counts.confirmed}
            icon={FaCircleCheck}
            color="bg-emerald-500/10 text-emerald-400"
          />
          <SummaryCard
            label="Pending"
            value={counts.pending}
            icon={FaClock}
            color="bg-amber-500/10 text-amber-400"
          />
          <SummaryCard
            label="Cancelled"
            value={counts.cancelled}
            icon={FaCircleXmark}
            color="bg-red-500/10 text-red-400"
          />
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={data.registrations}
          loading={loading}
          error={error}
          emptyMessage="No participants found. Registrations will appear here once submitted."
          rowKey="_id"
          searchable
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search by name, email, or reg number…"
          filterable
          filters={filters}
          filterConfig={filterConfig}
          onFilter={setFilters}
          sortable
          sort={sort}
          onSort={setSort}
          paginated
          page={page}
          rowsPerPage={rowsPerPage}
          totalRecords={data.total}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          actions={[
            {
              label: 'View',
              icon: FaEye,
              onClick: (row) => navigate(`/admin/participants/${row._id}`),
            },
            {
              label: 'Generate Cert',
              icon: FaCertificate,
              onClick: (row) => handleGenerateCertificate(row),
              disabled: (row) => row.status !== 'confirmed' || actionLoading,
            },
            {
              label: 'View Cert',
              icon: FaEye,
              onClick: (row) => handleViewCertificate(row),
              disabled: () => actionLoading,
            },
            {
              label: 'Download Cert',
              icon: FaDownload,
              onClick: (row) => handleDownloadCertificate(row),
              disabled: () => actionLoading,
            },
            {
              label: 'Delete',
              icon: FaTrashCan,
              danger: true,
              onClick: (row) => setDeleteTarget(row),
            },
          ]}
        />

        {/* Export buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl border border-steel bg-carbon px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-ember/40 hover:bg-steel disabled:opacity-50"
          >
            <FaFileExport size={14} />
            {exporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <button
            onClick={handleExportExcel}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl border border-steel bg-carbon px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-ember/40 hover:bg-steel disabled:opacity-50"
          >
            <FaFileArrowDown size={14} />
            {exporting ? 'Exporting…' : 'Export Excel'}
          </button>
          <span className="text-xs text-muted-dim">
            Exports all matching records (up to 10,000)
          </span>
        </div>

        {/* T-Shirt Size Report */}
        <TshirtSizeReport rows={allRows} />
      </PageContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Registration"
        message={`Remove registration for "${deleteTarget?.runnerDetails?.fullName || deleteTarget?.user?.fullName}"? This permanently removes the record.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default AdminParticipants
