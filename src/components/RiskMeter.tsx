import React from 'react'
import { motion } from 'framer-motion'
import { riskColor } from '../data/demoData'

interface RiskMeterProps {
  score: number
  label?: string
  size?: number
  color?: string
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, label = 'Risk Score', size = 140, color }) => {
  const stroke = size > 100 ? 12 : 8
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const effectiveColor = color || (score >= 80 ? '#ef4444' : score >= 60 ? '#f97316' : score >= 35 ? '#eab308' : '#22c55e')

  const level = score >= 80 ? 'EXTREME' : score >= 60 ? 'HIGH' : score >= 35 ? 'MODERATE' : 'LOW'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke="#1e293b" strokeWidth={stroke} fill="none"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            stroke={effectiveColor} strokeWidth={stroke} fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset: offset }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 8px ${effectiveColor}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: effectiveColor }}>{score}</span>
          <span className="text-[10px] text-slate-400">{label}</span>
        </div>
      </div>
      <span className="pill" style={{ color: effectiveColor, borderColor: `${effectiveColor}44`, backgroundColor: `${effectiveColor}11` }}>
        {level}
      </span>
    </div>
  )
}
