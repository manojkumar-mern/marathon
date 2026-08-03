import { useCallback, useEffect, useState } from 'react'
import {
  FaGear, FaBuilding, FaUserGear, FaCreditCard, FaEnvelope, FaShareNodes,
  FaFloppyDisk, FaCheck,
} from 'react-icons/fa6'
import SEO from '../../components/common/SEO'
import PageContainer from '../components/PageContainer'
import { settingsService } from '../services/settings.service'
import { BRAND } from '../../config/brand'

const TABS = [
  { key: 'general', label: 'General', icon: FaBuilding },
  { key: 'registration', label: 'Registration', icon: FaUserGear },
  { key: 'payments', label: 'Payments', icon: FaCreditCard },
  { key: 'email', label: 'Email', icon: FaEnvelope },
  { key: 'social', label: 'Social', icon: FaShareNodes },
]

const defaultSettings = {
  general: {
    brandName: BRAND.name, shortName: BRAND.shortName,
    tagline: '', supportEmail: '', supportPhone: '',
    address: '', website: '',
  },
  registration: {
    enableGroupRegistration: true,
    enableWaiver: true,
    waiverText: '',
    minAge: 5, maxAge: 100,
    termsUrl: '', privacyUrl: '',
    enableRefund: false,
    refundPolicy: '',
    cancellationDeadlineDays: 7,
  },
  payments: {
    currency: 'INR',
    gateway: 'razorpay',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    enableTestMode: true,
    convenienceFee: 0,
    convenienceFeeType: 'percentage',
  },
  email: {
    provider: 'smtp',
    smtpHost: '', smtpPort: 587,
    smtpUser: '', smtpPass: '',
    fromEmail: '', fromName: '',
    enableEmailNotifications: true,
  },
  social: {
    facebook: '', twitter: '', instagram: '',
    youtube: '', linkedin: '',
  },
}

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

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-dim">{label}</label>
      <select {...props}
        className="w-full rounded-lg border border-steel bg-carbon px-3.5 py-2.5 text-sm text-sf-white outline-none transition-colors focus:border-ember/50"
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

function SettingSection({ title, description, children }) {
  return (
    <div className="rounded-xl border border-steel/60 bg-carbon p-6">
      <div className="mb-6">
        <h3 className="font-display text-base font-black italic text-sf-white">{title}</h3>
        {description && <p className="mt-1 text-sm text-muted-dim">{description}</p>}
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

function AdminSettings() {
  const [tab, setTab] = useState('general')
  const [settings, setSettings] = useState(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await settingsService.get()
      if (res) setSettings((prev) => ({ ...prev, ...res }))
    } catch (err) {
      setError(err.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      await settingsService.update(settings)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  function updateSection(section, key, value) {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }

  if (loading) {
    return (
      <>
        <SEO title="Settings" description={`${BRAND.name} platform settings`} />
        <PageContainer title="Settings" description="Configure platform settings">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl border border-steel/60 bg-carbon" />
            ))}
          </div>
        </PageContainer>
      </>
    )
  }

  return (
    <>
      <SEO title="Settings" description={`${BRAND.name} platform settings`} />
      <PageContainer title="Settings" description="Configure platform settings">
        {error && (
          <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="mb-6 flex gap-1 rounded-xl border border-steel/60 bg-carbon p-1.5 overflow-x-auto w-full sm:w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
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

        <form onSubmit={handleSave}>
          <div className="space-y-6">
            {tab === 'general' && (
              <SettingSection title="General" description="Basic platform information">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Brand Name" value={settings.general.brandName}
                    onChange={(e) => updateSection('general', 'brandName', e.target.value)} />
                  <Input label="Short Name" value={settings.general.shortName}
                    onChange={(e) => updateSection('general', 'shortName', e.target.value)} />
                </div>
                <Input label="Tagline" value={settings.general.tagline}
                  onChange={(e) => updateSection('general', 'tagline', e.target.value)} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Support Email" type="email" value={settings.general.supportEmail}
                    onChange={(e) => updateSection('general', 'supportEmail', e.target.value)} />
                  <Input label="Support Phone" value={settings.general.supportPhone}
                    onChange={(e) => updateSection('general', 'supportPhone', e.target.value)} />
                </div>
                <Textarea label="Address" value={settings.general.address}
                  onChange={(e) => updateSection('general', 'address', e.target.value)} />
                <Input label="Website" type="url" value={settings.general.website}
                  onChange={(e) => updateSection('general', 'website', e.target.value)} />
              </SettingSection>
            )}

            {tab === 'registration' && (
              <SettingSection title="Registration" description="Participant registration policies">
                <div className="flex flex-wrap gap-6">
                  <Toggle label="Enable Group Registration" checked={settings.registration.enableGroupRegistration}
                    onChange={(v) => updateSection('registration', 'enableGroupRegistration', v)} />
                  <Toggle label="Enable Waiver" checked={settings.registration.enableWaiver}
                    onChange={(v) => updateSection('registration', 'enableWaiver', v)} />
                  <Toggle label="Enable Refunds" checked={settings.registration.enableRefund}
                    onChange={(v) => updateSection('registration', 'enableRefund', v)} />
                </div>
                <Textarea label="Waiver Text" value={settings.registration.waiverText}
                  onChange={(e) => updateSection('registration', 'waiverText', e.target.value)} />
                <Textarea label="Refund Policy" value={settings.registration.refundPolicy}
                  onChange={(e) => updateSection('registration', 'refundPolicy', e.target.value)} />
                <div className="grid gap-5 sm:grid-cols-3">
                  <Input label="Minimum Age" type="number" value={settings.registration.minAge}
                    onChange={(e) => updateSection('registration', 'minAge', Number(e.target.value))} />
                  <Input label="Maximum Age" type="number" value={settings.registration.maxAge}
                    onChange={(e) => updateSection('registration', 'maxAge', Number(e.target.value))} />
                  <Input label="Cancellation Deadline (days)" type="number" value={settings.registration.cancellationDeadlineDays}
                    onChange={(e) => updateSection('registration', 'cancellationDeadlineDays', Number(e.target.value))} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Terms URL" type="url" value={settings.registration.termsUrl}
                    onChange={(e) => updateSection('registration', 'termsUrl', e.target.value)} />
                  <Input label="Privacy URL" type="url" value={settings.registration.privacyUrl}
                    onChange={(e) => updateSection('registration', 'privacyUrl', e.target.value)} />
                </div>
              </SettingSection>
            )}

            {tab === 'payments' && (
              <SettingSection title="Payments" description="Payment gateway configuration">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Currency" value={settings.payments.currency}
                    onChange={(e) => updateSection('payments', 'currency', e.target.value)}
                    options={['INR', 'USD', 'EUR', 'GBP']} />
                  <Select label="Payment Gateway" value={settings.payments.gateway}
                    onChange={(e) => updateSection('payments', 'gateway', e.target.value)}
                    options={[{ label: 'Razorpay', value: 'razorpay' }, { label: 'Stripe', value: 'stripe' }, { label: 'PayPal', value: 'paypal' }]} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Razorpay Key ID" value={settings.payments.razorpayKeyId}
                    onChange={(e) => updateSection('payments', 'razorpayKeyId', e.target.value)} />
                  <Input label="Razorpay Key Secret" type="password" value={settings.payments.razorpayKeySecret}
                    onChange={(e) => updateSection('payments', 'razorpayKeySecret', e.target.value)} />
                </div>
                <Toggle label="Test Mode" checked={settings.payments.enableTestMode}
                  onChange={(v) => updateSection('payments', 'enableTestMode', v)} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Convenience Fee" type="number" value={settings.payments.convenienceFee}
                    onChange={(e) => updateSection('payments', 'convenienceFee', Number(e.target.value))} />
                  <Select label="Fee Type" value={settings.payments.convenienceFeeType}
                    onChange={(e) => updateSection('payments', 'convenienceFeeType', e.target.value)}
                    options={[{ label: 'Percentage', value: 'percentage' }, { label: 'Fixed', value: 'fixed' }]} />
                </div>
              </SettingSection>
            )}

            {tab === 'email' && (
              <SettingSection title="Email" description="Email service configuration">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Select label="Provider" value={settings.email.provider}
                    onChange={(e) => updateSection('email', 'provider', e.target.value)}
                    options={[{ label: 'SMTP', value: 'smtp' }, { label: 'SendGrid', value: 'sendgrid' }, { label: 'Mailgun', value: 'mailgun' }]} />
                  <Input label="SMTP Port" type="number" value={settings.email.smtpPort}
                    onChange={(e) => updateSection('email', 'smtpPort', Number(e.target.value))} />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="SMTP Host" value={settings.email.smtpHost}
                    onChange={(e) => updateSection('email', 'smtpHost', e.target.value)} />
                  <Input label="SMTP User" value={settings.email.smtpUser}
                    onChange={(e) => updateSection('email', 'smtpUser', e.target.value)} />
                </div>
                <Input label="SMTP Password" type="password" value={settings.email.smtpPass}
                  onChange={(e) => updateSection('email', 'smtpPass', e.target.value)} />
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="From Email" type="email" value={settings.email.fromEmail}
                    onChange={(e) => updateSection('email', 'fromEmail', e.target.value)} />
                  <Input label="From Name" value={settings.email.fromName}
                    onChange={(e) => updateSection('email', 'fromName', e.target.value)} />
                </div>
                <Toggle label="Enable Email Notifications" checked={settings.email.enableEmailNotifications}
                  onChange={(v) => updateSection('email', 'enableEmailNotifications', v)} />
              </SettingSection>
            )}

            {tab === 'social' && (
              <SettingSection title="Social" description="Social media links">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Input label="Facebook URL" type="url" value={settings.social.facebook}
                    onChange={(e) => updateSection('social', 'facebook', e.target.value)} placeholder="https://facebook.com/..." />
                  <Input label="Twitter URL" type="url" value={settings.social.twitter}
                    onChange={(e) => updateSection('social', 'twitter', e.target.value)} placeholder="https://twitter.com/..." />
                  <Input label="Instagram URL" type="url" value={settings.social.instagram}
                    onChange={(e) => updateSection('social', 'instagram', e.target.value)} placeholder="https://instagram.com/..." />
                  <Input label="YouTube URL" type="url" value={settings.social.youtube}
                    onChange={(e) => updateSection('social', 'youtube', e.target.value)} placeholder="https://youtube.com/..." />
                  <Input label="LinkedIn URL" type="url" value={settings.social.linkedin}
                    onChange={(e) => updateSection('social', 'linkedin', e.target.value)} placeholder="https://linkedin.com/..." />
                </div>
              </SettingSection>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-ember px-6 py-3 text-sm font-semibold text-obsidian transition-colors hover:bg-ember-deep disabled:opacity-50"
            >
              <FaFloppyDisk size={14} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                <FaCheck size={12} /> Saved
              </span>
            )}
          </div>
        </form>
      </PageContainer>
    </>
  )
}

export default AdminSettings
