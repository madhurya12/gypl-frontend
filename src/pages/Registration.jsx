import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { participantAPI, competitionAPI } from '../services/api'

export default function Registration() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [competitions, setCompetitions] = useState([])
  const [competitionsLoading, setCompetitionsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    competition: '',
    instructor: '',
    phone: '',
    email: '',
    address: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await competitionAPI.getAll()
        if (response.data.success) {
          setCompetitions(response.data.competitions)
          
          // Check for competition parameter in URL and pre-select it
          const competitionId = searchParams.get('competition')
          if (competitionId && response.data.competitions.some(comp => comp._id === competitionId)) {
            setFormData(prev => ({
              ...prev,
              competition: competitionId
            }))
          }
        }
      } catch (error) {
        toast.error('Error loading competitions')
      } finally {
        setCompetitionsLoading(false)
      }
    }
    fetchCompetitions()
  }, [searchParams])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.age) newErrors.age = 'Age is required'
    if (formData.age < 5 || formData.age > 100) newErrors.age = 'Age must be between 5 and 100'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.competition) newErrors.competition = 'Competition selection is required'
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor name is required'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits'
    if (!formData.email) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.address.trim()) newErrors.address = 'Address is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fill all fields correctly')
      return
    }

    setLoading(true)
    try {
      const response = await participantAPI.register(formData)

      if (response.data.success) {
        toast.success('Registration successful! 🎉')
        setFormData({
          name: '',
          age: '',
          gender: '',
          competition: '',
          instructor: '',
          phone: '',
          email: '',
          address: ''
        })
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yoga-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-yoga-700 mb-2">Registration Form</h1>
          <p className="text-gray-600 mb-8">Join Grand Yoga Premier League 2026</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Age and Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 ${
                    errors.age ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 ${
                    errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
            </div>

            {/* Competition */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Competition *</label>
              <select
                name="competition"
                value={formData.competition}
                onChange={handleChange}
                disabled={competitionsLoading}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 ${
                  errors.competition ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">
                  {competitionsLoading ? 'Loading competitions...' : 'Select Competition'}
                </option>
                {competitions.map(competition => (
                  <option key={competition._id} value={competition._id}>
                    {competition.name} (₹{competition.fees})
                  </option>
                ))}
              </select>
              {errors.competition && <p className="text-red-500 text-sm mt-1">{errors.competition}</p>}
            </div>

            {/* Instructor Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Instructor Name *</label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                placeholder="Your instructor's name"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 ${
                  errors.instructor ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.instructor && <p className="text-red-500 text-sm mt-1">{errors.instructor}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows="4"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yoga-600 resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              ></textarea>
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-yoga-600 hover:bg-yoga-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading && <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>}
                {loading ? 'Registering...' : 'Register Now'}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">* All fields are required</p>
          </form>
        </div>
      </div>
    </div>
  )
}
