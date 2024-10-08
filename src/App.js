import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Genesis from './Genesis';
import SolarMoon from './SolarMoon';
import MyPlanets from './MyPlanets';
import SpaceRace from './SpaceRace';
import PlanetConstructor from './PlanetConstructor';
import ProceduralUniverse from './ProceduralUniverse';
import LensflaresScene from './LensflareScene';
import RoadMap from './RoadMap';
import Blaster from './Blaster';
import Globe from './Globe';
import Video from './Video';
import Open from './Book/Open';

import './App.css';

function App() {
  const [planets,] = useState([]); 

  return (
    <Router>
      <div className="App">

        
        <Routes>
          <Route path="/" element={<Genesis />} />
          <Route path="/solar-moon" element={<SolarMoon />} />
          <Route path="/planet-constructor" element={<PlanetConstructor />}/>
          <Route path="/space-race" element={<SpaceRace />}/>
          <Route path="/procedural-universe" element={<ProceduralUniverse />} />
          <Route path="/lensflares-scene" element={<LensflaresScene />} />
          <Route path="/road-map" element={<RoadMap />} />
          <Route path="/blaster" element={<Blaster />} />
          <Route path="/globe" element={<Globe/>} />
          <Route path="/open" element={<Open />} />

          <Route path="/video" element={<Video/>} />
          <Route path="/my-planets" element={<MyPlanets planets={planets} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
