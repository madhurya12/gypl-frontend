import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { participantAPI, competitionAPI, eventAPI } from '../services/api'
import { useAdminAuth } from '../contexts/AdminAuthContext'

export default function Admin() {
  const [participants, setParticipants] = useState([])
  const [filteredParticipants, setFilteredParticipants] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [competitions, setCompetitions] = useState([])

  const { admin, isAuthenticated, logout, loading: authLoading } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/signin')
      return
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, authLoading, navigate])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [participantsResponse, competitionsResponse] = await Promise.all([
        participantAPI.getAll(),
        competitionAPI.getAll()
      ])

      if (participantsResponse.data.success) {
        setParticipants(participantsResponse.data.participants)
        setFilteredParticipants(participantsResponse.data.participants)
        console.log(participantsResponse.data.participants);
        
      }

      if (competitionsResponse.data.success) {
        setCompetitions(competitionsResponse.data.competitions)
      }
    } catch (error) {
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/admin/signin')
  }

  const handleCategoryFilter = async (competitionId) => {
    setSelectedCategory(competitionId)
    setLoading(true)
    try {
      if (competitionId) {
        const response = await participantAPI.getByCompetition(competitionId)
        if (response.data.success) {
          setFilteredParticipants(response.data.participants)
        }
      } else {
        setFilteredParticipants(participants)
      }
    } catch (error) {
      toast.error('Error filtering participants')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    const filtered = participants.filter(p =>
      (selectedCategory === '' || p.competition?._id === selectedCategory) &&
      (p.name.toLowerCase().includes(term.toLowerCase()) ||
        p.email.toLowerCase().includes(term.toLowerCase()) ||
        p.phone.includes(term))
    )
    setFilteredParticipants(filtered)
  }

  const exportToCSV = () => {
    try {
      const headers = ['Name', 'Age', 'Gender', 'Competition', 'Fees', 'Instructor', 'Phone', 'Email', 'Address', 'Registered Date']
      const rows = filteredParticipants.map(p => [
        p.name,
        p.age,
        p.gender,
        p.competition?.name || 'N/A',
        p.competition?.fees || 'N/A',
        p.instructor,
        p.phone,
        p.email,
        p.address,
        new Date(p.createdAt).toLocaleDateString()
      ])

      const csvContent = [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `participants-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('CSV exported successfully!')
    } catch (error) {
      toast.error('Error exporting CSV')
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
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-yoga-700">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {admin?.name} ({admin?.role})</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-yoga-600">{filteredParticipants.length}</div>
            <p className="text-gray-600">Total Selected</p>
          </div>
          {competitions.slice(0, 3).map((competition, index) => (
            <div key={competition._id} className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-yoga-600">
                {filteredParticipants.filter(p => p.competition?._id === competition._id).length}
              </div>
              <p className="text-gray-600">{competition.name}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Competition</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600"
              >
                <option value="">All Competitions</option>
                {competitions.map(competition => (
                  <option key={competition._id} value={competition._id}>
                    {competition.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name, email or phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={exportToCSV}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                📥 Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Participants Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="spinner mx-auto" style={{ borderWidth: '3px', width: '50px', height: '50px' }}></div>
              <p className="text-gray-600 mt-4">Loading participants...</p>
            </div>
          ) : filteredParticipants.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No participants found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yoga-700 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Competition</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Fees</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Instructor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Age</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredParticipants.map((participant, index) => (
                    <tr key={participant._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{participant.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{participant.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{participant.phone}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {participant.competition?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                        ₹{participant.competition?.fees || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{participant.instructor}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{participant.age}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(participant.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admin Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Competition Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Competitions</h3>
            <CompetitionManager competitions={competitions} onUpdate={fetchData} />
          </div>

          {/* Event Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Manage Event Details</h3>
            <EventManager onUpdate={fetchData} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yoga-50 p-4 rounded-lg border border-yoga-200">
            <p className="text-sm text-yoga-700">
              <strong>Faceoff League:</strong> ₹2100 | 5 Asanas Performance
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700">
              <strong>Talent Showcase:</strong> ₹600 | Dance, Music, Art & More
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Competition Manager Component
function CompetitionManager({ competitions, onUpdate }) {
  const [showForm, setShowForm] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    fees: '',
    ageCategory: 'All Ages',
    performance: '',
    categories: '',
    prizes: '',
    benefits: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        fees: Number(formData.fees),
        categories: formData.categories.split(',').map(c => c.trim()).filter(c => c),
        prizes: formData.prizes.split(',').map(p => p.trim()).filter(p => p),
        benefits: formData.benefits.split(',').map(b => b.trim()).filter(b => b)
      }

      if (editingCompetition) {
        await competitionAPI.update(editingCompetition._id, data)
        toast.success('Competition updated successfully')
      } else {
        await competitionAPI.create(data)
        toast.success('Competition created successfully')
      }

      setShowForm(false)
      setEditingCompetition(null)
      resetForm()
      onUpdate()
    } catch (error) {
      toast.error('Error saving competition')
    }
  }

  const handleEdit = (competition) => {
    setEditingCompetition(competition)
    setFormData({
      name: competition.name,
      fees: competition.fees.toString(),
      ageCategory: competition.ageCategory,
      performance: competition.performance,
      categories: competition.categories.join(', '),
      prizes: competition.prizes.join(', '),
      benefits: competition.benefits.join(', ')
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this competition?')) {
      try {
        await competitionAPI.delete(id)
        toast.success('Competition deleted successfully')
        onUpdate()
      } catch (error) {
        toast.error('Error deleting competition')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      fees: '',
      ageCategory: 'All Ages',
      performance: '',
      categories: '',
      prizes: '',
      benefits: ''
    })
  }

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 bg-yoga-600 hover:bg-yoga-700 text-white font-bold py-2 px-4 rounded"
      >
        {showForm ? 'Cancel' : '+ Add Competition'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fees</label>
            <input
              type="number"
              value={formData.fees}
              onChange={(e) => setFormData({...formData, fees: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Performance</label>
            <input
              type="text"
              value={formData.performance}
              onChange={(e) => setFormData({...formData, performance: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categories (comma separated)</label>
            <input
              type="text"
              value={formData.categories}
              onChange={(e) => setFormData({...formData, categories: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Music, Dance, Art..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prizes (comma separated)</label>
            <input
              type="text"
              value={formData.prizes}
              onChange={(e) => setFormData({...formData, prizes: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Benefits (comma separated)</label>
            <input
              type="text"
              value={formData.benefits}
              onChange={(e) => setFormData({...formData, benefits: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {editingCompetition ? 'Update' : 'Create'} Competition
          </button>
        </form>
      )}

      <div className="space-y-2">
        {competitions.map(competition => (
          <div key={competition._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <span className="font-medium">{competition.name}</span>
              <span className="text-sm text-gray-600 ml-2">₹{competition.fees}</span>
            </div>
            <div>
              <button
                onClick={() => handleEdit(competition)}
                className="text-blue-600 hover:text-blue-800 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(competition._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Event Manager Component
function EventManager({ onUpdate }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    presenter: '',
    date: '',
    venue: '',
    contact: '',
    description: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [])

  const fetchEvent = async () => {
    try {
      const response = await eventAPI.get()
      if (response.data.success) {
        const eventData = response.data.event
        setEvent(eventData)
        setFormData({
          title: eventData.title,
          organizer: eventData.organizer,
          presenter: eventData.presenter,
          date: eventData.date,
          venue: eventData.venue,
          contact: eventData.contact,
          description: eventData.description
        })
      }
    } catch (error) {
      toast.error('Error fetching event details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await eventAPI.update(formData)
      toast.success('Event details updated successfully')
      fetchEvent()
    } catch (error) {
      toast.error('Error updating event details')
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Organizer</label>
        <input
          type="text"
          value={formData.organizer}
          onChange={(e) => setFormData({...formData, organizer: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Presenter</label>
        <input
          type="text"
          value={formData.presenter}
          onChange={(e) => setFormData({...formData, presenter: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Date</label>
        <input
          type="text"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Venue</label>
        <input
          type="text"
          value={formData.venue}
          onChange={(e) => setFormData({...formData, venue: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Contact</label>
        <input
          type="text"
          value={formData.contact}
          onChange={(e) => setFormData({...formData, contact: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows="3"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Update Event Details
      </button>
    </form>
  )
}
