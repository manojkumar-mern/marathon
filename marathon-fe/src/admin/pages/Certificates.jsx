import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaCertificate, FaDownload, FaRotate, FaTrashCan,
  FaEye, FaEnvelope,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { certificateService } from '../services/certificate.service'
import useTableState from '../hooks/useTableState'
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

function RunnerDisplay({ val, row }) {
  const name = val?.fullName || row?.runnerDetails?.fullName || '—'
  const email = val?.email || row?.runnerDetails?.email || ''
  return (
    <div>
      <p className="text-sm font-medium text-sf-white">{name}</p>
      {email && <p className="text-xs text-muted-dim">{email}</p>}
    </div>
  )
}

const columns = [
  {
    key: 'certificateNumber',
    label: 'Certificate #',
    render: (val) => (
      <span className="font-mono text-xs text-ember">{val || '—'}</span>
    ),
  },
  {
    key: 'participant',
    label: 'Participant',
    render: (val, row) => <RunnerDisplay val={val} row={row} />,
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
    key: 'bibNumber',
    label: 'Bib',
    render: (val) => (
      <span className="font-mono text-xs text-muted-dim">{val || '—'}</span>
    ),
  },
  {
    key: 'finishTime',
    label: 'Finish Time',
    render: (val) => (
      <span className="font-mono text-sm text-sf-white">{formatTime(val)}</span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (val) => (
      <StatusBadge status={val || 'pending'} />
    ),
  },
  {
    key: 'generatedAt',
    label: 'Generated',
    sortable: true,
    render: (val) =>
      val
        ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '—',
  },
]

const filterConfig = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['generated', 'downloaded', 'emailed', 'pending'],
  },
  { key: 'event', label: 'Event', type: 'text' },
]

function AdminCertificates() {
  const navigate = useNavigate()
  const {
    search, setSearch,
    filters, setFilters,
    sort, setSort,
    page, setPage,
    rowsPerPage, setRowsPerPage,
  } = useTableState()

  const [data, setData] = useState({ certificates: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [regenerating, setRegenerating] = useState(null)

  const fetchCertificates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: rowsPerPage }
      if (search) params.search = search
      if (filters.status) params.status = filters.status
      if (filters.event) params.event = filters.event
      if (sort.key) params.sort = sort.direction === 'asc' ? sort.key : `-${sort.key}`
      const res = await certificateService.list(params)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }, [search, filters, sort, page, rowsPerPage])

  useEffect(() => { fetchCertificates() }, [fetchCertificates])
  useEffect(() => { setPage(1) }, [search, filters, setPage])

  async function handleRegenerate(row) {
    setRegenerating(row._id)
    try {
      await certificateService.regenerate(row._id)
      fetchCertificates()
    } catch {
      setError('Failed to regenerate certificate')
    } finally {
      setRegenerating(null)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await certificateService.remove(deleteTarget._id)
      setDeleteTarget(null)
      fetchCertificates()
    } catch {
      setError('Failed to delete certificate')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <SEO title="Certificates" description={`Manage ${BRAND.name} certificates`} />
      <PageContainer title="Certificates" description="Generate and manage certificates">
        <DataTable
          columns={columns}
          data={data.certificates}
          loading={loading}
          error={error}
          emptyMessage="No certificates generated yet. Generate certificates for completed races."
          rowKey="_id"
          searchable
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search by name, certificate number, or event..."
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
              onClick: (row) => navigate(`/admin/certificates/${row._id}`),
            },
            {
              label: 'View / Print',
              icon: FaEye,
              onClick: (row) => certificateService.preview(row._id),
            },
            {
              label: 'Download',
              icon: FaDownload,
              onClick: (row) => certificateService.download(row._id),
            },
            {
              label: 'Email',
              icon: FaEnvelope,
              onClick: (row) => navigate(`/admin/certificates/${row._id}`),
            },
            {
              label: 'Regenerate',
              icon: FaRotate,
              onClick: (row) => handleRegenerate(row),
              disabled: (row) => regenerating === row._id,
            },
            {
              label: 'Delete',
              icon: FaTrashCan,
              danger: true,
              onClick: (row) => setDeleteTarget(row),
            },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/admin/certificates/generate')}
            className="inline-flex items-center gap-2 rounded-xl bg-ember px-5 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-ember-deep"
          >
            <FaCertificate size={14} />
            Generate Certificates
          </button>
        </div>
      </PageContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        message={`Remove certificate for "${deleteTarget?.participant?.fullName || deleteTarget?.runnerDetails?.fullName || 'this participant'}"? This permanently removes the record.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default AdminCertificates
