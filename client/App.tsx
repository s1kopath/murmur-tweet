import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { Navbar } from './components/Navbar'
import { NotificationContainer } from './components/NotificationContainer'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { Timeline } from './components/Timeline'
import { Profile } from './components/Profile'
import { MurmurDetail } from './components/MurmurDetail'
import { DiscoverUsers } from './components/DiscoverUsers'
import { NotFound } from './components/NotFound'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Navbar />
          <NotificationContainer />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/discover" element={<DiscoverUsers />} />
            <Route path="/users/:id" element={<Profile />} />
            <Route path="/murmurs/:id" element={<MurmurDetail />} />
            <Route path="/" element={<Navigate to="/timeline" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
