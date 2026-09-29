import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { indiaStateRisk, riskColor } from '../data/demoData'
import type { IndiaStateRisk } from '../types'

interface IndiaMapProps {
  height?: string
  onSelectState?: (s: IndiaStateRisk) => void
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ height = '420px', onSelectState }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const [info, setInfo] = useState<IndiaStateRisk | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [22.2, 80.2],
      zoom: 4.4,
      zoomControl: false,
      attributionControl: false,
      minZoom: 4,
      maxZoom: 7,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map)

    indiaStateRisk.forEach((state) => {
      const color = riskColor(state.risk)
      const circle = L.circle([state.lat, state.lng], {
        radius: 90000 + state.score * 1600,
        color,
        fillColor: color,
        fillOpacity: 0.28,
        weight: 1.5,
        opacity: 0.9,
      })
      circle.addTo(map)
      circle.on('click', () => {
        setInfo(state)
        if (onSelectState) onSelectState(state)
        map.flyTo([state.lat - 3.5, state.lng], 5)
      })
      circle.bindTooltip(`<div style="color:#f8fafc;font-weight:700;font-size:12px">${state.name} · ${state.risk.toUpperCase()} risk (${state.score})</div>`, {
        direction: 'top',
        className: 'leaflet-tooltip-dark',
      })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [onSelectState])

  return (
    <div className="relative">
      <div ref={containerRef} style={{ height, width: '100%', borderRadius: 16 }} />
      {info && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-navy-900/95 backdrop-blur border border-white/10 p-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-white">{info.name}</span>
            <span className="pill" style={{ color: riskColor(info.risk), borderColor: `${riskColor(info.risk)}44`, background: `${riskColor(info.risk)}11` }}>{info.risk.toUpperCase()}</span>
          </div>
          <p className="text-[11px] text-slate-300">Risk score {info.score}/100 · ~{(info.populationExposure / 1_000_000).toFixed(1)}M people exposed</p>
          <p className="text-[10px] text-slate-500 mt-0.5">{info.drivers.join(' · ')}</p>
        </div>
      )}
    </div>
  )
}