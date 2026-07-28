import { useCallback, useEffect, useState } from 'react'
import {
  FaCreditCard, FaCircleCheck, FaClock, FaCircleXmark,
  FaIndianRupeeSign, FaFileExport,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import { paymentService } from '../services/admin.service'
import useTableState from '../hooks/useTableState'
import { BRAND } from '../../config/brand'

/* ── Currency formatter ──────────────────────────────────────────── */
const formatINR = (amount) =>
  amount != null
    ? new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount)
    : '—'

/* ── Columns ─────────────────────────────────────────────────────── */
const columns = [
  {
    key: 'receipt',
    label: 'Receipt / Order ID',
    render: (val, row) => (
      <div>
        <p className="font-mono text-xs text-ember">{val || row.gatewayOrderId || '—'}</p>
        {row.gatewayPaymentId && (
          <p className="mt-0.5 font-mono text-[10px] text-muted-dim">{row.gatewayPaymentId}</p>
        )}
      </div>
    ),
  },
  {
    key: 'user',
    label: 'Payer',
    render: (val) => (
      <div>
        <p className="text-sm font-medium text-sf-white">{val?.fullName || '—'}</p>
        <p className="text-xs text-muted-dim">{val?.email || ''}</p>
      </div>
    ),
  },
  {
    key: 'marathon',
    label: 'Event',
    render: (val) => <span className="text-sm text-sf-white">{val?.title || '—'}</span>,
  },
  {
    key: 'registration',
    label: 'Reg #',
    render: (val) => (
      <span className="font-mono text-xs text-muted">
        {val?.registrationNumber || '—'}
      </span>
    ),
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    render: (val) => (
      <span className="font-semibold text-sf-white">{formatINR(val)}</span>
    ),
  },
  {
    key: 'gateway',
    label: 'Gateway',
    render: (val) => (
      <span className="rounded-full bg-steel px-2 py-0.5 text-[11px] font-medium capitalize text-muted">
        {val || '—'}
      </span>
    ),
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (val) => <StatusBadge status={val} />,
  },
  {
    key: 'paidAt',
    label: 'Paid At',
    sortable: true,
    render: (val) =>
      val
        ? new Date(val).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
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
    options: ['pending', 'authorized', 'paid', 'failed', 'cancelled', 'refunded'],
  },
  {
    key: 'gateway',
    label: 'Gateway',
    type: 'select',
    options: ['razorpay', 'stripe', 'cashfree'],
  },
]

/* ── CSV export ──────────────────────────────────────────────────── */
function exportCSV(rows) {
  if (!rows?.length) return
  const headers = [
    'Receipt', 'Gateway Order ID', 'Payment ID',
    'Payer Name', 'Payer Email', 'Event', 'Reg #',
    'Amount (INR)', 'Gateway', 'Status', 'Paid At',
  ]
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const lines = [
    headers.join(','),
    ...rows.map((p) =>
      [
        p.receipt,
        p.gatewayOrderId,
        p.gatewayPaymentId,
        p.user?.fullName,
        p.user?.email,
        p.marathon?.title,
        p.registration?.registrationNumber,
        p.amount,
        p.gateway,
        p.status,
        p.paidAt ? new Date(p.paidAt).toLocaleString('en-IN') : '',
      ]
        .map(escape)
        .join(',')
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Summary card ────────────────────────────────────────────────── */
function SummaryCard({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-steel bg-carbon p-4">
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-dim">{label}</p>
        <p className="mt-0.5 font-display text-xl font-black text-sf-white">{value ?? '—'}</p>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────────────── */
function AdminPayments() {
  const {
    filters, setFilters,
    sort, setSort,
    page, setPage,
    rowsPerPage, setRowsPerPage,
  } = useTableState()

  const [data, setData]     = useState({ payments: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const fetchPayments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { page, limit: rowsPerPage }
      if (filters.status)  params.status  = filters.status
      if (filters.gateway) params.gateway = filters.gateway
      if (sort.key) params.sort = sort.direction === 'asc' ? sort.key : `-${sort.key}`

      const res = await paymentService.list(params)
      setData(res)
    } catch (err) {
      setError(err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }, [filters, sort, page, rowsPerPage])

  useEffect(() => { fetchPayments() }, [fetchPayments])
  useEffect(() => { setPage(1) }, [filters, setPage])

  const pending   = data.payments?.filter((p) => p.status === 'pending').length ?? 0
  const failed    = data.payments?.filter((p) => p.status === 'failed').length ?? 0
  const totalAmt  = data.payments?.reduce((s, p) => (p.status === 'paid' ? s + (p.amount ?? 0) : s), 0) ?? 0

  return (
    <>
      <SEO title="Payments" description={`Manage ${BRAND.name} payment records`} />
      <PageContainer
        title="Payments"
        description="Track Razorpay transactions, statuses, and payment history"
      >
        {/* Summary strip */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total Transactions"
            value={data.total}
            icon={FaCreditCard}
            color="bg-ember/10 text-ember"
          />
          <SummaryCard
            label={`Revenue (page)`}
            value={formatINR(totalAmt)}
            icon={FaIndianRupeeSign}
            color="bg-emerald-500/10 text-emerald-400"
          />
          <SummaryCard
            label="Pending (this page)"
            value={pending}
            icon={FaClock}
            color="bg-amber-500/10 text-amber-400"
          />
          <SummaryCard
            label="Failed (this page)"
            value={failed}
            icon={FaCircleXmark}
            color="bg-red-500/10 text-red-400"
          />
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={data.payments}
          loading={loading}
          error={error}
          emptyMessage="No payment records found. Completed payments will appear here."
          rowKey="_id"
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
        />

        {/* Export button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => exportCSV(data.payments)}
            className="inline-flex items-center gap-2 rounded-xl border border-steel bg-carbon px-5 py-2.5 text-sm font-semibold text-sf-white transition-colors hover:border-ember/40 hover:bg-steel"
          >
            <FaFileExport size={14} />
            Export CSV
          </button>
          <span className="text-xs text-muted-dim">
            Exports current page ({data.payments?.length ?? 0} records)
          </span>
        </div>
      </PageContainer>
    </>
  )
}

export default AdminPayments
