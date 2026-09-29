import { riskColor } from '../data/demoData'

export type GeoBasemap = 'hybrid' | 'streets' | 'topo'
export type GeoLayerKey = 'rainfall' | 'floodRisk' | 'glaciers' | 'glacialLakes' | 'cloudburst' | 'coastal'

export interface BasemapMeta {
  key: GeoBasemap
  label: string
  hint: string
}

export const basemaps: BasemapMeta[] = [
  { key: 'hybrid', label: 'Satellite', hint: 'MapTiler Hybrid — satellite imagery with labels' },
  { key: 'streets', label: 'Streets', hint: 'MapTiler Streets v2' },
  { key: 'topo', label: 'Terrain', hint: 'MapTiler Outdoor v4 — elevation & terrain relief' },
]

export interface GeoLayerMeta {
  key: GeoLayerKey
  label: string
  desc: string
  updated: string
  color: string
  legend: { label: string; color: string }[]
}

const riskLegend = [
  { label: 'Low', color: riskColor('low') },
  { label: 'Moderate', color: riskColor('moderate') },
  { label: 'High', color: riskColor('high') },
  { label: 'Extreme', color: riskColor('extreme') },
]

export const geoLayers: GeoLayerMeta[] = [
  {
    key: 'rainfall',
    label: 'Rainfall Intensity',
    desc: 'Nowcast precipitation grid',
    updated: '5 min ago',
    color: '#22d3ee',
    legend: [
      { label: 'Light', color: '#60a5fa' },
      { label: 'Moderate', color: '#22d3ee' },
      { label: 'Heavy', color: '#f97316' },
      { label: 'Extreme', color: '#ef4444' },
    ],
  },
  {
    key: 'floodRisk',
    label: 'State Flood Risk',
    desc: 'AI flood risk by state',
    updated: '10 min ago',
    color: '#3b82f6',
    legend: riskLegend,
  },
  {
    key: 'glaciers',
    label: 'Glacier Regions',
    desc: 'Area change & retreat',
    updated: '1 day ago',
    color: '#a855f7',
    legend: riskLegend,
  },
  {
    key: 'glacialLakes',
    label: 'Glacial Lakes (GLOF)',
    desc: 'Lake growth & freeze score',
    updated: '4 hr ago',
    color: '#818cf8',
    legend: riskLegend,
  },
  {
    key: 'cloudburst',
    label: 'Cloudburst Risk',
    desc: 'Nowcast trigger probability',
    updated: '15 min ago',
    color: '#eab308',
    legend: riskLegend,
  },
  {
    key: 'coastal',
    label: 'Coastal Hazards',
    desc: 'SST · tide · wave · surge',
    updated: '20 min ago',
    color: '#22c55e',
    legend: riskLegend,
  },
]

export interface SampleRainCell {
  id: string
  name: string
  lat: number
  lng: number
  intensity: 'light' | 'moderate' | 'heavy' | 'extreme'
  mm: number
}

export const rainColor: Record<SampleRainCell['intensity'], string> = {
  light: '#60a5fa',
  moderate: '#22d3ee',
  heavy: '#f97316',
  extreme: '#ef4444',
}

export const sampleRainfall: SampleRainCell[] = [
  { id: 'r1', name: 'Kochi', lat: 9.97, lng: 76.28, intensity: 'extreme', mm: 118 },
  { id: 'r2', name: 'Thiruvananthapuram', lat: 8.52, lng: 76.94, intensity: 'heavy', mm: 82 },
  { id: 'r3', name: 'Mumbai', lat: 19.08, lng: 72.88, intensity: 'heavy', mm: 74 },
  { id: 'r4', name: 'Chennai', lat: 13.08, lng: 80.27, intensity: 'moderate', mm: 34 },
  { id: 'r5', name: 'Kolkata', lat: 22.57, lng: 88.36, intensity: 'moderate', mm: 41 },
  { id: 'r6', name: 'Guwahati', lat: 26.14, lng: 91.74, intensity: 'heavy', mm: 68 },
  { id: 'r7', name: 'Shimla', lat: 31.1, lng: 77.17, intensity: 'light', mm: 12 },
  { id: 'r8', name: 'Bhubaneswar', lat: 20.3, lng: 85.82, intensity: 'moderate', mm: 29 },
  { id: 'r9', name: 'Hyderabad', lat: 17.39, lng: 78.49, intensity: 'light', mm: 8 },
  { id: 'r10', name: 'Bengaluru', lat: 12.97, lng: 77.59, intensity: 'light', mm: 6 },
]

export const GEO_POPUP_FOOTER = 'SAMPLE DATA — no live source connected yet'