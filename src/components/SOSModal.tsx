import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from './Modal'
import { useApp } from '../context/AppContext'

const contacts = [
  { label: 'National Emergency', value: '112', note: 'India-wide emergency number' },
  { label: 'Fire & Rescue', value: '101', note: 'Fire and rescue services' },
  { label: 'Ambulance', value: '108', note: 'Emergency medical services' },
  { label: 'Disaster Helpline', value: '1078', note: 'National Disaster Response Force' },
  { label: 'Police', value: '100', note: 'Local law enforcement' },
  { label: 'Flood Control Room', value: 'State/local', note: 'District disaster management' },
]

export const SOSModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { pushToast } = useApp()
  const [shared, setShared] = useState(false)

  const shareLocation = () => {
    if (!('geolocation' in navigator)) {
      pushToast('Demo: location sharing unavailable in this browser — simulated location sent')
      setShared(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        pushToast('Demo: your location has been shared with the control room')
        setShared(true)
      },
      () => {
        pushToast('Demo: location permission denied — simulated location sent instead')
        setShared(true)
      },
      { timeout: 5000 },
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} onClose={onClose} title="Emergency SOS">
          <div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-2xl border-2 border-red-500/50 p-5 text-center mb-5"
              style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.15), rgba(239,68,68,0.02))' }}
            >
              <div className="relative inline-flex">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-40 animate-ping" />
                <span className="relative inline-flex h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 items-center justify-center text-3xl font-black text-white shadow-lg shadow-red-900/50">
                  SOS
                </span>
              </div>
              <p className="mt-3 text-sm font-bold text-white">Emergency Response Mode</p>
              <p className="text-xs text-slate-400 mt-1">
                This is a DEMO interface. In a real emergency, dial <strong className="text-red-300">112</strong>.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-5">
              {contacts.map((c) => (
                <div key={c.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="text-[11px] font-bold text-accent-cyan">{c.value}</div>
                  <div className="text-xs text-slate-200">{c.label}</div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{c.note}</div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 mb-4">
              <div className="text-xs font-semibold text-white mb-2">Emergency Instructions (demo)</div>
              <ul className="space-y-1.5">
                {[
                  'Move to higher ground and stay away from rising water',
                  'Switch off power and gas at the main supply if flooding is imminent',
                  'Carry emergency kit — documents, torch, battery bank, medicines, water',
                  'Do not drive or walk through flooded roads — depth is unknown',
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-[11px] text-slate-400">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-red-400 shrink-0" />{s}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={shareLocation}
              className={`btn-primary w-full justify-center ${shared ? '!bg-emerald-500/20 !text-emerald-300 !border-emerald-400/40' : ''}`}
            >
              {shared ? 'Location shared ✓' : 'Share My Location with Control Room'}
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-3">
              Demo behavior — no real data is transmitted. Production integration requires an approved emergency gateway.
            </p>
          </div>
        </Modal>
      )}
    </AnimatePresence>
  )
}