import { FaBullhorn, FaPlus, FaBell, FaEnvelope } from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import { BRAND } from '../../config/brand'

const quickActions = [
  { label: 'New Announcement', icon: FaPlus },
  { label: 'Send Notification', icon: FaBell },
  { label: 'Email Campaign', icon: FaEnvelope },
]

function AdminAnnouncements() {
  return (
    <>
      <SEO title="Announcements" description={`Manage ${BRAND.name} announcements`} />
      <PageContainer title="Announcements" description="Create and manage announcements, notifications, and communications">
        <div className="rounded-xl border border-dashed border-steel bg-carbon p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-ember/10">
            <FaBullhorn className="size-8 text-ember" />
          </div>
          <h3 className="font-display text-xl font-black italic text-sf-white">Announcements Module</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Create and broadcast announcements to participants, send push notifications, email campaigns, and in-app alerts.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {quickActions.map((a) => (
              <span key={a.label} className="flex items-center gap-2 rounded-full bg-steel px-4 py-2 text-xs text-muted-dim">
                <a.icon className="size-3.5" />
                {a.label}
              </span>
            ))}
          </div>
          <p className="mt-8 text-xs italic text-muted-dim">Coming soon in a future phase</p>
        </div>
      </PageContainer>
    </>
  )
}

export default AdminAnnouncements
