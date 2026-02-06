import SinglePlanet from './components/SinglePlanet';
import UpscaleComparer from './components/UpscaleComparer';

import './App.css';

export default function App() {
  return (
    <div className ="stackpanel-vertical">
      <div className="panel">
        <SinglePlanet />
      </div>
      <div className="panel">
        <UpscaleComparer />
      </div>
    </div>
  );
}

