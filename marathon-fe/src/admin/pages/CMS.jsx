import { useCallback, useEffect, useState } from 'react'
import {
  FaNewspaper, FaBullhorn, FaPlus, FaPen, FaTrashCan, FaEye, FaFloppyDisk, FaXmark,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import DataTable from '../components/DataTable'
import StatusBadge from '../components/StatusBadge'
import ConfirmDialog from '../components/ConfirmDialog'
import { cmsService } from '../services/cms.service'
import { BRAND } from '../../config/brand'

const PAGES_TAB = 'pages'
const ANNOUNCEMENTS_TAB = 'announcements'

const pageCols = [
  { key: 'title', label: 'Page', render: (val) => <span className="font-medium text-sf-white">{val || '—'}</span> },
  { key: 'slug', label: 'Slug', render: (val) => <code className="font-mono text-xs text-ember">{val || '—'}</code> },
  { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val || 'draft'} /> },
  {
    key: 'updatedAt', label: 'Last Updated', sortable: true,
    render: (val) => val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—',
  },
]

const annCols = [
  { key: 'title', label: 'Title', render: (val) => <span className="font-medium text-sf-white">{val || '—'}</span> },
  {
    key: 'content', label: 'Content',
    render: (val) => <span className="max-w-[300px] truncate text-muted">{val || '—'}</span>,
  },
  { key: 'placement', label: 'Placement', render: (val) => <span className="text-xs text-muted-dim">{val || 'top'}</span> },
  { key: 'isActive', label: 'Active', render: (val) => <StatusBadge status={val ? 'active' : 'inactive'} /> },
  {
    key: 'startsAt', label: 'Starts', sortable: true,
    render: (val) => val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
  },
  {
    key: 'endsAt', label: 'Ends', sortable: true,
    render: (val) => val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
  },
]

function Input({ label, type = 'text', ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-dim">{label}</label>
      <input type={type} {...props}
        className="w-full rounded-lg border border-steel bg-carbon px-3.5 py-2.5 text-sm text-sf-white outline-none transition-colors placeholder-muted-dim focus:border-ember/50"
      />
    </div>
  )
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-dim">{label}</label>
      <textarea rows={4} {...props}
        className="w-full rounded-lg border border-steel bg-carbon px-3.5 py-2.5 text-sm text-sf-white outline-none transition-colors placeholder-muted-dim focus:border-ember/50 resize-y"
      />
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
          checked ? 'bg-ember' : 'bg-steel'
        }`}
      >
        <span className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`} />
      </button>
      <span className="text-sm text-muted-dim">{label}</span>
    </label>
  )
}

function AdminCMS() {
  const [tab, setTab] = useState(PAGES_TAB)
  const [pages, setPages] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [pagesRes, annRes] = await Promise.all([
        cmsService.listPages({ all: 'true' }),
        cmsService.listAnnouncements(),
      ])
      setPages(pagesRes.pages || [])
      setAnnouncements(annRes.announcements || [])
    } catch (err) {
      setError(err.message || 'Failed to load CMS data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleSaveAnnouncement(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editingAnnouncement._id) {
        const updated = await cmsService.updateAnnouncement(editingAnnouncement._id, editingAnnouncement)
        setAnnouncements((prev) => prev.map((a) => a._id === updated._id ? updated : a))
      } else {
        const created = await cmsService.createAnnouncement(editingAnnouncement)
        setAnnouncements((prev) => [...prev, created])
      }
      setEditingAnnouncement(null)
    } catch (err) {
      setError(err.message || 'Failed to save announcement')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAnnouncement() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await cmsService.removeAnnouncement(deleteTarget._id)
      setAnnouncements((prev) => prev.filter((a) => a._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch {
      setError('Failed to delete announcement')
    } finally {
      setDeleting(false)
    }
  }

  const tabs = [
    { key: PAGES_TAB, label: 'Pages', icon: FaNewspaper },
    { key: ANNOUNCEMENTS_TAB, label: 'Announcements', icon: FaBullhorn },
  ]

  return (
    <>
      <SEO title="CMS" description={`Manage ${BRAND.name} website content`} />
      <PageContainer title="CMS" description="Manage website content, pages, and announcements">
        {error && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-1 rounded-xl border border-steel/60 bg-carbon p-1.5 w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? 'bg-ember text-obsidian'
                  : 'text-muted-dim hover:text-sf-white'
              }`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === PAGES_TAB && (
          <div>
            <DataTable
              columns={pageCols}
              data={pages}
              loading={loading}
              error={null}
              emptyMessage="No pages yet. Create your first page."
              rowKey="_id"
              actions={[
                { label: 'View', icon: FaEye, onClick: () => {} },
                { label: 'Edit', icon: FaPen, onClick: () => {} },
              ]}
            />
          </div>
        )}

        {tab === ANNOUNCEMENTS_TAB && (
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <DataTable
                columns={annCols}
                data={announcements}
                loading={loading}
                error={null}
                emptyMessage="No announcements yet."
                rowKey="_id"
                actions={[
                  {
                    label: 'Edit', icon: FaPen,
                    onClick: (row) => setEditingAnnouncement({ ...row }),
                  },
                  {
                    label: 'Delete', icon: FaTrashCan, danger: true,
                    onClick: (row) => setDeleteTarget(row),
                  },
                ]}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-xl border border-steel/60 bg-carbon p-5 sticky top-20">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display text-base font-black italic text-sf-white">
                    {editingAnnouncement?._id ? 'Edit Announcement' : 'New Announcement'}
                  </h3>
                  {editingAnnouncement && (
                    <button onClick={() => setEditingAnnouncement(null)}
                      className="text-muted-dim hover:text-sf-white transition-colors"
                    >
                      <FaXmark size={16} />
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                  <Input label="Title" required value={editingAnnouncement?.title || ''}
                    onChange={(e) => setEditingAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Announcement title"
                  />
                  <Textarea label="Content" required value={editingAnnouncement?.content || ''}
                    onChange={(e) => setEditingAnnouncement((prev) => ({ ...prev, content: e.target.value }))}
                    placeholder="Announcement content..."
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Link URL" value={editingAnnouncement?.linkUrl || ''}
                      onChange={(e) => setEditingAnnouncement((prev) => ({ ...prev, linkUrl: e.target.value }))}
                      placeholder="https://..."
                    />
                    <Input label="Link Label" value={editingAnnouncement?.linkLabel || ''}
                      onChange={(e) => setEditingAnnouncement((prev) => ({ ...prev, linkLabel: e.target.value }))}
                      placeholder="Learn more"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Start Date" type="date" value={editingAnnouncement?.startsAt?.split('T')[0] || ''}
                      onChange={(e) => setEditingAnnouncement((prev) => ({ ...prev, startsAt: e.target.value }))}
                    />
                    <Input label="End Date" type="date" value={editingAnnouncement?.endsAt?.split('T')[0] || ''}
                      onChange={(e) => setEditingAnnouncement((prev) => ({ ...prev, endsAt: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <Toggle label="Active" checked={editingAnnouncement?.isActive ?? true}
                      onChange={(v) => setEditingAnnouncement((prev) => ({ ...prev, isActive: v }))}
                    />
                  </div>
                  <button type="submit" disabled={saving || !editingAnnouncement}
                    className="inline-flex items-center gap-2 rounded-xl bg-ember px-5 py-2.5 text-sm font-semibold text-obsidian transition-colors hover:bg-ember-deep disabled:opacity-50"
                  >
                    <FaFloppyDisk size={14} />
                    {saving ? 'Saving...' : editingAnnouncement?._id ? 'Update' : 'Create'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </PageContainer>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteAnnouncement}
        title="Delete Announcement"
        message={`Remove "${deleteTarget?.title}"? This permanently removes the announcement.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  )
}

export default AdminCMS
