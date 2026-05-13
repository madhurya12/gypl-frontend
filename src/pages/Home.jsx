import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { participantAPI, competitionAPI, eventAPI, userEventAPI } from '../services/api'
import toast from 'react-hot-toast'
import { AuthContext } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import {
  Users,
  Trophy,
  IndianRupee,
  UtensilsCrossed,
  Calendar,
  MapPin,
  Mic,
  Star,
  Sparkles,
  Award,
  Gift,
  UsersRound,
  ScrollText,
  Camera,
  Heart,
  ArrowRight,
  CircleCheck,
  ChevronRight,
} from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Button from '../components/Button'

export default function Home() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useContext(AuthContext)
  const [stats, setStats] = useState({ totalParticipants: 0 })
  const [competitions, setCompetitions] = useState([])
  const [userEvents, setUserEvents] = useState([])
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchUserEvents()
    }
  }, [isAuthenticated, token])

  const fetchData = async () => {
    try {
      const [statsResponse, competitionsResponse, eventResponse] = await Promise.all([
        participantAPI.getStats(),
        competitionAPI.getAll(),
        eventAPI.get(),
      ])

      if (statsResponse.data.success) setStats(statsResponse.data.stats)
      if (competitionsResponse.data.success) setCompetitions(competitionsResponse.data.competitions)
      if (eventResponse.data.success) setEvent(eventResponse.data.event)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error loading page data')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserEvents = async () => {
    try {
      const response = await userEventAPI.getMyEvents()
      if (response.data.success) {
        setUserEvents(response.data.events.map((e) => e._id))
      }
    } catch (error) {
      console.error('Error fetching user events:', error)
    }
  }

  const handleRegisterForCompetition = async (competitionId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to register for competitions')
      navigate('/login')
      return
    }

    setRegistering((prev) => ({ ...prev, [competitionId]: true }))
    try {
      const response = await userEventAPI.registerForCompetition(competitionId)

      if (response.data.success) {
        toast.success('Successfully registered for the competition!')
        setUserEvents([...userEvents, competitionId])
      } else {
        toast.error(response.data.message || 'Failed to register')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error registering for competition')
      console.error(error)
    } finally {
      setRegistering((prev) => ({ ...prev, [competitionId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="spinner mx-auto mb-4" />
          <p className="text-surface-500 font-medium text-sm">Loading event...</p>
        </motion.div>
      </div>
    )
  }

  const totalPrizePool = competitions.reduce((sum, c) => sum + (c.fees || 0), 0)

  const benefits = [
    { Icon: Award, title: 'Recognition', desc: "Get noticed at India's premier yoga event" },
    { Icon: UsersRound, title: 'Networking', desc: 'Connect with yogis and industry professionals' },
    { Icon: ScrollText, title: 'Certificates', desc: 'Official participation & achievement certificates' },
    { Icon: Camera, title: 'Media Coverage', desc: 'Featured across our event media and socials' },
    { Icon: Heart, title: 'Community', desc: "Join India's growing yoga community" },
    { Icon: Gift, title: 'Prizes & Rewards', desc: 'Win meaningful prizes and lasting recognition' },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Soft mesh background */}
        <div className="absolute inset-0 bg-grid bg-grid-fade opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-gradient-to-b from-primary-200/40 via-primary-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-20 w-[400px] h-[400px] bg-secondary-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative pt-16 pb-24 md:pt-24 md:pb-32">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-surface-200 shadow-soft mb-7"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              <span className="text-xs font-semibold text-surface-700 tracking-wide">
                Registrations Open · {event?.date || '2026'}
              </span>
            </motion.div>

            <motion.h1
              className="font-display font-extrabold text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tightest text-surface-900 mb-6"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {event?.title || 'Grand Yoga'}
              <br />
              <span className="gradient-text">Premier League</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-surface-600 max-w-2xl mx-auto mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {event?.description ||
                "India's most celebrated yoga competition — bringing together masters, students, and enthusiasts on one stage."}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Link to="/register">
                <Button size="lg" className="group">
                  Register Now
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Button>
              </Link>
              <a href="#competitions">
                <Button size="lg" variant="outline">
                  View Competitions
                </Button>
              </a>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {event?.date && (
                <div className="flex items-center gap-2 text-surface-600">
                  <Calendar size={15} className="text-primary-600" />
                  <span className="font-medium">{event.date}</span>
                </div>
              )}
              {event?.venue && (
                <>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-surface-300" />
                  <div className="flex items-center gap-2 text-surface-600">
                    <MapPin size={15} className="text-primary-600" />
                    <span className="font-medium">{event.venue}</span>
                  </div>
                </>
              )}
              {event?.presenter && (
                <>
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-surface-300" />
                  <div className="flex items-center gap-2 text-surface-600">
                    <Mic size={15} className="text-primary-600" />
                    <span className="font-medium">{event.presenter}</span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Subtle perk strip */}
        <motion.div
          className="container mx-auto px-4 pb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="max-w-2xl mx-auto flex items-center justify-center gap-3 px-5 py-3 rounded-2xl bg-white/70 backdrop-blur-md border border-surface-200/70 shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-secondary-50 flex items-center justify-center">
              <UtensilsCrossed size={17} className="text-secondary-600" />
            </div>
            <p className="text-sm font-medium text-surface-700">
              Complimentary lunch included for all participants
            </p>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-20 border-t border-surface-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow mb-4">By the numbers</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 tracking-tight mt-3">
              A stage built for excellence
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatsCard
              icon={<Users size={22} strokeWidth={2} />}
              value={stats.totalParticipants}
              label="Total Participants"
              delay={0}
              accent="primary"
            />
            <StatsCard
              icon={<Trophy size={22} strokeWidth={2} />}
              value={competitions.length}
              label="Active Competitions"
              delay={0.1}
              accent="secondary"
            />
            <StatsCard
              icon={<IndianRupee size={22} strokeWidth={2} />}
              value={`₹${totalPrizePool.toLocaleString()}`}
              label="Combined Entry Pool"
              delay={0.2}
              accent="surface"
            />
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section id="competitions" className="py-20 border-t border-surface-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow mb-4">Compete</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 tracking-tight mt-3 mb-3">
              Pick your stage
            </h2>
            <p className="text-surface-600 leading-relaxed">
              Every competition is judged by senior practitioners. Categories
              are designed so every age group has a fair shot at the top.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {competitions.map((competition, index) => (
              <motion.div
                key={competition._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-white border border-surface-200/70 rounded-2xl shadow-soft hover:shadow-soft-lg hover:border-surface-300/80 transition-all duration-300 overflow-hidden"
              >
                {/* Top accent line */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600" />

                <div className="p-7 md:p-8">
                  <div className="flex items-start justify-between mb-6 gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-display font-bold text-surface-900 tracking-tight mb-1.5">
                        {competition.name}
                      </h3>
                      <p className="text-surface-500 text-sm">
                        {competition.performance}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-xs uppercase tracking-wider text-surface-400 font-semibold mb-0.5">
                        Entry
                      </div>
                      <div className="text-2xl font-display font-bold text-surface-900">
                        ₹{competition.fees}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {competition.categories && competition.categories.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Star size={14} className="text-primary-600" />
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                            Categories
                          </h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {competition.categories.map((category, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-medium border border-primary-100"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {competition.prizes && competition.prizes.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Trophy size={14} className="text-secondary-600" />
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                            Prizes
                          </h4>
                        </div>
                        <ul className="space-y-1.5">
                          {competition.prizes.map((prize, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-surface-700"
                            >
                              <ChevronRight
                                size={14}
                                className="text-secondary-500 mt-0.5 flex-shrink-0"
                              />
                              <span>{prize}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {competition.benefits && competition.benefits.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Gift size={14} className="text-primary-600" />
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-surface-500">
                            Benefits
                          </h4>
                        </div>
                        <ul className="space-y-1.5">
                          {competition.benefits.map((benefit, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm text-surface-700"
                            >
                              <CircleCheck
                                size={14}
                                className="text-primary-500 mt-0.5 flex-shrink-0"
                              />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-7 pt-6 border-t border-surface-100">
                    {userEvents.includes(competition._id) ? (
                      <Button
                        disabled
                        className="w-full bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-50 shadow-none"
                      >
                        <CircleCheck size={16} />
                        Registered
                      </Button>
                    ) : isAuthenticated ? (
                      <Button
                        onClick={() => handleRegisterForCompetition(competition._id)}
                        disabled={registering[competition._id]}
                        className="w-full group/btn"
                      >
                        {registering[competition._id] ? (
                          'Registering...'
                        ) : (
                          <>
                            Register Now
                            <ArrowRight
                              size={16}
                              className="transition-transform group-hover/btn:translate-x-0.5"
                            />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Link
                        to={`/register?competition=${competition._id}`}
                        className="block"
                      >
                        <Button className="w-full group/btn">
                          Register Now
                          <ArrowRight
                            size={16}
                            className="transition-transform group-hover/btn:translate-x-0.5"
                          />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PARTICIPATE */}
      <section className="py-20 border-t border-surface-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow mb-4">Why participate</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-surface-900 tracking-tight mt-3 mb-3">
              More than a competition
            </h2>
            <p className="text-surface-600 leading-relaxed">
              A platform built to celebrate the practice, the people, and the
              progress.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map(({ Icon, title, desc }, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -3 }}
                className="bg-white border border-surface-200/70 rounded-2xl p-7 shadow-soft hover:shadow-soft-lg hover:border-surface-300/80 transition-all duration-200"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 ring-1 ring-inset ring-primary-100 mb-4">
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3 className="font-display font-bold text-surface-900 text-lg tracking-tight mb-1.5">
                  {title}
                </h3>
                <p className="text-surface-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTOR REWARDS — dark feature panel */}
      <section className="py-20 border-t border-surface-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative bg-surface-950 rounded-3xl overflow-hidden border border-surface-800"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-grid opacity-[0.08]" />
            <div className="absolute -top-32 -right-20 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative p-8 md:p-14">
              <div className="max-w-2xl mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles size={12} />
                  For Instructors
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-3">
                  Special instructor rewards
                </h2>
                <p className="text-surface-400 leading-relaxed">
                  Bring your students. Build your studio's reputation. Earn
                  recognition that lasts beyond the event.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-secondary-500/15 border border-secondary-500/20 flex items-center justify-center">
                      <Trophy size={18} className="text-secondary-400" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-white tracking-tight">
                      Most Participants Brought
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      { rank: '1st', text: 'Special Recognition + Gift Hamper', color: 'text-secondary-400' },
                      { rank: '2nd', text: 'Recognition Certificate + Gift', color: 'text-surface-300' },
                      { rank: '3rd', text: 'Certificate + Token Gift', color: 'text-surface-400' },
                    ].map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <span className={`text-sm font-display font-bold ${item.color} min-w-[28px]`}>
                          {item.rank}
                        </span>
                        <span className="text-surface-200 text-sm leading-relaxed">
                          {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center">
                      <Star size={18} className="text-primary-400" />
                    </div>
                    <h3 className="text-lg font-display font-bold text-white tracking-tight">
                      Performance-Based Rewards
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Winning Instructors: Featured Position',
                      'Media Highlights: Social Features',
                      'Lifetime Badge: Special Recognition',
                    ].map((text, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <CircleCheck
                          size={16}
                          className="text-primary-400 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-surface-200 text-sm leading-relaxed">
                          {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-surface-200/60">
        <div className="container mx-auto px-4">
          <motion.div
            className="relative max-w-4xl mx-auto text-center overflow-hidden"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary-100/40 via-transparent to-secondary-100/30 rounded-3xl blur-2xl" />

            <span className="eyebrow mb-4">Limited spots</span>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-surface-900 tracking-tightest mb-5 mt-4">
              Ready to take <span className="gradient-text">your stage</span>?
            </h2>
            <p className="text-lg text-surface-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of yogis at Grand Yoga Premier League 2026.
              Registration closes once spots are filled.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button size="xl" className="group">
                  Register Today
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button size="xl" variant="outline">
                    I already have an account
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
