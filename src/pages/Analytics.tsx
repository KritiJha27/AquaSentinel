import React, { useState } from 'react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { TrendLineChart, RiskTrendChart, AlertHistoryChart, WaterDepthRangeChart, ModelConsensusChart } from '../components/Charts'
import { rainfallTrendData, riskTrend, alertHistory, depthPrediction, modelForecasts, historicalEvents } from '../data/demoData'
import { Calendar, Filter, MapPin, Droplets } from 'lucide-react'

export const Analytics: React.FC = () => {
  const [date, setDate] = useState('All')
  const [location, setLocation] = useState('All')
  const [hazard, setHazard] = useState('All')
  const [severity, setSeverity] = useState('All')

  const filteredAlerts = alertHistory.map((row) => {
    if (severity !== 'All') {
      const key = severity.toLowerCase()
      return { ...row, [key]: row[key as keyof typeof row] as number, total: row[key as keyof typeof row] as number }
    }
    return row
  })

  const consensusModels = modelForecasts.map((m) => ({ short: m.model.split(' (')[0].split(' (')[1]?.split(')')[0] ?? m.model.split(' (')[0], value: m.value }))

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Analytics & Model Intelligence"
          badge="ANALYTICS"
          subtitle="Advanced analysis of rainfall trends, risk evolution, model confidence and historical comparison. Demo data."
        />

        <div className="glass p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={15} className="text-accent-cyan" />
            <select value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent text-xs text-slate-200 outline-none flex-1" aria-label="Date filter">
              <option>All</option><option>Last 7 days</option><option>Last 30 days</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-accent-cyan" />
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-transparent text-xs text-slate-200 outline-none flex-1" aria-label="Location filter">
              <option>All</option><option>Kochi</option><option>Mumbai</option><option>Chennai</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-accent-cyan" />
            <select value={hazard} onChange={(e) => setHazard(e.target.value)} className="bg-transparent text-xs text-slate-200 outline-none flex-1" aria-label="Hazard filter">
              <option>All</option><option>Heavy Rainfall</option><option>Flash Flood</option><option>Inundation</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Droplets size={15} className="text-accent-cyan" />
            <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="bg-transparent text-xs text-slate-200 outline-none flex-1" aria-label="Severity filter">
              <option>All</option><option>Advisory</option><option>Watch</option><option>Warning</option><option>Emergency</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Rainfall Trend (Actual vs Predicted)</h3>
            <TrendLineChart data={rainfallTrendData} keys={[{ key: 'actual', color: '#22d3ee', name: 'Actual' }, { key: 'predicted', color: '#f97316', name: 'Predicted' }]} height={250} />
          </div>
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Flood Risk Trend</h3>
            <RiskTrendChart data={riskTrend} height={250} />
          </div>
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Predicted Water Depth (Range)</h3>
            <WaterDepthRangeChart data={depthPrediction} height={250} />
          </div>
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Alert History (by severity)</h3>
            <AlertHistoryChart data={filteredAlerts} height={250} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Model Confidence — Rainfall Forecast</h3>
            <ModelConsensusChart data={consensusModels} height={250} />
          </div>
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Prediction Accuracy Trend</h3>
            <TrendLineChart
              data={[
                { hour: 'H-24', accuracy: 78, confidence: 72 },
                { hour: 'H-12', accuracy: 84, confidence: 80 },
                { hour: 'H-6', accuracy: 89, confidence: 86 },
                { hour: 'H-3', accuracy: 93, confidence: 91 },
                { hour: 'H-1', accuracy: 96, confidence: 94 },
              ]}
              keys={[{ key: 'accuracy', color: '#22c55e', name: 'Accuracy' }, { key: 'confidence', color: '#22d3ee', name: 'Confidence' }]}
              height={250}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {[
            { l: 'Model Confidence Avg', v: '91%', c: '#22c55e' },
            { l: 'Prediction Accuracy', v: '93%', c: '#22d3ee' },
            { l: 'Areas Affected (24h)', v: '4 zones', c: '#f97316' },
            { l: 'Historical Events Matched', v: `${historicalEvents.length - 1} events`, c: '#a855f7' },
          ].map((m, i) => (
            <div key={i} className="glass p-4">
              <div className="text-xs text-slate-500">{m.l}</div>
              <div className="text-2xl font-bold mt-1" style={{ color: m.c }}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
