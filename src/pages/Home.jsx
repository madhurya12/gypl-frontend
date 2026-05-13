import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { participantAPI, competitionAPI, eventAPI, userEventAPI } from '../services/api'
import toast from 'react-hot-toast'
import { AuthContext } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { Users, Trophy, DollarSign, UtensilsCrossed, Calendar, MapPin, Mic, Star } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Card from '../components/Card'
import Button from '../components/Button'

export default function Home() {
  const navigate = useNavigate()
  const { user, token, isAuthenticated } = useContext(AuthContext)
  const [stats, setStats] = useState({
    totalParticipants: 0
  })
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
      // Fetch stats, competitions, and event data in parallel
      const [statsResponse, competitionsResponse, eventResponse] = await Promise.all([
        participantAPI.getStats(),
        competitionAPI.getAll(),
        eventAPI.get()
      ])

      if (statsResponse.data.success) {
        setStats(statsResponse.data.stats)
      }

      if (competitionsResponse.data.success) {
        setCompetitions(competitionsResponse.data.competitions)
      }

      if (eventResponse.data.success) {
        setEvent(eventResponse.data.event)
      }
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
        setUserEvents(response.data.events.map(e => e._id))
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

    setRegistering(prev => ({ ...prev, [competitionId]: true }))
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
      setRegistering(prev => ({ ...prev, [competitionId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="spinner mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 font-medium">Loading...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yoga-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="glass max-w-4xl mx-auto p-8 md:p-12 rounded-3xl shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-display font-bold mb-6 gradient-text"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
              >
                {event?.title || 'Grand Yoga Premier League'}
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-gray-600 mb-4 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                {event?.date || '2026'}
              </motion.p>
              <motion.p
                className="text-lg md:text-xl text-gray-500 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                {event?.description || 'India\'s Premier Yoga Competition Event'}
              </motion.p>
              <motion.div
                className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <div className="flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full">
                  <Calendar size={16} />
                  <span>{event?.date}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full">
                  <MapPin size={16} />
                  <span>{event?.venue}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full">
                  <Mic size={16} />
                  <span>Presented by: {event?.presenter}</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <Link to="/register">
                  <Button size="lg" className="text-xl px-12 py-4">
                    Register Now
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Special Banner */}
      <motion.section
        className="py-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white py-4 px-6 rounded-2xl shadow-lg text-center max-w-2xl mx-auto">
            <motion.div
              className="flex items-center justify-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <UtensilsCrossed size={24} className="animate-pulse" />
              <p className="text-lg font-bold">Free Lunch for all participants!</p>
              <UtensilsCrossed size={24} className="animate-pulse" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-center mb-16 gradient-text"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Event Statistics
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <StatsCard
              icon={<Users className="text-primary-500" />}
              value={stats.totalParticipants}
              label="Total Participants"
              delay={0}
            />
            <StatsCard
              icon={<Trophy className="text-secondary-500" />}
              value={competitions.length}
              label="Competitions"
              delay={0.2}
            />
            <StatsCard
              icon={<DollarSign className="text-yoga-500" />}
              value={`₹${competitions.reduce((sum, comp) => sum + comp.fees, 0).toLocaleString()}`}
              label="Total Prize Pool"
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Competitions Section */}
      <section className="py-20 bg-gradient-to-b from-white to-primary-50/30">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-center text-gray-800 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Available Competitions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitions.map((competition, index) => (
              <motion.div
                key={competition._id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full ${index % 2 === 0 ? 'border-l-4 border-primary-500' : 'border-l-4 border-secondary-500'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">{competition.name}</h3>
                    <div className="text-right">
                      <span className="text-2xl font-bold gradient-text">₹{competition.fees}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-xl">
                      <h4 className="font-bold text-primary-700 mb-2 flex items-center">
                        <Star className="mr-2" size={18} />
                        Performance
                      </h4>
                      <p className="text-gray-700">{competition.performance}</p>
                      {competition.categories && competition.categories.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-primary-600">Categories:</p>
                          <ul className="text-sm text-gray-600 ml-4 mt-1">
                            {competition.categories.map((category, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="w-2 h-2 bg-primary-400 rounded-full mr-2"></span>
                                {category}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {competition.prizes && competition.prizes.length > 0 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                        <h4 className="font-bold text-yellow-700 mb-2 flex items-center">
                          <Trophy className="mr-2" size={18} />
                          Prizes
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {competition.prizes.map((prize, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="text-yellow-600 mr-2">🏆</span>
                              {prize}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {competition.benefits && competition.benefits.length > 0 && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                        <h4 className="font-bold text-green-700 mb-2 flex items-center">
                          <span className="mr-2">🎁</span>
                          Benefits
                        </h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {competition.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    {userEvents.includes(competition._id) ? (
                      <Button
                        disabled
                        className="w-full bg-green-500 hover:bg-green-600 text-white cursor-not-allowed"
                      >
                        ✓ Already Registered
                      </Button>
                    ) : isAuthenticated ? (
                      <Button
                        onClick={() => handleRegisterForCompetition(competition._id)}
                        disabled={registering[competition._id]}
                        className={`w-full ${index % 2 === 0 ? 'bg-primary-600 hover:bg-primary-700' : 'bg-secondary-600 hover:bg-secondary-700'}`}
                      >
                        {registering[competition._id] ? 'Registering...' : 'Register Now'}
                      </Button>
                    ) : (
                      <Link to={`/register?competition=${competition._id}`} className="block">
                        <Button
                          className={`w-full ${index % 2 === 0 ? 'bg-primary-600 hover:bg-primary-700' : 'bg-secondary-600 hover:bg-secondary-700'}`}
                        >
                          Register Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* General Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-5xl font-display font-bold text-center text-gray-800 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Why Participate?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎖️', title: 'Recognition', desc: 'Get recognized at India\'s premier yoga event' },
              { icon: '🤝', title: 'Networking', desc: 'Connect with yoga enthusiasts and professionals' },
              { icon: '📜', title: 'Certificates', desc: 'Receive participation and achievement certificates' },
              { icon: '🏅', title: 'Media Coverage', desc: 'Get featured in our event media and socials' },
              { icon: '👥', title: 'Community', desc: 'Be part of India\'s growing yoga community' },
              { icon: '🎁', title: 'Prizes & Rewards', desc: 'Win amazing prizes and recognition' }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card glass className="text-center h-full">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-gray-800 mb-3 text-xl">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Rewards Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="glass max-w-5xl mx-auto p-8 md:p-12 rounded-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-display font-bold mb-12 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Special Instructor Rewards
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Trophy className="mr-3 text-yellow-300" size={28} />
                  For Bringing Most Participants
                </h3>
                <ul className="space-y-4">
                  {[
                    { rank: '🥇', text: '1st Rank: Special Recognition + Gift Hamper' },
                    { rank: '🥈', text: '2nd Rank: Recognition Certificate + Gift' },
                    { rank: '🥉', text: '3rd Rank: Certificate + Token Gift' }
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="font-bold text-xl">{item.rank}</span>
                      <span className="text-white/90">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Star className="mr-3 text-yellow-300" size={28} />
                  Performance-Based Rewards
                </h3>
                <ul className="space-y-4">
                  {[
                    { icon: '⭐', text: 'Winning Instructors: Special Featured Position' },
                    { icon: '⭐', text: 'Media Highlights: Social Media Features' },
                    { icon: '⭐', text: 'Lifetime Badge: Special Recognition' }
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <span className="font-bold text-xl">{item.icon}</span>
                      <span className="text-white/90">{item.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-secondary-600 via-primary-600 to-secondary-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-display font-bold mb-6"
              initial={{ scale: 0.5 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              viewport={{ once: true }}
            >
              Ready to Compete?
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join thousands of yogis at Grand Yoga Premier League 2026
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/register">
                <Button variant="secondary" size="lg" className="text-xl px-12 py-4">
                  Register Today
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
