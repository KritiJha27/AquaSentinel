import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mountain, Snowflake, Waves, AlertTriangle, Eye, MapPin, TrendingDown, Activity } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { glacierRegions, glacialLakes, glacierAreaHistory, riskColor } from '../data/demoData'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MapPanel } from '../components/MapPanel'
import type { GlacierRegion, GlacialLake } from '../types'

const lakeRiskScale = (score: number) => {
  if (score >= 80) return { l: 'Very High', c: '#ef4444' }
  if (score >= 60) return { l: 'High', c: '#f97316' }
  if (score >= 40) return { l: 'Moderate', c: '#eab308' }
  return { l: 'Low', c: '#22c55e' }
}

export const Glacier: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<GlacierRegion | null>(null)
  const [selectedLake, setSelectedLake] = useState<GlacialLake | null>(null)

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Glacier & Glacial Lake (GLOF) Monitoring"
          badge="GLACIER & GLOF"
          subtitle="Satellite-based glacier boundary change detection and glacial lake monitoring across the Indian Himalaya. All imagery and change values are simulated demo data."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { l: 'Regions Monitored', v: '6', c: '#22d3ee', icon: Mountain },
            { l: 'Lakes Tracked', v: `${glacialLakes.length}`, c: '#3b82f6', icon: Snowflake },
            { l: 'Avg. Area Change', v: '-4.1%', c: '#ef4444', icon: TrendingDown },
            { l: 'High GLOF Risk Lakes', v: `${glacialLakes.filter((l) => l.risk === 'extreme' || l.risk === 'high').length}`, c: '#f97316', icon: AlertTriangle },
          ].map((m) => (
            <div key={m.l} className="glass p-4">
              <div className="flex items-center justify-between text-xs" style={{ color: m.c }}>
                <span>{m.l}</span>
                <m.icon size={14} />
              </div>
              <div className="text-2xl font-bold mt-1.5 text-white">{m.v}</div>
            </div>
          ))}
        </div>

        <div className="glass p-5 mb-6">
          <h3 className="text-sm font-semibold text-white mb-1">Glacier Area Change (simulated, sq km)</h3>
          <p className="text-[11px] text-slate-500 mb-3">Normalised multi-year boundary detection from demo satellite scenes.</p>
          <div style={{ width: '100%', height: 260 }} className="font-mono">
            <ResponsiveContainer>
              <AreaChart data={glacierAreaHistory} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                <defs>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="gangotri" name="Gangotri" stroke="#22d3ee" fill="url(#ga)" strokeWidth={2} />
                <Area type="monotone" dataKey="dhauladhar" name="Dhauladhar" stroke="#3b82f6" fill="none" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="lahaul" name="Lahaul" stroke="#a855f7" fill="none" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="chorabari" name="Chorabari" stroke="#ef4444" fill="none" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Glacier Regions & Boundary Change</h3>
            <div className="space-y-2">
              {glacierRegions.map((g) => (
                <motion.button
                  key={g.id}
                  onClick={() => setSelectedRegion(selectedRegion?.id === g.id ? null : g)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${selectedRegion?.id === g.id ? 'border-accent-cyan/50 bg-accent-cyan/5' : 'border-white/5 bg-white/[0.03] hover:border-white/20'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{g.name}</span>
                    <span className="pill" style={{ color: riskColor(g.risk), borderColor: `${riskColor(g.risk)}44`, background: `${riskColor(g.risk)}11` }}>{g.risk.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-400">
                    <span><MapPin size={11} className="inline mr-0.5 text-slate-500" />{g.state}</span>
                    <span>2020: <strong className="text-slate-200">{g.area2020} km²</strong></span>
                    <span>2026: <strong className="text-slate-200">{g.area2026} km²</strong></span>
                    <span className="text-red-400"><TrendingDown size={11} className="inline mr-0.5" />{g.changePercent}%</span>
                    <span>Lakes: <strong className="text-slate-200">{g.lakeCount}</strong></span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Glacial Lakes — GLOF Risk Assess</h3>
            <div className="space-y-2">
              {glacialLakes.map((l) => {
                const scale = lakeRiskScale(l.freezeScore)
                return (
                  <motion.button
                    key={l.id}
                    onClick={() => setSelectedLake(selectedLake?.id === l.id ? null : l)}
                    className={`w-full text-left rounded-xl border p-3 transition-all ${selectedLake?.id === l.id ? 'border-red-400/40 bg-red-500/5' : 'border-white/5 bg-white/[0.03] hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-white">{l.name}</span>
                      <span className="pill" style={{ color: riskColor(l.risk), borderColor: `${riskColor(l.risk)}44`, background: `${riskColor(l.risk)}11` }}>{l.risk.toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 mb-2">
                      <span>Area: <strong className="text-slate-200">{l.areaHa} ha</strong></span>
                      <span>Growth: <strong className="text-red-300">+{l.growthPercent}%</strong></span>
                      <span>GLOF risk: <strong style={{ color: scale.c }}>{scale.l}</strong></span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: scale.c }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${l.freezeScore}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
              <Eye size={14} className="text-accent-cyan" /> Satellite Scene Comparison — {selectedRegion ? selectedRegion.name : 'Gangotri (default)'}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-xl overflow-hidden border border-white/10">
                <div className="aspect-[4/3] w-full scan-effect" style={{ background: 'linear-gradient(135deg,#0b2236,#123a55,#0d2f47)' }}>
                  <div className="absolute inset-0 grid-bg opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mountain size={40} className="text-blue-300/30" />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-blue-200">2020 · BEFORE</span>
                  <span className="absolute bottom-2 left-2 text-[10px] text-slate-400">Boundary: <strong className="text-blue-300">{selectedRegion ? `${selectedRegion.area2020} km²` : '143 km²'}</strong></span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-xl overflow-hidden border border-white/10">
                <div className="aspect-[4/3] w-full scan-effect" style={{ background: 'linear-gradient(135deg,#1a0f3d,#3a1055,#2d0f47)' }}>
                  <div className="absolute inset-0 grid-bg opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Mountain size={40} className="text-purple-300/30" />
                  </div>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-purple-200">2026 · AFTER</span>
                  <span className="absolute bottom-2 left-2 text-[10px] text-slate-400">Boundary: <strong className="text-purple-300">{selectedRegion ? `${selectedRegion.area2026} km²` : '136 km²'}</strong></span>
                </div>
              </motion.div>
            </div>
            {selectedRegion && (
              <div className="mt-3 rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 flex items-start gap-2">
                <Activity size={14} className="text-amber-300 mt-0.5 shrink-0" />
                <p className="text-[11px] text-amber-200/90">
                  <strong>Detected change:</strong> {selectedRegion.changePercent}% area loss · {selectedRegion.note}.
                  Change is treated as a <strong>monitoring risk signal</strong> — AquaSentinel does not claim guaranteed crack or glacier-collapse prediction.
                </p>
              </div>
            )}
            <p className="text-[10px] text-slate-500 mt-2">Simulated scenes for demonstration — production uses Sentinel-1/2 change detection pipelines.</p>
          </div>

          <div className="glass p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-3">
              <MapPin size={14} className="text-red-400" /> High-Risk Lake Zone Map
            </div>
            <MapPanel height="320px" showControls={false} showAreaButtons={false} />
            <AnimatePresence>
              {selectedLake && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{selectedLake.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">GLOF risk {selectedLake.freezeScore}/100</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: riskColor(selectedLake.risk) }} initial={{ width: 0 }} animate={{ width: `${selectedLake.freezeScore}%` }} transition={{ duration: 0.7 }} />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Area {selectedLake.areaHa} ha · {selectedLake.growthPercent}% growth since baseline · continuous satellite monitoring recommended.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-300 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>Important limitation:</strong> Glacial lake growth and glacier retreat are detected from satellite time-series and used only as
            <strong> risk indicators</strong>. AquaSentinel cannot and does not predict a guaranteed moraine breach or glacier collapse. Any GLOF watch
            requires expert field verification and official approval before public release. <em>All values shown are demo/simulation data.</em>
          </p>
        </div>
      </div>
    </div>
  )
}