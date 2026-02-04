export interface CameraHelpProps {
  isCameraLocked: boolean;
}

function CameraHelp({ isCameraLocked }: CameraHelpProps) {
  if (isCameraLocked) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        maxWidth: '200px',
        fontSize: '14px',
      }}
    >
      <p><strong>Free Look Controls:</strong></p>
      <p>Left Click + Drag: Rotate</p>
      <p>Right Click + Drag: Pan</p>
      <p>Scroll: Zoom</p>
    </div>
  );
}

export default CameraHelp;
