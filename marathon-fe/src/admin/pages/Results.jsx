import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaTrophy, FaEye, FaPen, FaTrashCan, FaUpload, FaCircleCheck, FaCircleXmark, FaClock,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { resultService } from '../services/result.service'
import { eventService } from '../services/event.service'
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
    key: 'registrationNumber',
    label: 'Reg #',
    render: (val) => (
      <span className="font-mono text-xs text-ember">{val || '—'}</span>
    ),
  },
  {
    key: 'runnerDetails',
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
    key: 'gunTime',
    label: 'Gun Time',
    render: (val) => (
      <span className="font-mono text-sm text-sf-white">{formatTime(val)}</span>
    ),
  },
  {
    key: 'chipTime',
    label: 'Chip Time',
    render: (val) => (
      <span className="font-mono text-sm text-sf-white">{formatTime(val)}</span>
    ),
  },
  {
    key: 'overallPosition',
    label: 'Overall',
    sortable: true,
    render: (val) => (
      <span className="font-mono text-sm text-sf-white">
        {val != null ? `#${val}` : '—'}
      </span>
    ),
  },
  {
    key: 'categoryPosition',
    label: 'In Category',
    render: (val) => (
      <span className="font-mono text-sm text-muted">
        {val != null ? `#${val}` : '—'}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (val) => <StatusBadge status={val || 'pending'} />,
  },
]

const filterConfig = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['finished', 'dnf', 'dns', 'pending'],
  },
  { key: 'event', label: 'Event', type: 'text' },
]

function AdminResults() {
  const navigate = useNavigate()
  const {
    search, setSearch,
    filters, setFilters,
    sort, setSort,
    page, setPage,
    rowsPerPage, setRowsPerPage,
  } = useTableState()

  const [data, setData] = useState({ results: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [events, setEvents] = useState([])
  const [publishEvent, setPublishEvent] = useState('')
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await eventService.list({ all: 'true', limit: 100 })
        setEvents(res.marathons || [])
      } catch (err) {
        console.error(err)
      }
    }
    loadEvents()
  }, [])

  async function handlePublishResults() {
    if (!publishEvent) return alert('Select an event first')
    setPublishing(true)
    try {
      await resultService.publish(publishEvent)
      alert('Successfully published results and updated rankings!')
      fetchResults()
    } catch (err) {
      alert(err.message || 'Failed to publish results')
    } finally {
      setPublishing(false)
    }
  }

  async function handleUnpublishResults() {
    if (!publishEvent) return alert('Select an event first')
    setPublishing(true)
    try {
      await resultService.unpublish(publishEvent)
      alert('Successfully unpublished results!')
      fetchResults()
    } catch (err) {
      alert(err.message || 'Failed to unpublish results')
    } finally {
      setPublishing(false)
    }
  }

  const fetchResults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: rowsPerPage }
      if (search) params.search = search
      if (filters.status) params.status = filters.status
      if (filters.event) params.event = filters.event
      if (sort.key) params.sort = sort.direction === 'asc' ? sort.key : `-${sort.key}`
      const res = await resultService.list(params)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }, [search, filters, sort, page, rowsPerPage])

  useEffect(() => { fetchResults() }, [fetchResults])
  useEffect(() => { setPage(1) }, [search, filters, setPage])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await resultService.remove(deleteTarget._id)
      setDeleteTarget(null)
      fetchResults()
    } catch {
      setError('Failed to delete result')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <SEO title="Results" description={`Manage ${BRAND.name} race results`} />
      <PageContainer title="Results" description="Publish and manage race results">
        <DataTable
          columns={columns}
          data={data.results}
          loading={loading}
          error={error}
          emptyMessage="No results published yet. Upload race results to get started."
          rowKey="_id"
          searchable
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search by name, reg number, or event..."
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
              onClick: (row) => navigate(`/admin/results/${row._id}`),
            },
            {
              label: 'Edit',
              icon: FaPen,
              onClick: (row) => navigate(`/admin/results/${row._id}/edit`),
            },
            {
              label: 'Delete',
              icon: FaTrashCan,
              danger: true,
              onClick: (row) => setDeleteTarget(row),
            },
          ]}
        />

        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-steel/60 bg-carbon p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-muted-dim">Manage Results Publishing</span>
            <select
              value={publishEvent}
              onChange={(e) => setPublishEvent(e.target.value)}
              className="rounded-lg border border-steel/60 bg-obsidian px-3 py-2 text-sm text-sf-white outline-none focus:border-ember"
            >
              <option value="">-- Select Event --</option>
              {events.map((e) => (
                <option key={e._id} value={e._id}>{e.title}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handlePublishResults}
            disabled={publishing || !publishEvent}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
          >
            <FaCircleCheck size={14} />
            {publishing ? 'Publishing...' : 'Publish Official Results'}
          </button>
          <button
            onClick={handleUnpublishResults}
            disabled={publishing || !publishEvent}
            className="inline-flex items-center gap-2 rounded-xl border border-steel bg-obsidian px-5 py-3 text-sm font-semibold text-muted-dim transition-colors hover:bg-steel disabled:opacity-50"
          >
            <FaCircleXmark size={14} />
            {publishing ? 'Unpublishing...' : 'Unpublish Results'}
          </button>
          <div className="ml-auto">
            <button
              onClick={() => navigate('/admin/results/upload')}
              className="inline-flex items-center gap-2 rounded-xl bg-ember px-5 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-ember-deep"
            >
              <FaUpload size={14} />
              Upload Results
            </button>
          </div>
        </div>
      </PageContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Result"
        message={`Remove result for "${deleteTarget?.runner?.fullName || deleteTarget?.runnerDetails?.fullName || 'this participant'}"? This permanently removes the record.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default AdminResults
