import React, { useState } from 'react'
import { MapPanel } from '../components/MapPanel'
import { DemoBanner, SectionTitle } from '../components/Layout'
import type { AreaRiskProfile } from '../types'
import { riskColor } from '../data/demoData'

export const MapPage: React.FC = () => {
  const [selected, setSelected] = useState<AreaRiskProfile | null>(null)

  return (
    <div className="pt-16 min-h-screen">
      <DemoBanner />
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
        <SectionTitle
          title="Live Geo-Spatial Intelligence Map"
          badge="LIVE MAP"
          subtitle="Interactive GIS view with rainfall, radar, risk and inundation overlays. Select an area to view its detailed risk profile. Demo data — not live observations."
        />

        <MapPanel
          height="620px"
          onSelectArea={setSelected}
          centeredOnSelected={selected}
        />

        {selected && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {[
              { l: 'Current Rainfall', v: `${selected.currentRainfall} mm/h`, c: '#22d3ee' },
              { l: 'Predicted Rainfall', v: `${selected.predictedRainfall} mm`, c: '#f97316' },
              { l: 'Flood Probability', v: `${selected.floodProbability}%`, c: '#eab308' },
              { l: 'Predicted Water Depth', v: `${selected.waterDepth} m`, c: '#3b82f6' },
              { l: 'Population Exposure', v: selected.populationExposure.toLocaleString(), c: '#ef4444' },
            ].map((m, i) => (
              <div key={i} className="glass p-4">
                <div className="text-xs text-slate-500">{m.l}</div>
                <div className="text-2xl font-bold mt-1" style={{ color: m.c }}>{m.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
