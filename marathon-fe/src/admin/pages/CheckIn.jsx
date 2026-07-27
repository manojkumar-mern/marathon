import { FaQrcode, FaCamera, FaUserCheck, FaListCheck } from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import { BRAND } from '../../config/brand'

const quickActions = [
  { label: 'Scan QR Code', icon: FaCamera },
  { label: 'Manual Check-in', icon: FaUserCheck },
  { label: 'Check-in Log', icon: FaListCheck },
]

function AdminCheckIn() {
  return (
    <>
      <SEO title="QR Check-in" description={`${BRAND.name} QR check-in`} />
      <PageContainer title="QR Check-in" description="Scan QR codes and manage participant check-ins">
        <div className="rounded-xl border border-dashed border-steel bg-carbon p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-ember/10">
            <FaQrcode className="size-8 text-ember" />
          </div>
          <h3 className="font-display text-xl font-black italic text-sf-white">QR Check-in Module</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Scan participant QR codes for event day check-in, track attendance in real time, manage bib distribution, and view check-in analytics.
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

export default AdminCheckIn
