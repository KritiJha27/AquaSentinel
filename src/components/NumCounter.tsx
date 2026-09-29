import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { BrainCircuit } from 'lucide-react'

interface NumCounterProps {
  value: number
  duration?: number
  suffix?: string
  className?: string
}

export const NumCounter: React.FC<NumCounterProps> = ({ value, duration = 1.5, suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start({ opacity: 1 })
  }, [inView, controls])

  useEffect(() => {
    let raf = 0
    if (inView) {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / (duration * 1000), 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        if (ref.current) ref.current.textContent = Math.round(eased * value).toLocaleString() + suffix
        if (progress < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration, suffix])

  return (
    <motion.span ref={ref} className={className} initial={{ opacity: 0 }} animate={controls}>
      0{suffix}
    </motion.span>
  )
}

interface AIConfidenceCardProps {
  confidence: number
  reasons?: { label: string; positive: boolean }[]
}

export const AIConfidenceCard: React.FC<AIConfidenceCardProps> = ({ confidence, reasons = [] }) => {
  const color = confidence >= 80 ? '#22c55e' : confidence >= 60 ? '#eab308' : '#f97316'
  return (
    <div className="glass p-5">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit size={18} className="text-accent-cyan" />
        <h3 className="text-sm font-semibold text-white">AI Forecast Confidence</h3>
      </div>
      <div className="flex items-end gap-2 mb-2">
        <span className="text-4xl font-bold" style={{ color }}>{confidence}%</span>
        <span className="text-xs text-slate-500 mb-2">confidence</span>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${confidence}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
      {reasons.length > 0 && (
        <div className="space-y-1.5">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`h-1.5 w-1.5 rounded-full ${r.positive ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={r.positive ? 'text-emerald-300' : 'text-red-300'}>{r.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
