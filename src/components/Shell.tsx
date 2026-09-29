import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, Sparkles, Waves, Mountain, CloudLightning, Anchor,
  BarChart3, FlaskConical, Route as RouteIcon, Bell, Building2, Siren, Shield,
  Info, Microscope, LogOut, Menu, X, MapPin, ChevronDown, ShieldCheck, Search, Globe2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { locations } from '../data/demoData'
import { roleLabels, Role } from '../auth/auth'
import { SOSModal } from './SOSModal'

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
  roles?: Role[]
}

const navGroups: { title: string; items: NavItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    ],
  },
  {
    title: 'Monitoring',
    items: [
      { label: 'Live Map', icon: Map, path: '/map' },
      { label: 'Geospatial Intel', icon: Globe2, path: '/geointel' },
      { label: 'Rainfall Prediction', icon: Sparkles, path: '/predictions' },
      { label: 'Inundation', icon: Waves, path: '/inundation' },
      { label: 'Glacier & GLOF', icon: Mountain, path: '/glacier' },
      { label: 'Cloudburst', icon: CloudLightning, path: '/cloudburst' },
      { label: 'Coastal & Ocean', icon: Anchor, path: '/coastal' },
      { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    ],
  },
  {
    title: 'Response',
    items: [
      { label: 'What-If Simulator', icon: FlaskConical, path: '/simulator' },
      { label: 'Safe Route', icon: RouteIcon, path: '/route' },
      { label: 'Alerts', icon: Bell, path: '/alerts' },
      { label: 'Infrastructure', icon: Building2, path: '/infrastructure' },
      { label: 'Evacuation', icon: Siren, path: '/evacuation' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Command Center', icon: Shield, path: '/command', roles: ['authority', 'scientist', 'admin'] },
      { label: 'Scientist / Admin', icon: Microscope, path: '/scientist', roles: ['scientist', 'admin'] },
      { label: 'About', icon: Info, path: '/about' },
    ],
  },
]

const SYSTEM_ROUTES = ['/command', '/scientist']

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, can } = useAuth()
  const { selectedLocation, setSelectedLocation, alerts } = useApp()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [sosOpen, setSosOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSidebarOpen(false)
    setLocOpen(false)
    setUserOpen(false)
  }, [location.pathname, location.search])

  const filteredNav = navGroups
    .map((group) => ({
      title: group.title,
      items: group.items.filter((item) => !item.roles || can(...(item.roles as Role[]))),
    }))
    .filter((g) => g.items.length > 0)

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const allNavItems = navGroups.flatMap((g) => g.items)
  const searchResults = search.trim()
    ? allNavItems
        .filter((i) => !i.roles || can(...(i.roles as Role[])))
        .filter((i) => i.label.toLowerCase().includes(search.toLowerCase()))
    : []

  const isSystem = SYSTEM_ROUTES.some((r) => location.pathname.startsWith(r))

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-4 flex items-center gap-2.5">
        <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center shadow-lg shadow-cyan-900/40">
          <ShieldCheck size={20} className="text-navy-950" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="font-bold text-sm tracking-tight text-white">AquaSentinel <span className="text-accent-cyan">AI</span></div>
          <div className="text-[8px] uppercase tracking-widest text-slate-500">Command Dashboard</div>
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400">
          <Search size={13} className="shrink-0 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search modules…"
            className="bg-transparent w-full focus:outline-none placeholder:text-slate-600"
          />
        </div>
        <AnimatePresence>
          {search.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 rounded-lg border border-white/10 bg-navy-900 p-1"
            >
              {searchResults.length === 0 ? (
                <div className="px-3 py-2 text-[11px] text-slate-500">No modules match “{search}”</div>
              ) : (
                searchResults.map((r) => (
                  <Link key={r.path} to={r.path} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white">
                    <r.icon size={13} className="text-accent-cyan" /> {r.label}
                  </Link>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {filteredNav.map((group) => (
          <div key={group.title} className="mb-4">
            <div className="px-2 mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">{group.title}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${active ? 'text-accent-cyan bg-accent-cyan/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
                  >
                    {active && (
                      <motion.span layoutId="side-active" className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-accent-cyan" transition={{ type: 'spring', stiffness: 500, damping: 34 }} />
                    )}
                    <item.icon size={15} className={active ? 'text-accent-cyan' : 'text-slate-500'} />
                    <span>{item.label}</span>
                    {item.path === '/alerts' && alerts.length > 0 && (
                      <span className="ml-auto h-4 min-w-4 px-1 rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">{alerts.length}</span>
                    )}
                    {item.path === '/scientist' && can('scientist', 'admin') && (
                      <span className="ml-auto text-[8px] font-bold text-amber-400/80 tracking-wider">ADMIN</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-navy-950 text-sm font-black shrink-0">
              {user?.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
              <div className="text-[9px] text-accent-cyan/80 truncate">{user ? roleLabels[user.role] : ''}</div>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login', { replace: true }) }}
            className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-slate-400 hover:text-red-300 hover:border-red-400/30 hover:bg-red-500/5 transition-colors"
          >
            <LogOut size={13} /> Log out
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-navy-950">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 hidden lg:block border-r border-white/5 bg-navy-900/60 backdrop-blur-xl">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-navy-900 lg:hidden"
            >
              <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-3 p-2 text-slate-400 hover:text-white" aria-label="Close menu">
                <X size={18} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <header className={`fixed top-0 right-0 left-0 lg:left-64 z-30 transition-all duration-300 bg-navy-950/85 backdrop-blur-xl border-b border-white/5`}>
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-white" aria-label="Open menu">
              <Menu size={19} />
            </button>
            <Link to="/" className="flex items-center gap-2.5 lg:hidden">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                <ShieldCheck size={18} className="text-navy-950" strokeWidth={2.5} />
              </div>
              <div className="leading-tight">
                <div className="font-bold text-sm text-white">AquaSentinel <span className="text-accent-cyan">AI</span></div>
              </div>
            </Link>
            <div className="hidden lg:flex items-center text-xs text-slate-400 ml-1">
              {isSystem && <span className="pill text-amber-300 border-amber-400/30 bg-amber-400/10">RESTRICTED · AUTHORIZED ACCESS</span>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              AI SYSTEM OPERATIONAL
            </button>

            <div className="hidden md:block relative">
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
                    className="absolute right-0 mt-2 w-44 glass p-1.5 z-50"
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

            <button
              onClick={() => setSosOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-300 bg-red-500/15 border border-red-500/40 hover:bg-red-500/25 transition-colors"
            >
              <Siren size={14} /> SOS
            </button>

            <Link to="/alerts" className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-300 hover:text-white" aria-label="Alerts">
              <Bell size={17} />
              {alerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[9px] flex items-center justify-center font-bold text-white">
                  {alerts.length}
                </span>
              )}
            </Link>

            <div className="relative">
              <button onClick={() => setUserOpen((o) => !o)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-colors" aria-label="Account menu">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-navy-950 text-xs font-black">
                  {user?.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 glass p-2 z-50"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1.5">
                      <div className="text-sm font-semibold text-white">{user?.name}</div>
                      <div className="text-[10px] text-accent-cyan">{user?.email}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-accent-cyan/10 border border-accent-cyan/30 text-[9px] font-bold uppercase tracking-wider text-accent-cyan">
                        {user?.role}
                      </span>
                    </div>
                    <button
                      onClick={() => { logout(); navigate('/login', { replace: true }) }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="lg:pl-64 pt-14 pb-16 lg:pb-8 min-h-screen">
        {children}
      </main>

      <SOSModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  )
}