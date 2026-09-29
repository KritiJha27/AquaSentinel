import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CloudLightning, Radar, Waves, CloudRain, AlertTriangle, Gauge, MapPin } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { cloudburstZones, cloudMovement, riskColor } from '../data/demoData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MapPanel } from '../components/MapPanel'
import type { CloudburstZone } from '../types'

const confidenceColor = (conf: number) => (conf >= 75 ? '#ef4444' : conf >= 60 ? '#f97316' : '#eab308')

export const Cloudburst: React.FC = () => {
  const [selected, setSelected] = useState<CloudburstZone | null>(null)

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Cloudburst Risk Assessment"
          badge="CLOUDBURST"
          subtitle="Satellite cloud imagery, cloud-motion analysis and radar reflectivity are combined to flag potential cloudburst risk. Cloudburst prediction is inherently uncertain — confidence is displayed transparently."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { l: 'Active Risk Zones', v: `${cloudburstZones.length}`, c: '#ef4444', icon: CloudLightning },
            { l: 'Peak Radar Reflectivity', v: '88 dBZ', c: '#22d3ee', icon: Radar },
            { l: 'Avg. Detection Confidence', v: '69%', c: '#f97316', icon: Gauge },
            { l: 'Avg. Trigger Rate', v: '54%', c: '#eab308', icon: CloudRain },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Potential Cloudburst Risk Zones</h3>
            <p className="text-[11px] text-slate-500 mb-3">Click a zone to view forecast detail and confidence.</p>
            <div className="space-y-2">
              {cloudburstZones.map((z) => {
                const conf = confidenceColor(z.confidence)
                return (
                  <motion.button
                    key={z.id}
                    onClick={() => setSelected(selected?.id === z.id ? null : z)}
                    className={`w-full text-left rounded-xl border p-3 transition-all ${selected?.id === z.id ? 'border-red-400/40 bg-red-500/5' : 'border-white/5 bg-white/[0.03] hover:border-white/20'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-white">{z.name}</span>
                      <span className="pill" style={{ color: riskColor(z.risk), borderColor: `${riskColor(z.risk)}44`, background: `${riskColor(z.risk)}11` }}>{z.risk.toUpperCase()}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                      <span><MapPin size={11} className="inline mr-0.5 text-slate-500" />{z.state}</span>
                      <span>Trigger rate: <strong className="text-slate-200">{z.triggerRate}%</strong></span>
                      <span>Last signal: <strong className="text-slate-200">{z.lastEvent}</strong></span>
                      <span>Confidence: <strong style={{ color: conf }}>{z.confidence}%</strong></span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Radar Reflectivity & Cloud Intensity</h3>
            <p className="text-[11px] text-slate-500 mb-3">Simulated 6-hour trend for the active convective system.</p>
            <div style={{ width: '100%', height: 240 }} className="font-mono">
              <ResponsiveContainer>
                <LineChart data={cloudMovement} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="t" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="intensity" name="Cloud Intensity" stroke="#22d3ee" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="radarReflectivity" name="Radar (dBZ)" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="5 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { l: '80+ dBZ', v: 'Very severe', c: '#ef4444' },
                { l: '55–80 dBZ', v: 'Severe thunder', c: '#f97316' },
                { l: '&lt;55 dBZ', v: 'Intense rain', c: '#eab308' },
              ].map((r) => (
                <div key={r.l} className="rounded-lg bg-white/[0.03] border border-white/5 p-3 text-center">
                  <div className="text-xs font-bold" style={{ color: r.c }}>{r.l}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{r.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-4">
            <div className="text-xs font-semibold text-slate-400 mb-3">Cloud-Motion / Risk Map</div>
            <MapPanel height="340px" showControls={false} showAreaButtons={false} />
          </div>

          <div className="glass p-4">
            <div className="text-xs font-semibold text-slate-400 mb-3">Forecast Detail</div>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white">{selected.name}</span>
                      <span className="pill" style={{ color: riskColor(selected.risk), borderColor: `${riskColor(selected.risk)}44`, background: `${riskColor(selected.risk)}11` }}>{selected.risk.toUpperCase()}</span>
                    </div>
                    <div className="mb-1 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Prediction confidence</span>
                      <span className="font-mono font-bold" style={{ color: confidenceColor(selected.confidence) }}>{selected.confidence}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/5 overflow-hidden mb-4">
                      <motion.div className="h-full rounded-full" style={{ background: confidenceColor(selected.confidence) }} initial={{ width: 0 }} animate={{ width: `${selected.confidence}%` }} transition={{ duration: 0.8 }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="rounded-lg bg-white/[0.03] p-2.5"><span className="text-slate-500">State</span><div className="text-slate-100 font-semibold">{selected.state}</div></div>
                      <div className="rounded-lg bg-white/[0.03] p-2.5"><span className="text-slate-500">Trigger rate</span><div className="text-slate-100 font-semibold">{selected.triggerRate}%</div></div>
                      <div className="col-span-2 rounded-lg bg-white/[0.03] p-2.5"><span className="text-slate-500">Last comparable signal</span><div className="text-slate-100 font-semibold">{selected.lastEvent}</div></div>
                    </div>
                    <div className="mt-3 rounded-lg border border-amber-400/30 bg-amber-500/10 p-3 flex items-start gap-2">
                      <Waves size={14} className="text-amber-300 mt-0.5 shrink-0" />
                      <p className="text-[10px] leading-relaxed text-amber-200/90">
                        {selected.confidence >= 70 ? 'Elevated convection signature — treat as high-watch, require radar confirmation before any public advisory.'
                          : 'Uncertain signature — low-confidence caution. Officials should verify with ground radar before any action.'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-48 flex flex-col items-center justify-center text-slate-500">
                  <CloudLightning size={40} className="opacity-30 mb-3" />
                  <p className="text-sm">Select a risk zone to view its forecast detail, <br />confidence and recommended caution level.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 flex items-start gap-3">
          <CloudLightning size={18} className="text-amber-300 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>Uncertainty statement:</strong> Cloudbursts are extremely localised, short-duration, high-intensity events.
            AquaSentinel flags <em>potential</em> risk zones from satellite cloud-tracking, radar reflectivity and orographic signatures —
            it <strong>cannot reliably predict an exact cloudburst</strong>. Confidence below 70% is displayed explicitly and should never be used for
            public warnings without ground-radar confirmation. <em>All values shown are demo/simulation data.</em>
          </p>
        </div>
      </div>
    </div>
  )
}