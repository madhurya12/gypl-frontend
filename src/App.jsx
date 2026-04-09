import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Admin from './pages/Admin'
import AdminSignin from './pages/AdminSignin'
import AdminSignup from './pages/AdminSignup'
import Login from './pages/Login'
import Signup from './pages/Signup'
import MyEvents from './pages/MyEvents'
import './App.css'

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/my-events" element={<MyEvents />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/signin" element={<AdminSignin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </AdminAuthProvider>
  )
}

export default App
