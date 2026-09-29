import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MapPin, Clock, Home, Navigation, AlertTriangle } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { evacuationZones, riskColor } from '../data/demoData'
import type { EvacuationZone } from '../types'
import { MapPanel } from '../components/MapPanel'

export const Evacuation: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<EvacuationZone | null>(null)
  const sorted = [...evacuationZones].sort((a, b) => a.priority - b.priority)

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="AI Evacuation Priority Engine"
          badge="DECISION SUPPORT"
          subtitle="AI-generated priority ranking based on flood severity, population exposure, vulnerability, road accessibility and water depth. AI decision support — final evacuation decisions remain with authorized authorities."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            {sorted.map((zone, i) => {
              const color = riskColor(zone.severity)
              const isActive = selectedZone?.id === zone.id
              return (
                <motion.div
                  key={zone.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`glass p-5 cursor-pointer transition-all border-l-4 ${isActive ? 'border-l-4 -translate-y-0.5' : 'border-l-4'}`}
                  style={{ borderLeftColor: color }}
                  onClick={() => setSelectedZone(isActive ? null : zone)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-extrabold font-mono" style={{ color, background: `${color}15` }}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{zone.name}</div>
                        <div className="text-[10px] text-slate-500">Priority Zone {String(i + 1).padStart(2, '0')}</div>
                      </div>
                    </div>
                    <span className="pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
                      {zone.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="rounded-lg bg-white/[0.03] p-2.5">
                      <div className="text-[10px] text-slate-500 flex items-center gap-1"><Users size={10} /> Population</div>
                      <div className="text-sm font-bold text-slate-200">{zone.population.toLocaleString()}</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-2.5">
                      <div className="text-[10px] text-slate-500 flex items-center gap-1"><AlertTriangle size={10} /> Depth</div>
                      <div className="text-sm font-bold" style={{ color }}>{zone.waterDepth} m</div>
                    </div>
                    <div className="rounded-lg bg-white/[0.03] p-2.5">
                      <div className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10} /> Evac. Time</div>
                      <div className="text-sm font-bold text-slate-200">{zone.evacuationTime}</div>
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2.5"
                    >
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1"><Home size={10} /> Designated Shelters</div>
                        <div className="flex flex-wrap gap-1.5">
                          {zone.shelters.map((s) => (
                            <span key={s} className="text-[10px] px-2 py-1 rounded-md bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 mb-1 flex items-center gap-1"><Navigation size={10} /> Evacuation Routes</div>
                        <div className="flex flex-wrap gap-1.5">
                          {zone.roads.map((r) => (
                            <span key={r} className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-400/20">{r}</span>
                          ))}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
                        <strong>AI Recommendation:</strong> Prioritize evacuation of {zone.name}. Estimated {zone.evacuationTime} for full clearance.
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="glass p-5">
            <div className="text-xs font-semibold text-slate-400 mb-3">Evacuation Zones Map</div>
            <MapPanel height="520px" showControls={false} />
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                Priority 1 — Immediate evacuation
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="h-3 w-3 rounded-full bg-orange-500" />
                Priority 2 — Urgent evacuation
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                Priority 3 — Prepare for evacuation
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="h-3 w-3 rounded-full bg-green-500" />
                Priority 4 — Monitor and standby
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] text-slate-500">
              AI decision-support output based on simulated flood modelling. Not an autonomous authority decision.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
