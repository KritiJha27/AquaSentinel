import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Anchor, Thermometer, Waves, ShieldCheck, Siren, MapPin, TriangleAlert } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { coastalStations, tsunamiAdvisories, sstTrend, riskColor } from '../data/demoData'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { MapPanel } from '../components/MapPanel'
import type { CoastalStation } from '../types'

const statusMeta = {
  none: { label: 'NO ADVISORY', c: '#22c55e' },
  watch: { label: 'TSUNAMI WATCH', c: '#eab308' },
  warning: { label: 'TSUNAMI WARNING', c: '#ef4444' },
} as const

export const Coastal: React.FC = () => {
  const [selected, setSelected] = useState<CoastalStation | null>(null)
  const advisory = tsunamiAdvisories[0]
  const meta = statusMeta[advisory.status]

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Coastal & Ocean Monitoring"
          badge="COASTAL & TSUNAMI"
          subtitle="Sea-surface temperature, coastal change detection and official tsunami-advisory relay. AquaSentinel relays official advisories — it does not predict earthquakes or tsunamis independently."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { l: 'Stations Monitored', v: `${coastalStations.length}`, c: '#22d3ee', icon: Anchor },
            { l: 'Avg. Sea-Surface Temp', v: '29.6 °C', c: '#f97316', icon: Thermometer },
            { l: 'Tsunami Status', v: 'NONE', c: '#22c55e', icon: ShieldCheck },
            { l: 'Extreme-Risk Coasts', v: `${coastalStations.filter((s) => s.coastalRisk === 'extreme').length}`, c: '#ef4444', icon: Waves },
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

        <div className="rounded-2xl border p-5 mb-6" style={{ borderColor: `${meta.c}44`, background: `${meta.c}0d` }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.div
                animate={advisory.status === 'none' ? { opacity: [0.4, 1, 0.4] } : { scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ background: `${meta.c}22`, border: `1px solid ${meta.c}` }}
              >
                <ShieldCheck size={20} style={{ color: meta.c }} />
              </motion.div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wide" style={{ color: meta.c }}>{advisory.title}</div>
                <div className="text-[11px] text-slate-400">{advisory.issuedAt} · {advisory.affected}</div>
              </div>
            </div>
            <span className="pill" style={{ color: meta.c, borderColor: `${meta.c}44`, background: `${meta.c}11` }}>{meta.label}</span>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <Siren size={14} className="text-slate-400 mt-0.5 shrink-0" />
            <p className="text-[11px] text-slate-400 leading-relaxed">{advisory.note}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Sea-Surface Temperature (demo)</h3>
            <p className="text-[11px] text-slate-500 mb-3">Monthly SST vs climatological normal — Indian coastal waters.</p>
            <div style={{ width: '100%', height: 240 }} className="font-mono">
              <ResponsiveContainer>
                <AreaChart data={sstTrend} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} unit="°C" domain={[28, 32]} />
                  <Tooltip contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }} labelStyle={{ color: '#e2e8f0' }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="sst" name="Observed SST" stroke="#f97316" fill="url(#sst)" strokeWidth={2} />
                  <Area type="monotone" dataKey="normal" name="Climatological normal" stroke="#22d3ee" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-start gap-2">
              <Thermometer size={14} className="text-orange-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-400">
                Elevated SST (≈+1.0 °C above normal) is a moisture-feed indicator that can intensify coastal rainfall — monitored as a supporting signal, not a direct flood predictor.
              </p>
            </div>
          </div>

          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Coastal Stations & Risk Mapping</h3>
            <div className="space-y-2">
              {coastalStations.map((s) => (
                <motion.button
                  key={s.id}
                  onClick={() => setSelected(selected?.id === s.id ? null : s)}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${selected?.id === s.id ? 'border-accent-cyan/50 bg-accent-cyan/5' : 'border-white/5 bg-white/[0.03] hover:border-white/20'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{s.name}</span>
                    <span className="pill" style={{ color: riskColor(s.coastalRisk), borderColor: `${riskColor(s.coastalRisk)}44`, background: `${riskColor(s.coastalRisk)}11` }}>{s.coastalRisk.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-400">
                    <span><MapPin size={11} className="inline mr-0.5 text-slate-500" />{s.state}</span>
                    <span>SST: <strong className="text-slate-200">{s.sst}°C</strong></span>
                    <span>Tide: <strong className="text-slate-200">{s.tideHeight} m</strong></span>
                    <span>Wave: <strong className="text-slate-200">{s.waveHeight} m</strong></span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-4">
            <div className="text-xs font-semibold text-slate-400 mb-3">Coastal Risk Map</div>
            <MapPanel height="340px" showControls={false} showAreaButtons={false} />
            {selected && (
              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{selected.name}</span>
                  <span className="text-[10px] font-mono" style={{ color: riskColor(selected.coastalRisk) }}>{selected.coastalRisk.toUpperCase()} COASTAL RISK</span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-400">
                  <span>SST <strong className="text-slate-200">{selected.sst}°C</strong></span>
                  <span>Tide <strong className="text-slate-200">{selected.tideHeight} m</strong></span>
                  <span>Waves <strong className="text-slate-200">{selected.waveHeight} m</strong></span>
                </div>
              </div>
            )}
          </div>

          <div className="glass p-4">
            <h3 className="text-xs font-semibold text-slate-400 mb-3">Coastal Monitoring Capabilities</h3>
            <div className="space-y-2.5">
              {[
                { l: 'Coastal change detection', v: 'Satellite shoreline erosion/ accretion mapping' },
                { l: 'Sea-surface temperature', v: 'SST trend tracking for moisture-feed analysis' },
                { l: 'Storm-surge context', v: 'Tide + wave + water-level situational context' },
                { l: 'Official tsunami relay', v: 'Adds INCOIS / NOAA advisories as authoritative' },
              ].map((r, i) => (
                <div key={r.l} className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-start gap-3">
                  <span className="mt-0.5 h-6 w-6 rounded-lg bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center shrink-0">
                    {[Anchor, Thermometer, Waves, ShieldCheck][i] ? React.createElement([Anchor, Thermometer, Waves, ShieldCheck][i], { size: 13, className: 'text-accent-cyan' }) : null}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-slate-100">{r.l}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{r.v}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-4">
              Tsunami advisories are exclusively relayed from official sources (e.g. INCOIS, NOAA). AquaSentinel performs no independent earthquake or tsunami prediction.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 flex items-start gap-3">
          <TriangleAlert size={18} className="text-amber-300 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>Coastal disclaimer:</strong> SST, tide and wave values are demo/simulation data. Only an official tsunami-warning feed
            should drive evacuation decisions for coastal populations. AquaSentinel presents ocean monitoring as situational context, not as autonomous hazard prediction.
          </p>
        </div>
      </div>
    </div>
  )
}