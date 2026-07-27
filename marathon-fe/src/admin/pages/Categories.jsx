import { FaList, FaPlus, FaPencil, FaTag } from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import { BRAND } from '../../config/brand'

const quickActions = [
  { label: 'Add Category', icon: FaPlus },
  { label: 'Edit Categories', icon: FaPencil },
  { label: 'Manage Pricing', icon: FaTag },
]

function AdminCategories() {
  return (
    <>
      <SEO title="Categories" description={`Manage ${BRAND.name} race categories`} />
      <PageContainer title="Categories" description="Define and manage race categories, distances, and pricing tiers">
        <div className="rounded-xl border border-dashed border-steel bg-carbon p-12 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-ember/10">
            <FaList className="size-8 text-ember" />
          </div>
          <h3 className="font-display text-xl font-black italic text-sf-white">Race Categories Module</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Define race categories (3K, 5K, 10K, 21K, 42K), set distances, pricing, age limits, and category-specific rules for each event.
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

export default AdminCategories
