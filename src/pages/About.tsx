import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudRain, Activity, ShieldCheck, Database, BrainCircuit, Map as MapIcon, TrendingUp } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { historicalEvents } from '../data/demoData'
import { BarComparisonChart } from '../components/Charts'
import type { HistoricalEvent } from '../types'

const stack = {
  frontend: ['React', 'Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Lucide Icons', 'Leaflet'],
  mapping: ['Leaflet', 'GeoJSON', 'Raster / Vector Overlays'],
  backend: ['Python', 'FastAPI'],
  ml: ['XGBoost', 'Random Forest', 'LSTM', 'ConvLSTM', 'CNN-Geospatial', 'Hybrid Ensemble'],
  data: ['Pandas', 'NumPy', 'GeoPandas', 'Rasterio', 'Scikit-learn'],
  db: ['PostgreSQL', 'PostGIS'],
}

const problemPoints = ['Casualties', 'Road disruption', 'Infrastructure damage', 'Delayed emergency response']

const currentEvent = historicalEvents.find((h) => h.year === 2026)!

export const About: React.FC = () => {
  const [compareWith, setCompareWith] = useState<HistoricalEvent | null>(null)
  const historical = historicalEvents.filter((h) => h.id !== currentEvent.id)

  const similarity = (ev: HistoricalEvent) => {
    const dR = Math.abs(ev.rainfall - currentEvent.rainfall) / 30
    const dD = Math.abs(ev.duration - currentEvent.duration) / 24
    const dE = Math.abs(ev.floodExtent - currentEvent.floodExtent) / 2400
    const dW = Math.abs(ev.waterDepth - currentEvent.waterDepth) / 1.2
    const score = Math.max(0, Math.round(100 - ((dR + dD + dE + dW) / 4) * 45))
    return Math.min(99, score)
  }

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="About AquaSentinel AI"
          badge="THE STORY"
          subtitle="AI/ML-Based Integrated Heavy Rainfall Early Warning and Inundation Prediction System using Satellite, Radar, observational Weather and NWP Model Data."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4 text-red-400"><CloudRain size={18} /><span className="font-bold text-white">The Problem</span></div>
            <p className="text-sm text-slate-400 mb-4">Heavy rainfall can quickly become urban flooding and cause:</p>
            <div className="grid grid-cols-2 gap-2">
              {problemPoints.map((p) => (
                <div key={p} className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium px-3 py-2.5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />{p}
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-6">
            <div className="flex items-center gap-2 mb-4 text-accent-cyan"><ShieldCheck size={18} /><span className="font-bold text-white">The Solution</span></div>
            <p className="text-sm text-slate-400 mb-4">AquaSentinel AI combines</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Satellite', 'Radar', 'Weather Stations', 'NWP', 'Terrain', 'Drainage', 'Historical Data'].map((s) => (
                <span key={s} className="text-[11px] px-2.5 py-1.5 rounded-lg bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan">{s}</span>
              ))}
            </div>
            <p className="text-sm text-slate-400">with AI/ML to provide</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Predict', 'Map', 'Warn', 'Navigate', 'Respond'].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent-cyan/20 to-accent-blue/20 border border-white/10 text-white text-xs font-bold">{s}</span>
                  {i < 4 && <span className="text-accent-cyan/60">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SectionTitle title="Flood Event Memory" badge="HISTORICAL COMPARISON" subtitle="Compare current conditions with historical flood events across rainfall, duration, extent, depth and recovery." />
          <div className="glass p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <BarComparisonChart
                  data={historicalEvents.map((h) => ({ model: h.name, value: h.rainfall }))}
                  height={260}
                />
                <p className="text-[11px] text-slate-500 mt-2">Rainfall (mm) by event</p>

                {compareWith && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-xl border border-accent-cyan/30 bg-accent-cyan/5 p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp size={15} className="text-accent-cyan" />
                      <span className="text-xs font-semibold text-white">Current vs {compareWith.name} — Similarity Index</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { l: 'Rainfall', cur: `${currentEvent.rainfall}`, hist: `${compareWith.rainfall}`, u: 'mm' },
                        { l: 'Duration', cur: `${currentEvent.duration}`, hist: `${compareWith.duration}`, u: 'h' },
                        { l: 'Flood Extent', cur: currentEvent.floodExtent.toLocaleString(), hist: compareWith.floodExtent.toLocaleString(), u: 'ha' },
                        { l: 'Water Depth', cur: `${currentEvent.waterDepth}`, hist: `${compareWith.waterDepth}`, u: 'm' },
                      ].map((cmp) => (
                        <div key={cmp.l} className="rounded-lg bg-white/[0.03] p-2.5">
                          <div className="text-[10px] text-slate-500">{cmp.l}</div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-accent-cyan font-semibold">Cur: {cmp.cur}{cmp.u}</span>
                            <span className="text-slate-400">Hist: {cmp.hist}{cmp.u}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[11px] text-slate-400">
                      <strong className="text-accent-cyan">AI Insight:</strong> {currentEvent.rainfall >= compareWith.rainfall
                        ? `Current rainfall (${currentEvent.rainfall} mm) ${currentEvent.rainfall > compareWith.rainfall ? 'exceeds' : 'matches'} ${compareWith.name}. High-impact flood potential — monitor closely.`
                        : `Current rainfall (${currentEvent.rainfall} mm) is below ${compareWith.name} levels, but water depth and extent remain significant.`}
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2.5">
                {historical.map((h) => {
                  const sim = similarity(h)
                  const selected = compareWith?.id === h.id
                  return (
                    <motion.div
                      key={h.id}
                      initial={{ opacity: 0, y: 6 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className={`rounded-xl p-3 border cursor-pointer transition-all ${selected ? 'border-accent-cyan/40 bg-accent-cyan/5' : 'border-white/5 bg-white/[0.03] hover:border-white/20'}`}
                      onClick={() => setCompareWith(h)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{h.name}</span>
                        {selected && <span className="pill text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10">COMPARING</span>}
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-[11px] text-slate-400">
                        <span>Rain <strong className="text-slate-100">{h.rainfall}</strong></span>
                        <span>Dur <strong className="text-slate-100">{h.duration}h</strong></span>
                        <span>Area <strong className="text-slate-100">{h.floodExtent.toLocaleString()}</strong></span>
                        <span>Depth <strong className="text-slate-100">{h.waterDepth}m</strong></span>
                        <span>Recov <strong className="text-slate-100">{h.recoveryTime}d</strong></span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: sim >= 75 ? '#ef4444' : sim >= 55 ? '#f97316' : '#22d3ee' }}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${sim}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9 }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{sim}% match</span>
                      </div>
                    </motion.div>
                  )
                })}
                <div className="rounded-xl p-3 border border-accent-cyan/40 bg-accent-cyan/5">
                  <div className="text-sm font-semibold text-white mb-1">{currentEvent.name}</div>
                  <span className="pill text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10">CURRENT</span>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Select a historical event above to compare against the current simulated event.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SectionTitle title="Technology Stack" badge="ARCHITECTURE" subtitle="Modern, scalable and modular architecture ready to integrate real APIs and ML models in production." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stack).map(([cat, items], i) => (
              <motion.div key={cat} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="glass p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={15} className="text-accent-cyan" />
                  <span className="text-sm font-bold capitalize text-white">{cat.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-md bg-white/[0.04] border border-white/10 text-slate-300">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            Presented as a proposed SIH solution. All data shown is demo/simulation data for presentation purposes.
          </p>
        </div>
      </div>
    </div>
  )
}