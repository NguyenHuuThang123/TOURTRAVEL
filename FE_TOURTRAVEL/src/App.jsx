import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import TourList from './pages/TourList'
import TourDetail from './pages/TourDetail'
import Checkout from './pages/Checkout'
import Payment from './pages/Payment'
import VnpayReturn from './pages/VnpayReturn'
import CheckIn from './pages/CheckIn'
import AdminDashboard from './pages/AdminDashboard'
import GuideDashboard from './pages/GuideDashboard'
import Account from './pages/Account'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
import ChatWidget from './components/ChatWidget'
import { useAuth } from './context/AuthContext'
import './App.css'

function ScrollToTop() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.search])

  return null
}

function App() {
  const { user } = useAuth()

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/vnpay-return" element={<VnpayReturn />} />
        <Route path="/check-in" element={<CheckIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<ProtectedRoute allowedRoles={['user', 'admin']}><Account /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/guide" element={<ProtectedRoute allowedRoles={['guide']}><GuideDashboard /></ProtectedRoute>} />
      </Routes>
      {!['admin', 'guide'].includes(user?.role) && <ChatWidget />}
    </Router>
  )
}

export default App
