import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { participantAPI, competitionAPI, eventAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function Home() {
  const [stats, setStats] = useState({
    totalParticipants: 0,
    faceoffCount: 0,
    talentCount: 0
  })
  const [competitions, setCompetitions] = useState([])
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto" style={{ borderWidth: '3px', width: '50px', height: '50px' }}></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Banner */}
      <div className="bg-gradient-to-r from-yoga-600 via-yoga-500 to-green-400 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{event?.title || 'Grand Yoga Premier League'}</h1>
          <p className="text-xl md:text-2xl mb-2">{event?.date || '2026'}</p>
          <p className="text-lg md:text-xl opacity-90">{event?.description || 'India\'s Premier Yoga Competition Event'}</p>
          <div className="mt-4 text-sm opacity-75">
            <p>📅 {event?.date} | 📍 {event?.venue}</p>
            <p>🎤 Presented by: {event?.presenter} | 📞 Contact: {event?.contact}</p>
          </div>
          <Link to="/register" className="inline-block mt-6 bg-white text-yoga-600 font-bold py-3 px-8 rounded-lg hover:bg-yoga-50 transition">
            Register Now
          </Link>
        </div>
      </div>

      {/* Special Banner */}
      <div className="bg-yellow-400 text-black py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-bold">🍽️ Free Lunch for all participants!</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl font-bold text-yoga-600">{stats.totalParticipants}</div>
              <p className="text-gray-600 mt-2">Total Participants</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl font-bold text-blue-600">{competitions.length}</div>
              <p className="text-gray-600 mt-2">Competitions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-4xl font-bold text-green-600">₹{competitions.reduce((sum, comp) => sum + comp.fees, 0).toLocaleString()}</div>
              <p className="text-gray-600 mt-2">Total Prize Pool</p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yoga-700 mb-12">Available Competitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitions.map((competition, index) => (
              <div key={competition._id} className={`bg-white p-8 rounded-lg shadow-lg border-l-4 ${index % 2 === 0 ? 'border-yoga-600' : 'border-purple-600'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-800">{competition.name}</h3>
                  <span className="text-2xl font-bold text-green-600">₹{competition.fees}</span>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-700 mb-2">🧘 Performance</h4>
                    <p className="text-gray-600">{competition.performance}</p>
                    {competition.categories && competition.categories.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-700">Categories:</p>
                        <ul className="text-sm text-gray-600 ml-4">
                          {competition.categories.map((category, idx) => (
                            <li key={idx}>• {category}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {competition.prizes && competition.prizes.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-700 mb-2">🏆 Prizes</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {competition.prizes.map((prize, idx) => (
                          <li key={idx}>• {prize}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {competition.benefits && competition.benefits.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-green-700 mb-2">🎁 Benefits</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {competition.benefits.map((benefit, idx) => (
                          <li key={idx}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Link
                    to={`/register?competition=${competition._id}`}
                    className={`inline-block w-full text-center font-bold py-3 px-6 rounded-lg transition ${
                      index % 2 === 0
                        ? 'bg-yoga-600 hover:bg-yoga-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-yoga-700 mb-12">General Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-yoga-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">🎖️</div>
              <h3 className="font-bold text-yoga-700 mb-2">Recognition</h3>
              <p className="text-gray-700">Get recognized at India's premier yoga event</p>
            </div>
            <div className="bg-yoga-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-bold text-yoga-700 mb-2">Networking</h3>
              <p className="text-gray-700">Connect with yoga enthusiasts and professionals</p>
            </div>
            <div className="bg-yoga-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">📜</div>
              <h3 className="font-bold text-yoga-700 mb-2">Certificates</h3>
              <p className="text-gray-700">Receive participation and achievement certificates</p>
            </div>
            <div className="bg-yoga-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">🏅</div>
              <h3 className="font-bold text-yoga-700 mb-2">Media Coverage</h3>
              <p className="text-gray-700">Get featured in our event media and socials</p>
            </div>
            <div className="bg-yoga-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold text-yoga-700 mb-2">Community</h3>
              <p className="text-gray-700">Be part of India's growing yoga community</p>
            </div>
            <div className="bg-yoga-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="text-3xl mb-3">🎁</div>
              <h3 className="font-bold text-yoga-700 mb-2">Prizes & Rewards</h3>
              <p className="text-gray-700">Win amazing prizes and recognition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Rewards Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-yoga-600 to-yoga-700 text-white p-8 md:p-12 rounded-lg shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Special Instructor Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">For Bringing Most Participants</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-bold mr-3">🥇</span>
                    <span>1st Rank: Special Recognition + Gift Hamper</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">🥈</span>
                    <span>2nd Rank: Recognition Certificate + Gift</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">🥉</span>
                    <span>3rd Rank: Certificate + Token Gift</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Performance-Based Rewards</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="font-bold mr-3">⭐</span>
                    <span>Winning Instructors: Special Featured Position</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">⭐</span>
                    <span>Media Highlights: Social Media Features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-3">⭐</span>
                    <span>Lifetime Badge: Special Recognition</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-yoga-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Compete?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of yogis at Grand Yoga Premier League 2026</p>
          <Link to="/register" className="inline-block bg-white text-yoga-600 font-bold py-3 px-8 rounded-lg hover:bg-yoga-50 transition">
            Register Today
          </Link>
        </div>
      </section>
    </div>
  )
}
