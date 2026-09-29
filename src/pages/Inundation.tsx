import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { MapPanel } from '../components/MapPanel'
import { runSimulation, riskColor } from '../data/demoData'
import type { SimulationParams, SimulationResult, RiskLevel } from '../types'

const rainfallLevels = [20, 50, 80, 120]

export const Inundation: React.FC = () => {
  const [rainfallLevel, setRainfallLevel] = useState(50)

  const params: SimulationParams = {
    rainfall: rainfallLevel,
    duration: 12,
    drainage: 55,
    riverLevel: 3.2,
    soilSaturation: 72,
  }

  const result: SimulationResult = useMemo(() => runSimulation(params), [params])

  const twinSteps = [
    { label: 'Rainfall Input', value: `${rainfallLevel} mm/h` },
    { label: 'Surface Runoff', value: `${Math.round(rainfallLevel * 0.72)} mm/h` },
    { label: 'Drainage Capacity', value: '55%' },
    { label: 'Water Accumulation', value: `${result.inundatedArea.toLocaleString()} ha` },
    { label: 'Predicted Inundation', value: `${result.maxWaterDepth} m` },
  ]

  const color = riskColor(result.risk as RiskLevel)

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Rainfall → Inundation Digital Twin"
          badge="DIGITAL TWIN"
          subtitle="Simulated transformation of rainfall into surface runoff, drainage stress, water accumulation and predicted inundation. Demo data."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Simulation Control</h3>
            <div className="text-xs text-slate-400 mb-3">Rainfall Intensity</div>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {rainfallLevels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setRainfallLevel(lvl)}
                  className={`py-2.5 rounded-lg text-xs font-mono transition-all ${rainfallLevel === lvl ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40' : 'bg-white/5 border border-white/10 text-slate-400 hover:border-accent-cyan/30'}`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 relative">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-blue-500 to-accent-cyan"
                  animate={{ width: `${((rainfallLevel - 20) / 100) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              </div>
              <span className="text-xs font-mono text-slate-300">{rainfallLevel} mm/h</span>
            </div>

            <div className="space-y-2.5 mt-6">
              {twinSteps.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${i === twinSteps.length - 1 ? 'bg-orange-400 animate-pulse' : 'bg-accent-cyan'}`} />
                    <span className="text-xs text-slate-300">{step.label}</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-100">{step.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Predicted Inundation Map</h3>
              <span className="pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
                Risk: {result.risk.toUpperCase()}
              </span>
            </div>
            <MapPanel height="420px" showControls={false} />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { l: 'Flooded Area', v: `${result.inundatedArea.toLocaleString()} ha`, c: color },
                { l: 'Max Water Depth', v: `${result.maxWaterDepth} m`, c: '#3b82f6' },
                { l: 'Affected Roads', v: String(result.roadsAffected), c: '#f97316' },
                { l: 'Population Exposure', v: result.populationExposure.toLocaleString(), c: '#ef4444' },
              ].map((m, i) => (
                <motion.div key={m.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <div className="text-[10px] text-slate-500">{m.l}</div>
                  <AnimatePresence mode="wait">
                    <motion.div key={m.v} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-lg font-bold mt-0.5" style={{ color: m.c }}>
                      {m.v}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
