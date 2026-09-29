import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Microscope, ShieldCheck, CheckCircle2, XCircle, Users, Activity,
  BrainCircuit, Radar, Database, Clock, TrendingUp, AlertTriangle,
} from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { pendingAlertReviews, scientistUsers, systemHealth, modelForecasts } from '../data/demoData'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { roleLabels } from '../auth/auth'
import type { PendingAlertReviewee } from '../types'

export const Scientist: React.FC = () => {
  const { user, can } = useAuth()
  const { pushToast } = useApp()
  const [reviews, setReviews] = useState<PendingAlertReviewee[]>(pendingAlertReviews)
  const [published, setPublished] = useState<string[]>([])
  const [users, setUsers] = useState(scientistUsers)
  const [verified, setVerified] = useState<string[]>([])

  const isAdmin = can('admin')

  const approve = (r: PendingAlertReviewee) => {
    setReviews((prev) => prev.filter((p) => p.id !== r.id))
    setPublished((prev) => [...prev, `${r.title} (${r.proposedSeverity.toUpperCase()})`])
    pushToast(`Alert published: ${r.title}`)
  }

  const reject = (r: PendingAlertReviewee) => {
    setReviews((prev) => prev.filter((p) => p.id !== r.id))
    pushToast(`Review rejected: ${r.title}`)
  }

  const toggleUser = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u,
      ),
    )
    pushToast('User status updated')
  }

  const verify = (model: (typeof modelForecasts)[number]) => {
    if (!verified.includes(model.model)) setVerified((prev) => [...prev, model.model])
    pushToast(`Prediction verified against observed data: ${model.model}`)
  }

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Scientist & Administrator Dashboard"
          badge="AUTHORIZED ACCESS"
          subtitle={`Signed in as ${user?.name} · ${user ? roleLabels[user.role] : ''}. Only authorized personnel may review AI predictions and publish official alerts. Demo data.`}
        />

        <div className="glass p-4 mb-6 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <ShieldCheck size={20} className="text-navy-950" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{user?.name}</div>
              <div className="text-[11px] text-slate-400">{user?.email} · {user ? roleLabels[user.role] : ''}</div>
            </div>
          </div>
          <div className="flex gap-3">
            {[{ l: 'Prediction Review', v: reviews.length, c: '#f97316' }, { l: 'Published', v: published.length, c: '#22c55e' }, { l: 'Verified Models', v: verified.length, c: '#22d3ee' }].map((s) => (
              <div key={s.l} className="rounded-lg bg-white/[0.03] border border-white/5 px-4 py-2 text-center">
                <div className="text-xl font-bold" style={{ color: s.c }}>{s.v}</div>
                <div className="text-[9px] uppercase tracking-wider text-slate-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit size={16} className="text-accent-cyan" />
              <h3 className="text-sm font-semibold text-white">AI Prediction Review Queue</h3>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">Scientists validate AI-generated predictions before alert publication. Authorities can publish directly.</p>
            <div className="space-y-2">
              <AnimatePresence>
                {reviews.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-white/5 bg-white/[0.03] p-6 text-center">
                    <CheckCircle2 size={26} className="mx-auto text-emerald-400 mb-2" />
                    <p className="text-sm text-slate-300">Queue cleared — no pending prediction reviews.</p>
                  </motion.div>
                ) : (
                  reviews.map((r) => (
                    <motion.div key={r.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 60 }} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{r.title}</span>
                        <span className="pill text-amber-300 border-amber-400/30 bg-amber-400/10">{r.proposedSeverity.toUpperCase()}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 text-[11px] text-slate-400">
                        <span>{r.hazard}</span>
                        <span>Confidence: <strong className="text-slate-200">{r.confidence}%</strong></span>
                        <span>Submitted by: <strong className="text-slate-200">{r.submittedBy}</strong></span>
                        <span><Clock size={11} className="inline mr-0.5" />{r.date}</span>
                      </div>
                      <div className="flex gap-2 mt-2.5">
                        <button onClick={() => approve(r)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/25 transition-colors">
                          <CheckCircle2 size={13} /> Approve & Publish
                        </button>
                        {isAdmin && (
                          <button onClick={() => reject(r)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500/10 text-red-300 border border-red-400/30 hover:bg-red-500/20 transition-colors">
                            <XCircle size={13} /> Reject
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            {published.length > 0 && (
              <div className="mt-3 rounded-xl border border-emerald-400/25 bg-emerald-500/5 p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 mb-1.5">Recently published by you</div>
                {published.map((p) => (
                  <div key={p} className="flex items-center gap-2 text-[11px] text-slate-300"><CheckCircle2 size={12} className="text-emerald-400 shrink-0" />{p}</div>
                ))}
              </div>
            )}
            {!isAdmin && (
              <p className="text-[10px] text-slate-500 mt-2">Only administrators can reject/sub-approve; scientists validate and recommend.</p>
            )}
          </div>

          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-3">
              <Database size={16} className="text-accent-cyan" />
              <h3 className="text-sm font-semibold text-white">Prediction Verification against Observations</h3>
            </div>
            <div className="space-y-2">
              {modelForecasts.map((m) => {
                const isVerified = verified.includes(m.model)
                return (
                  <div key={m.model} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">{m.model}</span>
                      <span className="text-sm font-mono font-bold text-accent-cyan">{m.value} mm</span>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-blue" initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, m.value)}%` }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
                    </div>
                    <button onClick={() => verify(m)} disabled={isVerified} className={`mt-2 flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-semibold transition-colors ${isVerified ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30' : 'bg-white/5 text-slate-300 border border-white/10 hover:border-accent-cyan/40'}`}>
                      {isVerified ? <CheckCircle2 size={11} /> : <TrendingUp size={11} />}
                      {isVerified ? 'Verified against observed' : 'Verify against observed'}
                    </button>
                  </div>
                )
              })}
            </div>
            <p className="text-[10px] text-slate-500 mt-3">Demo workflow — simulated verification for presentation.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-3">
              <Users size={16} className="text-accent-cyan" />
              <h3 className="text-sm font-semibold text-white">User Management {isAdmin ? '' : '(view-only)'}</h3>
            </div>
            <div className="space-y-1.5">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2.5">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-100 truncate">{u.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{u.email} · {u.role}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${u.status === 'active' ? 'bg-emerald-500/15 text-emerald-300' : u.status === 'pending' ? 'bg-amber-500/15 text-amber-300' : 'bg-red-500/15 text-red-300'}`}>{u.status}</span>
                    {isAdmin && u.role !== 'Administrator' && (
                      <button onClick={() => toggleUser(u.id)} className="text-[10px] px-2 py-1 rounded-md border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-colors">
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {!isAdmin && <p className="text-[10px] text-slate-500 mt-2">Only administrators can suspend or activate users.</p>}
          </div>

          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-accent-cyan" />
              <h3 className="text-sm font-semibold text-white">System Performance Monitoring</h3>
            </div>
            <div className="space-y-3">
              {systemHealth.map((s) => (
                <div key={s.metric}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Radar size={11} className="text-slate-500" />{s.metric}
                    </span>
                    <span className={`font-mono font-bold ${s.status === 'operational' ? 'text-emerald-400' : 'text-amber-400'}`}>{s.value}% · {s.status.toUpperCase()}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: s.status === 'operational' ? 'linear-gradient(90deg,#22c55e,#22d3ee)' : 'linear-gradient(90deg,#f59e0b,#f97316)' }} initial={{ width: 0 }} whileInView={{ width: `${s.value}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-500/5 p-3 flex items-start gap-2">
              <AlertTriangle size={14} className="text-amber-300 mt-0.5 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Simulated telemetry. A degraded radar feed is intentionally shown to demonstrate operational-status monitoring. No real system metrics are collected.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}