import React from 'react'
import { motion } from 'framer-motion'
import type { Alert } from '../types'
import { severityColor } from '../data/demoData'
import { Bell, MapPin, Clock, ShieldAlert, CheckCircle2, Route as RouteIcon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'

interface AlertCardProps {
  alert: Alert
  showActions?: boolean
  onViewWhy?: (alert: Alert) => void
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, showActions = true, onViewWhy }) => {
  const { acknowledgeAlert } = useApp()
  const color = severityColor(alert.severity)
  const shielded = ['warning', 'emergency'].includes(alert.severity)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass p-4 relative overflow-hidden border-l-4 ${shielded ? 'animate-pulse' : ''}`}
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: `${color}1a`, color }}>
            <Bell size={18} />
          </span>
          <div>
            <div className="font-bold text-sm text-white uppercase tracking-wide" style={{ color }}>{alert.title}</div>
            <div className="text-[11px] text-slate-400">{alert.hazard}</div>
          </div>
        </div>
        <span className="pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
          {alert.severity.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-xs text-slate-300">
        <div className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-500" /> {alert.location}</div>
        <div className="flex items-center gap-1.5"><Clock size={13} className="text-slate-500" /> {alert.expectedTime}</div>
        <div className="flex items-center gap-1.5"><ShieldAlert size={13} className="text-slate-500" /> Confidence: <span className="text-accent-cyan font-semibold">{alert.confidence}%</span></div>
      </div>

      {showActions && (
        <>
          <ul className="mt-3 space-y-1.5">
            {alert.recommendedAction.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-accent-cyan shrink-0" />
                {a}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onViewWhy && onViewWhy(alert)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 transition-colors"
            >
              Why This Warning?
            </button>
            <button
              onClick={() => acknowledgeAlert(alert.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20 transition-colors"
            >
              <CheckCircle2 size={13} /> Acknowledge Alert
            </button>
            <Link
              to="/route"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-slate-300 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors"
            >
              <RouteIcon size={13} /> View Safe Route
            </Link>
          </div>
        </>
      )}
    </motion.div>
  )
}
