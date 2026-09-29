import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar, Legend, ComposedChart,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { rainfallForecast } from '../data/demoData'

export const ForecastChart: React.FC<{ height?: number }> = ({ height = 280 }) => {
  const data = rainfallForecast
  return (
    <div style={{ width: '100%', height }} className="font-mono">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} unit=" mm" />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
            itemStyle={{ color: '#22d3ee' }}
          />
          <Area type="monotone" dataKey="intensity" name="Rainfall Intensity" stroke="#22d3ee" strokeWidth={2} fill="url(#rainGrad)" />
          <Line type="monotone" dataKey="peak" name="Predicted Peak" stroke="#f97316" strokeWidth={2} dot={false} strokeDasharray="4 4" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export const TrendLineChart: React.FC<{ data: any[]; keys: { key: string; color: string; name: string }[]; height?: number }> = ({ data, keys, height = 260 }) => {
  return (
    <div style={{ width: '100%', height }} className="font-mono">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {keys.map((k) => (
            <Line key={k.key} type="monotone" dataKey={k.key} name={k.name} stroke={k.color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const RiskTrendChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 260 }) => {
  return (
    <div style={{ width: '100%', height }} className="font-mono">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
            itemStyle={{ color: '#ef4444' }}
          />
          <Area type="monotone" dataKey="score" stroke="#ef4444" strokeWidth={2} fill="url(#riskGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export const BarComparisonChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 260 }) => {
  return (
    <div style={{ width: '100%', height }} className="font-mono">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="model" stroke="#64748b" fontSize={11} tickFormatter={(v) => v.split(' ')[0]} />
          <YAxis stroke="#64748b" fontSize={11} unit=" mm" />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
            itemStyle={{ color: '#22d3ee' }}
          />
          <Bar dataKey="value" name="Rainfall (mm)" fill="#22d3ee" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const AlertHistoryChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 200 }) => {
  return (
    <div style={{ width: '100%', height }} className="font-mono">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} stackOffset="expand">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
          <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} stroke="#64748b" fontSize={11} />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value: number, name: string) => [`${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="advisory" name="Advisory" stackId="s" fill="#3b82f6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="watch" name="Watch" stackId="s" fill="#eab308" />
          <Bar dataKey="warning" name="Warning" stackId="s" fill="#f97316" />
          <Bar dataKey="emergency" name="Emergency" stackId="s" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export const ModelConsensusChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 240 }) => {
  return (
    <div style={{ width: '100%', height }} className="font-mono">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="short" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} unit=" mm" domain={[60, 110]} />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [`${value} mm`, 'Forecast']}
          />
          <Bar dataKey="value" name="Forecast" fill="#22d3ee" radius={[6, 6, 0, 0]} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

export const WaterDepthRangeChart: React.FC<{ data: any[]; height?: number }> = ({ data, height = 260 }) => {
  return (
    <div style={{ width: '100%', height }} className="font-mono">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} unit=" m" />
          <Tooltip
            contentStyle={{ background: '#0d1526', border: '1px solid #1e293b', borderRadius: 12 }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Line type="monotone" dataKey="min" name="Min" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="mid" name="Predicted" stroke="#22d3ee" strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="max" name="Max" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 4" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
