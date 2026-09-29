import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TriangleAlert, TrendingUp } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { ForecastChart, BarComparisonChart } from '../components/Charts'
import { AIConfidenceCard } from '../components/NumCounter'
import { modelForecasts, demoAreas, riskColor } from '../data/demoData'
import type { AreaRiskProfile } from '../types'

const hyperlocalLevels = ['District', 'City', 'Ward', 'Local Area', 'Road / Zone']

const uncertainty = modelForecasts
const consensus = Math.round(uncertainty.reduce((a, b) => a + b.value, 0) / uncertainty.length)
const spread = Math.max(...uncertainty.map((u) => u.value)) - Math.min(...uncertainty.map((u) => u.value))

export const Predictions: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<AreaRiskProfile>(demoAreas[0])

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="AI Rainfall & Inundation Predictions"
          badge="MACHINE LEARNING"
          subtitle="Prediction outputs from the fused ensemble of satellite, radar, station, and NWP models. Demo data for presentation."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Rainfall Prediction Timeline</h3>
              <span className="text-[10px] text-slate-500">Intensity · Probability · Peak</span>
            </div>
            <ForecastChart height={300} />
          </div>

          <AIConfidenceCard
            confidence={91}
            reasons={[
              { label: 'Model consensus high (91-96%)', positive: true },
              { label: 'Satellite + radar convergence', positive: true },
              { label: 'Historical pattern match', positive: true },
              { label: 'Moderate lead-time uncertainty', positive: false },
            ]}
          />
        </div>

        <div className="mt-10">
          <SectionTitle
            title="Hyperlocal Risk Intelligence"
            badge="DEEP-DIVE"
            subtitle="Proposed AI capability supporting prediction from District down to Road/Zone level. High-resolution real data is required for operational use."
          />

          <div className="flex flex-wrap gap-2 mb-6">
            {hyperlocalLevels.map((lvl, i) => (
              <div key={lvl} className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i === 3 ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40' : 'bg-white/5 border border-white/10 text-slate-300'}`}>
                  {lvl}
                </span>
                {i < hyperlocalLevels.length - 1 && <span className="text-accent-cyan/50 text-xs">→</span>}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="glass p-4">
              <div className="text-xs font-semibold text-slate-400 mb-3">Select Local Area</div>
              <div className="space-y-1.5">
                {demoAreas.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedArea(a)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${selectedArea.id === a.id ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30' : 'text-slate-300 hover:bg-white/5 border border-transparent'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: riskColor(a.risk) }} />
                      {a.name}
                    </span>
                    <span className="font-mono">{a.riskScore}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedArea.name}</h3>
                  <div className="text-xs text-slate-500">{selectedArea.district} · {selectedArea.city} · {selectedArea.ward} · {selectedArea.localArea} · {selectedArea.roadZone}</div>
                </div>
                <span className="pill" style={{ color: riskColor(selectedArea.risk), borderColor: `${riskColor(selectedArea.risk)}44`, background: `${riskColor(selectedArea.risk)}11` }}>
                  {selectedArea.risk.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { l: 'Flood Probability', v: `${selectedArea.floodProbability}%`, c: '#eab308' },
                  { l: 'Water Depth', v: `${selectedArea.waterDepth} m`, c: '#3b82f6' },
                  { l: 'Rainfall Intensity', v: `${selectedArea.currentRainfall} mm/h`, c: '#22d3ee' },
                  { l: 'Drainage Stress', v: `${selectedArea.drainageStress}%`, c: '#f97316' },
                  { l: 'Population Exposure', v: selectedArea.populationExposure.toLocaleString(), c: '#ef4444' },
                  { l: 'Soil Saturation', v: `${selectedArea.soilSaturation}%`, c: '#a855f7' },
                ].map((m, i) => (
                  <motion.div
                    key={m.l}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-xl bg-white/[0.03] border border-white/5 p-3"
                  >
                    <div className="text-[10px] text-slate-500">{m.l}</div>
                    <div className="text-lg font-bold mt-0.5" style={{ color: m.c }}>{m.v}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-400">
                <strong className="text-amber-300">Infrastructure:</strong> {selectedArea.criticalInfrastructure.join(', ')}
                <div className="mt-2"><strong className="text-accent-cyan">Recommended:</strong> {selectedArea.recommendedAction}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <SectionTitle
            title="AI Uncertainty Monitor"
            badge="MODEL CONSENSUS"
            subtitle="Comparison across independent prediction models to quantify forecast agreement and uncertainty."
          />

          <div className={`glass p-5 ${spread > 14 ? 'border-orange-500/40' : 'border-emerald-500/30'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-accent-cyan" />
                  <span className="text-sm font-semibold text-white">Model Comparison (next 24h rainfall)</span>
                </div>
                <BarComparisonChart data={uncertainty.map((u) => ({ model: u.model, value: u.value }))} height={240} />
                <p className="text-[11px] text-slate-500 mt-2">Spread across models: {spread} mm</p>
              </div>
              <div className="flex flex-col justify-center">
                <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
                  <div className="text-3xl font-bold text-accent-cyan">Prediction Consensus: {consensus}%</div>
                  {spread > 14 ? (
                    <div className="mt-3 flex items-start gap-2">
                      <TriangleAlert size={18} className="text-orange-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-orange-300 text-sm">⚠ Forecast Uncertainty Detected</div>
                        <p className="text-xs text-slate-400 mt-1">Multiple prediction sources show significant variation. Monitoring recommended.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-emerald-400">✅ Model agreement within acceptable range. High confidence.</div>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-3">
                  The uncertainty engine quantifies divergence to decide when to issue early warnings and how much lead time to provide.
                </p>
              </div>
              <div className="lg:col-span-2">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: 'Pessimistic (+1σ)', v: `${consensus + Math.round(spread * 0.6)} mm`, c: '#ef4444', desc: 'High-end scenario — treat as upper bound' },
                    { l: 'Consensus', v: `${consensus} mm`, c: '#22d3ee', desc: 'Ensemble-agreed forecast' },
                    { l: 'Optimistic (−1σ)', v: `${Math.max(0, consensus - Math.round(spread * 0.6))} mm`, c: '#22c55e', desc: 'Low-end scenario — treat as lower bound' },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                      <div className="text-[10px] text-slate-500">{s.l}</div>
                      <div className="text-xl font-bold" style={{ color: s.c }}>{s.v}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{s.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-xl border border-white/10 bg-white/[0.03] flex items-start gap-2">
                  <TriangleAlert size={14} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-amber-300">Low-confidence indicator:</strong> model spread of {spread} mm across sources is {spread > 14 ? 'above the warning threshold — a low-confidence forecast; officials should verify with observations before acting.' : 'within an acceptable band — treat as a moderate-confidence forecast.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
