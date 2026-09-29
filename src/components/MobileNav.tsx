import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Map, Bell, FlaskConical, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'

const items = [
  { label: 'Home', icon: LayoutDashboard, path: '/' },
  { label: 'Map', icon: Map, path: '/map' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Simulate', icon: FlaskConical, path: '/simulator' },
  { label: 'Command', icon: Shield, path: '/command' },
]

export const MobileNav: React.FC = () => {
  const location = useLocation()
  const { alerts } = useApp()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-navy-900/95 backdrop-blur-xl border-t border-white/10">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 py-3 ${active ? 'text-accent-cyan' : 'text-slate-400'}`}
            >
              {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-accent-cyan" />}
              <span className="relative">
                <item.icon size={19} />
                {item.path === '/alerts' && alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1.5 h-3.5 w-3.5 rounded-full bg-red-500 text-[8px] flex items-center justify-center font-bold text-white">{alerts.length}</span>
                )}
              </span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
