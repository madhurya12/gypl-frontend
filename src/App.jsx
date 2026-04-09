import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Registration from './pages/Registration'
import Admin from './pages/Admin'
import AdminSignin from './pages/AdminSignin'
import AdminSignup from './pages/AdminSignup'
import './App.css'

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/signin" element={<AdminSignin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AdminAuthProvider>
  )
}

export default App
