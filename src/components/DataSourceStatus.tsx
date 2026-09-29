import React from 'react'
import { motion } from 'framer-motion'
import type { DataSourceStatus as DataSourceStatusType } from '../types'
import { dataSourceStatus } from '../data/demoData'

export const DataSourceStatus: React.FC = () => {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Data Source Status</h3>
        <span className="text-[11px] text-slate-500">Last Updated: 2 min ago</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {dataSourceStatus.map((ds: DataSourceStatusType, i) => (
          <motion.div
            key={ds.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex items-center gap-2.5"
          >
            <span className="text-xl">{ds.icon}</span>
            <div className="flex-1">
              <div className="text-xs font-semibold text-slate-200">{ds.name}</div>
              <div className={`flex items-center gap-1 text-[10px] ${ds.status === 'online' ? 'text-emerald-400' : 'text-amber-400'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${ds.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {ds.status === 'online' ? 'Online' : 'Available'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-[10px] text-slate-600">
        Demo/Simulation connectivity. Real APIs may replace demo data in production deployment.
      </p>
    </div>
  )
}
