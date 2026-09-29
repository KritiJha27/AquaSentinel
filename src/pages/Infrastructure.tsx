import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Hospital, School, Siren, Shield, Zap, Bus, Building, MapPin, AlertTriangle } from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { infrastructure, riskColor } from '../data/demoData'
import type { InfrastructureAsset, RiskLevel } from '../types'
import { Modal } from '../components/Modal'

const typeIcon: Record<string, React.ReactNode> = {
  Hospital: <Hospital size={18} />,
  School: <School size={18} />,
  'Fire Station': <Siren size={18} />,
  'Police Station': <Shield size={18} />,
  'Power Station': <Zap size={18} />,
  'Transport Hub': <Bus size={18} />,
  Bridge: <Building size={18} />,
  Government: <Building size={18} />,
}

const typeColor: Record<string, string> = {
  Hospital: '#ef4444',
  School: '#3b82f6',
  'Fire Station': '#f97316',
  'Police Station': '#22d3ee',
  'Power Station': '#eab308',
  'Transport Hub': '#a855f7',
  Bridge: '#22c55e',
  Government: '#64748b',
}

export const Infrastructure: React.FC = () => {
  const [selected, setSelected] = useState<InfrastructureAsset | null>(null)
  const [typeFilter, setTypeFilter] = useState<string>('All')

  const types = ['All', ...Array.from(new Set(infrastructure.map((i) => i.type)))]
  const filtered = typeFilter === 'All' ? infrastructure : infrastructure.filter((i) => i.type === typeFilter)
  const ranked = [...filtered].sort((a, b) => b.inundation - a.inundation)

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Critical Infrastructure Risk Intelligence"
          badge="INFRASTRUCTURE"
          subtitle="Real-time flood risk assessment for hospitals, schools, power stations, transport and public buildings. Demo data."
        />

        <div className="flex flex-wrap gap-2 mb-6">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${typeFilter === t ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40' : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ranked.map((asset, i) => {
            const color = riskColor(asset.risk)
            const isHighest = asset.risk === 'extreme' || asset.risk === 'high'
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={`glass glass-hover p-5 cursor-pointer ${isHighest ? 'border-l-4' : ''}`}
                style={isHighest ? { borderLeftColor: color } : undefined}
                onClick={() => setSelected(asset)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}1a`, color: typeColor[asset.type] || color }}>
                      {typeIcon[asset.type] || <Building size={18} />}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white">{asset.name}</div>
                      <div className="text-[10px] text-slate-500">{asset.type}</div>
                    </div>
                  </div>
                  <span className="pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>
                    {asset.risk.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-lg bg-white/[0.03] p-2.5">
                    <div className="text-[10px] text-slate-500">Flood Depth</div>
                    <div className="text-sm font-bold text-slate-200">{asset.inundation} m</div>
                  </div>
                  <div className="rounded-lg bg-white/[0.03] p-2.5">
                    <div className="text-[10px] text-slate-500">Flood Prob.</div>
                    <div className="text-sm font-bold text-slate-200">{asset.floodProbability}%</div>
                  </div>
                </div>

                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Accessibility</span>
                  <span className="font-mono text-slate-300">{asset.accessibility}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${asset.accessibility}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>

                <div className="mt-3 text-[11px] text-slate-400 line-clamp-2">{asset.recommendedAction}</div>
              </motion.div>
            )
          })}
        </div>

        <SectionTitle title="Most At-Risk Infrastructure" badge="PRIORITY RANKING" subtitle="Ranked by predicted inundation depth. Authoritative evacuation decisions remain with authorized authorities." />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ranked.slice(0, 4).map((asset, i) => {
            const color = riskColor(asset.risk)
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass p-4 flex items-center gap-4 border-l-4"
                style={{ borderLeftColor: color }}
              >
                <div className="text-3xl font-extrabold font-mono" style={{ color }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-white">{asset.name}</div>
                  <div className="text-[10px] text-slate-500">{asset.type}</div>
                  <div className="text-xs text-slate-400 mt-1">{asset.recommendedAction}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold font-mono" style={{ color }}>{asset.inundation}m</div>
                  <div className="text-[10px] text-slate-500">depth</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''}>
        {selected && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${riskColor(selected.risk)}1a`, color: typeColor[selected.type] || riskColor(selected.risk) }}>
                {typeIcon[selected.type] || <Building size={18} />}
              </span>
              <div>
                <div className="text-sm font-semibold text-white">{selected.type}</div>
                <div className="pill" style={{ color: riskColor(selected.risk), borderColor: `${riskColor(selected.risk)}44`, background: `${riskColor(selected.risk)}11` }}>
                  {selected.risk.toUpperCase()} RISK
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { l: 'Predicted Depth', v: `${selected.inundation} m`, c: '#3b82f6' },
                { l: 'Flood Probability', v: `${selected.floodProbability}%`, c: '#eab308' },
                { l: 'Accessibility', v: `${selected.accessibility}%`, c: selected.accessibility < 50 ? '#ef4444' : '#22c55e' },
                { l: 'Risk Score', v: `${selected.inundation * 35}/100`, c: riskColor(selected.risk) },
              ].map((m) => (
                <div key={m.l} className="rounded-lg bg-white/[0.03] p-3">
                  <div className="text-[10px] text-slate-500">{m.l}</div>
                  <div className="text-lg font-bold" style={{ color: m.c }}>{m.v}</div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
              <strong>Recommended Action:</strong> {selected.recommendedAction}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
