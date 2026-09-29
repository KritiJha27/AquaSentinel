import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RefreshCw, CloudRain, Mountain, User, Map as MapIcon, Droplets, Waves, Pipette, ArrowDownWideNarrow, CircleDot, Landmark } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { runSimulation, riskColor } from '../data/demoData'
import type { SimulationParams, SimulationResult, RiskLevel } from '../types'
import { useApp } from '../context/AppContext'
import { MapPanel } from '../components/MapPanel'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (v: number) => void
  color?: string
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, unit, onChange, color = '#22d3ee' }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs font-mono font-semibold text-slate-200">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10 accent-cyan-400"
        style={{ accentColor: color }}
        aria-label={label}
      />
    </div>
  )
}

export const Simulator: React.FC = () => {
  const { pushToast } = useApp()
  const [params, setParams] = useState<SimulationParams>({ rainfall: 60, duration: 12, drainage: 55, riverLevel: 3.2, soilSaturation: 72 })
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<SimulationResult | null>(null)
  const [scenario, setScenario] = useState<'A' | 'B' | 'C'>('A')
  const [stage, setStage] = useState(0)

  const runSimulationHere = () => {
    setRunning(true)
    setResult(null)
    setStage(0)
    pushToast('AI simulation started...')
    setTimeout(() => {
      const r = runSimulation(params)
      setResult(r)
      setStage(5)
      setRunning(false)
      pushToast('Simulation complete')
    }, 1800)
  }

  useEffect(() => {
    if (!running) return
    const iv = setInterval(() => setStage((s) => Math.min(s + 1, 5)), 450)
    return () => clearInterval(iv)
  }, [running])

  const pipelineStages = [
    { icon: CloudRain, label: 'Rainfall', detail: `${params.rainfall} mm/h input` },
    { icon: Droplets, label: 'Runoff Generation', detail: result ? `${Math.round(params.rainfall * 0.68)} mm/hr runoff` : 'Soil absorption model' },
    { icon: Pipette, label: 'Drainage', detail: `${params.drainage}% network capacity` },
    { icon: Waves, label: 'River Level', detail: `${params.riverLevel} m — ${params.riverLevel > 3.5 ? 'above warning level' : 'within normal band'}` },
    { icon: Landmark, label: 'Inundation Extent', detail: result ? `${result.inundatedArea.toLocaleString()} ha flooded` : 'Extent modelling' },
  ]

  const setDefaultScenario = (which: 'A' | 'B' | 'C') => {
    if (which === 'A') setParams({ rainfall: 60, duration: 12, drainage: 55, riverLevel: 3.2, soilSaturation: 72 })
    else if (which === 'B') setParams({ rainfall: 120, duration: 24, drainage: 35, riverLevel: 4.5, soilSaturation: 95 })
    else setParams({ rainfall: 100, duration: 18, drainage: 45, riverLevel: 4.0, soilSaturation: 88 })
    setScenario(which)
  }

  const color = result ? riskColor(result.risk as RiskLevel) : '#64748b'

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="What-If Flood Simulator"
          badge="AI SIMULATOR"
          subtitle="Change rainfall, duration, drainage, river and soil parameters to model before/after flood scenarios and their consequences."
        />

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setDefaultScenario('A')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${scenario === 'A' ? 'bg-accent-cyan/20 border-accent-cyan/40 text-accent-cyan' : 'bg-white/5 border-white/10 text-slate-300 hover:border-accent-cyan/30'}`}>
            Scenario A · 60mm
          </button>
          <button onClick={() => setDefaultScenario('C')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${scenario === 'C' ? 'bg-amber-500/20 border-amber-400/40 text-amber-300' : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400/30'}`}>
            Scenario C · 100mm
          </button>
          <button onClick={() => setDefaultScenario('B')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${scenario === 'B' ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-white/5 border-white/10 text-slate-300 hover:border-red-400/30'}`}>
            Scenario B · 120mm
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Simulation Parameters</h3>
            <div className="space-y-5">
              <Slider label="Rainfall Intensity" value={params.rainfall} min={20} max={150} step={5} unit=" mm/h" onChange={(v) => setParams({ ...params, rainfall: v })} color="#22d3ee" />
              <Slider label="Rainfall Duration" value={params.duration} min={3} max={48} step={3} unit=" h" onChange={(v) => setParams({ ...params, duration: v })} color="#3b82f6" />
              <Slider label="Drainage Capacity" value={params.drainage} min={10} max={100} step={5} unit="%" onChange={(v) => setParams({ ...params, drainage: v })} color="#f97316" />
              <Slider label="River Water Level" value={params.riverLevel} min={1} max={6} step={0.1} unit=" m" onChange={(v) => setParams({ ...params, riverLevel: v })} color="#eab308" />
              <Slider label="Soil Saturation" value={params.soilSaturation} min={20} max={100} step={5} unit="%" onChange={(v) => setParams({ ...params, soilSaturation: v })} color="#a855f7" />
            </div>
            <button onClick={runSimulationHere} disabled={running} className="btn-primary w-full justify-center mt-6">
              {running ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
              {running ? 'AI SIMULATING...' : 'RUN AI SIMULATION'}
            </button>
          </div>

          <div className="glass p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Scenario Result</h3>
              <span className="pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
                Risk: {result ? result.risk.toUpperCase() : '—'}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[300px] flex flex-col items-center justify-center text-slate-500">
                  <MapIcon size={36} className="mb-3 opacity-30" />
                  <p className="text-sm">Set parameters and run the AI simulation<br />to see the predicted impact.</p>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={running ? 'opacity-50 transition-opacity' : ''}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { icon: MapIcon, l: 'Inundated Area', v: `${result.inundatedArea.toLocaleString()} ha` },
                      { icon: CloudRain, l: 'Max Water Depth', v: `${result.maxWaterDepth} m` },
                      { icon: Mountain, l: 'Roads Affected', v: String(result.roadsAffected) },
                      { icon: User, l: 'Population Exposure', v: result.populationExposure.toLocaleString() },
                      { icon: MapIcon, l: 'Critical Infra', v: String(result.criticalInfrastructure) },
                      { icon: MapIcon, l: 'Risk Level', v: result.risk.toUpperCase() },
                    ].map((m, i) => (
                      <motion.div key={m.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500"><m.icon size={12} />{m.l}</div>
                        <div className="text-lg font-bold mt-1 text-slate-100">{m.v}</div>
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-3">
                    AI decision-support estimate based on current parameters. Not autonomous authority decision.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="glass p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2"><ArrowDownWideNarrow size={15} className="text-accent-cyan" />Rainfall to Inundation — Transformation Pipeline</h3>
            <span className="text-[10px] text-slate-500 font-mono">{running || result ? 'MODEL EXECUTION' : 'IDLE'}</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {pipelineStages.map((st, i) => {
              const lit = (running && stage >= i) || (!running && result)
              return (
                <div key={st.label} className="relative">
                  {i < pipelineStages.length - 1 && (
                    <div className="hidden md:block absolute top-5 left-[calc(50%+22px)] w-[calc(100%-44px)] h-[2px] bg-white/5 overflow-hidden rounded-full">
                      <motion.div
                        className="h-full bg-accent-cyan"
                        initial={{ width: '0%' }}
                        animate={{ width: (running && stage > i) || (!running && result) ? '100%' : '0%' }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0.35, scale: 0.96 }}
                    animate={{ opacity: lit ? 1 : 0.35, scale: lit ? 1.02 : 0.96 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl border p-3 relative ${lit ? 'border-accent-cyan/40 bg-accent-cyan/5' : 'border-white/5 bg-white/[0.03]'}`}
                  >
                    <div className="flex items-center justify-between">
                      <st.icon size={16} className={lit ? 'text-accent-cyan' : 'text-slate-500'} />
                      {lit && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative flex h-2 w-2"
                        >
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-cyan" />
                        </motion.span>
                      )}
                    </div>
                    <div className="text-[11px] font-semibold mt-2 text-slate-200">{st.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{st.detail}</div>
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-accent-cyan"
                        initial={{ width: '0%' }}
                        animate={{ width: lit ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                </div>
              )
            })}
          </div>
          <p className="text-[10px] text-slate-500 mt-3">
            Conceptual chain: rainfall intensity drives runoff, constrained by drainage &amp; river capacity, giving a modelled inundation extent. Animated during execution — demo simulation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-4">
            <div className="text-xs font-semibold text-slate-400 mb-3">Before / Result Map View</div>
            <MapPanel height="360px" showControls={false} />
          </div>
          <div className="glass p-4">
            <div className="text-xs font-semibold text-slate-400 mb-3">Impact Comparison (Scenario A vs B)</div>
            <div className="space-y-3">
              {[
                { k: 'Inundated Area', a: '1,024 ha', b: '4,127 ha', ratio: 0.25 },
                { k: 'Max Water Depth', a: '1.4 m', b: '3.6 m', ratio: 0.39 },
                { k: 'Roads Affected', a: '18', b: '57', ratio: 0.32 },
                { k: 'Population Exposure', a: '6,800', b: '24,500', ratio: 0.28 },
              ].map((row) => (
                <div key={row.k} className="rounded-lg bg-white/[0.03] border border-white/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-300">{row.k}</span>
                    <span className="flex gap-3 text-xs font-mono">
                      <span className="text-accent-cyan">A: {row.a}</span>
                      <span className="text-red-400">B: {row.b}</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${row.ratio * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
