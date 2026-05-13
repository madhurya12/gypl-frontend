import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
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
          <div className="min-h-screen flex flex-col bg-surface-50">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route 
                  path="/register" 
                  element={
                    <PrivateRoute>
                      <Registration />
                    </PrivateRoute>
                  } 
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route 
                  path="/my-events" 
                  element={
                    <PrivateRoute>
                      <MyEvents />
                    </PrivateRoute>
                  } 
                />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/signin" element={<AdminSignin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />
              </Routes>
            </main>
            <Footer />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: '#1c1917',
                  color: '#fafaf9',
                  border: '1px solid #292524',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.08)',
                },
                success: { iconTheme: { primary: '#14b8a6', secondary: '#fafaf9' } },
                error: { iconTheme: { primary: '#f43f5e', secondary: '#fafaf9' } },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </AdminAuthProvider>
  )
}

export default App
