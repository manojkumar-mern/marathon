import { createElement, useCallback, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  FaCheck, FaChevronLeft, FaChevronRight,
  FaCreditCard, FaDownload, FaMobile,
  FaShare, FaSpinner, FaLandmark, FaWallet,
} from 'react-icons/fa6'
import { Link, useSearchParams } from 'react-router-dom'
import SEO from '../components/common/SEO'
import { BRAND } from '../config/brand'
import { events, raceCategories } from '../data/platform'

const STEPS = [
  { label: 'Event',     num: 1 },
  { label: 'Category',  num: 2 },
  { label: 'Details',   num: 3 },
  { label: 'Emergency', num: 4 },
  { label: 'Jersey',    num: 5 },
  { label: 'Review',    num: 6 },
  { label: 'Payment',   num: 7 },
  { label: 'Ticket',    num: 8 },
]
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
const SHIRT_SIZES  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
const SHIRT_GUIDE  = [
  { size: 'XS',  chest: '34-35', waist: '28-29' },
  { size: 'S',   chest: '36-37', waist: '30-31' },
  { size: 'M',   chest: '38-39', waist: '32-33' },
  { size: 'L',   chest: '40-41', waist: '34-35' },
  { size: 'XL',  chest: '42-43', waist: '36-37' },
  { size: 'XXL', chest: '44-45', waist: '38-39' },
  { size: '3XL', chest: '46-47', waist: '40-41' },
]
const BANKS   = ['SBI', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank']
const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik', 'Airtel Money']
const PAYMENT_METHODS = [
  { id: 'UPI',        label: 'UPI',                sub: 'Google Pay, PhonePe, Paytm',  Icon: FaMobile },
  { id: 'Card',       label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay',     Icon: FaCreditCard },
  { id: 'NetBanking', label: 'Net Banking',          sub: 'All major Indian banks',      Icon: FaLandmark },
  { id: 'Wallet',     label: 'Wallets',              sub: 'Paytm, PhonePe, Amazon Pay', Icon: FaWallet },
]
const iCls  = 'mt-2 w-full rounded-xl border border-steel bg-obsidian px-4 py-3 text-sm text-sf-white outline-none transition-colors placeholder:text-muted-dim focus:border-ember'
const iECls = 'mt-2 w-full rounded-xl border border-red-500/60 bg-obsidian px-4 py-3 text-sm text-sf-white outline-none transition-colors placeholder:text-muted-dim focus:border-red-400'
const lCls  = 'block text-sm font-medium text-muted'

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="mt-1 text-xs text-red-400" role="alert">{msg}</p>
}
function validateStep(step, form, pm) {
  const e = {}
  if (step === 2) {
    if (!form.firstName.trim()) e.firstName = 'Enter your first name as it appears on ID'
    if (!form.lastName.trim())  e.lastName  = 'Enter your last name as it appears on ID'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address (e.g., name@domain.com)'
    if (form.phone.replace(/\D/g,'').length < 10) e.phone = 'Enter a valid 10-digit mobile number'
    if (!form.dob)    e.dob    = 'Select your date of birth'
    if (!form.gender) e.gender = 'Select your gender'
  }
  if (step === 3) {
    if (!form.emergencyName.trim())     e.emergencyName     = 'Enter the name of your emergency contact'
    if (!form.emergencyRelation.trim()) e.emergencyRelation = 'Select your relationship to the contact'
    if (form.emergencyPhone.replace(/\D/g,'').length < 10) e.emergencyPhone = 'Enter a valid 10-digit phone number for your contact'
  }
  if (step === 6) {
    if (pm === 'UPI') {
      if (!form.upiId.trim()) e.upiId = 'Enter your UPI ID (e.g., name@bank)'
    }
    if (pm === 'Card') {
      if (!form.cardName.trim()) e.cardName = 'Enter the name on your card'
      if (!form.cardNumber.trim()) e.cardNumber = 'Enter your card number'
      if (!form.cardExpiry.trim()) e.cardExpiry = 'Enter the expiry date (MM/YY)'
      if (!form.cardCvv.trim()) e.cardCvv = 'Enter the CVV on the back of your card'
    }
    if (pm === 'NetBanking') {
      if (!form.selectedBank) e.selectedBank = 'Select your bank from the list'
    }
    if (pm === 'Wallet') {
      if (!form.selectedWallet) e.selectedWallet = 'Select your wallet'
    }
  }
  return e
}

function Registration() {
  const [searchParams] = useSearchParams()
  const [step,setStep]               = useState(0)
  const [errors,setErrors]           = useState({})
  const [processing,setProcessing]   = useState(false)
  const [couponApplied,setCouponApplied] = useState(false)
  const [paymentMethod,setPaymentMethod] = useState('UPI')
  const [form,setForm] = useState(() => {
    const urlEventId = searchParams.get('event')
    const initialEventId = events.find(e => e.id === urlEventId)?.id ?? events[0].id
    return {
      eventId:           initialEventId,
      categoryId:        raceCategories[1]?.id ?? raceCategories[0].id,
      firstName:'', lastName:'', email:'', phone:'', dob:'', gender:'', city:'', pincode:'',
      emergencyName:'', emergencyRelation:'', emergencyPhone:'', bloodGroup:'', medical:'',
      shirt:'M', upiId:'', selectedBank:'', selectedWallet:'',
      cardName:'', cardNumber:'', cardExpiry:'', cardCvv:'', couponCode:'',
    }
  })
  const upd = useCallback((e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value })), [])
  const sf  = useCallback((k,v) => setForm((f) => ({ ...f, [k]: v })), [])
  const fi  = useCallback((name) => ({ name, value: form[name], onChange: upd, className: errors[name] ? iECls : iCls, id: `f-${name}`, 'aria-invalid': !!errors[name] || undefined }), [form, errors, upd])

  const selEvent = useMemo(() => events.find((e) => e.id === form.eventId), [form.eventId])
  const selCat   = useMemo(() => raceCategories.find((c) => c.id === form.categoryId), [form.categoryId])
  const fullName = useMemo(() => [form.firstName, form.lastName].filter(Boolean).join(' ') || 'Runner', [form.firstName, form.lastName])

  const registrationId = useMemo(() => {
    const seed = (form.firstName.length + form.lastName.length + form.email.length + 1) * 317 + 10000
    return `${BRAND.idPrefix}-2027-${String(seed).padStart(5,'0')}`
  }, [form.firstName, form.lastName, form.email])

  const bibNumber = useMemo(() => {
    const n = ((form.firstName.charCodeAt(0)||65)*37 + form.email.length*113 + 1000) % 8000 + 1001
    return String(n)
  }, [form.firstName, form.email])

  const basePrice = useMemo(() => Number((selCat?.price ?? '799').replace(/[^0-9]/g,'')), [selCat?.price])
  const discount  = useMemo(() => couponApplied ? Math.round(basePrice*0.1) : 0, [couponApplied, basePrice])
  const subtotal  = useMemo(() => basePrice - discount, [basePrice, discount])
  const tax       = useMemo(() => Math.round(subtotal*0.18), [subtotal])
  const total     = useMemo(() => subtotal + tax, [subtotal, tax])

  const handleNext = useCallback(() => {
    const errs = validateStep(step, form, paymentMethod)
    if (Object.keys(errs).length > 0) { setErrors(errs); window.scrollTo({top:0,behavior:'smooth'}); return }
    setErrors({})
    if (step === 6) { setProcessing(true); setTimeout(()=>{ setProcessing(false); setStep(7) }, 2400); return }
    setStep((s) => Math.min(s+1, STEPS.length-1))
    window.scrollTo({top:0,behavior:'smooth'})
  }, [step, form, paymentMethod])
  const handleBack = useCallback(() => { setErrors({}); setStep((s)=>Math.max(s-1,0)); window.scrollTo({top:0,behavior:'smooth'}) }, [])

  return (
    <main className="min-h-screen bg-obsidian py-14 sm:py-20">
      <SEO title="Register" description="Register for STRIDEFORGE marathon events. Choose your event, category, and complete secure checkout." url="/register" />
      <div className="mx-auto max-w-4xl px-5 sm:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-ember"/>Registration
            </p>
            <h1 className="mt-3 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-5xl">
              BUILD YOUR<br/><span className="ember-gradient-text">RACE DAY.</span>
            </h1>
          </div>
          {step < 7 && (
            <span className="shrink-0 rounded-full border border-steel bg-carbon px-4 py-1.5 text-xs font-semibold text-muted">
              Secure checkout
            </span>
          )}
        </div>

        {/* Stepper */}
        {step < 7 && (
          <div className="mb-10">
            <div className="flex items-center">
              {STEPS.slice(0,7).map((s,i) => {
                const done=i<step, cur=i===step
                return (
                  <div key={s.label} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div aria-current={cur?'step':undefined} className={`flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${done?'bg-ember text-white':cur?'bg-ember text-white ring-4 ring-ember/20':'bg-steel text-muted-dim'}`}>
                        {done ? <FaCheck className="text-[10px]" aria-hidden="true"/> : s.num}
                      </div>
                      <span className={`hidden text-[9px] font-semibold uppercase tracking-wider sm:block ${cur?'text-ember':done?'text-sf-white/40':'text-muted/30'}`}>{s.label}</span>
                    </div>
                    {i<6 && <div className={`mx-1 h-px flex-1 transition-all duration-500 ${i<step?'bg-ember':'bg-steel'}`}/>}
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-xs font-medium text-muted">Step {step+1} of 7 — <span className="text-sf-white">{STEPS[step].label}</span></p>
          </div>
        )}

        {/* Card */}
        <div className="rounded-3xl border border-steel bg-carbon p-7 sm:p-10">

          {/* Step 0: Event */}
          {step===0 && (
            <div>
              <h2 className="font-display text-3xl font-black italic text-sf-white">Choose Your Event</h2>
              <p className="mt-2 text-sm text-muted">Select the city edition you want to run in.</p>
              <div className="mt-7 grid gap-4">
                {events.map((ev) => {
                  const sel = form.eventId===ev.id
                  return (
                    <label key={ev.id} className={`flex cursor-pointer overflow-hidden rounded-2xl border transition-all ${sel?'border-ember bg-ember/5':'border-steel hover:border-steel-light'}`}>
                      <input type="radio" className="sr-only" name="eventId" value={ev.id} checked={sel} onChange={upd}/>
                      <img alt={ev.title} src={ev.image} className="h-28 w-32 shrink-0 object-cover sm:h-36 sm:w-44"/>
                      <div className="flex flex-1 flex-col justify-center gap-1 p-5">
                        <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${ev.status==='Registration Open'?'bg-emerald-500/15 text-emerald-400':'bg-amber-500/15 text-amber-400'}`}>{ev.status}</span>
                        <p className="mt-1.5 font-semibold text-sf-white">{ev.title}</p>
                        <p className="text-xs text-muted">{ev.date} · {ev.location}</p>
                        <p className="text-xs text-muted-dim">{ev.distance}</p>
                        {ev.regDeadline && <p className="mt-1 text-xs text-muted-dim">Reg. closes: <span className="font-semibold text-volt">{ev.regDeadline}</span></p>}
                      </div>
                      <div className="flex shrink-0 items-center pr-5">
                        <div className={`flex size-6 items-center justify-center rounded-full border transition-all ${sel?'border-ember bg-ember':'border-steel'}`}>
                          {sel && <FaCheck className="text-[9px] text-white" aria-hidden="true"/>}
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 1: Category */}
          {step===1 && (
            <div>
              <h2 className="font-display text-3xl font-black italic text-sf-white">Choose Your Distance</h2>
              <p className="mt-2 text-sm text-muted">Select the race category that matches your training and goals.</p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {raceCategories.map((cat) => {
                  const sel = form.categoryId===cat.id
                  return (
                    <label key={cat.id} className={`relative cursor-pointer overflow-hidden rounded-2xl border p-6 transition-all duration-200 ${sel?'border-ember bg-ember/10 shadow-lg shadow-ember/10':'border-steel bg-obsidian hover:border-steel-light'}`}>
                      <input type="radio" className="sr-only" name="categoryId" value={cat.id} checked={sel} onChange={upd}/>
                      {cat.featured && <span className="absolute right-4 top-4 rounded-full bg-ember/20 px-2.5 py-0.5 text-xs font-bold text-ember">Popular</span>}
                      <p className="font-display text-5xl font-black italic text-sf-white">{cat.distance}</p>
                      <p className="mt-2 font-semibold text-sf-white">{cat.title}</p>
                      <p className="mt-1 text-xs leading-5 text-muted">{cat.detail}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-xs text-muted">Start {cat.startTime}</span>
                        <span className="font-display text-xl font-black italic text-volt">{cat.price}</span>
                      </div>
                      {sel && <div className="absolute bottom-4 right-4 flex size-6 items-center justify-center rounded-full bg-ember"><FaCheck className="text-[9px] text-white" aria-hidden="true"/></div>}
                    </label>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step===2 && (
            <div>
              <h2 className="font-display text-3xl font-black italic text-sf-white">Personal Details</h2>
              <p className="mt-2 text-sm text-muted">This information appears on your race bib and finisher certificate.</p>
              {Object.keys(errors).length>0 && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
                  Please complete all required fields before continuing.
                </div>
              )}
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className={lCls}>First name <span className="text-ember">*</span>
                  <input {...fi('firstName')} placeholder="Arun"/>
                  <FieldError msg={errors.firstName}/>
                </label>
                <label className={lCls}>Last name <span className="text-ember">*</span>
                  <input {...fi('lastName')} placeholder="Kumar"/>
                  <FieldError msg={errors.lastName}/>
                </label>
                <label className={lCls}>Email address <span className="text-ember">*</span>
                  <input {...fi('email')} type="email" placeholder="arun@email.com"/>
                  <FieldError msg={errors.email}/>
                </label>
                <label className={lCls}>Mobile number <span className="text-ember">*</span>
                  <input {...fi('phone')} type="tel" placeholder="98765 43210"/>
                  <FieldError msg={errors.phone}/>
                </label>
                <label className={lCls}>Date of birth <span className="text-ember">*</span>
                  <input {...fi('dob')} type="date"/>
                  <FieldError msg={errors.dob}/>
                </label>
                <label className={lCls}>Gender <span className="text-ember">*</span>
                  <select {...fi('gender')}>
                    <option value="">Select gender</option>
                    {['Male','Female','Non-binary','Prefer not to say'].map((g)=><option key={g} value={g}>{g}</option>)}
                  </select>
                  <FieldError msg={errors.gender}/>
                </label>
                <label className={lCls}>City / Town
                  <input name="city" value={form.city} onChange={upd} className={iCls} placeholder="Chennai"/>
                </label>
                <label className={lCls}>PIN code
                  <input name="pincode" value={form.pincode} onChange={upd} className={iCls} placeholder="600001" maxLength={6}/>
                </label>
              </div>
              <p className="mt-5 text-xs text-muted-dim">Fields marked <span className="text-ember">*</span> are required.</p>
            </div>
          )}

          {/* Step 3: Emergency */}
          {step===3 && (
            <div>
              <h2 className="font-display text-3xl font-black italic text-sf-white">Safety Information</h2>
              <p className="mt-2 text-sm text-muted">Required for all participants. Shared with race medics only in an emergency.</p>
              {Object.keys(errors).length>0 && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400" role="alert">
                  Please complete all required fields before continuing.
                </div>
              )}
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className={lCls}>Emergency contact name <span className="text-ember">*</span>
                  <input {...fi('emergencyName')} placeholder="Priya Kumar"/>
                  <FieldError msg={errors.emergencyName}/>
                </label>
                <label className={lCls}>Relationship <span className="text-ember">*</span>
                  <select {...fi('emergencyRelation')}>
                    <option value="">Select relationship</option>
                    {['Spouse','Parent','Sibling','Child','Friend','Other'].map((r)=><option key={r} value={r}>{r}</option>)}
                  </select>
                  <FieldError msg={errors.emergencyRelation}/>
                </label>
                <label className={lCls}>Emergency phone <span className="text-ember">*</span>
                  <input {...fi('emergencyPhone')} type="tel" placeholder="98765 43211"/>
                  <FieldError msg={errors.emergencyPhone}/>
                </label>
                <label className={lCls}>Blood group
                  <select name="bloodGroup" value={form.bloodGroup} onChange={upd} className={iCls}>
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((b)=><option key={b} value={b}>{b}</option>)}
                  </select>
                </label>
                <label className={`col-span-full ${lCls}`}>Medical declaration
                  <textarea name="medical" value={form.medical} onChange={upd} className={`${iCls} min-h-28 resize-none`} placeholder="Any medical conditions, medications, or allergies. Write 'None' if not applicable."/>
                </label>
              </div>
              <p className="mt-5 rounded-xl bg-obsidian/60 px-4 py-3 text-xs leading-5 text-muted-dim">
                Medical information is used only by on-course medical staff and is not shared with any third party.
              </p>
            </div>
          )}

          {/* Step 4: Jersey */}
          {step===4 && (
            <div>
              <h2 className="font-display text-3xl font-black italic text-sf-white">Race Jersey</h2>
              <p className="mt-2 text-sm text-muted">Every registered runner receives an official STRIDEFORGE race jersey. Choose your size.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {SHIRT_SIZES.map((size)=>(
                  <button key={size} type="button" onClick={()=>sf('shirt',size)} aria-pressed={form.shirt===size}
                    className={`h-14 w-14 rounded-xl border text-sm font-bold transition-all duration-200 ${form.shirt===size?'scale-110 border-ember bg-ember text-white shadow-lg shadow-ember/30':'border-steel text-muted hover:border-ember/50 hover:text-sf-white'}`}>
                    {size}
                  </button>
                ))}
              </div>
              <p className="mt-8 text-xs font-bold uppercase tracking-widest text-ember">Size Guide (inches)</p>
              <div className="mt-3 overflow-hidden rounded-2xl border border-steel">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-steel bg-obsidian text-xs">
                      <th className="px-5 py-3 text-left font-semibold text-muted">Size</th>
                      <th className="px-5 py-3 text-left font-semibold text-muted">Chest</th>
                      <th className="px-5 py-3 text-left font-semibold text-muted">Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHIRT_GUIDE.map((row,i)=>(
                      <tr key={row.size} className={`border-b border-steel/50 ${form.shirt===row.size?'bg-ember/10':i%2===0?'':'bg-obsidian/40'}`}>
                        <td className={`px-5 py-3 font-semibold ${form.shirt===row.size?'text-ember':'text-sf-white'}`}>
                          {row.size}{form.shirt===row.size && <FaCheck className="ml-1.5 inline text-[10px]" aria-hidden="true"/>}
                        </td>
                        <td className="px-5 py-3 text-muted">{row.chest}"</td>
                        <td className="px-5 py-3 text-muted">{row.waist}"</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-dim">When in doubt, size up for comfort on the run.</p>
            </div>
          )}

          {/* Step 5: Review */}
          {step===5 && (
            <div>
              <h2 className="font-display text-3xl font-black italic text-sf-white">Review Your Entry</h2>
              <p className="mt-2 text-sm text-muted">Please confirm your details. Use Back to make any changes.</p>
              <div className="mt-7 space-y-4">
                <div className="rounded-2xl border border-steel bg-obsidian p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">Event and Category</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-muted">Event</p>
                      <p className="mt-1 font-semibold text-sf-white">{selEvent?.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{selEvent?.date} - {selEvent?.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted">Category</p>
                      <p className="mt-1 font-semibold text-sf-white">{selCat?.title} - {selCat?.distance}</p>
                      <p className="mt-0.5 text-xs text-muted">Wave start: {selCat?.startTime}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-steel bg-obsidian p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">Personal Details</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {[
                      {label:'Full name',value:fullName},
                      {label:'Email',value:form.email||'--'},
                      {label:'Mobile',value:form.phone||'--'},
                      {label:'Date of birth',value:form.dob||'--'},
                      {label:'Gender',value:form.gender||'--'},
                      {label:'City',value:form.city||'--'},
                    ].map(({label,value})=>(
                      <div key={label}>
                        <p className="text-xs text-muted">{label}</p>
                        <p className="mt-0.5 text-sm font-medium text-sf-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-steel bg-obsidian p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">Emergency Contact</p>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    {[
                      {label:'Name',value:form.emergencyName||'--'},
                      {label:'Relationship',value:form.emergencyRelation||'--'},
                      {label:'Phone',value:form.emergencyPhone||'--'},
                      {label:'Blood group',value:form.bloodGroup||'Not specified'},
                    ].map(({label,value})=>(
                      <div key={label}>
                        <p className="text-xs text-muted">{label}</p>
                        <p className="mt-0.5 text-sm font-medium text-sf-white">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-steel bg-obsidian p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-ember">Race Jersey</p>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-xl border border-ember/40 bg-ember/10 font-display text-lg font-black italic text-ember">{form.shirt}</div>
                    <div>
                      <p className="font-semibold text-sf-white">Size {form.shirt}</p>
                      <p className="text-xs text-muted">Official STRIDEFORGE race jersey - included</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-xs text-muted-dim">
                By proceeding you agree to the <Link to="/terms" className="text-ember underline hover:text-volt">Terms and Conditions</Link> and <Link to="/privacy" className="text-ember underline hover:text-volt">Privacy Policy</Link> of {BRAND.name}.
              </p>
            </div>
          )}

          {/* Step 6: Payment */}
          {step===6 && !processing && (
            <div>
              <h2 className="font-display text-3xl font-black italic text-sf-white">Secure Checkout</h2>
              <p className="mt-2 text-sm text-muted">All transactions are secured with 256-bit SSL encryption.</p>
              <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_280px]">
                <div>
                  <p className="text-sm font-medium text-muted">Payment method</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {PAYMENT_METHODS.map((method) => (
                      <label key={method.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all ${paymentMethod===method.id?'border-ember bg-ember/10':'border-steel hover:border-steel-light'}`}>
                        <input type="radio" className="sr-only" checked={paymentMethod===method.id} onChange={()=>setPaymentMethod(method.id)}/>
                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${paymentMethod===method.id?'bg-ember/20':'bg-steel'}`}>
                          {createElement(method.Icon, { className: `text-base ${paymentMethod===method.id?'text-ember':'text-muted'}`, 'aria-hidden': true })}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-sf-white">{method.label}</p>
                          <p className="text-xs text-muted">{method.sub}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  {paymentMethod==='UPI' && (
                    <div className="mt-6">
                      <label className={lCls}>Your UPI ID <span className="text-ember">*</span>
                        <input {...fi('upiId')} placeholder="yourname@okaxis"/>
                        <FieldError msg={errors.upiId}/>
                      </label>
                      <p className="mt-3 text-xs text-muted-dim">A payment request will be sent to your UPI app. Approve it to confirm registration.</p>
                    </div>
                  )}
                  {paymentMethod==='Card' && (
                    <div className="mt-6 space-y-4">
                      <label className={lCls}>Cardholder name
                        <input name="cardName" value={form.cardName} onChange={upd} className={errors.cardName?iECls:iCls} placeholder="ARUN KUMAR"/>
                        <FieldError msg={errors.cardName}/>
                      </label>
                      <label className={lCls}>Card number
                        <input name="cardNumber" value={form.cardNumber} onChange={upd} className={errors.cardNumber?iECls:iCls} placeholder="4242 4242 4242 4242" maxLength={19}/>
                        <FieldError msg={errors.cardNumber}/>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <label className={lCls}>Expiry
                          <input name="cardExpiry" value={form.cardExpiry} onChange={upd} className={errors.cardExpiry?iECls:iCls} placeholder="MM / YY" maxLength={7}/>
                          <FieldError msg={errors.cardExpiry}/>
                        </label>
                        <label className={lCls}>CVV
                          <input name="cardCvv" value={form.cardCvv} onChange={upd} className={errors.cardCvv?iECls:iCls} placeholder="..." maxLength={4} type="password"/>
                          <FieldError msg={errors.cardCvv}/>
                        </label>
                      </div>
                    </div>
                  )}
                  {paymentMethod==='NetBanking' && (
                    <div className="mt-6">
                      <label className={lCls}>Select your bank <span className="text-ember">*</span>
                        <select name="selectedBank" value={form.selectedBank} onChange={upd} className={errors.selectedBank?iECls:iCls}>
                          <option value="">Choose bank</option>
                          {BANKS.map((b)=><option key={b} value={b}>{b}</option>)}
                        </select>
                        <FieldError msg={errors.selectedBank}/>
                      </label>
                    </div>
                  )}
                  {paymentMethod==='Wallet' && (
                    <div className="mt-6">
                      <p className="text-sm font-medium text-muted">Select wallet <span className="text-ember">*</span></p>
                      <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Select wallet">
                        {WALLETS.map((w)=>(
                          <button key={w} type="button" onClick={()=>sf('selectedWallet',w)}
                            className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${form.selectedWallet===w?'border-ember bg-ember/10 text-ember':'border-steel text-muted hover:border-ember/40 hover:text-sf-white'}`}>
                            {w}
                          </button>
                        ))}
                      </div>
                      <FieldError msg={errors.selectedWallet}/>
                    </div>
                  )}
                  <div className="mt-7">
                    <p className="text-sm font-medium text-muted">Coupon code</p>
                    <div className="mt-2 flex gap-2">
                      <input name="couponCode" value={form.couponCode} onChange={upd} placeholder='Try "FIRST10"'
                        className="flex-1 rounded-xl border border-steel bg-obsidian px-4 py-3 text-sm text-sf-white outline-none placeholder:text-muted-dim focus:border-ember"/>
                      <button type="button" onClick={()=>{ if(form.couponCode.toUpperCase()==='FIRST10') setCouponApplied(true) }}
                        className="shrink-0 rounded-xl bg-ember px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ember-deep">
                        Apply
                      </button>
                    </div>
                    {couponApplied && <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400"><FaCheck aria-hidden="true"/> FIRST10 applied - 10% discount</p>}
                  </div>
                </div>
                <div>
                  <div className="rounded-2xl border border-steel bg-obsidian p-6 lg:sticky lg:top-28">
                    <p className="text-xs font-bold uppercase tracking-widest text-ember">Order Summary</p>
                    <div className="mt-5 space-y-3 text-sm">
                      <div><p className="font-medium text-sf-white">{selEvent?.title}</p><p className="text-xs text-muted">{selEvent?.date}</p></div>
                      <div className="flex justify-between border-t border-steel pt-3">
                        <span className="text-muted">{selCat?.title} ({selCat?.distance})</span>
                        <span className="text-sf-white">&#x20B9;{basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Jersey (Size {form.shirt})</span>
                        <span className="text-xs font-semibold text-emerald-400">Included</span>
                      </div>
                      {couponApplied && <div className="flex justify-between text-emerald-400"><span>Discount (10%)</span><span>-&#x20B9;{discount.toLocaleString()}</span></div>}
                      <div className="flex justify-between text-xs text-muted"><span>GST (18%)</span><span>&#x20B9;{tax.toLocaleString()}</span></div>
                      <div className="flex justify-between border-t border-steel pt-3 font-bold">
                        <span className="text-sf-white">Total</span>
                        <span className="font-display text-xl italic text-volt">&#x20B9;{total.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="mt-5 text-[10px] leading-4 text-muted-dim">Prototype only - no real payment processed.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing */}
          {step===6 && processing && (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="relative flex size-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-ember/20"/>
                <FaSpinner className="animate-spin text-3xl text-ember" aria-hidden="true"/>
              </div>
              <p className="mt-6 font-display text-2xl font-black italic text-sf-white">Processing payment...</p>
              <p className="mt-2 text-sm text-muted">Please wait. Do not refresh this page.</p>
            </div>
          )}

          {/* Step 7: Ticket */}
          {step===7 && (
            <div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-5 py-2 text-sm font-bold text-emerald-400">
                  <FaCheck aria-hidden="true"/> Registration confirmed
                </div>
                <h2 className="mt-5 font-display text-4xl font-black italic text-sf-white sm:text-5xl">YOUR RACE TICKET<br/>IS READY.</h2>
                <p className="mt-3 text-sm text-muted">Show this QR code at the bib collection desk on race day.</p>
              </div>
              <div className="mx-auto mt-10 max-w-lg overflow-hidden rounded-3xl border border-ember/30 bg-carbon ember-glow-sm">
                <div className="bg-gradient-to-r from-ember to-ember-deep px-7 py-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest opacity-70">{BRAND.name}</p>
                      <p className="mt-1 font-display text-2xl font-black italic leading-tight">{selEvent?.title}</p>
                      <p className="mt-1.5 text-xs opacity-75">{selEvent?.date} - {selEvent?.location}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs uppercase tracking-widest opacity-70">BIB</p>
                      <p className="font-display text-4xl font-black italic">{bibNumber}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-6 p-7">
                  <div className="space-y-4">
                    {[
                      {label:'Runner name',value:fullName},
                      {label:'Runner ID',value:registrationId},
                      {label:'Category',value:`${selCat?.title} - ${selCat?.distance}`},
                      {label:'Wave start',value:selCat?.startTime},
                      {label:'Jersey size',value:`Size ${form.shirt}`},
                      {label:'Emerg. contact',value:form.emergencyName||'Not provided'},
                    ].map(({label,value})=>(
                      <div key={label}>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</p>
                        <p className="mt-0.5 text-sm font-semibold text-sf-white">{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="rounded-xl bg-sf-white p-3">
                      <QRCodeSVG size={110} value={`${registrationId}|${form.email||'runner'}|${form.eventId}|${form.categoryId}`} bgColor="#F8FAFC" fgColor="#080C10" level="H"/>
                    </div>
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-dim">Scan at check-in</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border-t border-dashed border-steel/60 px-7 py-3">
                  <div className="h-px flex-1 border-t border-dashed border-steel/30"/>
                  <span className="text-[9px] uppercase tracking-widest text-muted-dim">Valid for race day only</span>
                  <div className="h-px flex-1 border-t border-dashed border-steel/30"/>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button type="button" onClick={()=>window.print()}
                  className="inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3 text-sm font-semibold text-white transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <FaDownload aria-hidden="true"/> Download ticket
                </button>
                <button type="button" onClick={()=>{ if(navigator.share) navigator.share({title:`${BRAND.name} - ${selEvent?.title}`,text:`I am registered! Bib ${bibNumber}. See you at the start line.`}) }}
                  className="inline-flex items-center gap-2 rounded-full border border-steel px-7 py-3 text-sm font-semibold text-muted transition-all hover:border-ember/40 hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">
                  <FaShare aria-hidden="true"/> Share
                </button>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-6">
                <Link to="/dashboard" className="text-sm font-semibold text-ember transition-colors hover:text-volt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">View in dashboard</Link>
                <Link to="/events" className="text-sm text-muted transition-colors hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember">Browse more events</Link>
              </div>
              <p className="mt-8 text-center text-xs text-muted-dim">
                Confirmation sent to <span className="text-sf-white">{form.email||'your email'}</span>. Check your inbox.
              </p>
            </div>
          )}

          {/* Navigation */}
          {step<7 && !processing && (
            <div className="mt-10 flex items-center justify-between border-t border-steel pt-7">
              <button type="button" onClick={handleBack}
                className={`inline-flex items-center gap-2 rounded-full border border-steel px-6 py-3 text-sm font-semibold text-muted transition-all hover:border-steel-light hover:text-sf-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember ${step===0?'invisible':''}`}>
                <FaChevronLeft aria-hidden="true"/> Back
              </button>
              <button type="button" onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:bg-ember-deep hover:-translate-y-0.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                {step===5?'Proceed to payment':step===6?'Confirm and pay':'Continue'}
                <FaChevronRight aria-hidden="true"/>
              </button>
            </div>
          )}
        </div>

        {step<7 && (
          <p className="mt-6 text-center text-xs text-muted-dim">
            Client-side prototype - no personal data is submitted or stored.
          </p>
        )}
      </div>
    </main>
  )
}

export default Registration
