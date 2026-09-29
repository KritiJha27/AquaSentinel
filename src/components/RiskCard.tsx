import React from 'react'
import { motion } from 'framer-motion'
import { CloudRain, TrendingUp, TrendingDown } from 'lucide-react'
import { riskColor } from '../data/demoData'

interface RiskCardProps {
  title: string
  riskLevel: string
  riskScore?: number
  metrics?: { label: string; value: string }[]
  trend?: 'up' | 'down' | 'flat'
  trendText?: string
}

export const RiskCard: React.FC<RiskCardProps> = ({ title, riskLevel, riskScore, metrics = [], trend, trendText }) => {
  const color = riskColor(riskLevel as never)
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : CloudRain
  const trendColor = trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#e2e8f0'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass glass-hover p-5 relative overflow-hidden group"
    >
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-80 transition-all"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)`, boxShadow: `0 0 20px ${color}66` }}
      />
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-300">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold uppercase tracking-wide" style={{ color }}>{riskLevel}</span>
            {riskScore !== undefined && (
              <span className="text-xs text-slate-500 font-mono">{riskScore}/100</span>
            )}
          </div>
        </div>
        {trend && (
          <div className="flex flex-col items-end">
            <TrendIcon size={20} style={{ color: trendColor }} className={trend !== 'flat' ? 'animate-pulse' : ''} />
            {trendText && <span className="text-[10px] text-slate-500 mt-1">{trendText}</span>}
          </div>
        )}
      </div>
      {metrics.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, i) => (
            <div key={i} className="rounded-lg bg-white/[0.03] p-2.5">
              <div className="text-[10px] text-slate-500">{m.label}</div>
              <div className="text-sm font-semibold text-slate-200">{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
