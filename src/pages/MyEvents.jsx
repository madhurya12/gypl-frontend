import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { userEventAPI } from '../services/api'
import { AuthContext } from '../contexts/AuthContext'

export default function MyEvents() {
  const { user, token, isAuthenticated, loading: authLoading } = useContext(AuthContext)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!isAuthenticated || !token) {
      setLoading(false)
      return
    }

    fetchMyEvents()
  }, [isAuthenticated, token, authLoading])

  const fetchMyEvents = async () => {
    try {
      setLoading(true)
      const response = await userEventAPI.getMyEvents()

      if (response.data.success) {
        setEvents(response.data.events || [])
      } else {
        toast.error(response.data.message || 'Error loading events')
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Error fetching your events'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleUnregister = async (eventId) => {
    if (!window.confirm('Are you sure you want to unregister from this competition?')) {
      return
    }

    try {
      const response = await userEventAPI.unregisterFromCompetition(eventId)

      if (response.data.success) {
        toast.success('Successfully unregistered!')
        setEvents(events.filter(event => event._id !== eventId))
      } else {
        toast.error(response.data.message || 'Error unregistering')
      }
    } catch (error) {
      console.error('Error unregistering:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Error unregistering from event'
      toast.error(errorMsg)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto" style={{ borderWidth: '3px', width: '50px', height: '50px' }}></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Please log in</h1>
          <p className="text-gray-600 mb-8">You need to be logged in to view your registered events.</p>
          <Link
            to="/login"
            className="inline-block bg-yoga-600 hover:bg-yoga-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto" style={{ borderWidth: '3px', width: '50px', height: '50px' }}></div>
          <p className="text-gray-600 mt-4">Loading your events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yoga-700 mb-2">My Registered Events</h1>
          <p className="text-gray-600">
            Hello, <span className="font-semibold">{user?.name}</span>! You have registered for {events.length} competition{events.length !== 1 ? 's' : ''}.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Registrations Yet</h2>
            <p className="text-gray-600 mb-8">You haven't registered for any competitions yet.</p>
            <Link
              to="/"
              className="inline-block bg-yoga-600 hover:bg-yoga-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Browse Competitions
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition">
                <div className="bg-gradient-to-r from-yoga-600 to-yoga-700 text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{event.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">₹{event.fees}</span>
                    <span className="bg-white text-yoga-600 px-3 py-1 rounded-full text-sm font-semibold">
                      Registered
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Performance</h4>
                    <p className="text-gray-600">{event.performance}</p>
                  </div>

                  {event.categories && event.categories.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Categories</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {event.categories.map((category, idx) => (
                          <li key={idx}>• {category}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {event.prizes && event.prizes.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">🏆 Prizes</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {event.prizes.map((prize, idx) => (
                          <li key={idx}>• {prize}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => handleUnregister(event._id)}
                    className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
                  >
                    Unregister
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
