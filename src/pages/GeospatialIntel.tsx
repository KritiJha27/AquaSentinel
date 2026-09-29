import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Layers, Globe2, RefreshCcw, ChevronLeft, MapPin, Satellite, Map, Mountain as TerrainIcon, Crosshair, Info,
} from 'lucide-react'
import { DemoBanner, SectionTitle } from '../components/Layout'
import { indiaStateRisk, glacierRegions, glacialLakes, cloudburstZones, coastalStations, riskColor } from '../data/demoData'
import { basemaps, geoLayers, sampleRainfall, rainColor, GEO_POPUP_FOOTER } from '../lib/geoLayers'
import type { GeoBasemap, GeoLayerKey } from '../lib/geoLayers'

const MAPTILER_ENABLED = import.meta.env.VITE_MAPTILER_ENABLED !== 'false'

const INDIA: [number, number] = [22.8, 79.0]

interface GeoResult {
  name: string
  lat: number
  lng: number
  country?: string
}

function popupHTML(title: string, pill: { label: string; color: string }, rows: [string, string][], footer = GEO_POPUP_FOOTER): string {
  const rowsHtml = rows
    .map(([l, v]) => `<div style="display:flex;justify-content:space-between;gap:8px;font-size:11px;line-height:1.5">
      <span style="color:#64748b">${l}</span><span style="color:#e2e8f0;font-weight:600;text-align:right">${v}</span></div>`)
    .join('')
  return `<div style="min-width:190px">
    <div style="font-weight:800;font-size:13px;color:#f8fafc;margin-bottom:6px">${title}</div>
    <div style="display:inline-block;font-size:10px;font-weight:700;letter-spacing:.04em;padding:2px 8px;border-radius:999px;color:${pill.color};border:1px solid ${pill.color}44;background:${pill.color}11;margin-bottom:8px">${pill.label}</div>
    <div style="display:flex;flex-direction:column;gap:2px;border-top:1px solid #1e293b;padding-top:6px;margin-bottom:6px">${rowsHtml}</div>
    <div style="font-size:9px;color:#475569;letter-spacing:.05em;text-transform:uppercase">${footer}</div>
  </div>`
}

function markerIcon(color: string, glyph: string, size = 16): L.DivIcon {
  return L.divIcon({
    className: 'geo-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color}22;border:1.5px solid ${color};box-shadow:0 0 12px ${color}55, 0 0 0 6px ${color}0d;display:flex;align-items:center;justify-content:center;color:${color};font-size:9px;font-weight:800">${glyph}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

const layerGlyph: Record<GeoLayerKey, string> = {
  rainfall: '≈',
  floodRisk: '∿',
  glaciers: 'Δ',
  glacialLakes: '◆',
  cloudburst: '!',
  coastal: '~',
}

export const GeospatialIntel: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const baseTilesRef = useRef<Partial<Record<GeoBasemap, L.TileLayer>>>({})
  const overlayGroupsRef = useRef<Partial<Record<GeoLayerKey, L.LayerGroup>>>({})
  const searchMarkerRef = useRef<L.Marker | null>(null)
  const [panelOpen, setPanelOpen] = useState(() => window.innerWidth >= 1024)
  const [base, setBase] = useState<GeoBasemap>('hybrid')
  const [active, setActive] = useState<GeoLayerKey[]>(['floodRisk', 'rainfall', 'glacialLakes', 'cloudburst', 'coastal'])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeoResult[]>([])
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState(false)
  const [tilesFailed, setTilesFailed] = useState(false)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, {
      center: INDIA,
      zoom: 5,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: true,
    })
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.control.scale({ position: 'bottomright', imperial: false }).addTo(map)
    mapRef.current = map

    const mkBase = (style: GeoBasemap) => {
      const layer = L.tileLayer(`/api/maptiler/tile/${style}/{z}/{x}/{y}`, {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
      layer.on('tileerror', () => {
        setTilesFailed(true)
        map.removeLayer(layer)
      })
      return layer
    }
    baseTilesRef.current = { hybrid: mkBase('hybrid'), streets: mkBase('streets'), topo: mkBase('topo') }
    baseTilesRef.current[base]?.addTo(map)

    const mkGroup = (): L.LayerGroup => L.layerGroup()
    const g = overlayGroupsRef.current
    g.rainfall = mkGroup()
    g.floodRisk = mkGroup()
    g.glaciers = mkGroup()
    g.glacialLakes = mkGroup()
    g.cloudburst = mkGroup()
    g.coastal = mkGroup()

    sampleRainfall.forEach((c) => {
      const color = rainColor[c.intensity]
      const marker = L.circleMarker([c.lat, c.lng], {
        radius: 6 + c.mm / 8,
        color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: 0.4,
      })
      marker.on('click', () => map.flyTo([c.lat, c.lng], 9))
      marker.bindPopup(popupHTML(`${c.name} — rainfall`, { label: c.intensity.toUpperCase(), color }, [['Intensity', `${c.intensity} mm/h`], ['Observed', `${c.mm} mm (sample)`]]))
      marker.bindTooltip(`<div style="font-size:11px;font-weight:700;color:#e2e8f0">${c.name} · ${c.intensity}</div>`, { direction: 'top' })
      marker.addTo(g.rainfall!)
    })

    indiaStateRisk.forEach((s) => {
      const color = riskColor(s.risk)
      const circle = L.circle([s.lat, s.lng], {
        radius: 52000 + s.score * 700,
        color,
        weight: 1.5,
        fillColor: color,
        fillOpacity: s.risk === 'extreme' ? 0.28 : s.risk === 'high' ? 0.18 : 0.1,
      })
      circle.bindPopup(popupHTML(`Flood risk — ${s.name}`, { label: s.risk.toUpperCase(), color }, [
        ['Risk score', `${s.score}/100`],
        ['Population exposed', s.populationExposure.toLocaleString('en-IN')],
        ['Key drivers', s.drivers.slice(0, 2).join(' · ')],
      ]))
      circle.bindTooltip(`<div style="font-size:11px;font-weight:700;color:#e2e8f0">${s.name} · ${s.score}</div>`, { direction: 'top' })
      circle.addTo(g.floodRisk!)
    })

    glacierRegions.forEach((gl) => {
      const color = riskColor(gl.risk)
      const marker = L.marker([gl.lat, gl.lng], { icon: markerIcon(color, 'Δ', 17) })
      marker.bindPopup(popupHTML(gl.name, { label: gl.risk.toUpperCase(), color }, [
        ['State', gl.state],
        ['Area (2026)', `${gl.area2026} km²`],
        ['Change', `${gl.changePercent}%`],
        ['Proglacial lakes', `${gl.lakeCount}`],
      ]))
      marker.bindTooltip(`<div style="font-size:11px;font-weight:700;color:#e2e8f0">${gl.name}</div>`, { direction: 'top' })
      marker.addTo(g.glaciers!)
    })

    glacialLakes.forEach((lk) => {
      const color = riskColor(lk.risk)
      if (lk.risk === 'extreme' || lk.risk === 'high') {
        L.marker([lk.lat, lk.lng], { icon: markerIcon(color, '◆', 14) })
          .bindPopup(popupHTML(lk.name, { label: `${lk.risk.toUpperCase()} · GLOF`, color }, [
            ['Lake area', `${lk.areaHa} ha`],
            ['Growth', `+${lk.growthPercent}%`],
            ['Freeze score', `${lk.freezeScore}/100`],
          ]))
          .addTo(g.glacialLakes!)
      }
      L.circleMarker([lk.lat, lk.lng], { radius: 5, color, weight: 1.5, fillColor: color, fillOpacity: 0.5 })
        .bindTooltip(`<div style="font-size:11px;font-weight:700;color:#e2e8f0">${lk.name} · ${lk.risk}</div>`, { direction: 'top' })
        .addTo(g.glacialLakes!)
    })

    cloudburstZones.forEach((cz) => {
      const color = riskColor(cz.risk)
      L.circle([cz.lat, cz.lng], {
        radius: 26000,
        color,
        weight: 2,
        dashArray: '8 8',
        fillColor: color,
        fillOpacity: 0.08,
      })
        .bindPopup(popupHTML(cz.name, { label: cz.risk.toUpperCase(), color }, [
          ['State', cz.state],
          ['Confidence', `${cz.confidence}%`],
          ['Trigger rate', `${cz.triggerRate}%`],
          ['Last event', cz.lastEvent],
        ]))
        .addTo(g.cloudburst!)
      L.marker([cz.lat, cz.lng], { icon: markerIcon(color, '!', 15) })
        .bindTooltip(`<div style="font-size:11px;font-weight:700;color:#e2e8f0">${cz.name} · cloudburst</div>`, { direction: 'top' })
        .addTo(g.cloudburst!)
    })

    coastalStations.forEach((cs) => {
      const color = riskColor(cs.coastalRisk)
      L.circleMarker([cs.lat, cs.lng], { radius: 8, color, weight: 2, fillColor: color, fillOpacity: 0.5 })
        .bindPopup(popupHTML(cs.name, { label: cs.coastalRisk.toUpperCase(), color }, [
          ['State', cs.state],
          ['Sea surface temp', `${cs.sst} °C`],
          ['Tide', `${cs.tideHeight} m`],
          ['Wave', `${cs.waveHeight} m`],
        ]))
        .bindTooltip(`<div style="font-size:11px;font-weight:700;color:#e2e8f0">${cs.name} · ${cs.coastalRisk}</div>`, { direction: 'top' })
        .addTo(g.coastal!)
    })

    return () => {
      map.remove()
      mapRef.current = null
      baseTilesRef.current = {}
      overlayGroupsRef.current = {}
      searchMarkerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    Object.values(baseTilesRef.current).forEach((t) => map.removeLayer(t))
    baseTilesRef.current[base]?.addTo(map)
  }, [base])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    geoLayers.forEach((l) => {
      const group = overlayGroupsRef.current[l.key]
      if (!group) return
      if (active.includes(l.key)) group.addTo(map)
      else map.removeLayer(group)
    })
  }, [active])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearchErr(false)
      return
    }
    let alive = true
    setSearching(true)
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/maptiler/geocode?q=${encodeURIComponent(query.trim())}`)
        if (!r.ok) throw new Error('geocode failed')
        const data = await r.json()
        if (!alive) return
        const mapped: GeoResult[] = (data.features || [])
          .filter((f: any) => Array.isArray(f.center) && f.center.length === 2)
          .map((f: any) => ({
            name: f.place_name || f.text || 'Unknown',
            lng: f.center[0],
            lat: f.center[1],
            country: f.context?.find((c: any) => c.id?.startsWith('country'))?.text,
          }))
        setResults(mapped.slice(0, 6))
        setSearchErr(false)
      } catch {
        if (alive) setSearchErr(true)
      } finally {
        if (alive) setSearching(false)
      }
    }, 400)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [query])

  const flyToResult = (r: GeoResult) => {
    const map = mapRef.current
    if (!map) return
    map.flyTo([r.lat, r.lng], 11)
    searchMarkerRef.current?.remove()
    searchMarkerRef.current = L.marker([r.lat, r.lng], { icon: markerIcon('#22d3ee', '◉', 20) })
      .addTo(map)
      .bindPopup(popupHTML(r.name, { label: 'SEARCH RESULT', color: '#22d3ee' }, [['Position', `${r.lat.toFixed(3)}, ${r.lng.toFixed(3)}`]], 'MapTiler geocoding · live'))
      .openPopup()
    setResults([])
    setQuery(r.name)
  }

  const resetView = () => {
    mapRef.current?.flyTo(INDIA, 5)
    searchMarkerRef.current?.remove()
  }

  const toggleLayer = (k: GeoLayerKey) => {
    setActive((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]))
  }

  const baseIcon = (k: GeoBasemap) =>
    k === 'hybrid' ? <Satellite size={13} /> : k === 'streets' ? <Map size={13} /> : <TerrainIcon size={13} />
  const activeMeta = geoLayers.filter((l) => active.includes(l.key))

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      <DemoBanner />
      <div className="max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 flex flex-col flex-1">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 mb-4">
          <SectionTitle
            title="Geospatial Intelligence Map"
            badge="MAPTILER + LEAFLET"
            subtitle="Interactive India hazard map with live MapTiler basemaps, searchable locations and clearly-labeled sample hazard layers."
          />
          <div className={`pill ${MAPTILER_ENABLED ? 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10' : 'border-amber-400/40 text-amber-300 bg-amber-400/10'}`}>
            <Globe2 size={12} />
            {MAPTILER_ENABLED ? 'MapTiler connected' : 'MapTiler key not configured'}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
            {basemaps.map((b) => (
              <button
                key={b.key}
                onClick={() => setBase(b.key)}
                title={b.hint}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${base === b.key ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
              >
                {baseIcon(b.key)} {b.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[180px] max-w-md">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 focus-within:border-accent-cyan/50 transition-colors">
              <Search size={14} className="text-slate-500 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any location in India… (MapTiler geocoding)"
                className="bg-transparent text-xs text-slate-200 placeholder:text-slate-500 outline-none w-full"
                aria-label="Search location"
              />
              {searching && <span className="h-3 w-3 rounded-full border border-accent-cyan border-t-transparent animate-spin shrink-0" />}
            </div>
            <AnimatePresence>
              {(results.length > 0 || searchErr) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="absolute top-11 left-0 right-0 z-[600] glass-strong p-1.5"
                >
                  {searchErr ? (
                    <div className="px-3 py-2.5 text-xs text-amber-300 flex items-center gap-2">
                      <Info size={13} /> Geocoding unavailable — is MAPTILER_KEY set in .env?
                    </div>
                  ) : (
                    results.map((r) => (
                      <button
                        key={`${r.lat}-${r.lng}-${r.name}`}
                        onClick={() => flyToResult(r)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-white/5 text-left"
                      >
                        <MapPin size={13} className="text-accent-cyan shrink-0" />
                        <span className="truncate">{r.name}</span>
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={resetView} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-slate-300 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors">
            <Crosshair size={13} /> Reset to India
          </button>
        </div>

        <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40 geo-map" style={{ minHeight: 540 }}>
          <div ref={containerRef} className="absolute inset-0 z-0" />

          {!MAPTILER_ENABLED && (
            <div className="absolute inset-0 z-[400] flex items-center justify-center bg-navy-950/60 backdrop-blur-sm">
              <div className="glass-strong p-6 max-w-sm text-center">
                <Globe2 size={28} className="mx-auto mb-3 text-amber-300" />
                <div className="text-sm font-bold text-white mb-1">MapTiler basemaps disabled</div>
                <p className="text-xs text-slate-400 leading-relaxed">Add your key to <code className="text-accent-cyan">.env</code> as <code className="text-accent-cyan">MAPTILER_KEY</code> (server-side only) and set <code className="text-accent-cyan">VITE_MAPTILER_ENABLED=true</code>.</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {MAPTILER_ENABLED && tilesFailed && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 rounded-lg border border-amber-400/30 bg-navy-900/90 backdrop-blur-md text-xs text-amber-300">
                MapTiler tile load failed — check MAPTILER_KEY in .env and restart the dev server.
              </motion.div>
            )}
          </AnimatePresence>

          {panelOpen && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="absolute top-3 right-3 bottom-3 z-[500] w-60 glass-strong flex flex-col"
            >
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Layers size={14} className="text-accent-cyan" /> Hazard Layers
                </div>
                <button onClick={() => setPanelOpen(false)} className="text-slate-500 hover:text-slate-200" aria-label="Collapse panel">
                  <ChevronLeft size={15} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                <div className="px-1 pb-1 text-[9px] uppercase tracking-widest text-slate-500">Layer · last update · source</div>
                {geoLayers.map((l) => {
                  const on = active.includes(l.key)
                  return (
                    <button
                      key={l.key}
                      onClick={() => toggleLayer(l.key)}
                      className={`w-full rounded-xl border px-2.5 py-2 text-left transition-all ${on ? 'border-accent-cyan/40 bg-accent-cyan/[0.07]' : 'border-white/5 bg-white/[0.02] hover:border-white/15'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200">
                          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} /> {l.label}
                        </span>
                        <span className={`relative h-4 w-7 rounded-full transition-colors ${on ? 'bg-accent-cyan' : 'bg-white/10'}`}>
                          <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-500">{l.desc}</div>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[9px] font-mono text-emerald-400/80">UPDATED {l.updated.toUpperCase()}</span>
                        <span className="text-[8px] uppercase tracking-wider px-1 py-0.5 rounded bg-white/5 text-slate-500">sample</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {!panelOpen && (
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute top-3 right-3 z-[500] flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-navy-900/85 backdrop-blur-md text-xs text-slate-200 hover:border-accent-cyan/40 transition-colors"
            >
              <Layers size={13} className="text-accent-cyan" /> Layers
            </button>
          )}

          <div className="absolute bottom-3 left-3 z-[500] glass p-3 hidden md:block">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] uppercase tracking-widest text-slate-500">Legend · Active layers</div>
              <RefreshCcw size={11} className="text-slate-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              {activeMeta.map((l) => (
                <div key={l.key} className="flex flex-col gap-0.5">
                  <div className="text-[10px] font-semibold text-slate-300">{l.label}</div>
                  <div className="flex items-center gap-2">
                    {l.legend.map((lg) => (
                      <span key={lg.label} className="flex items-center gap-1 text-[9px] text-slate-500">
                        <span className="h-2 w-2 rounded-full" style={{ background: lg.color }} /> {lg.label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {activeMeta.length === 0 && <div className="text-[10px] text-slate-500">No layers active — enable from the panel.</div>}
            </div>
            <div className="mt-2 border-t border-white/10 pt-2">
              <div className="text-[9px] text-slate-600">Risk scale renders per-layer where applicable</div>
            </div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            Basemap & geocoding: <strong className="text-slate-400">MapTiler</strong> · served through the Vite proxy so the API key never reaches your browser.
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={11} /> All hazard layers use <strong className="text-amber-300/80">clearly-labelled sample data</strong> — wire live feeds via the backend adapters when credentials are configured.
          </div>
        </div>
      </div>
    </div>
  )
}