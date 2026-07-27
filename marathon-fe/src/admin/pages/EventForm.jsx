import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  FaPlus, FaTrashCan, FaArrowLeft, FaImage, FaXmark,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import StatusBadge from '../components/StatusBadge'
import { eventService } from '../services/event.service'
import { BRAND } from '../../config/brand'

const emptyCategory = () => ({
  name: '', distance: '', difficulty: 'moderate', price: 0, currency: 'INR',
  maxParticipants: 100, startTime: '', description: '', isActive: true,
})

const emptyFaq = () => ({ question: '', answer: '' })

const emptySponsor = () => ({ name: '', logo: '', website: '', tier: 'partner' })

const emptyForm = {
  title: '', slug: '', eventCode: '', shortDescription: '', description: '',
  eventDate: '', registrationStartDate: '', registrationEndDate: '',
  venue: { name: '', address: '', city: '', state: '', country: 'India' },
  location: { latitude: '', longitude: '' },
  organizer: '', contactEmail: '', contactPhone: '',
  bannerImage: '', galleryImages: [],
  raceCategories: [emptyCategory()],
  rules: [], faqs: [emptyFaq()],
  sponsors: [emptySponsor()],
  status: 'draft', featured: false,
  seo: { metaTitle: '', metaDescription: '', metaKeywords: [] },
  termsConditions: '',
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-dim">{label}</label>
      <input
        {...props}
        className="w-full rounded-lg border border-steel bg-carbon px-3 py-2 text-sm text-sf-white outline-none transition-colors placeholder-muted-dim focus:border-ember/50"
      />
    </div>
  )
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-dim">{label}</label>
      <textarea
        {...props}
        className="w-full rounded-lg border border-steel bg-carbon px-3 py-2 text-sm text-sf-white outline-none transition-colors placeholder-muted-dim focus:border-ember/50 resize-y"
      />
    </div>
  )
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-dim">{label}</label>
      <select
        {...props}
        className="w-full rounded-lg border border-steel bg-carbon px-3 py-2 text-sm text-sf-white outline-none transition-colors focus:border-ember/50"
      >
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt
          const lbl = typeof opt === 'object' ? opt.label : opt
          return <option key={val} value={val}>{lbl}</option>
        })}
      </select>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-steel bg-carbon p-6">
      <h3 className="mb-5 font-display text-lg font-black italic text-sf-white">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function AdminEventForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    eventService.getById(id)
      .then((event) => {
        setForm({
          title: event.title || '',
          slug: event.slug || '',
          eventCode: event.eventCode || '',
          shortDescription: event.shortDescription || '',
          description: event.description || '',
          eventDate: event.eventDate ? event.eventDate.slice(0, 10) : '',
          registrationStartDate: event.registrationStartDate ? event.registrationStartDate.slice(0, 10) : '',
          registrationEndDate: event.registrationEndDate ? event.registrationEndDate.slice(0, 10) : '',
          venue: {
            name: event.venue?.name || '',
            address: event.venue?.address || '',
            city: event.venue?.city || '',
            state: event.venue?.state || '',
            country: event.venue?.country || 'India',
          },
          location: {
            latitude: event.location?.latitude?.toString() || '',
            longitude: event.location?.longitude?.toString() || '',
          },
          organizer: event.organizer || '',
          contactEmail: event.contactEmail || '',
          contactPhone: event.contactPhone || '',
          bannerImage: event.bannerImage || '',
          galleryImages: event.galleryImages || [],
          raceCategories: event.raceCategories?.length ? event.raceCategories : [emptyCategory()],
          rules: event.rules || [],
          faqs: event.faqs?.length ? event.faqs : [emptyFaq()],
          sponsors: event.sponsors?.length ? event.sponsors : [emptySponsor()],
          status: event.status || 'draft',
          featured: event.featured || false,
          seo: {
            metaTitle: event.seo?.metaTitle || '',
            metaDescription: event.seo?.metaDescription || '',
            metaKeywords: event.seo?.metaKeywords || [],
          },
          termsConditions: event.termsConditions || '',
        })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  function set(path, value) {
    setForm((prev) => {
      const keys = path.split('.')
      const copy = { ...prev }
      let obj = copy
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] }
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return copy
    })
  }

  function addArray(path, factory) {
    setForm((prev) => ({ ...prev, [path]: [...prev[path], factory()] }))
  }

  function removeArray(path, index) {
    setForm((prev) => ({ ...prev, [path]: prev[path].filter((_, i) => i !== index) }))
  }

  function updateArray(path, index, field, value) {
    setForm((prev) => {
      const arr = [...prev[path]]
      arr[index] = { ...arr[index], [field]: value }
      return { ...prev, [path]: arr }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      ...form,
      eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : undefined,
      registrationStartDate: form.registrationStartDate ? new Date(form.registrationStartDate).toISOString() : undefined,
      registrationEndDate: form.registrationEndDate ? new Date(form.registrationEndDate).toISOString() : undefined,
      location: {
        latitude: form.location.latitude ? parseFloat(form.location.latitude) : undefined,
        longitude: form.location.longitude ? parseFloat(form.location.longitude) : undefined,
      },
      galleryImages: form.galleryImages.filter(Boolean),
      raceCategories: form.raceCategories.map((c) => ({
        ...c,
        price: Number(c.price),
        maxParticipants: Number(c.maxParticipants),
      })),
      seo: {
        ...form.seo,
        metaKeywords: form.seo.metaKeywords.filter(Boolean),
      },
      sponsors: form.sponsors.filter((s) => s.name),
      faqs: form.faqs.filter((f) => f.question),
    }

    try {
      if (isEdit) {
        await eventService.update(id, payload)
      } else {
        await eventService.create(payload)
      }
      navigate('/admin/events')
    } catch (err) {
      setError(err.message || 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageContainer title={isEdit ? 'Edit Event' : 'Create Event'}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-steel" />
          ))}
        </div>
      </PageContainer>
    )
  }

  return (
    <>
      <SEO title={isEdit ? 'Edit Event' : 'Create Event'} description={`${BRAND.name} event management`} />
      <PageContainer
        title={isEdit ? 'Edit Event' : 'Create Event'}
        description={isEdit ? `Editing "${form.title}"` : 'Create a new marathon event'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">{error}</div>
          )}

          <Section title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Event Name" value={form.title} onChange={(e) => set('title', e.target.value)} required />
              <Input label="Slug" value={form.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto-generated" />
              <Input label="Event Code" value={form.eventCode} onChange={(e) => set('eventCode', e.target.value)} placeholder="e.g. SF-MUMBAI-2026" />
              <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value)} options={['draft', 'published', 'completed', 'cancelled']} />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} className="rounded border-steel bg-obsidian text-ember outline-none focus:ring-2 focus:ring-ember/30" />
              <label htmlFor="featured" className="text-sm text-muted">Featured event</label>
            </div>
            <Textarea label="Short Description" value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} rows={2} />
            <Textarea label="Full Description" value={form.description} onChange={(e) => set('description', e.target.value)} rows={4} />
          </Section>

          <Section title="Dates">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Event Date" type="date" value={form.eventDate} onChange={(e) => set('eventDate', e.target.value)} required />
              <Input label="Registration Opens" type="date" value={form.registrationStartDate} onChange={(e) => set('registrationStartDate', e.target.value)} required />
              <Input label="Registration Closes" type="date" value={form.registrationEndDate} onChange={(e) => set('registrationEndDate', e.target.value)} required />
            </div>
          </Section>

          <Section title="Venue">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Venue Name" value={form.venue.name} onChange={(e) => set('venue.name', e.target.value)} required />
              <Input label="Address" value={form.venue.address} onChange={(e) => set('venue.address', e.target.value)} />
              <Input label="City" value={form.venue.city} onChange={(e) => set('venue.city', e.target.value)} required />
              <Input label="State" value={form.venue.state} onChange={(e) => set('venue.state', e.target.value)} required />
              <Input label="Country" value={form.venue.country} onChange={(e) => set('venue.country', e.target.value)} />
              <Input label="Latitude" type="number" step="any" value={form.location.latitude} onChange={(e) => set('location.latitude', e.target.value)} />
              <Input label="Longitude" type="number" step="any" value={form.location.longitude} onChange={(e) => set('location.longitude', e.target.value)} />
            </div>
          </Section>

          <Section title="Contact">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input label="Organizer" value={form.organizer} onChange={(e) => set('organizer', e.target.value)} />
              <Input label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} />
              <Input label="Contact Phone" value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} placeholder="+91 80000 00000" />
            </div>
          </Section>

          <Section title="Media">
            <Input label="Banner Image URL" value={form.bannerImage} onChange={(e) => set('bannerImage', e.target.value)} placeholder="https://..." />
            {form.bannerImage && (
              <div className="relative mt-2 inline-block">
                <img src={form.bannerImage} alt="Banner preview" className="h-32 rounded-lg object-cover" onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            )}
            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-muted-dim">Gallery Images (URLs)</label>
              {form.galleryImages.map((url, i) => (
                <div key={i} className="mb-2 flex items-center gap-2">
                  <input value={url} onChange={(e) => { const g = [...form.galleryImages]; g[i] = e.target.value; set('galleryImages', g) }} placeholder="https://..." className="flex-1 rounded-lg border border-steel bg-carbon px-3 py-2 text-sm text-sf-white outline-none placeholder-muted-dim focus:border-ember/50" />
                  <button type="button" onClick={() => { const g = form.galleryImages.filter((_, j) => j !== i); set('galleryImages', g) }} className="rounded-lg p-2 text-muted-dim hover:text-red-400 transition-colors"><FaXmark size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={() => set('galleryImages', [...form.galleryImages, ''])} className="text-xs font-medium text-ember hover:underline">+ Add image URL</button>
            </div>
          </Section>

          <Section title="Race Categories">
            {form.raceCategories.map((cat, i) => (
              <div key={i} className="rounded-lg border border-steel/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-dim">Category {i + 1}</span>
                  {form.raceCategories.length > 1 && (
                    <button type="button" onClick={() => removeArray('raceCategories', i)} className="text-muted-dim hover:text-red-400 transition-colors"><FaTrashCan size={12} /></button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Input label="Name" value={cat.name} onChange={(e) => updateArray('raceCategories', i, 'name', e.target.value)} placeholder="e.g. Half Marathon" />
                  <Input label="Distance" value={cat.distance} onChange={(e) => updateArray('raceCategories', i, 'distance', e.target.value)} placeholder="e.g. 21.1K" />
                  <Select label="Difficulty" value={cat.difficulty} onChange={(e) => updateArray('raceCategories', i, 'difficulty', e.target.value)} options={['easy', 'moderate', 'hard', 'extreme']} />
                  <Input label="Price (INR)" type="number" min="0" value={cat.price} onChange={(e) => updateArray('raceCategories', i, 'price', e.target.value)} />
                  <Input label="Max Participants" type="number" min="1" value={cat.maxParticipants} onChange={(e) => updateArray('raceCategories', i, 'maxParticipants', e.target.value)} />
                  <Input label="Start Time" value={cat.startTime} onChange={(e) => updateArray('raceCategories', i, 'startTime', e.target.value)} placeholder="e.g. 06:00 AM" />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id={`cat-active-${i}`} checked={cat.isActive} onChange={(e) => updateArray('raceCategories', i, 'isActive', e.target.checked)} className="rounded border-steel bg-obsidian text-ember outline-none focus:ring-2 focus:ring-ember/30" />
                    <label htmlFor={`cat-active-${i}`} className="text-xs text-muted">Active</label>
                  </div>
                </div>
                <Textarea label="Description" value={cat.description} onChange={(e) => updateArray('raceCategories', i, 'description', e.target.value)} rows={2} />
              </div>
            ))}
            <button type="button" onClick={() => addArray('raceCategories', emptyCategory)} className="mt-3 text-xs font-medium text-ember hover:underline">+ Add category</button>
          </Section>

          <Section title="Race Rules">
            {form.rules.map((rule, i) => (
              <div key={i} className="mb-2 flex items-center gap-2">
                <input value={rule} onChange={(e) => { const r = [...form.rules]; r[i] = e.target.value; set('rules', r) }} placeholder="Enter a rule..." className="flex-1 rounded-lg border border-steel bg-carbon px-3 py-2 text-sm text-sf-white outline-none placeholder-muted-dim focus:border-ember/50" />
                <button type="button" onClick={() => { const r = form.rules.filter((_, j) => j !== i); set('rules', r) }} className="rounded-lg p-2 text-muted-dim hover:text-red-400 transition-colors"><FaXmark size={14} /></button>
              </div>
            ))}
            <button type="button" onClick={() => set('rules', [...form.rules, ''])} className="text-xs font-medium text-ember hover:underline">+ Add rule</button>
          </Section>

          <Section title="FAQs">
            {form.faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-steel/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-dim">FAQ {i + 1}</span>
                  {form.faqs.length > 1 && (
                    <button type="button" onClick={() => removeArray('faqs', i)} className="text-muted-dim hover:text-red-400 transition-colors"><FaTrashCan size={12} /></button>
                  )}
                </div>
                <div className="space-y-3">
                  <Input label="Question" value={faq.question} onChange={(e) => updateArray('faqs', i, 'question', e.target.value)} />
                  <Textarea label="Answer" value={faq.answer} onChange={(e) => updateArray('faqs', i, 'answer', e.target.value)} rows={2} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addArray('faqs', emptyFaq)} className="mt-3 text-xs font-medium text-ember hover:underline">+ Add FAQ</button>
          </Section>

          <Section title="Sponsors">
            {form.sponsors.map((sp, i) => (
              <div key={i} className="rounded-lg border border-steel/50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-dim">Sponsor {i + 1}</span>
                  {form.sponsors.length > 1 && (
                    <button type="button" onClick={() => removeArray('sponsors', i)} className="text-muted-dim hover:text-red-400 transition-colors"><FaTrashCan size={12} /></button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input label="Name" value={sp.name} onChange={(e) => updateArray('sponsors', i, 'name', e.target.value)} />
                  <Select label="Tier" value={sp.tier} onChange={(e) => updateArray('sponsors', i, 'tier', e.target.value)} options={['platinum', 'gold', 'silver', 'bronze', 'partner']} />
                  <Input label="Logo URL" value={sp.logo} onChange={(e) => updateArray('sponsors', i, 'logo', e.target.value)} />
                  <Input label="Website" value={sp.website} onChange={(e) => updateArray('sponsors', i, 'website', e.target.value)} />
                </div>
              </div>
            ))}
            <button type="button" onClick={() => addArray('sponsors', emptySponsor)} className="mt-3 text-xs font-medium text-ember hover:underline">+ Add sponsor</button>
          </Section>

          <Section title="SEO &amp; Terms">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Meta Title" value={form.seo.metaTitle} onChange={(e) => set('seo.metaTitle', e.target.value)} />
              <Input label="Meta Keywords (comma separated)" value={form.seo.metaKeywords.join(', ')} onChange={(e) => set('seo.metaKeywords', e.target.value.split(',').map((s) => s.trim()))} />
            </div>
            <Textarea label="Meta Description" value={form.seo.metaDescription} onChange={(e) => set('seo.metaDescription', e.target.value)} rows={2} />
            <Textarea label="Terms &amp; Conditions" value={form.termsConditions} onChange={(e) => set('termsConditions', e.target.value)} rows={4} />
          </Section>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={saving} className="rounded-xl bg-ember px-6 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-ember-deep disabled:opacity-50">
              {saving ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
            </button>
            <button type="button" onClick={() => navigate('/admin/events')} className="rounded-xl border border-steel px-6 py-3 text-sm font-medium text-muted transition-colors hover:bg-steel hover:text-sf-white">
              Cancel
            </button>
          </div>
        </form>
      </PageContainer>
    </>
  )
}

export default AdminEventForm
