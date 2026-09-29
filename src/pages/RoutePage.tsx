import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Route as RouteIcon, Footprints } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { routes as defaultRoutes, riskColor } from '../data/demoData'
import type { RouteOption } from '../types'
import { useApp } from '../context/AppContext'
import { MapPanel } from '../components/MapPanel'

export const RoutePage: React.FC = () => {
  const { setRoutes, pushToast } = useApp()
  const [selected, setSelected] = useState<RouteOption>(defaultRoutes[2])
  const [start] = useState('Kochi Railway Stn')
  const [dest] = useState('General Hospital')

  const selectRoute = (r: RouteOption) => {
    setSelected(r)
    setRoutes([r])
    pushToast(`Selected ${r.label}`)
  }

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Flood-Aware Safe Navigation"
          badge="SMART ROUTE"
          subtitle="Route planning that avoids predicted flooded roads, high-risk zones, waterlogged areas and dangerous crossings. Demo data."
        />

        <div className="glass p-4 mb-5 flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-2 flex-1 w-full">
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
                <MapPin size={14} className="text-green-400" />
                <span className="text-sm text-slate-200">{start}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
                <RouteIcon size={14} className="text-red-400" />
                <span className="text-sm text-slate-200">{dest}</span>
              </div>
            </div>
          </div>
          <button className="btn-primary shrink-0" onClick={() => pushToast('Route optimized')}>Compute Routes</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass p-4 lg:col-span-2">
            <div className="text-xs font-semibold text-slate-400 mb-3">Route Comparison</div>
            <MapPanel height="440px" showControls={false} />
          </div>

          <div className="space-y-3">
            {defaultRoutes.map((r) => {
              const color = riskColor(r.floodRisk)
              const active = selected.label === r.label
              return (
                <motion.button
                  key={r.label}
                  onClick={() => selectRoute(r)}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`glass p-4 w-full text-left transition-all border-2 ${active ? 'border-accent-cyan/50 shadow-cyan-900/30' : 'border-transparent hover:border-white/10'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-4 w-4 rounded-full border-2" style={{ borderColor: color }}>
                        <span className={`block h-full w-full rounded-full ${active ? 'scale-90' : 'scale-0'} transition-transform`} style={{ background: color }} />
                      </span>
                      <span className="text-sm font-semibold text-white">{r.label}</span>
                    </div>
                    <span className="pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
                      {r.floodRisk.toUpperCase()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1"><Footprints size={12} />{r.distance} km</div>
                    <div className="flex items-center gap-1"><Clock size={12} />{r.eta} min</div>
                    <div className="flex items-center gap-1"><RouteIcon size={12} />{r.roadCondition}</div>
                  </div>
                </motion.button>
              )
            })}

            <div className="glass p-4">
              <div className="text-xs font-semibold text-slate-400 mb-2">Avoidance Zones</div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /> Predicted flooded roads</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-orange-500" /> High-risk zones</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Waterlogged areas</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Low-lying roads</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
