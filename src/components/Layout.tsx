import React from 'react'
import { motion } from 'framer-motion'

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export const SectionTitle: React.FC<{ title: string; subtitle?: string; badge?: string }> = ({ title, subtitle, badge }) => {
  return (
    <div className="mb-6">
      {badge && (
        <span className="pill text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10 mb-3">{badge}</span>
      )}
      <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      {subtitle && <p className="text-sm text-slate-400 mt-1 max-w-2xl">{subtitle}</p>}
    </div>
  )
}

export const DemoBanner: React.FC = () => {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 pointer-events-none flex justify-center mt-2 px-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md shadow-lg"
      >
        Demo / Simulation Data
      </motion.div>
    </div>
  )
}
