import React from 'react'
import { motion } from 'framer-motion'
import {
  Activity, Users, Building2, Home as HomeIcon, Shield,
  AlertTriangle, CheckCircle2, Siren, School, Hospital, Radar, Zap, Bus, Landmark, GitBranch,
} from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { infrastructure, riskColor } from '../data/demoData'
import { useApp } from '../context/AppContext'

const incidents = [
  { id: 'n1', title: 'Flash Flood — Fort Kochi', status: 'Active', time: 'Ongoing', severity: 'emergency', location: 'Fort Kochi' },
  { id: 'n2', title: 'Road Waterlogging — Marine Drive', status: 'Active', time: '95% capacity', severity: 'warning', location: 'Marine Drive' },
  { id: 'n3', title: 'Drainage Overflow — Vyttila', status: 'Monitoring', time: 'Under watch', severity: 'watch', location: 'Vyttila' },
]

const infraIcons: Record<string, React.ReactNode> = {
  Hospital: <Hospital size={14} />,
  School: <School size={14} />,
  'Fire Station': <Siren size={14} />,
  'Police Station': <Shield size={14} />,
  'Power Station': <Zap size={14} />,
  'Transport Hub': <Bus size={14} />,
  Bridge: <GitBranch size={14} />,
  Government: <Landmark size={14} />,
}

export const Command: React.FC = () => {
  const { alerts } = useApp()

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Disaster Management Command Center"
          badge="COMMAND CENTER"
          subtitle="Consolidated operational view for authorities with situation overview, live incidents, response status and AI recommendations. Demo data."
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[
            { l: 'Active Alerts', v: alerts.length, c: '#ef4444', icon: AlertTriangle },
            { l: 'High-Risk Zones', v: 4, c: '#f97316', icon: Activity },
            { l: 'Infra at Risk', v: 3, c: '#eab308', icon: Building2 },
            { l: 'Roads Affected', v: 18, c: '#22d3ee', icon: Radar },
            { l: 'Evacuation Zones', v: 5, c: '#3b82f6', icon: HomeIcon },
            { l: 'Teams Deployed', v: 12, c: '#22c55e', icon: Users },
          ].map((m, i) => (
            <motion.div key={m.l} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="glass p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500"><m.icon size={12} />{m.l}</div>
              <div className="text-xl font-bold mt-1" style={{ color: m.c }}>{m.v}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Live Incidents</h3>
            <div className="space-y-2.5">
              {incidents.map((inc) => (
                <motion.div
                  key={inc.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-xl p-3 border ${inc.severity === 'emergency' ? 'border-red-500/30 bg-red-500/5' : inc.severity === 'warning' ? 'border-orange-500/30 bg-orange-500/5' : 'border-yellow-500/30 bg-yellow-500/5'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {inc.severity === 'emergency' ? <Siren size={15} className="text-red-400" /> : <AlertTriangle size={15} className="text-amber-400" />}
                      <span className="text-sm font-semibold text-slate-200">{inc.title}</span>
                    </div>
                    <span className={`pill ${inc.status === 'Active' ? 'text-red-300 border-red-400/40 bg-red-400/10' : 'text-yellow-300 border-yellow-400/40 bg-yellow-400/10'}`}>
                      {inc.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{inc.location} · {inc.time}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Response Status</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: 'Teams Deployed', v: '12', u: 'of 18', c: '#22c55e' },
                { l: 'Shelters Open', v: '6', u: 'of 8', c: '#22d3ee' },
                { l: 'Emergency Services', v: 'Standby', u: '', c: '#3b82f6' },
                { l: 'Road Closures', v: '7', u: 'routes', c: '#f97316' },
              ].map((r) => (
                <div key={r.l} className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
                  <div className="text-[10px] text-slate-500">{r.l}</div>
                  <div className="text-lg font-bold" style={{ color: r.c }}>{r.v} <span className="text-xs text-slate-500 font-normal">{r.u}</span></div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-slate-400">
              <strong className="text-slate-200">Coordination:</strong> District Control Room · NDRF · Fire & Rescue · Health Dept
            </div>
          </div>
        </div>

        <div className="mt-8">
          <SectionTitle title="Critical Infrastructure Risk" badge="INFRASTRUCTURE IMPACT" subtitle="Risk assessment for hospitals, schools, power, transport and public buildings. Demo data." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {infrastructure.map((asset) => {
              const color = riskColor(asset.risk)
              return (
                <motion.div key={asset.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass glass-hover p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ background: `${color}1a`, color }}>{infraIcons[asset.type]}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{asset.name}</div>
                      <div className="text-[10px] text-slate-500">{asset.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="pill" style={{ color, borderColor: `${color}44`, background: `${color}11` }}>{asset.risk.toUpperCase()} RISK</span>
                    <span className="text-[11px] text-slate-500">Depth: {asset.inundation} m</span>
                  </div>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Accessibility</span>
                    <span className="font-mono text-slate-200">{asset.accessibility}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                    <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} whileInView={{ width: `${asset.accessibility}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
                  </div>
                  <div className="text-[11px] text-slate-400"><strong className="text-amber-300">Action:</strong> {asset.recommendedAction}</div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <SectionTitle title="AI Recommendations" badge="DECISION SUPPORT" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: <Users size={18} />, t: 'Deploy teams to Priority Zone 01', d: 'Pre-position rescue teams at Fort Kochi lowlands before peak rainfall.' },
              { icon: <Building2 size={18} />, t: 'Activate drainage pumps', d: 'Drainage stress exceeds 65%. Pre-activate pump stations along Marine Drive.' },
              { icon: <HomeIcon size={18} />, t: 'Open 2 additional shelters', d: 'Projected 12,400 displaced persons exceeds current shelter capacity.' },
            ].map((rec, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass glass-hover p-5">
                <div className="flex items-center gap-2 mb-3 text-accent-cyan">{rec.icon}<CheckCircle2 size={16} /></div>
                <div className="text-sm font-semibold text-white mb-1">{rec.t}</div>
                <div className="text-xs text-slate-400">{rec.d}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
