export interface NavigationButtonsProps {
  onPrevPlanet: () => void;
  onNextPlanet: () => void;
  onResetView: () => void;
  onToggleScan: () => void;
  onToggleCameraLock: () => void;
  onRandomizeSystem: () => void;
  isScanning: boolean;
  isCameraLocked: boolean;
}

function NavigationButtons({
  onPrevPlanet,
  onNextPlanet,
  onResetView,
  onToggleScan,
  onToggleCameraLock,
  onRandomizeSystem,
  isScanning,
  isCameraLocked,
}: NavigationButtonsProps) {
  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 100 }}>
      <button onClick={onPrevPlanet} style={{ marginRight: '10px', padding: '8px 15px' }}>
        Previous
      </button>
      <button onClick={onNextPlanet} style={{ marginRight: '10px', padding: '8px 15px' }}>
        Next
      </button>
      <button onClick={onResetView} style={{ marginRight: '10px', padding: '8px 15px' }}>
        Reset View
      </button>
      <button onClick={onToggleScan} style={{ padding: '8px 15px' }}>
        {isScanning ? 'Stop Scan' : 'Start Scan'}
      </button>
      <button onClick={onToggleCameraLock} style={{ marginLeft: '10px', padding: '8px 15px' }}>
        {isCameraLocked ? 'Unlock Camera' : 'Lock Camera'}
      </button>
      <button onClick={onRandomizeSystem} style={{ marginLeft: '10px', padding: '8px 15px' }}>
        Randomize System
      </button>
    </div>
  );
}

export default NavigationButtons;
