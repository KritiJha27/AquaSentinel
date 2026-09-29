import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Layers, Search } from 'lucide-react'
import { demoAreas, riskColor, locations, infrastructure, evacuationZones } from '../data/demoData'
import type { AreaRiskProfile, InfrastructureAsset } from '../types'

interface MapPanelProps {
  height?: string
  onSelectArea?: (area: AreaRiskProfile) => void
  centeredOnSelected?: AreaRiskProfile | null
  showControls?: boolean
  showAreaButtons?: boolean
  showInfobox?: boolean
}

const layerOptions = [
  { key: 'rainfall', label: 'Rainfall' },
  { key: 'radar', label: 'Radar' },
  { key: 'satellite', label: 'Satellite' },
  { key: 'floodRisk', label: 'Flood Risk' },
  { key: 'inundation', label: 'Predicted Inundation' },
  { key: 'waterDepth', label: 'Water Depth' },
  { key: 'rivers', label: 'Rivers' },
  { key: 'drainage', label: 'Drainage' },
  { key: 'roads', label: 'Roads' },
  { key: 'infrastructure', label: 'Critical Infrastructure' },
  { key: 'evacuation', label: 'Evacuation Zones' },
]

const infraColor: Record<string, string> = {
  Hospital: '#ef4444',
  School: '#3b82f6',
  'Fire Station': '#f97316',
  'Police Station': '#22d3ee',
  'Power Station': '#eab308',
  'Transport Hub': '#a855f7',
  Bridge: '#22c55e',
  Government: '#64748b',
}

export const MapPanel: React.FC<MapPanelProps> = ({
  height = '500px',
  onSelectArea,
  centeredOnSelected,
  showControls = true,
  showAreaButtons = true,
  showInfobox = true,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const layerGroupsRef = useRef<{ [key: string]: L.LayerGroup }>({})
  const [activeLayers, setActiveLayers] = useState<string[]>(['floodRisk', 'roads', 'infrastructure'])
  const [selected, setSelected] = useState<AreaRiskProfile | null>(null)
  const [selectedInfra, setSelectedInfra] = useState<InfrastructureAsset | null>(null)
  const [layersOpen, setLayersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredAreas, setFilteredAreas] = useState<AreaRiskProfile[]>(demoAreas)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: [9.96, 76.28],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map)

    mapRef.current = map

    layerOptions.forEach((l) => {
      layerGroupsRef.current[l.key] = L.layerGroup().addTo(map)
    })

    demoAreas.forEach((area) => {
      const circle = L.circle([area.lat, area.lng], {
        radius: 800 + area.waterDepth * 400,
        color: riskColor(area.risk),
        fillColor: riskColor(area.risk),
        fillOpacity: 0.22,
        weight: 1.5,
      })
      circle.addTo(layerGroupsRef.current.floodRisk)
      circle.on('click', () => {
        setSelected(area)
        setSelectedInfra(null)
        if (onSelectArea) onSelectArea(area)
        map.flyTo([area.lat, area.lng], 14)
      })
      circle.bindTooltip(`<div style="color:#0f172a;font-weight:700;font-size:12px">${area.name} · ${area.risk.toUpperCase()} risk</div>`, { direction: 'top' })
    })

    locations.forEach((loc) => {
      L.circleMarker([loc.lat, loc.lng], { radius: 4, color: '#f8fafc', weight: 1, fillColor: '#94a3b8', fillOpacity: 0.8 }).addTo(layerGroupsRef.current.roads)
    })

    infrastructure.forEach((infra) => {
      const color = infraColor[infra.type] || '#64748b'
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:22px;height:22px;border-radius:6px;background:${color}26;border:1px solid ${color};display:flex;align-items:center;justify-content:center;font-size:11px">&#127961;</div>`,
      })
      const marker = L.marker([infra.lat, infra.lng], { icon })
      marker.addTo(layerGroupsRef.current.infrastructure)
      marker.on('click', () => {
        setSelectedInfra(infra)
        setSelected(null)
        map.flyTo([infra.lat, infra.lng], 15)
      })
      marker.bindTooltip(`<div style="color:#0f172a;font-weight:700;font-size:12px">${infra.name} · ${infra.risk.toUpperCase()}</div>`, { direction: 'top' })
    })

    evacuationZones.forEach((zone) => {
      const color = riskColor(zone.severity)
      const circle = L.circle([zone.lat, zone.lng], {
        radius: 1200,
        color,
        fillColor: color,
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '6 6',
      })
      circle.addTo(layerGroupsRef.current.evacuation)
      circle.bindTooltip(`<div style="color:#0f172a;font-weight:700;font-size:12px">Evac ${zone.name} · P${zone.priority}</div>`, { direction: 'top' })
    })

    L.polyline(
      [[9.958, 76.268], [9.968, 76.276]],
      { color: '#475569', weight: 3, opacity: 0.6 }
    ).addTo(layerGroupsRef.current.roads)

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [onSelectArea])

  useEffect(() => {
    if (centeredOnSelected && mapRef.current) {
      mapRef.current.flyTo([centeredOnSelected.lat, centeredOnSelected.lng], 14)
      setSelected(centeredOnSelected)
    }
  }, [centeredOnSelected])

  useEffect(() => {
    if (!search.trim()) {
      setFilteredAreas(demoAreas)
      return
    }
    setFilteredAreas(demoAreas.filter((a) => a.name.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  const handleSelect = (area: AreaRiskProfile) => {
    if (mapRef.current) {
      mapRef.current.flyTo([area.lat, area.lng], 14)
    }
    setSelected(area)
    setSelectedInfra(null)
    if (onSelectArea) onSelectArea(area)
  }

  const toggleLayer = (key: string) => {
    setActiveLayers((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      const group = layerGroupsRef.current[key]
      if (group && mapRef.current) {
        if (next.includes(key)) group.addTo(mapRef.current)
        else mapRef.current.removeLayer(group)
      }
      return next
    })
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40" style={{ height }}>
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {showControls && (
        <>
          <div className="absolute top-3 left-3 z-[500] flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-navy-900/85 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 w-44 md:w-56">
              <Search size={14} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search area..."
                className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none w-full"
                aria-label="Search location"
              />
            </div>
            <AnimatePresence>
              {search.trim() && filteredAreas.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-12 left-0 mt-1 w-44 md:w-56 glass-strong p-1.5 z-50"
                >
                  {filteredAreas.map((a) => (
                    <button key={a.id} onClick={() => { handleSelect(a); setSearch('') }} className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: riskColor(a.risk) }} />
                      {a.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setLayersOpen((o) => !o)}
            className="absolute top-3 right-3 z-[500] flex items-center gap-1.5 px-3 py-2 bg-navy-900/85 backdrop-blur-md border border-white/10 rounded-lg text-xs font-medium text-slate-200 hover:border-accent-cyan/40 transition-colors"
          >
            <Layers size={14} className="text-accent-cyan" />
            Layers
          </button>

          <AnimatePresence>
            {layersOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-14 right-3 z-[500] bg-navy-900/90 backdrop-blur-xl border border-white/10 rounded-xl p-3 w-52 max-h-[62%] overflow-y-auto"
              >
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Map Layers</div>
                <div className="space-y-1.5">
                  {layerOptions.map((l) => {
                    const on = activeLayers.includes(l.key)
                    return (
                      <button
                        key={l.key}
                        onClick={() => toggleLayer(l.key)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${on ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-slate-400 hover:bg-white/5'}`}
                      >
                        <span className={`h-3 w-3 rounded border flex items-center justify-center ${on ? 'bg-accent-cyan border-accent-cyan' : 'border-slate-600'}`}>
                          {on && <span className="h-1.5 w-1.5 rounded-sm bg-navy-950" />}
                        </span>
                        {l.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      <div className="absolute bottom-3 left-3 z-[500] glass p-2.5 flex flex-col gap-1.5">
        <div className="text-[9px] uppercase tracking-widest text-slate-500">Risk Legend</div>
        <div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Low</div>
        <div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-yellow-500" /> Moderate</div>
        <div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> High</div>
        <div className="flex items-center gap-2 text-xs text-slate-300"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Extreme</div>
      </div>

      <AnimatePresence>
        {showInfobox && selected && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="absolute top-14 left-3 z-[500] w-[300px] md:w-[340px] max-h-[70%] overflow-y-auto glass-strong p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-slate-500">{selected.district} | {selected.city}</div>
                <h3 className="text-base font-bold text-white">{selected.name}</h3>
                <div className="text-[11px] text-slate-500">{selected.ward} | {selected.localArea} | {selected.roadZone}</div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-white/10 text-slate-400" aria-label="Close">
                <X size={14} />
              </button>
            </div>

            <div className="pill mb-3" style={{ color: riskColor(selected.risk), borderColor: `${riskColor(selected.risk)}44`, background: `${riskColor(selected.risk)}11` }}>
              Risk Level: {selected.risk.toUpperCase()} | {selected.riskScore}/100
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Current Rainfall</div>
                <div className="text-sm font-semibold text-slate-200">{selected.currentRainfall} mm/h</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Predicted Rainfall</div>
                <div className="text-sm font-semibold text-orange-400">{selected.predictedRainfall} mm</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Flood Probability</div>
                <div className="text-sm font-semibold text-accent-cyan">{selected.floodProbability}%</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Predicted Water Depth</div>
                <div className="text-sm font-semibold text-accent-cyan">{selected.waterDepth} m</div>
              </div>
            </div>

            <div className="text-xs text-slate-400 mb-1">Critical Infrastructure Nearby</div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selected.criticalInfrastructure.map((ci) => (
                <span key={ci} className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/10 text-red-300 border border-red-500/20">{ci}</span>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
              <strong>Recommended:</strong> {selected.recommendedAction}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInfobox && selectedInfra && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="absolute top-14 left-3 z-[500] w-[300px] md:w-[340px] glass-strong p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] text-slate-500">{selectedInfra.type}</div>
                <h3 className="text-base font-bold text-white">{selectedInfra.name}</h3>
              </div>
              <button onClick={() => setSelectedInfra(null)} className="p-1 rounded hover:bg-white/10 text-slate-400" aria-label="Close">
                <X size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Flood Depth</div>
                <div className="text-sm font-bold text-slate-200">{selectedInfra.inundation} m</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Flood Probability</div>
                <div className="text-sm font-bold text-accent-cyan">{selectedInfra.floodProbability}%</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Accessibility</div>
                <div className="text-sm font-bold" style={{ color: selectedInfra.accessibility < 50 ? '#ef4444' : '#22c55e' }}>{selectedInfra.accessibility}%</div>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-2">
                <div className="text-[10px] text-slate-500">Risk Level</div>
                <div className="text-sm font-bold" style={{ color: riskColor(selectedInfra.risk) }}>{selectedInfra.risk.toUpperCase()}</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-200 text-xs">
              <strong>Recommended:</strong> {selectedInfra.recommendedAction}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showAreaButtons && (
        <div className="absolute bottom-3 right-3 z-[500] flex gap-2">
          {demoAreas.slice(0, 3).map((area) => (
            <button
              key={area.id}
              onClick={() => handleSelect(area)}
              className="px-2 py-1 rounded-md bg-navy-900/85 backdrop-blur-md border border-white/10 text-[10px] text-slate-200 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors"
            >
              {area.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}