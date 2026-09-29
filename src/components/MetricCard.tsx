import React from 'react'
import { motion } from 'framer-motion'

interface MetricCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: React.ReactNode
  color?: string
  accent?: string
  delay?: number
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, icon, color = '#22d3ee', accent = 'text-slate-300', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass glass-hover p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color }}>{label}</span>
        {icon && <span className="text-slate-500">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl md:text-3xl font-bold ${accent}`}>{value}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
    </motion.div>
  )
}
