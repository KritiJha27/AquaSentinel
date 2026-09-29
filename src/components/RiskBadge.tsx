import React from 'react'
import { motion } from 'framer-motion'
import { riskColor } from '../data/demoData'

interface RiskBadgeProps {
  level: string
  text?: boolean
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'sm', showLabel = true }) => {
  const color = riskColor(level as never) || '#22c55e'
  const sz = size === 'sm' ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5'
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`relative ${sz} rounded-full`} style={{ backgroundColor: color }}>
        <span className={`absolute inset-0 rounded-full ${showLabel ? 'pulse-dot' : ''}`} style={{ color, display: showLabel ? 'block' : 'none' }} />
      </span>
      {showLabel && (
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>
          {level}
        </span>
      )}
    </span>
  )
}
