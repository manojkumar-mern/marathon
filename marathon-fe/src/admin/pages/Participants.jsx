import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUsers, FaCircleCheck, FaClock, FaCircleXmark,
  FaEye, FaTrashCan, FaFileExport, FaFileArrowDown,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { participantService } from '../services/participant.service'
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
    } catch (err) {
      setError(err.message || 'Failed to load participants')
    } finally {
      setLoading(false)
    }
  }, [search, filters, sort, page, rowsPerPage])

  useEffect(() => { fetchParticipants() }, [fetchParticipants])
  useEffect(() => { setPage(1) }, [search, filters, setPage])

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

  // Summary counts from current page
  const confirmed = data.registrations?.filter((r) => r.status === 'confirmed').length ?? 0
  const pending   = data.registrations?.filter((r) => r.status === 'pending').length ?? 0
  const cancelled = data.registrations?.filter((r) => r.status === 'cancelled').length ?? 0

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
            value={confirmed}
            icon={FaCircleCheck}
            color="bg-emerald-500/10 text-emerald-400"
          />
          <SummaryCard
            label="Pending"
            value={pending}
            icon={FaClock}
            color="bg-amber-500/10 text-amber-400"
          />
          <SummaryCard
            label="Cancelled"
            value={cancelled}
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
