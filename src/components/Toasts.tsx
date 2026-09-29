import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { CheckCircle2 } from 'lucide-react'

export const Toasts: React.FC = () => {
  const { toasts } = useApp()
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((t, i) => (
          <motion.div
            key={t + i}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm font-medium shadow-lg backdrop-blur-xl pointer-events-auto"
          >
            <CheckCircle2 size={16} />
            {t}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
