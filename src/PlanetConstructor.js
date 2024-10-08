import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './PlanetConstructor.css';
import SideNav from './SideNav';
import { Buffer } from 'buffer';

// Ensure Buffer is globally available
window.Buffer = Buffer;

const defaultPlanet = {
  name: '',
  description: '',
  size: 20,
  distanceFromCannabisPrime: 1, // Determines x, y, z coordinates
  texture: null,
  rotationSpeed: 1,  // Rotation speed in the preview
  nftRotationSpeed: 1,  // Rotation speed as an NFT attribute
  orbitalRadius: 15,  // Updated based on distanceFromCannabisPrime
  orbitalRange: 15   // Updated based on distanceFromCannabisPrime
};

function PlanetConstructor({ planets, setPlanets }) {
  const [planet, setPlanet] = useState(defaultPlanet);
  const [saved, setSaved] = useState(false);
  const [uploadedTexture, setUploadedTexture] = useState(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const planetRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  const handleTextureUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const textureURL = URL.createObjectURL(file);
      const texture = new THREE.TextureLoader().load(textureURL, () => {
        if (planetRef.current) {
          sceneRef.current.remove(planetRef.current);
        }
        setUploadedTexture(file);

        const planetGeometry = new THREE.SphereGeometry(planet.size, 32, 32);
        const planetMaterial = new THREE.MeshBasicMaterial({ map: texture });
        const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
        
        planetMesh.position.x += 27;
        planetRef.current = planetMesh;
        sceneRef.current.add(planetMesh);
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let finalValue = value;

    if (["nftRotationSpeed", "rotationSpeed", "size", "distanceFromCannabisPrime"].includes(name)) {
      finalValue = parseFloat(value);
      if (isNaN(finalValue)) finalValue = 0;
    }

    setPlanet((prevPlanet) => ({
      ...prevPlanet,
      [name]: finalValue
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setPlanets([...planets, planet]);
    setSaved(true);
  };

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 45;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    const resizeFunction = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resizeFunction);

    const animate = () => {
      requestAnimationFrame(animate);
      if (planetRef.current) {
        // Rotate the planet on its y-axis
        planetRef.current.rotation.y += planet.rotationSpeed * 0.01;

        // Orbit logic
        const angle = planetRef.current.rotation.y;
        planetRef.current.position.x = Math.cos(angle) * planet.orbitalRadius;
        planetRef.current.position.z = Math.sin(angle) * planet.orbitalRange;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeFunction);
    };
  }, [planet.rotationSpeed, planet.orbitalRadius]);

  return (
    <div className="planet-constructor-container">
      <div className="form-container">
        <form onSubmit={handleFormSubmit}>
          <h2>Create Your Own Planet</h2>

          <label htmlFor="planet-name">Planet Name:</label>
          <input type="text" id="planet-name" placeholder="Enter planet name" name="name" value={planet.name} onChange={handleInputChange} />

          <label htmlFor="planet-description">Description:</label>
          <textarea id="planet-description" placeholder="Enter planet description" name="description" value={planet.description} onChange={handleInputChange} />

          <label htmlFor="planet-size">Planet Size (Max 20):</label>
          <input type="number" id="planet-size" min="1" max="20" step="1" value={planet.size} name="size" onChange={handleInputChange} />

          <label htmlFor="distance-from-cannabis-prime">LightYears from Cannabis Prime:</label>
          <input type="number" id="distance-from-cannabis-prime" min="1" max="2500" step="1" value={planet.distanceFromCannabisPrime} name="distanceFromCannabisPrime" onChange={handleInputChange} />

          <label htmlFor="planet-texture">Planet Texture:</label>
          <input type="file" id="planet-texture" name="texture" onChange={handleTextureUpload} />

          <label htmlFor="nft-rotation-speed">NFT Rotation Speed:</label>
          <input type="number" id="nft-rotation-speed" min="-10" max="10" step="1" value={planet.nftRotationSpeed} name="nftRotationSpeed" onChange={handleInputChange} />

          <button type="submit">Submit</button>
          {saved && <span>Connect your wallet, mint your planet, and explore the galaxy!</span>}
        </form>
      </div>

      <div className="planet-display-container">
        <canvas ref={canvasRef} className="planet-preview" />
        <div className="slider-container">
          <label htmlFor="rotation-speed">Rotation Speed:</label>
          <input type="range" id="rotation-speed" min="-1" max="1" value={planet.rotationSpeed} name="rotationSpeed" onChange={handleInputChange} />
        </div>
        <div className="footer">
          <a href="/">Home</a>
         
        </div>
        <SideNav />
      </div>
    </div>
  );
}

export default PlanetConstructor;
