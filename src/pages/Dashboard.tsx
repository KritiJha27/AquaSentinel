import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Map, FlaskConical, CloudRain, Droplets, Activity, Users, Clock,
  Database, Shield, TriangleAlert, Waves, ArrowRight, BrainCircuit,
  Building2, Siren, Route as RouteIcon, Sparkles, Satellite, Mountain,
  CloudLightning, Anchor, ShieldCheck, Globe2, LogOut,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { MetricCard } from '../components/MetricCard'
import { RiskMeter } from '../components/RiskMeter'
import { NumCounter } from '../components/NumCounter'
import { ForecastChart } from '../components/Charts'
import { AIConfidenceCard } from '../components/NumCounter'
import { IndiaMap } from '../components/IndiaMap'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { indiaStateRisk, riskColor } from '../data/demoData'
import { roleLabels } from '../auth/auth'
import { useNavigate } from 'react-router-dom'

const dataSources = [
  { icon: '🛰', label: 'Satellite' },
  { icon: '📡', label: 'Radar' },
  { icon: '🌧', label: 'Ground Stations' },
  { icon: '🌐', label: 'NWP' },
  { icon: '🏔', label: 'DEM / Terrain' },
  { icon: '🌊', label: 'River Data' },
  { icon: '🚰', label: 'Drainage' },
  { icon: '📊', label: 'Historical Flood Data' },
]

const differentiated = [
  { icon: '🌧', title: 'Rainfall-to-Inundation Intelligence', desc: 'Converts forecast rainfall into predicted inundation via a digital twin.' },
  { icon: '📍', title: 'Hyperlocal Risk Mapping', desc: 'Risk intelligence from district down to road/zone level.' },
  { icon: '🎯', title: 'What-If Flood Simulator', desc: 'Model any rainfall and drainage scenario before it happens.' },
  { icon: '📊', title: 'AI Forecast Uncertainty Engine', desc: 'Multi-scenario confidence, uncertainty indicators and honest low-confidence warnings.' },
  { icon: '🛣', title: 'Flood-Aware Safe Route', desc: 'Navigation that avoids predicted flooded and risky roads.' },
  { icon: '🔍', title: 'Explainable AI Warnings', desc: 'Every warning explains exactly which factors drive the risk.' },
  { icon: '🏥', title: 'Infrastructure Risk', desc: 'Impacts on hospitals, schools, power, transport, dams and bridges.' },
  { icon: '🚨', title: 'Evacuation Decision Support', desc: 'AI-ranked priority zones — authorities retain final call.' },
  { icon: '🗂', title: 'Historical Event Memory', desc: 'Compare current conditions with past flood events.' },
  { icon: '🧬', title: 'Multi-Source Data Fusion', desc: 'Satellite, radar, station, NWP, terrain and drainage fused by AI.' },
  { icon: '🏔', title: 'Glacier & GLOF Monitoring', desc: 'Satellite boundary change + glacial-lake GLOF risk screening.' },
  { icon: '⛈', title: 'Cloudburst Risk Assessment', desc: 'Cloud-tracking and radar signatures with transparent confidence.' },
  { icon: '🌊', title: 'Coastal & Ocean Monitoring', desc: 'SST, coastal change and official tsunami-advisory relay.' },
  { icon: '🚑', title: 'Emergency SOS Support', desc: 'One-tap emergency contacts, instructions and location share.' },
  { icon: '✅', title: 'Expert-Verified Alerts', desc: 'Scientist-review and admin-approval workflow before publishing.' },
]

const pipelineSteps = [
  { label: 'HEAVY RAINFALL', icon: CloudRain },
  { label: 'MULTI-SOURCE DATA', icon: Database },
  { label: 'AI/ML FUSION', icon: BrainCircuit },
  { label: 'RAINFALL PREDICTION', icon: Droplets },
  { label: 'INUNDATION DIGITAL TWIN', icon: Waves },
  { label: 'HYPERLOCAL RISK', icon: Map },
  { label: 'UNCERTAINTY + EXPLAINABLE AI', icon: Sparkles },
  { label: 'EARLY WARNING', icon: TriangleAlert },
  { label: 'SAFE ROUTE + INFRASTRUCTURE', icon: RouteIcon },
  { label: 'EVACUATION SUPPORT', icon: Siren },
  { label: 'ACTION', icon: Shield },
]

export const Dashboard: React.FC = () => {
  const { alerts } = useApp()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const topAlert = alerts.find((a) => a.severity === 'emergency') || alerts[0]
  const topStates = indiaStateRisk.filter((s) => s.risk === 'extreme' || s.risk === 'high').slice(0, 5)

  return (
    <div className="pt-16">
      <DemoBanner />

      <section className="radial-bg relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap items-center gap-3 mb-5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">AI System Operational</span>
              {user && (
                <span className="pill text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10">
                  {user.role.toUpperCase()} · {user.name}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
            >
              {user ? (
                <>Welcome back, {user.name.split(' ')[0]} <span className="gradient-text-cyan">👋</span></>
              ) : (
                <><span className="gradient-text-cyan">AI-Powered Flood</span> Intelligence</>
              )}
            </motion.h1>
            {user && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-lg text-slate-400 mt-1">India-wide Disaster Intelligence Dashboard</motion.div>}

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg text-slate-400 max-w-2xl"
            >
              From rainfall prediction to hyperlocal inundation intelligence,
              explainable risk and actionable early warnings. {user ? `${roleLabels[user.role]} access.` : 'Sign in to your role-based command view.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <Link to="/map" className="btn-primary">
                <Map size={16} /> Explore Live Map
              </Link>
              <Link to="/simulator" className="btn-ghost">
                <FlaskConical size={16} /> Run Flood Simulation
              </Link>
              {user && (
                <button
                  onClick={() => { logout(); navigate('/login', { replace: true }) }}
                  className="btn-ghost !text-slate-400"
                >
                  <LogOut size={16} /> Log out
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex items-center gap-2 text-[11px] text-slate-500"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Demo / Simulation Data — values shown are generated for presentation, not live observations.
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-14">
            {[
              { label: 'Rainfall Intensity', value: 34, unit: 'mm/h', icon: CloudRain, color: '#22d3ee', delay: 0.1 },
              { label: 'Flood Risk', value: 82, unit: '/100', icon: Activity, color: '#ef4444', delay: 0.2 },
              { label: 'Forecast Confidence', value: 91, unit: '%', icon: Database, color: '#22c55e', delay: 0.3 },
              { label: 'Areas at Risk', value: 4, unit: 'zones', icon: Users, color: '#f97316', delay: 0.4 },
              { label: 'Warning Lead Time', value: 2, unit: 'hrs', icon: Clock, color: '#eab308', delay: 0.5 },
            ].map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: m.delay }}
                className="glass glass-hover p-4 flex flex-col gap-2 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px shimmer-border" style={{ backgroundColor: 'transparent' }} />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: m.color }}>{m.label}</span>
                  <m.icon size={14} className="text-slate-500" />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="metric-value">
                    <NumCounter value={m.value} suffix="" />
                  </span>
                  <span className="text-xs text-slate-500">{m.unit}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <SectionTitle
          title="Nationwide Hazard Overview — India"
          badge="COUNTRY VIEW"
          subtitle="State-level risk aggregation from AI fusion of rainfall, river, terrain, glacier, cloudburst and coastal signals. Click a state on the map. All demo data."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">Interactive Risk Map of India</span>
              <span className="pill text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10">13 HAZARD SIGNALS FUSED</span>
            </div>
            <IndiaMap height="440px" />
            <p className="text-[10px] text-slate-500 mt-2">Geo-visualisation is schematic (demo) — production uses verified state/district boundary GeoJSON.</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="glass p-4">
              <h3 className="text-xs font-semibold text-white mb-3">Highest-Risk States</h3>
              <div className="space-y-2">
                {topStates.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2.5">
                    <div>
                      <div className="text-xs font-semibold text-slate-100">{s.name}</div>
                      <div className="text-[10px] text-slate-500">{(s.populationExposure / 1_000_000).toFixed(1)}M people exposed</div>
                    </div>
                    <span className="pill" style={{ color: riskColor(s.risk), borderColor: `${riskColor(s.risk)}44`, background: `${riskColor(s.risk)}11` }}>{s.risk.toUpperCase()} · {s.score}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass p-4 flex-1">
              <h3 className="text-xs font-semibold text-white mb-3">Multi-Hazard Coverage</h3>
              <div className="space-y-2">
                {[
                  { l: 'Heavy Rainfall', c: '#22d3ee', icon: CloudRain },
                  { l: 'Flood Inundation', c: '#3b82f6', icon: Waves },
                  { l: 'Glacier & GLOF', c: '#a855f7', icon: Mountain },
                  { l: 'Cloudburst Risk', c: '#f97316', icon: CloudLightning },
                  { l: 'Coastal & Ocean', c: '#22c55e', icon: Anchor },
                  { l: 'Riverine Flooding', c: '#eab308', icon: Droplets },
                ].map((h) => (
                  <div key={h.l} className="flex items-center gap-2 text-xs text-slate-300">
                    <h.icon size={14} style={{ color: h.c }} />
                    {h.l}
                    <span className="ml-auto text-[9px] font-bold uppercase tracking-wider" style={{ color: h.c }}>Active</span>
                  </div>
                ))}
              </div>
              <Link to="/map" className="mt-3 flex items-center gap-1 text-xs text-accent-cyan hover:underline">
                Open hyperlocal map <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div className="lg:col-span-1">
            <div className="glass p-5 flex flex-col items-center justify-center h-full">
              <div className="text-xs text-slate-400 mb-3 uppercase tracking-widest">Current Flood Risk</div>
              <RiskMeter score={82} />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="glass p-5 border-l-4 border-l-red-500 glow-red">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <TriangleAlert size={20} className="text-red-400" />
                  <span className="text-xl font-bold text-white">{topAlert?.title}</span>
                </div>
                <span className="pill text-red-300 border-red-400/40 bg-red-400/10 animate-pulse">{topAlert?.severity.toUpperCase()}</span>
              </div>
              <p className="text-sm text-slate-300">{topAlert?.location} — {topAlert?.expectedTime}</p>
              <ul className="mt-3 space-y-1">
                {topAlert?.recommendedAction.slice(0, 3).map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-red-400 shrink-0" />{a}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link to="/alerts" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/15 text-red-300 border border-red-400/30 hover:bg-red-500/25 transition-colors">
                  Warning Center <ArrowRight size={13} />
                </Link>
                <Link to="/evacuation" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-slate-300 border border-white/10 hover:border-accent-cyan/40 transition-colors">
                  <Siren size={13} /> Evacuation Priority
                </Link>
              </div>
            </div>

            <div className="glass p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Rainfall Forecast</h3>
                <div className="flex gap-1">
                  {['1h', '3h', '6h', '12h', '24h', '72h'].map((h, i) => (
                    <span key={h} className={`text-[10px] px-2 py-1 rounded-md ${i === 2 ? 'bg-accent-cyan/15 text-accent-cyan font-semibold' : 'text-slate-500'}`}>{h}</span>
                  ))}
                </div>
              </div>
              <ForecastChart height={210} />
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <div className="text-[10px] text-slate-500">Peak Rainfall</div>
                  <div className="text-lg font-bold text-orange-400">142 mm</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <div className="text-[10px] text-slate-500">Heavy Rain Prob.</div>
                  <div className="text-lg font-bold text-accent-cyan">92%</div>
                </div>
                <div className="rounded-lg bg-white/[0.03] p-3 text-center">
                  <div className="text-[10px] text-slate-500">Total Forecast</div>
                  <div className="text-lg font-bold text-slate-200">334 mm</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-5">
            <AIConfidenceCard
              confidence={91}
              reasons={[
                { label: 'High agreement across 4 models', positive: true },
                { label: 'Multi-source data convergence', positive: true },
                { label: 'Seasonal pattern alignment', positive: true },
                { label: 'Moderate long-range uncertainty', positive: false },
              ]}
            />
            <div className="glass p-4">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={16} className="text-accent-cyan" />
                <h3 className="text-sm font-semibold text-white">Critical Infrastructure</h3>
              </div>
              <div className="space-y-2">
                {[
                  { l: 'Power Substation', v: 'EXTREME', c: '#ef4444' },
                  { l: 'General Hospital', v: 'HIGH', c: '#f97316' },
                  { l: 'Fire & Rescue HQ', v: 'LOW', c: '#22c55e' },
                ].map((r) => (
                  <div key={r.l} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                    <span className="text-xs text-slate-300">{r.l}</span>
                    <span className="text-[10px] font-bold" style={{ color: r.c }}>{r.v} RISK</span>
                  </div>
                ))}
              </div>
              <Link to="/infrastructure" className="mt-3 flex items-center gap-1 text-xs text-accent-cyan hover:underline">
                View all infrastructure risk <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <SectionTitle
          title="Multi-Source Data Fusion Pipeline"
          badge="AI PIPELINE"
          subtitle="AI continuously combines heterogeneous environmental data to improve localized prediction and reduce uncertainty."
        />

        <div className="glass p-6 md:p-8 relative overflow-hidden scan-effect">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {dataSources.map((ds, i) => (
              <motion.div
                key={ds.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl bg-white/[0.03] border border-white/5 p-4 flex flex-col items-center justify-center text-center glass-hover"
              >
                <span className="text-3xl mb-2">{ds.icon}</span>
                <span className="text-xs text-slate-300 font-medium">{ds.label}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center my-6">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent relative">
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 -top-2 h-4 w-4 rotate-45 bg-accent-cyan"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.2, 0.9] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{ boxShadow: '0 0 16px rgba(34,211,238,0.6)' }}
              />
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-2xl rounded-2xl p-6 text-center border-2 border-accent-cyan/40 glow-cyan"
            style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(59,130,246,0.08))' }}
          >
            <BrainCircuit size={26} className="mx-auto mb-2 animate-pulse text-accent-cyan" />
            <div className="font-bold text-accent-cyan text-xl">AI DATA FUSION ENGINE</div>
            <div className="text-xs text-slate-400 mt-1">Ensemble ML | Geospatial Modelling | Uncertainty Estimation</div>
            <div className="mt-3 flex justify-center gap-4 text-[10px] text-slate-500">
              <span>XGBoost</span><span>Random Forest</span><span>LSTM</span><span>ConvLSTM</span><span>CNN Geo</span><span>Hybrid</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 max-w-2xl mx-auto">
            {[
              { icon: Droplets, label: 'Rainfall Prediction', color: '#22d3ee' },
              { icon: Waves, label: 'Inundation Prediction', color: '#3b82f6' },
            ].map((out) => (
              <motion.div
                key={out.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
                className="glass glass-hover flex items-center justify-center gap-2 px-5 py-3 font-semibold text-slate-100 text-sm"
              >
                <out.icon size={16} style={{ color: out.color }} /> {out.label}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <SectionTitle
          title="What Makes AquaSentinel AI Different?"
          badge="PROPOSED DIFFERENTIATORS"
          subtitle="Presented as AquaSentinel AI's proposed differentiating capabilities."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {differentiated.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass glass-hover p-4 flex flex-col gap-2"
            >
              <span className="text-2xl">{f.icon}</span>
              <span className="text-sm font-semibold text-slate-100">{f.title}</span>
              <span className="text-[11px] text-slate-500 leading-relaxed">{f.desc}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <SectionTitle
          title="The AquaSentinel AI Pipeline"
          badge="CORE STORY"
          subtitle="From heavy rainfall to coordinated action."
        />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-11 gap-2">
          {pipelineSteps.map((step, i) => (
            <React.Fragment key={step.label}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass glass-hover p-3 flex flex-col items-center text-center"
              >
                <step.icon size={16} className="text-accent-cyan mb-1.5" />
                <span className="text-[9px] font-semibold text-slate-300 leading-tight">{step.label}</span>
              </motion.div>
              {i < pipelineSteps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center">
                  <ArrowRight size={12} className="text-accent-cyan/50" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="max-w-[1600px] mx-auto px-4 md:px-6 py-10">
        <SectionTitle
          title="Quick Access"
          badge="COMMAND CENTER"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Map, label: 'Live Intelligence Map', desc: 'Explore risk zones and layers', to: '/map', c: '#22d3ee' },
            { icon: Waves, label: 'Inundation Twin', desc: 'Rainfall to water mapping', to: '/inundation', c: '#3b82f6' },
            { icon: Mountain, label: 'Glacier & GLOF', desc: 'Himalayan lake risk', to: '/glacier', c: '#a855f7' },
            { icon: CloudLightning, label: 'Cloudburst Risk', desc: 'Convective risk zones', to: '/cloudburst', c: '#f97316' },
            { icon: Anchor, label: 'Coastal & Tsunami', desc: 'Ocean + official advisories', to: '/coastal', c: '#22c55e' },
            { icon: Building2, label: 'Infrastructure Risk', desc: 'Assets under threat', to: '/infrastructure', c: '#eab308' },
            { icon: Siren, label: 'Evacuation Priority', desc: 'Who to move first', to: '/evacuation', c: '#ef4444' },
            { icon: ShieldCheck, label: 'Scientist / Admin', desc: 'Review & publish alerts', to: '/scientist', c: '#64748b' },
          ].map((q, i) => (
            <motion.div key={q.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={q.to} className="glass glass-hover p-5 flex flex-col gap-3 h-full">
                <q.icon size={20} style={{ color: q.c }} />
                <div>
                  <div className="text-sm font-bold text-white">{q.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{q.desc}</div>
                </div>
                <span className="flex items-center gap-1 text-xs text-accent-cyan mt-auto">Open <ArrowRight size={11} /></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}