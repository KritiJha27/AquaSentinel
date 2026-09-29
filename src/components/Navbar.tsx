import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, Sparkles, Waves, FlaskConical, Route as RouteIcon,
  Bell, BarChart3, Info, MapPin, ChevronDown, Shield, Menu, X, Building2, Siren,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { locations } from '../data/demoData'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Live Map', icon: Map, path: '/map' },
  { label: 'Predictions', icon: Sparkles, path: '/predictions' },
  { label: 'Inundation', icon: Waves, path: '/inundation' },
  { label: 'Simulator', icon: FlaskConical, path: '/simulator' },
  { label: 'Safe Route', icon: RouteIcon, path: '/route' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Infrastructure', icon: Building2, path: '/infrastructure' },
  { label: 'Evacuation', icon: Siren, path: '/evacuation' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Command', icon: Shield, path: '/command' },
  { label: 'About', icon: Info, path: '/about' },
]

export const Navbar: React.FC = () => {
  const location = useLocation()
  const { selectedLocation, setSelectedLocation, alerts } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-navy-950/85 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center shadow-lg shadow-cyan-900/40 group-hover:shadow-cyan-800/50 transition-all">
                <Shield size={20} className="text-navy-950" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-base tracking-tight text-white">AquaSentinel <span className="text-accent-cyan">AI</span></div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500">Predict Rain. Map Water. Trigger Action.</div>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5">
              {navItems.map((item) => {
                const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${active ? 'text-accent-cyan' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    {active && (
                      <motion.div layoutId="nav-active" className="absolute inset-0 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                    )}
                    <item.icon size={14} />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setLocOpen((o) => !o)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-accent-cyan/40 text-slate-200 text-xs font-medium transition-colors"
                >
                  <MapPin size={13} className="text-accent-cyan" />
                  {selectedLocation}
                  <ChevronDown size={12} className="text-slate-500" />
                </button>
                <AnimatePresence>
                  {locOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-40 glass p-1.5 z-50"
                    >
                      {locations.map((l) => (
                        <button
                          key={l.name}
                          onClick={() => { setSelectedLocation(l.name); setLocOpen(false) }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedLocation === l.name ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-slate-400 hover:bg-white/5'}`}
                        >
                          {l.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                AI SYSTEM OPERATIONAL
              </button>

              <Link to="/alerts" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white">
                <Bell size={17} />
                {alerts.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] flex items-center justify-center font-bold text-white">
                    {alerts.length}
                  </span>
                )}
              </Link>
            </div>

            <button className="xl:hidden p-2 rounded-lg hover:bg-white/5 text-white" onClick={() => setMobileOpen((o) => !o)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-navy-900/95 backdrop-blur-xl border-b border-white/5 p-3 xl:hidden max-h-[70vh] overflow-y-auto"
          >
            {navItems.map((item) => {
              const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${active ? 'text-accent-cyan bg-accent-cyan/10' : 'text-slate-300 hover:bg-white/5'}`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}