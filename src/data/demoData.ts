import type {
  AreaRiskProfile,
  RainfallForecastPoint,
  Alert,
  RouteOption,
  DataSourceStatus,
  SimulationParams,
  SimulationResult,
  InfrastructureAsset,
  HistoricalEvent,
  RiskLevel,
  EvacuationZone,
  ExplanationFactor,
  IndiaStateRisk,
  GlacierRegion,
  GlacialLake,
  CloudburstZone,
  CoastalStation,
  TsunamiAdvisory,
  ScientistUserRecord,
  PendingAlertReviewee,
} from '../types'

export const locations = [
  { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
]

export function buildRiskProfile(base: { lat: number; lng: number }): AreaRiskProfile {
  return {
    id: 'area-1',
    name: 'Willingdon Island',
    district: 'Ernakulam',
    city: 'Kochi',
    ward: 'Ward 21',
    localArea: 'Market Zone',
    roadZone: 'NH-966B',
    lat: base.lat,
    lng: base.lng,
    currentRainfall: 34,
    predictedRainfall: 118,
    floodProbability: 82,
    waterDepth: 1.4,
    risk: 'high',
    riskScore: 82,
    populationExposure: 12400,
    drainageStress: 68,
    soilSaturation: 86,
    criticalInfrastructure: ['General Hospital', 'Power Substation', 'Railway Station'],
    recommendedAction: 'Evacuate low-lying zones within 2 hours',
  }
}

export const demoAreas: AreaRiskProfile[] = [
  { ...buildRiskProfile(locations[0]), id: '1', name: 'Willingdon Island', lat: 9.955, lng: 76.272 },
  { ...buildRiskProfile(locations[0]), id: '2', name: 'Marine Drive', lat: 9.968, lng: 76.281, riskScore: 58, risk: 'moderate', waterDepth: 0.6, floodProbability: 54, predictedRainfall: 74, drainageStress: 44, populationExposure: 8600, soilSaturation: 72 },
  { ...buildRiskProfile(locations[0]), id: '3', name: 'Fort Kochi', lat: 9.966, lng: 76.242, riskScore: 91, risk: 'extreme', waterDepth: 2.1, floodProbability: 94, predictedRainfall: 142, drainageStress: 78, populationExposure: 18200, soilSaturation: 92, recommendedAction: 'Immediate evacuation — water rising rapidly' },
  { ...buildRiskProfile(locations[0]), id: '4', name: 'Vyttila', lat: 9.979, lng: 76.315, riskScore: 44, risk: 'moderate', waterDepth: 0.4, floodProbability: 41, predictedRainfall: 58, drainageStress: 35, populationExposure: 6400, soilSaturation: 61 },
  { ...buildRiskProfile(locations[0]), id: '5', name: 'Kakkanad', lat: 10.016, lng: 76.344, riskScore: 35, risk: 'low', waterDepth: 0.2, floodProbability: 28, predictedRainfall: 42, drainageStress: 22, populationExposure: 4200, soilSaturation: 48 },
]

export const rainfallForecast: RainfallForecastPoint[] = [
  { time: 'Now', intensity: 34, probability: 100, peak: 40 },
  { time: '+1h', intensity: 48, probability: 88, peak: 62 },
  { time: '+3h', intensity: 76, probability: 92, peak: 96 },
  { time: '+6h', intensity: 118, probability: 84, peak: 142 },
  { time: '+12h', intensity: 88, probability: 71, peak: 110 },
  { time: '+24h', intensity: 56, probability: 63, peak: 72 },
  { time: '+72h', intensity: 30, probability: 45, peak: 38 },
]

export const alerts: Alert[] = [
  {
    id: 'a1',
    title: 'FLASH FLOOD WARNING',
    location: 'Fort Kochi & Surroundings',
    hazard: 'Flash Flood / Inundation',
    expectedTime: 'Next 2 hours',
    severity: 'emergency',
    confidence: 91,
    recommendedAction: [
      'Avoid low-lying roads immediately',
      'Move away from drainage channels',
      'Follow designated evacuation routes',
      'Move to higher ground if in affected zone',
    ],
    factors: [
      { label: 'Heavy rainfall forecast', magnitude: '+118 mm expected', weight: 35, positive: false },
      { label: 'High soil saturation', magnitude: '92% saturation', weight: 22, positive: false },
      { label: 'Low drainage capacity', magnitude: '78% capacity', weight: 18, positive: false },
      { label: 'Rising river level', magnitude: '+1.2 m above normal', weight: 15, positive: false },
      { label: 'Low-lying terrain', magnitude: '<2 m elevation', weight: 10, positive: false },
    ],
  },
  {
    id: 'a2',
    title: 'HEAVY RAINFALL WARNING',
    location: 'Willingdon Island',
    hazard: 'Heavy Rainfall',
    expectedTime: 'Next 6 hours',
    severity: 'warning',
    confidence: 84,
    recommendedAction: [
      'Secure loose objects outdoors',
      'Stay indoors where possible',
      'Monitor local advisories',
      'Keep emergency supplies ready',
    ],
    factors: [
      { label: 'Active monsoon system', magnitude: 'Multiple convective bands', weight: 40, positive: false },
      { label: 'High atmospheric moisture', magnitude: '92% RH', weight: 30, positive: false },
      { label: 'Moderate drainage stress', magnitude: '68% utilization', weight: 20, positive: false },
      { label: 'Wind convergence zone', magnitude: 'Overlapping jet streams', weight: 10, positive: false },
    ],
  },
  {
    id: 'a3',
    title: 'INUNDATION WATCH',
    location: 'Vyttila Junction',
    hazard: 'Urban Flooding',
    expectedTime: 'Next 12-24 hours',
    severity: 'watch',
    confidence: 72,
    recommendedAction: [
      'Prepare emergency kit',
      'Review evacuation routes',
      'Keep vehicles on higher ground',
    ],
    factors: [
      { label: 'Moderate rainfall forecast', magnitude: '+58 mm', weight: 45, positive: false },
      { label: 'Drainage stress', magnitude: '35% utilization', weight: 30, positive: true },
      { label: 'Soil absorption capacity', magnitude: 'Moderate', weight: 25, positive: true },
    ],
  },
]

export const routes: RouteOption[] = [
  { label: 'Fastest Route', distance: 4.2, eta: 12, floodRisk: 'high', roadCondition: 'Flooded segments' },
  { label: 'Normal Route', distance: 4.8, eta: 15, floodRisk: 'moderate', roadCondition: 'Waterlogged patches' },
  { label: 'Safest Route', distance: 6.1, eta: 19, floodRisk: 'low', roadCondition: 'Clear' },
  { label: 'Emergency Route', distance: 5.4, eta: 17, floodRisk: 'low', roadCondition: 'Cleared for access' },
]

export const dataSourceStatus: DataSourceStatus[] = [
  { name: 'Satellite', status: 'online', icon: '🛰' },
  { name: 'Weather Radar', status: 'online', icon: '📡' },
  { name: 'Weather Stations', status: 'online', icon: '🌧' },
  { name: 'NWP', status: 'online', icon: '🌐' },
  { name: 'DEM / Terrain', status: 'available', icon: '🏔' },
  { name: 'River Data', status: 'online', icon: '🌊' },
]

export const infrastructure: InfrastructureAsset[] = [
  { id: 'i1', type: 'Hospital', name: 'General Hospital', lat: 9.958, lng: 76.268, risk: 'high', inundation: 1.6, accessibility: 45, floodProbability: 78, recommendedAction: 'Pre-position medical supplies, prepare for possible shelter-in-place' },
  { id: 'i2', type: 'School', name: 'St. Teresa School', lat: 9.965, lng: 76.276, risk: 'moderate', inundation: 0.7, accessibility: 70, floodProbability: 52, recommendedAction: 'Monitor closely, prepare evacuation notice' },
  { id: 'i3', type: 'Fire Station', name: 'Fire & Rescue HQ', lat: 9.97, lng: 76.27, risk: 'low', inundation: 0.2, accessibility: 95, floodProbability: 12, recommendedAction: 'Maintain full readiness, stage vehicles on high ground' },
  { id: 'i4', type: 'Police Station', name: 'Central Police HQ', lat: 9.968, lng: 76.283, risk: 'moderate', inundation: 0.5, accessibility: 78, floodProbability: 45, recommendedAction: 'Increase patrol staffing, prepare road closure plans' },
  { id: 'i5', type: 'Power Station', name: 'Power Substation', lat: 9.949, lng: 76.264, risk: 'extreme', inundation: 2.3, accessibility: 22, floodProbability: 94, recommendedAction: 'Emergency shutdown plan activation, protect transformers' },
  { id: 'i6', type: 'Transport Hub', name: 'Kochi Railway Stn', lat: 9.967, lng: 76.284, risk: 'high', inundation: 1.2, accessibility: 55, floodProbability: 72, recommendedAction: 'Reroute services, suspend low-lying platforms' },
  { id: 'i7', type: 'Bridge', name: 'Vypeen Bridge', lat: 9.961, lng: 76.258, risk: 'high', inundation: 1.1, accessibility: 50, floodProbability: 68, recommendedAction: 'Close to heavy vehicles, monitor water level' },
  { id: 'i8', type: 'Government', name: 'Collectorate Office', lat: 9.969, lng: 76.278, risk: 'moderate', inundation: 0.4, accessibility: 82, floodProbability: 38, recommendedAction: 'Ensure emergency operations center is staffed' },
  { id: 'i9', type: 'Hospital', name: 'Lakeshore Hospital', lat: 9.972, lng: 76.288, risk: 'moderate', inundation: 0.6, accessibility: 74, floodProbability: 48, recommendedAction: 'Prepare backup power and essential supply stockpile' },
  { id: 'i10', type: 'Power Station', name: 'Kaloor Substation', lat: 9.939, lng: 76.272, risk: 'high', inundation: 1.5, accessibility: 42, floodProbability: 76, recommendedAction: 'Deploy flood barriers, prepare for load shedding' },
]

export const evacuationZones: EvacuationZone[] = [
  { id: 'ez1', name: 'Fort Kochi Lowlands', lat: 9.965, lng: 76.242, priority: 1, population: 18200, severity: 'extreme', waterDepth: 2.1, evacuationTime: '30 min', shelters: ['St. Marys School', 'Community Hall'], roads: ['KP Rd', 'Bazaar Rd', 'Bridge Rd'] },
  { id: 'ez2', name: 'Willingdon Island South', lat: 9.948, lng: 76.270, priority: 2, population: 12400, severity: 'high', waterDepth: 1.6, evacuationTime: '45 min', shelters: ['Island School', 'Club House'], roads: ['Canal Rd', 'Shipyard Rd'] },
  { id: 'ez3', name: 'Marine Drive Corridor', lat: 9.968, lng: 76.281, priority: 3, population: 8600, severity: 'moderate', waterDepth: 0.9, evacuationTime: '60 min', shelters: ['Boat Jetty Complex', 'Mahatma Ground'], roads: ['Marine Drive Walkway', 'Shanmugham Rd'] },
  { id: 'ez4', name: 'Vyttila Junction Area', lat: 9.978, lng: 76.312, priority: 4, population: 6400, severity: 'moderate', waterDepth: 0.5, evacuationTime: '90 min', shelters: ['Vyttila Community Center'], roads: ['Vyttila Mobiyity Hub Rd'] },
]

export const explanationFactors: ExplanationFactor[] = [
  { label: 'Heavy Rainfall Forecast', magnitude: '+118 mm expected', weight: 35, positive: false },
  { label: 'High Soil Saturation', magnitude: '92% saturation', weight: 22, positive: false },
  { label: 'Low Drainage Capacity', magnitude: '78% stress level', weight: 18, positive: false },
  { label: 'Rising River Level', magnitude: '+1.2 m above normal', weight: 15, positive: false },
  { label: 'Low-Lying Terrain', magnitude: '<2 m elevation zone', weight: 10, positive: false },
]

export function runSimulation(params: SimulationParams): SimulationResult {
  const rainfallFactor = params.rainfall / 60
  const durationFactor = params.duration / 12
  const drainageFactor = (100 - params.drainage) / 50
  const riverFactor = params.riverLevel / 4
  const soilFactor = params.soilSaturation / 80

  const base = rainfallFactor * durationFactor * drainageFactor * riverFactor * soilFactor
  const inundatedArea = Math.round(base * 1200)
  const maxWaterDepth = Math.round(base * 2.4 * 10) / 10
  const roadsAffected = Math.round(base * 45)
  const criticalInfrastructure = Math.round(base * 10)
  const populationExposure = Math.round(base * 32000)

  const score = Math.min(100, Math.round(base * 95))
  const risk: RiskLevel =
    score >= 80 ? 'extreme' : score >= 60 ? 'high' : score >= 35 ? 'moderate' : 'low'

  return { inundatedArea, maxWaterDepth, roadsAffected, criticalInfrastructure, populationExposure, risk }
}

export const riskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case 'low': return '#22c55e'
    case 'moderate': return '#eab308'
    case 'high': return '#f97316'
    case 'extreme': return '#ef4444'
  }
}

export const severityColor = (s: string): string => {
  switch (s) {
    case 'advisory': return '#3b82f6'
    case 'watch': return '#eab308'
    case 'warning': return '#f97316'
    case 'emergency': return '#ef4444'
    default: return '#22c55e'
  }
}

export const rainfallTrendData = [
  { hour: '00:00', actual: 8, predicted: 10 },
  { hour: '03:00', actual: 15, predicted: 14 },
  { hour: '06:00', actual: 38, predicted: 40 },
  { hour: '09:00', actual: 62, predicted: 58 },
  { hour: '12:00', actual: 78, predicted: 82 },
  { hour: '15:00', actual: 118, predicted: 112 },
  { hour: '18:00', actual: 95, predicted: 100 },
  { hour: '21:00', actual: 68, predicted: 72 },
  { hour: '24:00', actual: 45, predicted: 50 },
]

export const modelForecasts = [
  { model: 'Model A (ConvLSTM)', value: 82 },
  { model: 'Model B (Hybrid Ensemble)', value: 96 },
  { model: 'Model C (XGBoost)', value: 91 },
  { model: 'Model D (Ensemble Blend)', value: 88 },
]

export const alertHistory = [
  { date: 'Sep 01', advisory: 1, watch: 0, warning: 0, emergency: 0, total: 1 },
  { date: 'Sep 02', advisory: 1, watch: 1, warning: 0, emergency: 0, total: 2 },
  { date: 'Sep 03', advisory: 2, watch: 1, warning: 1, emergency: 0, total: 4 },
  { date: 'Sep 04', advisory: 1, watch: 2, warning: 2, emergency: 1, total: 6 },
  { date: 'Sep 05', advisory: 2, watch: 1, warning: 1, emergency: 1, total: 5 },
  { date: 'Sep 06', advisory: 1, watch: 2, warning: 3, emergency: 2, total: 8 },
  { date: 'Sep 07', advisory: 1, watch: 1, warning: 2, emergency: 1, total: 5 },
]

export const riskTrend = [
  { date: 'Sep 01', score: 18 },
  { date: 'Sep 02', score: 25 },
  { date: 'Sep 03', score: 38 },
  { date: 'Sep 04', score: 55 },
  { date: 'Sep 05', score: 68 },
  { date: 'Sep 06', score: 82 },
  { date: 'Sep 07', score: 91 },
]

export const depthPrediction = [
  { hour: '+1h', min: 0.2, mid: 0.6, max: 1.0 },
  { hour: '+3h', min: 0.5, mid: 1.1, max: 1.8 },
  { hour: '+6h', min: 0.9, mid: 1.8, max: 2.7 },
  { hour: '+12h', min: 1.2, mid: 2.3, max: 3.4 },
  { hour: '+24h', min: 0.8, mid: 1.6, max: 2.5 },
]

export const historicalEvents: HistoricalEvent[] = [
  { id: 'h1', name: '2018 Kerala Floods', year: 2018, rainfall: 128, duration: 72, floodExtent: 5400, waterDepth: 2.8, recoveryTime: 90 },
  { id: 'h2', name: '2021 Monsoon Surge', year: 2021, rainfall: 96, duration: 48, floodExtent: 2300, waterDepth: 1.9, recoveryTime: 45 },
  { id: 'h3', name: '2023 Urban Event', year: 2023, rainfall: 74, duration: 24, floodExtent: 900, waterDepth: 1.1, recoveryTime: 12 },
  { id: 'h4', name: 'Current Event (2026)', year: 2026, rainfall: 118, duration: 36, floodExtent: 3100, waterDepth: 2.1, recoveryTime: 60 },
]

export const indiaStateRisk: IndiaStateRisk[] = [
  { id: 's1', name: 'Kerala', lat: 10.85, lng: 76.27, risk: 'extreme', score: 91, drivers: ['Monsoon surge', 'Western Ghats runoff', 'High urbanization'], populationExposure: 3_200_000 },
  { id: 's2', name: 'Maharashtra', lat: 19.75, lng: 75.71, risk: 'high', score: 78, drivers: ['Urban flooding', 'Coastal surge', 'Hilly terrain cloudburst'], populationExposure: 5_100_000 },
  { id: 's3', name: 'Tamil Nadu', lat: 11.12, lng: 78.66, risk: 'high', score: 74, drivers: ['NE monsoon', 'Chennai urban floods', 'Coastal exposure'], populationExposure: 4_300_000 },
  { id: 's4', name: 'West Bengal', lat: 23.24, lng: 87.87, risk: 'high', score: 72, drivers: ['River flooding', 'Cyclone coupling', 'Deltaic lowlands'], populationExposure: 3_800_000 },
  { id: 's5', name: 'Uttarakhand', lat: 30.07, lng: 79.02, risk: 'high', score: 69, drivers: ['GLOF risk', 'Cloudburst', 'Hill torrents'], populationExposure: 420_000 },
  { id: 's6', name: 'Himachal Pradesh', lat: 31.1, lng: 77.17, risk: 'moderate', score: 58, drivers: ['Cloudburst', 'Flash floods', 'Glacier melt'], populationExposure: 380_000 },
  { id: 's7', name: 'Odisha', lat: 20.95, lng: 85.09, risk: 'moderate', score: 56, drivers: ['Cyclone-related rainfall', 'Coastal flooding'], populationExposure: 2_100_000 },
  { id: 's8', name: 'Assam', lat: 26.2, lng: 92.93, risk: 'high', score: 71, drivers: ['Brahmaputra flooding', 'Annual river erosion'], populationExposure: 1_900_000 },
  { id: 's9', name: 'Gujarat', lat: 22.3, lng: 70.8, risk: 'moderate', score: 52, drivers: ['Coastal surge', 'Flash floods'], populationExposure: 1_400_000 },
  { id: 's10', name: 'Bihar', lat: 25.1, lng: 85.31, risk: 'moderate', score: 55, drivers: ['Riverine flooding', 'Monsoon drainage'], populationExposure: 1_800_000 },
]

export const glacierRegions: GlacierRegion[] = [
  { id: 'g1', name: 'Gangotri Glacier', state: 'Uttarakhand', lat: 30.92, lng: 79.07, area2020: 143, area2026: 136, changePercent: -4.9, lakeCount: 8, risk: 'high', note: 'Accelerated retreat; frontal lake growth observed' },
  { id: 'g2', name: 'Chorabari Glacier', state: 'Uttarakhand', lat: 30.77, lng: 79.02, area2020: 8.7, area2026: 8.2, changePercent: -5.7, lakeCount: 5, risk: 'extreme', note: 'Kedarnath catchment; 2013 event analogue' },
  { id: 'g3', name: 'Kangra (Dhauladhar) Zone', state: 'Himachal Pradesh', lat: 32.2, lng: 76.3, area2020: 54, area2026: 51, changePercent: -5.5, lakeCount: 9, risk: 'high', note: 'Dense lake network in moraine terrain' },
  { id: 'g4', name: 'Lahaul-Spiti Zone', state: 'Himachal Pradesh', lat: 32.6, lng: 77.1, area2020: 210, area2026: 201, changePercent: -4.3, lakeCount: 14, risk: 'moderate', note: 'High-altitude, low connectivity' },
  { id: 'g5', name: 'Siachen Glacier', state: 'Ladakh', lat: 35.42, lng: 76.9, area2020: 1100, area2026: 1082, changePercent: -1.6, lakeCount: 2, risk: 'low', note: 'Slow retreat, monitored' },
  { id: 'g6', name: 'Zanskar Zone', state: 'Ladakh', lat: 33.7, lng: 77.0, area2020: 480, area2026: 467, changePercent: -2.7, lakeCount: 6, risk: 'moderate', note: 'Periglacial lakes expanding' },
]

export const glacialLakes: GlacialLake[] = [
  { id: 'l1', regionId: 'g2', name: 'Chorabari Lake', lat: 30.79, lng: 79.04, areaHa: 42, growthPercent: 24, risk: 'extreme', freezeScore: 88 },
  { id: 'l2', regionId: 'g1', name: 'Gangotri Proglacial Lake', lat: 30.93, lng: 79.08, areaHa: 18, growthPercent: 12, risk: 'high', freezeScore: 64 },
  { id: 'l3', regionId: 'g3', name: 'Dhauladhar Moraine Lake', lat: 32.21, lng: 76.32, areaHa: 9, growthPercent: 31, risk: 'high', freezeScore: 71 },
  { id: 'l4', regionId: 'g4', name: 'Lahaul Terminal Lake', lat: 32.62, lng: 77.15, areaHa: 27, growthPercent: 18, risk: 'moderate', freezeScore: 45 },
  { id: 'l5', regionId: 'g6', name: 'Zanskar Peripheral Lake', lat: 33.72, lng: 77.04, areaHa: 14, growthPercent: 9, risk: 'moderate', freezeScore: 39 },
  { id: 'l6', regionId: 'g5', name: 'Siachen Upper Lake', lat: 35.4, lng: 76.95, areaHa: 6, growthPercent: 4, risk: 'low', freezeScore: 18 },
]

export const cloudburstZones: CloudburstZone[] = [
  { id: 'c1', name: 'Kedarnath Corridor', state: 'Uttarakhand', lat: 30.74, lng: 79.07, risk: 'extreme', confidence: 78, triggerRate: 64, lastEvent: 'Jun 2013 analogue' },
  { id: 'c2', name: 'Dharamshala Hills', state: 'Himachal Pradesh', lat: 32.22, lng: 76.32, risk: 'high', confidence: 71, triggerRate: 58, lastEvent: 'Aug 2022' },
  { id: 'c3', name: 'Kullu Valley', state: 'Himachal Pradesh', lat: 31.96, lng: 77.1, risk: 'high', confidence: 74, triggerRate: 60, lastEvent: 'Jul 2021' },
  { id: 'c4', name: 'Nilgiris (Coimbatore)', state: 'Tamil Nadu', lat: 11.41, lng: 76.69, risk: 'moderate', confidence: 62, triggerRate: 44, lastEvent: 'Nov 2021' },
  { id: 'c5', name: 'Ghats of Maheshwar', state: 'Maharashtra', lat: 19.6, lng: 73.4, risk: 'moderate', confidence: 58, triggerRate: 40, lastEvent: 'Jul 2020' },
  { id: 'c6', name: 'Shillong Plateau', state: 'Meghalaya', lat: 25.57, lng: 91.88, risk: 'high', confidence: 69, triggerRate: 55, lastEvent: 'Jun 2022' },
]

export const coastalStations: CoastalStation[] = [
  { id: 'co1', name: 'Mumbai (ARB)', state: 'Maharashtra', lat: 18.94, lng: 72.84, sst: 29.8, tideHeight: 4.8, waveHeight: 2.4, coastalRisk: 'high' },
  { id: 'co2', name: 'Cochin Harbour', state: 'Kerala', lat: 9.97, lng: 76.27, sst: 30.4, tideHeight: 3.2, waveHeight: 1.1, coastalRisk: 'moderate' },
  { id: 'co3', name: 'Chennai Coast', state: 'Tamil Nadu', lat: 13.08, lng: 80.29, sst: 29.1, tideHeight: 2.1, waveHeight: 1.8, coastalRisk: 'high' },
  { id: 'co4', name: 'Paradip Port', state: 'Odisha', lat: 20.26, lng: 86.66, sst: 29.3, tideHeight: 3.4, waveHeight: 2.9, coastalRisk: 'extreme' },
  { id: 'co5', name: 'Sundarbans Delta', state: 'West Bengal', lat: 21.9, lng: 88.9, sst: 29.7, tideHeight: 5.1, waveHeight: 2.2, coastalRisk: 'extreme' },
  { id: 'co6', name: 'Kandla / Gulf of Kutch', state: 'Gujarat', lat: 22.9, lng: 70.1, sst: 28.5, tideHeight: 6.9, waveHeight: 1.4, coastalRisk: 'moderate' },
]

export const tsunamiAdvisories: TsunamiAdvisory[] = [
  { id: 't0', title: 'No active tsunami advisory', source: 'INCOIS / NOAA (demo feed)', issuedAt: 'Sep 07 · 06:00 IST', affected: 'All Indian coasts', status: 'none', note: 'No tsunami warnings in effect. AquaSentinel relays official advisories only — it does not independently predict earthquakes or tsunamis.' },
]

export const sstTrend = [
  { month: 'Apr', sst: 29.1, normal: 28.6 },
  { month: 'May', sst: 29.6, normal: 29.0 },
  { month: 'Jun', sst: 30.1, normal: 29.0 },
  { month: 'Jul', sst: 30.6, normal: 29.1 },
  { month: 'Aug', sst: 30.8, normal: 29.2 },
  { month: 'Sep', sst: 30.4, normal: 29.3 },
]

export const glacierAreaHistory = [
  { year: 2016, gangotri: 146, chorabari: 9.2, dhauladhar: 58, lahaul: 216 },
  { year: 2018, gangotri: 144, chorabari: 8.9, dhauladhar: 56, lahaul: 213 },
  { year: 2020, gangotri: 143, chorabari: 8.7, dhauladhar: 54, lahaul: 210 },
  { year: 2022, gangotri: 141, chorabari: 8.5, dhauladhar: 53, lahaul: 207 },
  { year: 2024, gangotri: 138, chorabari: 8.3, dhauladhar: 52, lahaul: 203 },
  { year: 2026, gangotri: 136, chorabari: 8.2, dhauladhar: 51, lahaul: 201 },
]

export const cloudMovement = [
  { t: '14:00', intensity: 20, radarReflectivity: 18 },
  { t: '15:00', intensity: 35, radarReflectivity: 32 },
  { t: '16:00', intensity: 52, radarReflectivity: 48 },
  { t: '17:00', intensity: 66, radarReflectivity: 61 },
  { t: '18:00', intensity: 74, radarReflectivity: 78 },
  { t: '19:00', intensity: 99, radarReflectivity: 88 },
]

export const scientistUsers: ScientistUserRecord[] = [
  { id: 'u1', name: 'Dr. Kavitha Menon', email: 'scientist@demo.aquasentinel.ai', role: 'Research Scientist', status: 'active', lastActive: '2 min ago' },
  { id: 'u2', name: 'R. Srinivasan', email: 'hydromet@demo.aquasentinel.ai', role: 'Disaster Authority', status: 'active', lastActive: '1 hr ago' },
  { id: 'u3', name: 'Anjali Deshmukh', email: 'geo@demo.aquasentinel.ai', role: 'GIS Analyst', status: 'pending', lastActive: 'Pending approval' },
  { id: 'u4', name: 'Vikram Rathore', email: 'ops@demo.aquasentinel.ai', role: 'Field Operations', status: 'active', lastActive: 'Yesterday' },
  { id: 'u5', name: 'Priya Nair', email: 'modelling@demo.aquasentinel.ai', role: 'ML Researcher', status: 'suspended', lastActive: 'Suspended' },
  { id: 'u6', name: 'Sanjay Kumar', email: 'satellite@demo.aquasentinel.ai', role: 'Remote Sensing', status: 'pending', lastActive: 'Pending approval' },
]

export const pendingAlertReviews: PendingAlertReviewee[] = [
  { id: 'r1', title: 'GLOF WATCH — Chorabari Lake', hazard: 'Glacial Lake Outburst', proposedSeverity: 'warning', confidence: 76, submittedBy: 'Dr. Kavitha Menon', date: 'Sep 07 · 05:00' },
  { id: 'r2', title: 'CLOUDBURST RISK — Kedarnath Corridor', hazard: 'Cloudburst', proposedSeverity: 'watch', confidence: 63, submittedBy: 'R. Srinivasan', date: 'Sep 07 · 04:20' },
  { id: 'r3', title: 'COASTAL SURGE — Paradip Port', hazard: 'Storm Surge', proposedSeverity: 'advisory', confidence: 58, submittedBy: 'Priya Nair', date: 'Sep 06 · 21:10' },
]

export const systemHealth = [
  { metric: 'API / Data Ingest', value: 98, status: 'operational' },
  { metric: 'Satellite Pipeline', value: 95, status: 'operational' },
  { metric: 'Radar Feed', value: 92, status: 'degraded' },
  { metric: 'NWP Model Runs', value: 99, status: 'operational' },
  { metric: 'Prediction API Latency', value: 97, status: 'operational' },
  { metric: 'WebSocket Stream', value: 94, status: 'operational' },
]
