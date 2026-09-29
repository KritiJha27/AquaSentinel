import React from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toasts } from './components/Toasts'
import { Shell } from './components/Shell'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { MapPage } from './pages/MapPage'
import { GeospatialIntel } from './pages/GeospatialIntel'
import { Predictions } from './pages/Predictions'
import { Inundation } from './pages/Inundation'
import { Glacier } from './pages/Glacier'
import { Cloudburst } from './pages/Cloudburst'
import { Coastal } from './pages/Coastal'
import { Simulator } from './pages/Simulator'
import { RoutePage } from './pages/RoutePage'
import { Alerts } from './pages/Alerts'
import { Infrastructure } from './pages/Infrastructure'
import { Evacuation } from './pages/Evacuation'
import { Analytics } from './pages/Analytics'
import { Command } from './pages/Command'
import { Scientist } from './pages/Scientist'
import { About } from './pages/About'
import type { Role } from './auth/auth'

const Protected: React.FC<{ roles?: Role[]; children: React.ReactNode }> = ({ roles, children }) => {
  const { user, ready } = useAuth()
  if (!ready) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
        <span className="text-xs text-slate-500 uppercase tracking-widest">Initializing secure session…</span>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}

const AppRoutes: React.FC = () => {
  const location = useLocation()
  const { user, ready } = useAuth()

  if (!ready) {
    return (
      <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
        <span className="text-xs text-slate-500 uppercase tracking-widest">Initializing secure session…</span>
      </div>
    )
  }

  const onAuthPage = location.pathname === '/login' || location.pathname === '/register'
  if (onAuthPage && user) return <Navigate to="/" replace />

  if (onAuthPage) {
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
        </Routes>
      </AnimatePresence>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route
          path="*"
          element={
            <Protected>
              <Shell>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/map" element={<MapPage />} />
                  <Route path="/geointel" element={<GeospatialIntel />} />
                  <Route path="/predictions" element={<Predictions />} />
                  <Route path="/inundation" element={<Inundation />} />
                  <Route path="/glacier" element={<Glacier />} />
                  <Route path="/cloudburst" element={<Cloudburst />} />
                  <Route path="/coastal" element={<Coastal />} />
                  <Route path="/simulator" element={<Simulator />} />
                  <Route path="/route" element={<RoutePage />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/infrastructure" element={<Infrastructure />} />
                  <Route path="/evacuation" element={<Evacuation />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/command" element={<Protected roles={['authority', 'scientist', 'admin']}><Command /></Protected>} />
                  <Route path="/scientist" element={<Protected roles={['scientist', 'admin']}><Scientist /></Protected>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Shell>
            </Protected>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Toasts />
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}

export default App