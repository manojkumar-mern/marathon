import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FaPlus, FaEye, FaPen, FaTrashCan,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { eventService } from '../services/event.service'
import useTableState from '../hooks/useTableState'
import { getComputedStatus } from '../utils/constants'
import { BRAND } from '../../config/brand'

const columns = [
  {
    key: 'bannerImage',
    label: 'Banner',
    render: (val) =>
      val ? (
        <img src={val} alt="" className="size-10 rounded-lg object-cover" />
      ) : (
        <div className="size-10 rounded-lg bg-steel" />
      ),
  },
  { key: 'title', label: 'Event Name', sortable: true },
  { key: 'eventCode', label: 'Code' },
  {
    key: 'eventDate',
    label: 'Date',
    sortable: true,
    render: (val) =>
      val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
  },
  {
    key: 'venue',
    label: 'Location',
    render: (_, row) => [row.venue?.city, row.venue?.state].filter(Boolean).join(', ') || '—',
  },
  {
    key: 'raceCategories',
    label: 'Categories',
    render: (val) => val?.length || 0,
  },
  {
    key: 'registrationCount',
    label: 'Registrations',
    sortable: true,
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (val, row) => <StatusBadge status={getComputedStatus(row)} />,
  },
  {
    key: 'createdAt',
    label: 'Created',
    sortable: true,
    render: (val) =>
      val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
  },
]

const filterConfig = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: ['draft', 'published', 'completed', 'cancelled'],
  },
  { key: 'city', label: 'City', type: 'text' },
]

function AdminEvents() {
  const navigate = useNavigate()
  const { search, setSearch, filters, setFilters, sort, setSort, page, setPage, rowsPerPage, setRowsPerPage } = useTableState()
  const [data, setData] = useState({ marathons: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: rowsPerPage }
      if (search) params.search = search
      if (filters.status) params.status = filters.status
      if (filters.city) params.city = filters.city
      if (sort.key) params.sort = sort.direction === 'asc' ? sort.key : `-${sort.key}`
      const res = await eventService.list(params)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [search, filters, sort, page, rowsPerPage])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  useEffect(() => { setPage(1) }, [search, filters, setPage])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await eventService.remove(deleteTarget._id)
      setDeleteTarget(null)
      fetchEvents()
    } catch {
      setError('Failed to delete event')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <SEO title="Events" description={`Manage ${BRAND.name} events`} />
      <PageContainer title="Events" description="Create and manage marathon events">
        <DataTable
          columns={columns}
          data={data.marathons}
          loading={loading}
          error={error}
          emptyMessage="No events yet. Create your first event."
          rowKey="_id"
          searchable
          searchValue={search}
          onSearch={setSearch}
          searchPlaceholder="Search by name, city, or code..."
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
              onClick: (row) => navigate(`/admin/events/${row._id}`),
            },
            {
              label: 'Edit',
              icon: FaPen,
              onClick: (row) => navigate(`/admin/events/${row._id}/edit`),
            },
            {
              label: 'Delete',
              icon: FaTrashCan,
              danger: true,
              onClick: (row) => setDeleteTarget(row),
            },
          ]}
        />

        <div className="mt-6">
          <Link
            to="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-xl bg-ember px-5 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-ember-deep"
          >
            <FaPlus size={14} />
            Create Event
          </Link>
        </div>
      </PageContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action is reversible (soft delete).`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default AdminEvents
