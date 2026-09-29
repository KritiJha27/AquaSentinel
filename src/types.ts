export type RiskLevel = 'low' | 'moderate' | 'high' | 'extreme'

export type AlertSeverity = 'advisory' | 'watch' | 'warning' | 'emergency'

export interface AreaRiskProfile {
  id: string
  name: string
  district: string
  city: string
  ward: string
  localArea: string
  roadZone: string
  lat: number
  lng: number
  currentRainfall: number
  predictedRainfall: number
  floodProbability: number
  waterDepth: number
  risk: RiskLevel
  riskScore: number
  populationExposure: number
  drainageStress: number
  soilSaturation: number
  criticalInfrastructure: string[]
  recommendedAction: string
}

export interface RainfallForecastPoint {
  time: string
  intensity: number
  probability: number
  peak: number
}

export interface ExplanationFactor {
  label: string
  magnitude: string
  weight: number
  positive: boolean
}

export interface Alert {
  id: string
  title: string
  location: string
  hazard: string
  expectedTime: string
  severity: AlertSeverity
  confidence: number
  recommendedAction: string[]
  factors: ExplanationFactor[]
}

export interface RouteOption {
  label: string
  distance: number
  eta: number
  floodRisk: RiskLevel
  roadCondition: string
}

export interface DataSourceStatus {
  name: string
  status: 'online' | 'available' | 'offline'
  icon: string
}

export interface SimulationParams {
  rainfall: number
  duration: number
  drainage: number
  riverLevel: number
  soilSaturation: number
}

export interface SimulationResult {
  inundatedArea: number
  maxWaterDepth: number
  roadsAffected: number
  criticalInfrastructure: number
  populationExposure: number
  risk: RiskLevel
}

export interface InfrastructureAsset {
  id: string
  type: string
  name: string
  lat: number
  lng: number
  risk: RiskLevel
  inundation: number
  accessibility: number
  floodProbability: number
  recommendedAction: string
}

export interface EvacuationZone {
  id: string
  name: string
  lat: number
  lng: number
  priority: number
  population: number
  severity: RiskLevel
  waterDepth: number
  evacuationTime: string
  shelters: string[]
  roads: string[]
}

export interface HistoricalEvent {
  id: string
  name: string
  year: number
  rainfall: number
  duration: number
  floodExtent: number
  waterDepth: number
  recoveryTime: number
}

export interface IndiaStateRisk {
  id: string
  name: string
  lat: number
  lng: number
  risk: RiskLevel
  score: number
  drivers: string[]
  populationExposure: number
}

export interface GlacierRegion {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  area2020: number
  area2026: number
  changePercent: number
  lakeCount: number
  risk: RiskLevel
  note: string
}

export interface GlacialLake {
  id: string
  regionId: string
  name: string
  lat: number
  lng: number
  areaHa: number
  growthPercent: number
  risk: RiskLevel
  freezeScore: number
}

export interface CloudburstZone {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  risk: RiskLevel
  confidence: number
  triggerRate: number
  lastEvent: string
}

export interface CoastalStation {
  id: string
  name: string
  state: string
  lat: number
  lng: number
  sst: number
  tideHeight: number
  waveHeight: number
  coastalRisk: RiskLevel
}

export interface TsunamiAdvisory {
  id: string
  title: string
  source: string
  issuedAt: string
  affected: string
  status: 'none' | 'watch' | 'warning'
  note: string
}

export interface ScientistUserRecord {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'pending' | 'suspended'
  lastActive: string
}

export interface PendingAlertReviewee {
  id: string
  title: string
  hazard: string
  proposedSeverity: AlertSeverity
  confidence: number
  submittedBy: string
  date: string
}
