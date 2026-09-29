import React, { createContext, useContext, useState } from 'react'
import type { RouteOption, Alert, SimulationResult } from '../types'
import { routes as defaultRoutes, alerts as defaultAlerts } from '../data/demoData'

interface AppState {
  selectedLocation: string
  setSelectedLocation: (l: string) => void
  routes: RouteOption[]
  setRoutes: (r: RouteOption[]) => void
  alerts: Alert[]
  simulationResult: SimulationResult | null
  setSimulationResult: (r: SimulationResult | null) => void
  acknowledgeAlert: (id: string) => void
  toasts: string[]
  pushToast: (msg: string) => void
}

const AppContext = createContext<AppState | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState('Kochi')
  const [routes, setRoutes] = useState<RouteOption[]>(defaultRoutes)
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts)
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null)
  const [toasts, setToasts] = useState<string[]>([])

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    pushToast('Alert acknowledged')
  }

  const pushToast = (msg: string) => {
    setToasts((prev) => [...prev, msg])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t !== msg))
    }, 3500)
  }

  return (
    <AppContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        routes,
        setRoutes,
        alerts,
        simulationResult,
        setSimulationResult,
        acknowledgeAlert,
        toasts,
        pushToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = (): AppState => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
