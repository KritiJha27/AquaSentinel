import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Mail, Lock, Eye, EyeOff, User, ShieldCheck, LogIn, UserPlus,
  CloudRain, Droplets, Waves, ArrowRight, MapPin, Activity, Globe2,
  CheckCircle2, Circle, ChevronLeft, ChevronRight, FlaskConical, Landmark, Crown, KeyRound, BadgeCheck, Sparkles,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { demoAccounts, roleLabels, Role } from '../auth/auth'

const features = [
  { icon: CloudRain, text: 'AI Heavy-Rainfall Prediction' },
  { icon: Waves, text: 'Rainfall-to-Inundation Digital Twin' },
  { icon: MapPin, text: 'Hyperlocal Risk Mapping' },
  { icon: Activity, text: 'Glacier, Cloudburst & Coastal Monitoring' },
]

export const Auth: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()
  const { pushToast } = useApp()
  const [mode, setMode] = useState<'login' | 'signup'>(location.pathname === '/register' ? 'signup' : 'login')
  const [busy, setBusy] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: true })
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'public' as Role, terms: false })
  const [step, setStep] = useState(1)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const steps = [
    { n: 1, label: 'Account', sub: 'Profile details' },
    { n: 2, label: 'Security', sub: 'Create password' },
    { n: 3, label: 'Role & Review', sub: 'Access level' },
  ]

  const roleCards = [
    { key: 'public' as Role, icon: User, title: 'Public User', desc: 'Live alerts, safe routes, SOS & hyperlocal risk maps', badge: '' },
    { key: 'scientist' as Role, icon: FlaskConical, title: 'Research Scientist', desc: 'Model verification, prediction review & analytics tools', badge: 'REVIEW TOOLS' },
    { key: 'authority' as Role, icon: Landmark, title: 'Disaster Authority', desc: 'Command center, warning broadcast & coordination', badge: 'NDMA / DISTRICT' },
    { key: 'admin' as Role, icon: Crown, title: 'Administrator', desc: 'System governance, approvals & user management', badge: 'GOVERNANCE' },
  ]

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(signupForm.email)
  const pwRules = [
    { label: '8+ characters', ok: (p: string) => p.length >= 8 },
    { label: 'Upper & lowercase', ok: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
    { label: 'At least one number', ok: (p: string) => /\d/.test(p) },
    { label: 'Special character', ok: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ]
  const pwScore = pwRules.filter((r) => r.ok(signupForm.password)).length
  const pwLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const pwColor = ['#ef4444', '#f97316', '#22c55e', '#22d3ee']
  const pwMatch = signupForm.confirm.length > 0 && signupForm.password === signupForm.confirm

  const nextStep = () => {
    setError('')
    if (step === 1) {
      if (!signupForm.name.trim()) { setError('Please enter your full name'); setTouched({ ...touched, name: true }); return }
      if (!emailValid) { setError('Please enter a valid email address'); setTouched({ ...touched, email: true }); return }
      setStep(2)
    } else if (step === 2) {
      if (signupForm.password.length < 8) { setError('Password must be at least 8 characters'); setTouched({ ...touched, password: true }); return }
      if (signupForm.password !== signupForm.confirm) { setError('Passwords do not match'); setTouched({ ...touched, confirm: true }); return }
      setStep(3)
    }
  }

  const switchMode = (m: 'login' | 'signup') => {
    setMode(m)
    setError('')
    setStep(1)
    setTouched({})
    navigate(m === 'signup' ? '/register' : '/login', { replace: true })
  }

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!loginForm.email || !loginForm.password) {
      setError('Please enter your email and password')
      return
    }
    setBusy(true)
    try {
      await login(loginForm.email, loginForm.password, loginForm.remember)
      pushToast('Welcome back to AquaSentinel AI')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const quickFill = (acc: (typeof demoAccounts)[number]) => {
    setLoginForm({ ...loginForm, email: acc.email, password: acc.password })
    setMode('login')
    pushToast(`Demo credentials filled for ${roleLabels[acc.role]} (${acc.role})`)
  }

  const doSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const f = signupForm
    if (!f.name.trim() || !f.email.trim() || !f.password) {
      setError('Please fill in all required fields')
      return
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) {
      setError('Please enter a valid email address')
      return
    }
    if (f.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (f.password !== f.confirm) {
      setError('Passwords do not match')
      return
    }
    if (!f.terms) {
      setTouched({ ...touched, terms: true })
      setError('Please accept the terms to continue')
      return
    }
    setBusy(true)
    try {
      await register(f.name, f.email, f.password)
      pushToast('Account created — welcome to AquaSentinel AI')
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  const inputCls =
    'w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none'

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 radial-bg" />
      <div className="fixed inset-0 grid-bg opacity-40" />
      <motion.div
        className="fixed -top-40 -right-40 h-[520px] w-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.18), transparent 60%)' }}
        animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.15, 1] }}
        transition={{ duration: 9, repeat: Infinity }}
      />
      <AnimatePresence>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8"
        >
          <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="hidden lg:flex flex-col justify-between p-8 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl"
            >
              <div>
                <div className="flex items-center gap-3 mb-10">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center shadow-lg shadow-cyan-900/50">
                    <ShieldCheck size={26} className="text-navy-950" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold text-white tracking-tight">AquaSentinel <span className="text-accent-cyan">AI</span></div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Predict Rain · Map Water · Trigger Action</div>
                  </div>
                </div>

                <h1 className="text-3xl font-extrabold text-white leading-tight">
                  Integrated Heavy-Rainfall <br />
                  <span className="gradient-text-cyan">Early Warning System</span>
                </h1>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  AquaSentinel AI fuses satellite, radar, weather observations, NWP, terrain and river data with AI/ML
                  to predict heavy rainfall, map inundation and support proactive disaster response across India.
                </p>

                <div className="mt-8 space-y-3">
                  {features.map((f, i) => (
                    <motion.div
                      key={f.text}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="flex items-center gap-3 text-sm text-slate-300"
                    >
                      <span className="h-8 w-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center">
                        <f.icon size={15} className="text-accent-cyan" />
                      </span>
                      {f.text}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                AI SYSTEM OPERATIONAL · DEMO MODE
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="glass-strong rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 lg:hidden">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                    <ShieldCheck size={22} className="text-navy-950" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="font-extrabold text-white">AquaSentinel <span className="text-accent-cyan">AI</span></div>
                    <div className="text-[9px] uppercase tracking-widest text-slate-500">Predict Rain · Map Water · Trigger Action</div>
                  </div>
                </div>

                <div className="flex rounded-xl bg-white/5 border border-white/10 p-1 mb-6">
                  {(['login', 'signup'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => switchMode(m)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all ${mode === m ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {m === 'login' ? <LogIn size={14} /> : <UserPlus size={14} />}
                      {m === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                  ))}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                {mode === 'login' ? (
                  <form onSubmit={doLogin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Email Address</label>
                      <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 focus-within:border-accent-cyan/50 transition-colors">
                        <Mail size={15} className="text-slate-500 shrink-0" />
                        <input
                          type="email"
                          className={inputCls}
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Password</label>
                      <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 focus-within:border-accent-cyan/50 transition-colors">
                        <Lock size={15} className="text-slate-500 shrink-0" />
                        <input
                          type={showPw ? 'text' : 'password'}
                          className={inputCls}
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          autoComplete="current-password"
                        />
                        <button type="button" onClick={() => setShowPw((s) => !s)} className="text-slate-500 hover:text-slate-300 shrink-0" aria-label="Toggle password visibility">
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={loginForm.remember}
                          onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                          className="accent-cyan-400 h-3.5 w-3.5"
                        />
                        Remember me
                      </label>
                      <button
                        type="button"
                        onClick={() => pushToast('Demo: a password-reset link would be emailed to you')}
                        className="text-xs text-accent-cyan hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-primary w-full justify-center !py-3"
                    >
                      {busy ? <span className="animate-pulse">VERIFYING…</span> : (
                        <>
                          <LogIn size={16} /> Login to Dashboard <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={doSignup}>
                    <div className="mb-6">
                      <div className="flex items-start">
                        {steps.map((s, i) => (
                          <React.Fragment key={s.n}>
                            <div className="flex flex-col items-center">
                              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${s.n < step ? 'bg-accent-cyan border-accent-cyan text-navy-950' : s.n === step ? 'border-accent-cyan/60 text-accent-cyan bg-accent-cyan/10 shadow-[0_0_0_4px_rgba(34,211,238,0.12)]' : 'border-white/15 text-slate-500 bg-white/[0.03]'}`}>
                                {s.n < step ? <CheckCircle2 size={16} strokeWidth={2.5} /> : s.n}
                              </div>
                              <span className={`mt-1.5 text-[10px] font-bold tracking-wide ${s.n === step ? 'text-accent-cyan' : s.n < step ? 'text-slate-300' : 'text-slate-600'}`}>{s.label}</span>
                              <span className="hidden sm:block text-[9px] text-slate-600">{s.sub}</span>
                            </div>
                            {i < steps.length - 1 && (
                              <div className={`self-start mt-[18px] flex-1 h-px mx-2 sm:mx-3 ${s.n < step ? 'bg-gradient-to-r from-accent-cyan/70 to-accent-cyan/30' : 'bg-white/10'}`} />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div
                          key="s1"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Full Name</label>
                            <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 focus-within:border-accent-cyan/50 transition-colors ${touched.name && !signupForm.name.trim() ? 'border-red-400/50 bg-red-500/[0.04]' : 'border-white/10 bg-white/[0.03]'}`}>
                              <User size={15} className="text-slate-500 shrink-0" />
                              <input
                                type="text"
                                className={inputCls}
                                placeholder="Your full name"
                                value={signupForm.name}
                                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                                onBlur={() => setTouched({ ...touched, name: true })}
                                autoComplete="name"
                              />
                              {signupForm.name.trim() && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Email Address</label>
                            <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 focus-within:border-accent-cyan/50 transition-colors ${touched.email && signupForm.email && !emailValid ? 'border-red-400/50 bg-red-500/[0.04]' : 'border-white/10 bg-white/[0.03]'}`}>
                              <Mail size={15} className="text-slate-500 shrink-0" />
                              <input
                                type="email"
                                className={inputCls}
                                placeholder="you@example.com"
                                value={signupForm.email}
                                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                                onBlur={() => setTouched({ ...touched, email: true })}
                                autoComplete="email"
                              />
                              {emailValid && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
                            </div>
                            {touched.email && signupForm.email && !emailValid && (
                              <p className="mt-1.5 text-[10px] text-red-400">Enter a valid email, e.g. you@example.com</p>
                            )}
                          </div>

                          <div className="flex justify-end pt-1">
                            <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2 !py-2.5 !px-5">
                              Continue <ChevronRight size={15} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="s2"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Create Password</label>
                            <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 focus-within:border-accent-cyan/50 transition-colors ${touched.password && signupForm.password.length < 8 ? 'border-red-400/50 bg-red-500/[0.04]' : 'border-white/10 bg-white/[0.03]'}`}>
                              <KeyRound size={15} className="text-slate-500 shrink-0" />
                              <input
                                type={showPw ? 'text' : 'password'}
                                className={inputCls}
                                placeholder="Min 8 characters"
                                value={signupForm.password}
                                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                                onBlur={() => setTouched({ ...touched, password: true })}
                                autoComplete="new-password"
                              />
                              {pwScore === 4 && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
                            </div>

                            {signupForm.password && (
                              <div className="mt-2">
                                <div className="flex items-center gap-1.5">
                                  {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="h-1 flex-1 rounded-full transition-colors duration-300" style={{ background: i < pwScore ? pwColor[pwScore - 1] : 'rgba(255,255,255,0.08)' }} />
                                  ))}
                                </div>
                                <div className="mt-1.5 text-[10px] font-semibold" style={{ color: pwScore > 0 ? pwColor[pwScore - 1] : '#94a3b8' }}>
                                  {pwScore === 0 ? 'Too weak — try adding more character types' : `${pwLabels[pwScore - 1]} password`}
                                </div>
                              </div>
                            )}

                            <div className={`mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 ${signupForm.password ? '' : 'opacity-50'}`}>
                              {pwRules.map((r) => (
                                <div key={r.label} className={`flex items-center gap-1.5 text-[10px] ${r.ok(signupForm.password) ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {r.ok(signupForm.password) ? <CheckCircle2 size={11} /> : <Circle size={11} />} {r.label}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Confirm Password</label>
                            <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 focus-within:border-accent-cyan/50 transition-colors ${touched.confirm && !pwMatch ? 'border-red-400/50 bg-red-500/[0.04]' : 'border-white/10 bg-white/[0.03]'}`}>
                              <Lock size={15} className="text-slate-500 shrink-0" />
                              <input
                                type={showPw ? 'text' : 'password'}
                                className={inputCls}
                                placeholder="Repeat password"
                                value={signupForm.confirm}
                                onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })}
                                onBlur={() => setTouched({ ...touched, confirm: true })}
                                autoComplete="new-password"
                              />
                              {pwMatch && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
                            </div>
                            {touched.confirm && !pwMatch && (
                              <p className="mt-1.5 text-[10px] text-red-400">Passwords do not match</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-white/25 transition-all">
                              <ChevronLeft size={14} /> Back
                            </button>
                            <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2 !py-2.5 !px-5">
                              Continue <ChevronRight size={15} />
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="s3"
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -16 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Select Access Role</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {roleCards.map((rc) => (
                                <button
                                  key={rc.key}
                                  type="button"
                                  onClick={() => setSignupForm({ ...signupForm, role: rc.key })}
                                  className={`relative rounded-xl border p-3.5 text-left transition-all ${signupForm.role === rc.key ? 'border-accent-cyan/60 bg-accent-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.08)]' : 'border-white/10 bg-white/[0.03] hover:border-white/25'}`}
                                >
                                  {signupForm.role === rc.key && (
                                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                                  )}
                                  <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${signupForm.role === rc.key ? 'bg-accent-cyan/20' : 'bg-white/5'}`}>
                                      <rc.icon size={15} className={signupForm.role === rc.key ? 'text-accent-cyan' : 'text-slate-400'} />
                                    </span>
                                    <div>
                                      <div className="text-xs font-bold text-slate-100 leading-tight">{rc.title}</div>
                                      <div className="text-[9px] text-slate-500">{roleLabels[rc.key]}</div>
                                    </div>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed">{rc.desc}</p>
                                  <div className="mt-2">
                                    {rc.badge && (
                                      <span className="inline-block text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">{rc.badge}</span>
                                    )}
                                    {rc.key !== 'public' && <span className="inline-block ml-1 text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">APPROVAL REQUIRED</span>}
                                    {rc.key === 'public' && <span className="inline-block text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">IMMEDIATE ACCESS</span>}
                                  </div>
                                </button>
                              ))}
                            </div>
                            {signupForm.role !== 'public' && (
                              <p className="mt-2 text-[10px] text-amber-300/90 flex items-center gap-1.5">
                                <BadgeCheck size={12} /> Restricted roles require admin approval / KYC verification in production — demo assigns immediately for presentation.
                              </p>
                            )}
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                            <div className="text-[10px] font-semibold text-slate-500 mb-2 uppercase tracking-widest">Review</div>
                            <div className="grid grid-cols-3 gap-2 text-[11px]">
                              <div className="min-w-0">
                                <div className="text-[10px] text-slate-500">Name</div>
                                <div className="text-slate-100 font-semibold truncate">{signupForm.name || '—'}</div>
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] text-slate-500">Email</div>
                                <div className="text-slate-100 font-semibold truncate">{signupForm.email || '—'}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-slate-500">Role</div>
                                <div className="text-accent-cyan font-semibold capitalize truncate">{roleLabels[signupForm.role]}</div>
                              </div>
                            </div>
                          </div>

                          <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={signupForm.terms}
                              onChange={(e) => setSignupForm({ ...signupForm, terms: e.target.checked })}
                              className="accent-cyan-400 h-3.5 w-3.5 mt-0.5"
                            />
                            <span>I agree to AquaSentinel's terms & privacy policy, and understand this is a demo prototype using simulated data.</span>
                          </label>
                          {touched.terms && !signupForm.terms && (
                            <p className="text-[10px] text-red-400 -mt-1">Please accept the terms to continue.</p>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-white/25 transition-all">
                              <ChevronLeft size={14} /> Back
                            </button>
                            <button type="submit" disabled={busy} className="btn-primary flex items-center gap-2 !py-2.5 !px-5">
                              {busy ? <span className="animate-pulse">CREATING ACCOUNT…</span> : (
                                <>
                                  <UserPlus size={16} /> Create Account <Sparkles size={14} />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                )}

                {mode === 'login' && (
                  <div className="mt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">Demo accounts</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {demoAccounts.map((acc) => (
                        <button
                          key={acc.email}
                          onClick={() => quickFill(acc)}
                          className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left hover:border-accent-cyan/40 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-200 truncate">{acc.label}</span>
                            <span className="text-[10px] text-accent-cyan/70 group-hover:text-accent-cyan">{acc.role.toUpperCase()}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate mt-0.5">{acc.email}</div>
                        </button>
                      ))}
                    </div>
                    <p className="mt-2.5 text-[10px] text-slate-500 flex items-center gap-1.5">
                      <Globe2 size={11} /> Demo authentication runs in-browser with PBKDF2-hashed passwords — no plaintext stored. Production path documented in README.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 text-[10px] text-slate-600">
        <Droplets size={11} /> Demo / Simulation Data — for Smart India Hackathon 2026 presentation only
      </div>
    </div>
  )
}