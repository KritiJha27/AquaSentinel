import React from 'react'
import { motion } from 'framer-motion'

interface TimelineItem {
  title: string
  subtitle?: string
  time: string
  status?: 'done' | 'current' | 'upcoming'
}

export const Timeline: React.FC<{ items: TimelineItem[] }> = ({ items }) => {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 bottom-2 w-px bg-white/10" />
      <div className="space-y-4">
        {items.map((item, i) => {
          const color = item.status === 'done' ? '#22c55e' : item.status === 'current' ? '#22d3ee' : '#64748b'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <div className="absolute -left-6 top-1">
                <span className={`h-3 w-3 rounded-full border-2`} style={{ borderColor: color, background: color, boxShadow: `0 0 8px ${color}66` }} />
              </div>
              <div className="pl-0">
                <div className="text-sm font-semibold text-white">{item.title}</div>
                {item.subtitle && <div className="text-xs text-slate-400">{item.subtitle}</div>}
                <div className="text-[10px] text-slate-600 mt-0.5">{item.time}</div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
