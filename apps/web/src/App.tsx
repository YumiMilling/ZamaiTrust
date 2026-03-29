import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './core/auth'
import { KioskDelivery } from './kiosk/KioskDelivery'
import { KioskLogin } from './kiosk/KioskLogin'
import { AdminContracts } from './modules/contracts/AdminContracts'
import { Proposals } from './modules/governance/Proposals'
import { WaterfallView } from './modules/treasury/WaterfallView'
import { Dashboard } from './dashboard/Dashboard'
import { type ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-400">Loading...</div>
  if (!user) return <Navigate to="/login" />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Kiosk mode — aggregation point */}
      <Route path="/kiosk" element={<KioskLogin />} />
      <Route path="/kiosk/delivery" element={<ProtectedRoute><KioskDelivery /></ProtectedRoute>} />

      {/* Admin / processor / dashboard */}
      <Route path="/login" element={<KioskLogin />} />
      <Route path="/contracts" element={<ProtectedRoute><AdminContracts /></ProtectedRoute>} />
      <Route path="/governance" element={<ProtectedRoute><Proposals /></ProtectedRoute>} />
      <Route path="/waterfall" element={<ProtectedRoute><WaterfallView /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
