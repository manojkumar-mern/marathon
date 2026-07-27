import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaCalendarDays, FaUsers, FaIndianRupeeSign,
  FaClock, FaCircleCheck, FaArrowUp, FaArrowRight,
  FaPlus, FaUserPlus, FaUpload, FaCertificate,
  FaFileExport, FaBell, FaServer, FaDatabase,
  FaEnvelope, FaCreditCard, FaHardDrive, FaTriangleExclamation,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DashboardSection from '../components/DashboardSection'
import DashboardTable from '../components/DashboardTable'
import DashboardCard from '../components/DashboardCard'
import AnalyticsCard from '../components/AnalyticsCard'
import QuickActionCard from '../components/QuickActionCard'
import NotificationPanel from '../components/NotificationPanel'
import LineChart from '../components/charts/LineChart'
import AreaChart from '../components/charts/AreaChart'
import DonutChart from '../components/charts/DonutChart'
import BarChart from '../components/charts/BarChart'
import { adminService } from '../services/admin.service'
import { BRAND } from '../../config/brand'

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function computeTrend(trendData) {
  if (!trendData || trendData.length < 2) return null
  const last = trendData[trendData.length - 1].value
  const prev = trendData[trendData.length - 2].value
  if (prev === 0) return last > 0 ? { value: 100, direction: 'up', label: 'vs last month' } : null
  const pct = ((last - prev) / prev) * 100
  return {
    value: Math.abs(Math.round(pct)),
    direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral',
    label: 'vs last month',
  }
}

const paymentStatusColors = {
  paid: '#22c55e',
  pending: '#eab308',
  failed: '#ef4444',
  cancelled: '#6b7280',
  refunded: '#8b5cf6',
}

const kpiConfig = [
  { label: 'Total Events', key: 'totalEvents', icon: FaCalendarDays },
  { label: 'Active Participants', key: 'activeParticipants', icon: FaUsers },
  { label: 'Total Revenue', key: 'totalRevenue', icon: FaIndianRupeeSign, format: formatCurrency },
  { label: 'Pending Payments', key: 'pendingPayments', icon: FaClock },
  { label: 'Successful Payments', key: 'successfulPayments', icon: FaCircleCheck },
  { label: 'Failed Payments', key: 'failedPayments', icon: FaTriangleExclamation },
  { label: 'Upcoming Events', key: 'upcomingEventsCount', icon: FaArrowUp },
  { label: 'Certificates Generated', key: 'certificatesGenerated', icon: FaCertificate },
]

const regTableColumns = [
  { key: 'fullName', label: 'Participant' },
  { key: 'marathon', label: 'Event' },
  { key: 'category', label: 'Category' },
  {
    key: 'createdAt',
    label: 'Date',
    render: (val) =>
      val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
  },
  { key: 'paymentStatus', label: 'Payment' },
]

const paymentTableColumns = [
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'fullName', label: 'Participant' },
  { key: 'amount', label: 'Amount', render: (val) => val != null ? formatCurrency(val) : '—' },
  { key: 'status', label: 'Status' },
  {
    key: 'createdAt',
    label: 'Date',
    render: (val) =>
      val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
  },
]

const healthConfig = [
  { id: 'api', label: 'API Status', icon: FaServer },
  { id: 'database', label: 'Database', icon: FaDatabase },
  { id: 'emailQueue', label: 'Email Queue', icon: FaEnvelope },
  { id: 'paymentGateway', label: 'Payment Gateway', icon: FaCreditCard },
  { id: 'storage', label: 'Storage', icon: FaHardDrive },
]

function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await adminService.getDashboard()
      setData(res.data)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  const stats = data?.stats
  const trends = data?.trends
  const paymentStatus = data?.paymentStatus
  const categoryDistribution = data?.categoryDistribution
  const genderDistribution = data?.genderDistribution
  const ageDistribution = data?.ageDistribution
  const registrations = data?.recentRegistrations
  const payments = data?.recentPayments
  const upcomingEvents = data?.upcomingEvents
  const notifications = data?.notifications
  const systemHealth = data?.systemHealth

  const regTrend = useMemo(() => computeTrend(trends?.registrations), [trends])
  const revTrend = useMemo(() => computeTrend(trends?.revenue), [trends])

  const kpiCards = useMemo(
    () =>
      kpiConfig.map((cfg) => {
        let trend = null
        if (cfg.key === 'totalRevenue') trend = revTrend
        else if (cfg.key === 'activeParticipants') trend = regTrend
        return { ...cfg, trend }
      }),
    [revTrend, regTrend]
  )

  const paymentChartData = useMemo(
    () =>
      paymentStatus?.map((s) => ({
        name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
        value: s.count,
        color: paymentStatusColors[s.status] || '#6b7280',
      })) || [],
    [paymentStatus]
  )

  const categoryChartData = useMemo(
    () =>
      categoryDistribution?.map((c) => ({
        name: c.category,
        value: c.count,
      })) || [],
    [categoryDistribution]
  )

  const genderChartData = useMemo(
    () =>
      genderDistribution?.map((g) => ({
        label: g.gender.charAt(0).toUpperCase() + g.gender.slice(1),
        value: g.count,
        color: g.gender === 'male' ? '#22c55e' : g.gender === 'female' ? '#f97316' : '#8b5cf6',
      })) || [],
    [genderDistribution]
  )

  const ageChartData = useMemo(
    () =>
      ageDistribution?.map((a) => ({
        label: a.group,
        value: a.count,
      })) || [],
    [ageDistribution]
  )

  return (
    <>
      <SEO title="Admin Dashboard" description={`${BRAND.name} administration panel`} />
      <PageContainer
        title="Dashboard"
        description="Executive command centre for your marathon management platform"
      >
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiCards.map((cfg) => (
            <DashboardCard
              key={cfg.key}
              label={cfg.label}
              value={stats?.[cfg.key]}
              icon={cfg.icon}
              format={cfg.format}
              trend={cfg.trend}
              loading={loading}
              error={error}
            />
          ))}
        </div>

        {/* Analytics Section */}
        <div className="mt-8">
          <div className="mb-4">
            <h3 className="font-display text-xl font-black italic text-sf-white">Analytics</h3>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <AnalyticsCard
              title="Registration Trend"
              subtitle="Last 12 months"
              loading={loading}
              error={error}
              isEmpty={!trends?.registrations || trends.registrations.length === 0}
              emptyMessage="No registration data yet"
            >
              <LineChart data={trends?.registrations} color="#f97316" />
            </AnalyticsCard>

            <AnalyticsCard
              title="Revenue Trend"
              subtitle="Last 12 months"
              loading={loading}
              error={error}
              isEmpty={!trends?.revenue || trends.revenue.length === 0}
              emptyMessage="No revenue data yet"
            >
              <AreaChart
                data={trends?.revenue}
                color="#06b6d4"
                format={formatCurrency}
              />
            </AnalyticsCard>
          </div>
        </div>

        {/* Payment Status + Category Distribution */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AnalyticsCard
            title="Payment Status"
            subtitle="Distribution across all payments"
            loading={loading}
            error={error}
            isEmpty={paymentChartData.length === 0}
            emptyMessage="No payment data yet"
          >
            <DonutChart
              data={paymentChartData}
              nameKey="name"
              valueKey="value"
              colors={['#22c55e', '#eab308', '#ef4444']}
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Registration by Category"
            subtitle="Category distribution across all events"
            loading={loading}
            error={error}
            isEmpty={categoryChartData.length === 0}
            emptyMessage="No category data yet"
          >
            <DonutChart
              data={categoryChartData}
              nameKey="name"
              valueKey="value"
            />
          </AnalyticsCard>
        </div>

        {/* Gender + Age Distribution */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <AnalyticsCard
            title="Gender Distribution"
            subtitle="Male / Female / Other"
            loading={loading}
            error={error}
            isEmpty={genderChartData.length === 0}
            emptyMessage="No gender data yet"
          >
            <BarChart
              data={genderChartData}
              xKey="label"
              yKey="value"
              layout="horizontal"
              useDistinctColors
              height={180}
            />
          </AnalyticsCard>

          <AnalyticsCard
            title="Age Group Distribution"
            subtitle="Participant age breakdown"
            loading={loading}
            error={error}
            isEmpty={ageChartData.length === 0}
            emptyMessage="No age data yet"
          >
            <BarChart
              data={ageChartData}
              xKey="label"
              yKey="value"
              layout="vertical"
              height={220}
            />
          </AnalyticsCard>
        </div>

        {/* Recent Registrations */}
        <div className="mt-8">
          <DashboardSection
            title="Recent Registrations"
            action={
              <Link
                to="/admin/participants"
                className="flex items-center gap-1 text-xs font-medium text-ember hover:underline"
              >
                View all <FaArrowRight className="size-2.5" />
              </Link>
            }
          >
            <DashboardTable
              columns={regTableColumns}
              data={registrations}
              loading={loading}
              error={error}
              emptyMessage="No registrations yet"
            />
          </DashboardSection>
        </div>

        {/* Recent Payments */}
        <div className="mt-8">
          <DashboardSection
            title="Recent Payments"
            action={
              <Link
                to="/admin/payments"
                className="flex items-center gap-1 text-xs font-medium text-ember hover:underline"
              >
                View all <FaArrowRight className="size-2.5" />
              </Link>
            }
          >
            <DashboardTable
              columns={paymentTableColumns}
              data={payments}
              loading={loading}
              error={error}
              emptyMessage="No payments yet"
            />
          </DashboardSection>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <DashboardSection
            title="Upcoming Events"
            action={
              <Link
                to="/admin/events"
                className="flex items-center gap-1 text-xs font-medium text-ember hover:underline"
              >
                View all <FaArrowRight className="size-2.5" />
              </Link>
            }
          >
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-48 animate-pulse rounded-xl border border-steel bg-carbon p-4">
                    <div className="mb-3 h-24 w-full rounded-lg bg-steel" />
                    <div className="h-4 w-3/4 rounded bg-steel" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-steel/50" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : !upcomingEvents || upcomingEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-steel p-8 text-center">
                <p className="text-sm text-muted-dim">No upcoming events</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event._id}
                    to={`/admin/events/${event._id}`}
                    className="group block overflow-hidden rounded-xl border border-steel bg-carbon transition-all hover:-translate-y-0.5 hover:border-ember/40 hover:shadow-lg hover:shadow-ember/5"
                  >
                    <div className="aspect-[16/7] w-full overflow-hidden bg-steel">
                      {event.bannerImage ? (
                        <img
                          src={event.bannerImage}
                          alt={event.title}
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <FaCalendarDays className="size-8 text-muted-dim" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm font-semibold text-sf-white group-hover:text-ember transition-colors">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-dim">
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Date TBD'}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="rounded-full bg-ember/10 px-2.5 py-0.5 font-medium text-ember">
                          {event.remainingDays > 0
                            ? `${event.remainingDays} day${event.remainingDays !== 1 ? 's' : ''} left`
                            : 'Today'}
                        </span>
                        <span className="text-muted-dim">
                          {event.registrationCount ?? 0} registered
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </DashboardSection>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <DashboardSection title="Quick Actions">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <QuickActionCard
                label="Create Event"
                description="Add a new marathon"
                icon={FaPlus}
                to="/admin/events/new"
              />
              <QuickActionCard
                label="Register Participant"
                description="Manual registration"
                icon={FaUserPlus}
                to="/admin/participants"
              />
              <QuickActionCard
                label="Upload Results"
                description="Import race results"
                icon={FaUpload}
                to="/admin/results"
              />
              <QuickActionCard
                label="Generate Certificates"
                description="Create certificates"
                icon={FaCertificate}
                to="/admin/certificates"
              />
              <QuickActionCard
                label="Export Reports"
                description="Download data"
                icon={FaFileExport}
                to="/admin/reports"
              />
              <QuickActionCard
                label="Send Notifications"
                description="Alert participants"
                icon={FaBell}
                to="/admin/cms"
              />
            </div>
          </DashboardSection>
        </div>

        {/* Notifications + System Health */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <DashboardSection title="Recent Notifications">
              <div className="rounded-xl border border-steel bg-carbon p-5">
                <NotificationPanel notifications={notifications} loading={loading} />
              </div>
            </DashboardSection>
          </div>

          <div>
            <DashboardSection title="System Health">
              <div className="rounded-xl border border-steel bg-carbon p-5">
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 animate-pulse rounded-lg bg-steel" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {healthConfig.map((h) => {
                      const status = systemHealth?.[h.id] || 'unknown'
                      const statusColor =
                        status === 'operational'
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : status === 'degraded'
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-red-400 bg-red-500/10'
                      return (
                        <div
                          key={h.id}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-steel/30"
                        >
                          <div className="flex items-center gap-3">
                            <h.icon className="size-4 text-muted-dim" />
                            <span className="text-sm text-sf-white">{h.label}</span>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${statusColor}`}
                          >
                            {status}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </DashboardSection>
          </div>
        </div>
      </PageContainer>
    </>
  )
}

export default AdminDashboard
