import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaTrophy, FaCalendarDays, FaLocationDot, FaMedal, FaClock, FaLock, FaUsers } from 'react-icons/fa6'
import SEO from '../components/common/SEO'
import { BRAND } from '../config/brand'
import { useAuth } from '../context/useAuth'
import { resultService } from '../admin/services/result.service'
import { eventService } from '../admin/services/event.service'
import { registrationService } from '../services/registration.service'

function formatTime(seconds) {
  if (seconds == null) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

export default function ResultsPage() {
  const { isAuthenticated, user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || (isAuthenticated ? 'my-results' : 'leaderboard')

  // Common Events List
  const [events, setEvents] = useState([])
  
  // My Results State
  const [myResults, setMyResults] = useState([])
  const [loadingMy, setLoadingMy] = useState(false)
  
  // Leaderboard State
  const [selectedEvent, setSelectedEvent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)

  // Load active events for dropdown
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await eventService.list({ all: 'true', limit: 100 })
        const list = res.marathons || []
        setEvents(list)
        if (list.length > 0 && !selectedEvent) {
          setSelectedEvent(list[0]._id)
        }
      } catch (err) {
        console.error('Failed to load events:', err)
      }
    }
    loadEvents()
  }, [])

  // Fetch participant results
  const fetchMyResults = useCallback(async () => {
    if (!isAuthenticated) return
    setLoadingMy(true)
    try {
      const regData = await registrationService.getMyRegistrations()
      const regs = regData.registrations || []
      
      const resultsList = []
      for (const reg of regs) {
        try {
          const res = await resultService.getParticipantResult(reg._id)
          if (res) {
            resultsList.push({ reg, result: res, status: 'published' })
          }
        } catch (err) {
          // If 404, it means results are not generated or published yet
          resultsList.push({ reg, result: null, status: 'pending' })
        }
      }
      setMyResults(resultsList)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingMy(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (activeTab === 'my-results') {
      fetchMyResults()
    }
  }, [activeTab, fetchMyResults])

  // Fetch Leaderboard data
  const fetchLeaderboard = useCallback(async () => {
    if (!selectedEvent) return
    setLoadingLeaderboard(true)
    try {
      const params = {}
      if (selectedCategory) params.category = selectedCategory
      const res = await resultService.getLeaderboard(selectedEvent, params)
      setLeaderboardData(res.leaderboard || [])
    } catch (err) {
      console.error('Failed to load leaderboard:', err)
      setLeaderboardData([])
    } finally {
      setLoadingLeaderboard(false)
    }
  }, [selectedEvent, selectedCategory])

  useEffect(() => {
    if (activeTab === 'leaderboard' && selectedEvent) {
      fetchLeaderboard()
    }
  }, [activeTab, selectedEvent, selectedCategory, fetchLeaderboard])

  const currentEventObj = events.find(e => e._id === selectedEvent)
  const categoriesList = currentEventObj?.raceCategories || []

  return (
    <main className="min-h-screen bg-obsidian py-20 sm:py-28">
      <SEO title="Race Results & Leaderboard" description={`Check official race results and overall rankings for ${BRAND.name} marathons.`} url="/results" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-ember" />
            Official Timing
          </p>
          <h1 className="mt-4 font-display text-4xl font-black italic leading-none tracking-tight text-sf-white sm:text-6xl uppercase">
            RACE RESULTS.
          </h1>
        </div>

        {/* Tabs switcher */}
        <div className="mb-10 flex justify-center border-b border-steel/40">
          <div className="flex gap-8">
            <button
              onClick={() => setSearchParams({ tab: 'my-results' })}
              className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-colors relative ${
                activeTab === 'my-results' ? 'text-ember' : 'text-muted hover:text-sf-white'
              }`}
            >
              My Results
              {activeTab === 'my-results' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ember" />
              )}
            </button>
            <button
              onClick={() => setSearchParams({ tab: 'leaderboard' })}
              className={`pb-4 text-sm font-semibold tracking-wider uppercase transition-colors relative ${
                activeTab === 'leaderboard' ? 'text-ember' : 'text-muted hover:text-sf-white'
              }`}
            >
              Leaderboard
              {activeTab === 'leaderboard' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ember" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'my-results' ? (
          <div>
            {!isAuthenticated ? (
              <div className="mx-auto max-w-md text-center rounded-3xl border border-steel bg-carbon p-8">
                <FaLock className="mx-auto text-4xl text-ember/60 mb-4" />
                <h3 className="font-display text-xl font-black italic text-sf-white">LOGIN REQUIRED</h3>
                <p className="mt-2 text-sm text-muted">Sign in to check your official timing and placement details.</p>
                <Link
                  to="/login?redirect=/results?tab=my-results"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-2.5 text-xs font-bold uppercase text-white shadow-lg shadow-ember/20 hover:bg-ember-deep transition-all"
                >
                  Sign In Now
                </Link>
              </div>
            ) : loadingMy ? (
              <div className="flex justify-center py-20">
                <div className="size-8 animate-spin rounded-full border-2 border-ember border-t-transparent" />
              </div>
            ) : myResults.length === 0 ? (
              <div className="text-center py-20 rounded-3xl border border-steel/40 bg-carbon/40">
                <FaTrophy className="mx-auto text-4xl text-muted/40 mb-4" />
                <p className="text-sm text-muted">No event registrations found under your account.</p>
                <Link to="/events" className="mt-4 inline-flex text-xs font-bold uppercase text-ember hover:underline">
                  Find an Event to Register →
                </Link>
              </div>
            ) : (
              <div className="grid gap-6">
                {myResults.map(({ reg, result, status }) => (
                  <div key={reg._id} className="rounded-3xl border border-steel bg-carbon p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted">
                        <FaCalendarDays className="text-ember text-[10px]" />
                        {new Date(reg.marathon?.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        <span className="h-2 w-px bg-steel" />
                        <FaLocationDot className="text-ember text-[10px]" />
                        {reg.marathon?.venue || 'Venue'}
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-black italic text-sf-white uppercase">
                        {reg.marathon?.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-dim">
                        <span>Category: <strong className="text-sf-white">{reg.raceCategory?.name}</strong></span>
                        <span>Bib Number: <strong className="text-sf-white">{reg.bibNumber || 'Pending'}</strong></span>
                      </div>
                    </div>

                    <div className="border-t border-steel/50 pt-4 md:border-t-0 md:pt-0 flex flex-wrap items-center gap-6">
                      {status === 'pending' || !result?.isPublished ? (
                        <div className="rounded-2xl bg-steel/30 px-5 py-3 border border-steel/50">
                          <p className="text-xs font-bold uppercase tracking-wider text-muted-dim">Results Status</p>
                          <p className="text-sm font-semibold text-ember mt-1">Pending Publication</p>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-2xl bg-obsidian border border-steel/60 p-4 min-w-[120px] text-center">
                            <span className="flex items-center justify-center gap-1.5 text-xs text-muted-dim uppercase font-bold">
                              <FaClock className="text-ember" /> Chip Time
                            </span>
                            <span className="mt-1 block font-mono text-lg font-bold text-sf-white">
                              {formatTime(result.chipTime)}
                            </span>
                          </div>
                          <div className="rounded-2xl bg-obsidian border border-steel/60 p-4 min-w-[100px] text-center">
                            <span className="flex items-center justify-center gap-1.5 text-xs text-muted-dim uppercase font-bold">
                              <FaMedal className="text-ember" /> Placement
                            </span>
                            <span className="mt-1 block font-mono text-lg font-bold text-sf-white">
                              #{result.overallPosition || '—'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Filter Row */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-steel bg-carbon p-4">
              <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted uppercase mb-1">Select Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => {
                      setSelectedEvent(e.target.value)
                      setSelectedCategory('')
                    }}
                    className="w-full rounded-xl border border-steel bg-obsidian px-3 py-2.5 text-sm text-sf-white outline-none focus:border-ember"
                  >
                    <option value="">-- Choose Event --</option>
                    {events.map((e) => (
                      <option key={e._id} value={e._id}>{e.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-muted uppercase mb-1">Race Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-steel bg-obsidian px-3 py-2.5 text-sm text-sf-white outline-none focus:border-ember"
                  >
                    <option value="">All Categories</option>
                    {categoriesList.map((cat) => (
                      <option key={cat._id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            {loadingLeaderboard ? (
              <div className="flex justify-center py-20">
                <div className="size-8 animate-spin rounded-full border-2 border-ember border-t-transparent" />
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="text-center py-20 rounded-3xl border border-steel/40 bg-carbon/40">
                <FaUsers className="mx-auto text-4xl text-muted/40 mb-4" />
                <p className="text-sm text-muted">No results found or published yet for this event.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-steel bg-carbon">
                <table className="w-full border-collapse text-left text-sm text-sf-white">
                  <thead>
                    <tr className="border-b border-steel bg-obsidian/60 text-xs font-bold uppercase tracking-wider text-muted">
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Bib</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Chip Time</th>
                      <th className="px-6 py-4">Gun Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel/50">
                    {leaderboardData.map((row, index) => (
                      <tr key={row._id} className="hover:bg-steel/10 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-ember">
                          #{selectedCategory ? row.categoryRank : row.overallRank}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {row.runnerDetails?.fullName || row.registration?.runnerDetails?.fullName || '—'}
                        </td>
                        <td className="px-6 py-4 font-mono text-muted-dim">{row.bibNumber || '—'}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-muted uppercase">
                          {row.raceCategory?.name || '—'}
                        </td>
                        <td className="px-6 py-4 font-mono">{formatTime(row.chipTime)}</td>
                        <td className="px-6 py-4 font-mono text-muted-dim">{formatTime(row.gunTime)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
