import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import SideNav from './SideNav';

// Style definitions
const infoBoxStyle = {
  position: 'fixed',
  top: '20%',
  left: '50%',
  background: '#4CAF50',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
  maxWidth: '300px',
  maxLength: '500px',

  zIndex: 1000,
  
};

const titleStyle = {
  fontFamily: 'Pacifico, cursive',
  color: '#FFF',
  background: '#388E3C',
  padding: '5px 10px',
  borderRadius: '10px',
  textAlign: 'center',
};

const descriptionStyle = {
  fontFamily: 'Arial, sans-serif',
  marginTop: '10px',
  color: '#2E7D32',
};

const closeButtonStyle = {
  position: 'absolute',
  top: '5px',
  right: '5px',
  background: 'none',
  border: 'none',
  color: '#FFF',
  fontSize: '20px',
  cursor: 'pointer',
};

const Genesis = () => {
  const mountRef = useRef(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [camera, setCamera] = useState(null);

  const planetData = {
    'leaf2.png': {
      title: "Cannabia Prime",
      description: "The hub of cannabis culture in the galaxy. Home to the ancient and most pure strains of cannabis, its history is deeply rooted in interstellar peace and creativity.",
      distance: "0 light years (Main Planet)",
    },
    'leaf8.png': {
      title: "Sativa Star",
      description: "Known for uplifting and cerebral effects, this planet's atmosphere energizes all who visit. Native strains promote creativity and focus.",
      distance: "4.2 light years",
    },
    'can.png': {
      title: "Indica Isle",
      description: "A relaxed and serene world, its strains are renowned for their relaxing qualities. The perfect place for rest and recuperation.",
      distance: "5.8 light years",
    },
    'leaf3.png': {
      title: "Hybrid Haven",
      description: "A balanced world where sativa and indica strains coexist in harmony. The planet itself represents equilibrium and adaptability.",
      distance: "3.7 light years",
    },
    'leaf4.png': {
      title: "Terpene Terra",
      description: "This icy world is the primary source of terpenes – aromatic compounds found in cannabis that shape its flavor and effects.",
      distance: "8.1 light years",
    },
    'leaf5.png': {
      title: "CBD Celestia",
      description: "A tranquil oasis known for its non-psychoactive healing properties. The native strains here are rich in CBD, promoting health and wellness.",
      distance: "2.3 light years",
    },
    'leaf7.png': {
      title: "THC Titan",
      description: "A gas giant swirling with storms of potent THC. The source of the psychoactive effects in cannabis, it's a planet of intense experiences.",
      distance: "9.4 light years",
    },
    'leaf6.png': {
      title: "Ruderalis Realm",
      description: "A rugged and hardy planet, home to cannabis strains that flower automatically and are resilient to harsh conditions.",
      distance: "6.2 light years",
    },
    'leaf.png': {
      title: "Edibles Elysium",
      description: "Oceanic world renowned for creating the galaxy's finest cannabis-infused food and drinks. An epicurean's delight.",
      distance: "7.7 light years",
    },
    'weed3.png': {
      title: "Concentrate Cluster",
      description: "Rocky terrain rich in dense cannabis resins and extracts. The hub for creating shatter, wax, and other potent concentrates.",
      distance: "5.1 light years",
    },
    'weed1.png': {
      title: "Vapor Vale",
      description: "Cloud-covered planet known for pioneering cannabis vaping technology, offering a smoother and cleaner experience.",
      distance: "4.9 light years",
    },
    'weed.png': {
      title: "Cannabinoid Constellation",
      description: "Twin of Concentrate Cluster, it's known for its diverse range of cannabinoids that work in synergy to produce the entourage effect.",
      distance: "5.4 light years",
    },
  };

  useEffect(() => {
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const planets = [];
    let hoveredPlanet = null;

    const scene = new THREE.Scene();
    const newCamera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    newCamera.position.z = 15;
    setCamera(newCamera);

    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.setSize(width, height);
    mountRef.current.appendChild(newRenderer.domElement);
    setRenderer(newRenderer);

    const geometry = new THREE.SphereGeometry(100, 200, 100);
    const pointsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: .0025 });
    const starField = new THREE.Points(geometry, pointsMaterial);
    scene.add(starField);

    const createPlanet = (texturePath, scale, position) => {
      const planetTexture = new THREE.TextureLoader().load(texturePath);
      planetTexture.minFilter = THREE.LinearFilter;

      const planetMaterial = new THREE.MeshPhongMaterial({ map: planetTexture });
      const planetGeometry = new THREE.SphereGeometry(1, 28, 32);
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);

      planet.scale.set(scale, scale, scale);
      planet.position.set(position.x, position.y, position.z);
      planet.userData.textureName = texturePath; // Attach the texture name as user data

      planets.push(planet);
      scene.add(planet);
      return planet;
    };

    const mainPlanet = createPlanet('leaf2.png', 1.9, { x: -8, y: -2.8, z: 0 });
    const sidePlanet1 = createPlanet('leaf8.png', 2.4, { x: 7, y: 1.5, z: 2 });
    const sidePlanet2 = createPlanet('can.png', 1.51, { x: -5.7, y: 1.2, z: 1 });
    const sidePlanet3 = createPlanet('leaf3.png', 0.95, { x: 3, y: 1.5, z: 2 });
    const sidePlanet4 = createPlanet('leaf4.png', 0.75, { x: -3, y: -2, z: -2 });
    const sidePlanet5 = createPlanet('leaf5.png', 0.65, { x: -1, y: -2.5, z: 2 });
    const sidePlanet6 = createPlanet('leaf7.png', 1.45, { x: 2, y: -3.75, z: -1 });
    const sidePlanet7 = createPlanet('leaf6.png', 2.93, { x: 0, y: 0, z: 0 });
    const sidePlanet8 = createPlanet('leaf.png', 0.95, { x: 4, y: -1.6, z: 3 });
    const sidePlanet9 = createPlanet('weed.png', 0.85, { x: 0, y: 4, z: 2 });
    const sidePlanet10 = createPlanet('weed1.png', 1.3, { x: -9, y: 5, z: -2 });
    const sidePlanet11 = createPlanet('weed3.png', 2.28, { x: 8, y: -3, z: 0 });

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 8);
    scene.add(light);

    const onMouseMove = (event) => {
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
      raycaster.setFromCamera(mouse, newCamera);

      const intersects = raycaster.intersectObjects(planets);

      if (hoveredPlanet) {
        hoveredPlanet.material.emissive.setHex(0x000000);
        hoveredPlanet = null;
      }

      if (intersects.length > 0) {
        hoveredPlanet = intersects[0].object;
        hoveredPlanet.material.emissive.setHex(0x555555);
      }
    };

    const onClick = (event) => {
      if (event.target.tagName !== 'BUTTON') {
        if (hoveredPlanet) {
          const texturePath = hoveredPlanet.material.map.image.src;
          const textureFilename = texturePath.split('/').pop();
          if (selectedPlanet === textureFilename) {
            setSelectedPlanet(null); // hide info if the same planet is clicked
          } else {
            setSelectedPlanet(textureFilename); // show info for the selected planet
          }
        } else {
          setSelectedPlanet(null); // hide info if clicking outside of a planet
        }
      }
    };

    const handleResize = () => {
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      newCamera.aspect = width / height;
      newCamera.updateProjectionMatrix();
      newRenderer.setSize(width, height);
    };

    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('click', onClick);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);

      starField.rotation.x += 0.001;
      starField.rotation.y += 0.001;

      // Rotate planets
      planets.forEach(planet => {
        planet.rotation.y += 0.005; // General rotation for all planets
      });

      newRenderer.render(scene, newCamera);
    };

    animate();

    return () => {
      mountRef.current.removeEventListener('mousemove', onMouseMove);
      mountRef.current.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(newRenderer.domElement);
      geometry.dispose();
      pointsMaterial.dispose();
    };
  }, []);

  const planetInfo = selectedPlanet ? planetData[selectedPlanet] : null;

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100vh' }}>
      {planetInfo && (
        <div style={infoBoxStyle}>
          <button style={closeButtonStyle} onClick={() => setSelectedPlanet(null)}>×</button>
          <h3 style={titleStyle}>{planetInfo.title}</h3>
          <p style={descriptionStyle}>{planetInfo.description}</p>
          <p style={descriptionStyle}>{planetInfo.distance} from Cannabium Prime</p>
        </div>
      )}
    </div>
  );
}

function GenesisPage() {
  const glowingTextStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '5%',
    color: '#4CAF50',
    fontSize: '4vw',
    textShadow: '0 0 10px #4CAF50, 0 0 20px #4CAF50, 0 0 30px #4CAF50, 0 0 40px #4CAF50',
  };

  const floatingButtonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '5%',
    padding: '10px 20px',
    background: 'linear-gradient(45deg, #4CAF50, #5e35b1)',
    color: '#FFFFFF',
    borderRadius: '20px',
    cursor: 'pointer',
    animation: 'glowing 1500ms infinite',
    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
    zIndex: 9999,
    fontSize: '1.5vw',
  };

  return (
    <div className="genesis-container">
      <Genesis />
      <div style={glowingTextStyle}>Welcome to CannaVerse</div>
      <SideNav className="side-nav" />
    </div>
  );
}

export default GenesisPage;