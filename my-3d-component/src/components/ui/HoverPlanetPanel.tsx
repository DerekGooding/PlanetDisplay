import { Planet as PlanetModel } from '../../models/Planet';

export interface HoverPlanetPanelProps {
  hoveredPlanet: PlanetModel | null;
}

function HoverPlanetPanel({ hoveredPlanet }: HoverPlanetPanelProps) {
  if (!hoveredPlanet) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 10,
        left: 10,
        zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '300px',
      }}
    >
      <h3>{hoveredPlanet.name}</h3>
      <p><strong>Classification:</strong> {hoveredPlanet.classification}</p>
      <p><strong>Allegiance:</strong> {hoveredPlanet.allegiance}</p>
      <p><strong>Biome:</strong> {hoveredPlanet.biome}</p>
      <p><strong>Threat Level:</strong> {hoveredPlanet.threatLevel}</p>
      <p>{hoveredPlanet.flavorText}</p>
    </div>
  );
}

export default HoverPlanetPanel;
