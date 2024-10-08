import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
//import Header from './Header';
import SideNav from './SideNav';


// Style definitions
const infoBoxStyle = {
  position: 'fixed',
  top: '10%',
  left: '10%',
  background: '#4CAF50',
  padding: '20px',
  borderRadius: '15px',
  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
  maxWidth: '300px'
};



const titleStyle = {
  fontFamily: 'Pacifico, cursive',
  color: '#FFF',
  background: '#388E3C',
  padding: '5px 10px',
  borderRadius: '10px',
  textAlign: 'center'
};

const descriptionStyle = {
  fontFamily: 'Arial, sans-serif',
  marginTop: '10px',
  color: '#2E7D32'
};


const Genesis = () => {
  const mountRef = useRef(null);
  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  
  const planetData = {
    'leaf2.png': {
        title: "Cannabia Prime",
        description: "The hub of cannabis culture in the galaxy. Home to the ancient and most pure strains of cannabis, its history is deeply rooted in interstellar peace and creativity.",
        distance: "0 light years (Main Planet)"
    },
    'leaf8.png': {
        title: "Sativa Star",
        description: "Known for uplifting and cerebral effects, this planet's atmosphere energizes all who visit. Native strains promote creativity and focus.",
        distance: "4.2 light years"
    },
    'can.png': {
        title: "Indica Isle",
        description: "A relaxed and serene world, its strains are renowned for their relaxing qualities. The perfect place for rest and recuperation.",
        distance: "5.8 light years"
    },
    'leaf3.png': {
        title: "Hybrid Haven",
        description: "A balanced world where sativa and indica strains coexist in harmony. The planet itself represents equilibrium and adaptability.",
        distance: "3.7 light years"
    },
    'leaf4.png': {
        title: "Terpene Terra",
        description: "This icy world is the primary source of terpenes – aromatic compounds found in cannabis that shape its flavor and effects.",
        distance: "8.1 light years"
    },
    'leaf5.png': {
        title: "CBD Celestia",
        description: "A tranquil oasis known for its non-psychoactive healing properties. The native strains here are rich in CBD, promoting health and wellness.",
        distance: "2.3 light years"
    },
    'leaf7.png': {
        title: "THC Titan",
        description: "A gas giant swirling with storms of potent THC. The source of the psychoactive effects in cannabis, it's a planet of intense experiences.",
        distance: "9.4 light years"
    },
    'leaf6.png': {
        title: "Ruderalis Realm",
        description: "A rugged and hardy planet, home to cannabis strains that flower automatically and are resilient to harsh conditions.",
        distance: "6.2 light years"
    },
    'leaf.png': {
        title: "Edibles Elysium",
        description: "Oceanic world renowned for creating the galaxy's finest cannabis-infused food and drinks. An epicurean's delight.",
        distance: "7.7 light years"
    },
    'weed3.png': {
        title: "Concentrate Cluster",
        description: "Rocky terrain rich in dense cannabis resins and extracts. The hub for creating shatter, wax, and other potent concentrates.",
        distance: "5.1 light years"
    },
    'weed1.png': {
        title: "Vapor Vale",
        description: "Cloud-covered planet known for pioneering cannabis vaping technology, offering a smoother and cleaner experience.",
        distance: "4.9 light years"
    },
    'weed.png': {
        title: "Cannabinoid Constellation",
        description: "Twin of Concentrate Cluster, it's known for its diverse range of cannabinoids that work in synergy to produce the entourage effect.",
        distance: "5.4 light years"
    }
  };
  
  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const planets = [];
    let hoveredPlanet = null;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

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
      planet.userData.textureName = texturePath;  // Attach the texture name as user data

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

    // Additional smaller planets
    const sidePlanet9 = createPlanet('weed.png', .85, { x: 0, y: 4, z: 2 });
    const sidePlanet10 = createPlanet('weed1.png', 1.3, { x: -9, y: 5, z: -2 });
    const sidePlanet11 = createPlanet('weed3.png', 2.28, { x:8, y: -3, z: 0 });
// ... [Other planets creation code remains unchanged]
// Create your planets here
    // ...

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 8);
    scene.add(light);

    
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / width) * 2 - 1;
      mouse.y = -(event.clientY / height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

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
      // Check if the clicked element is not a button (or some other UI element you want to exclude)
      if (event.target.tagName !== 'BUTTON') {
        if (hoveredPlanet) {
          const texturePath = hoveredPlanet.material.map.image.src;
          const textureFilename = texturePath.split('/').pop();
          if (selectedPlanet === textureFilename) {
            setSelectedPlanet(null); // hide info if the same planet is clicked again
          } else {
            setSelectedPlanet(textureFilename); // show new planet's info
          }
        }
      }
    };
    

    
    mountRef.current.addEventListener('mousemove', onMouseMove);
    mountRef.current.addEventListener('click', onClick);

    const animate = () => {
      requestAnimationFrame(animate);

      starField.rotation.x += 0.001;
      starField.rotation.y += 0.001;

      mainPlanet.rotation.y += -0.008;
      sidePlanet1.rotation.y += 0.006;
      sidePlanet2.rotation.y += -0.006;
      sidePlanet3.rotation.y += 0.005;
      sidePlanet4.rotation.y += 0.004;
      sidePlanet5.rotation.y += 0.006;
      sidePlanet6.rotation.y += -0.003;
      sidePlanet7.rotation.y += 0.006;
      sidePlanet8.rotation.y += -0.009;

      sidePlanet9.rotation.y += 0.007;
      sidePlanet10.rotation.y += -0.007;
      sidePlanet11.rotation.y += 0.007;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      console.log("Cleanup function triggered");
    console.log("mountRef.current:", mountRef.current);
    console.log("renderer:", renderer);
    console.log("renderer.domElement:", renderer ? renderer.domElement : null);

      if (mountRef && mountRef.current) {
        // Check for existence before trying to remove event listeners
        mountRef.current.removeEventListener('mousemove', onMouseMove);
        mountRef.current.removeEventListener('click', onClick);
  
        // Check if renderer.domElement exists and is a child of mountRef.current
        if (renderer && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
  
      // Dispose of your geometry and material here
      geometry.dispose();
      pointsMaterial.dispose();
  };
    
    // This return statement is the last thing inside the useEffect hook.
    
  }, []); // The dependency array remains unchanged
  
    
    
    const planetInfo = selectedPlanet ? planetData[selectedPlanet] : null;
    
    return (
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }}>
        {planetInfo && (
          <div style={infoBoxStyle}>
            <h3 style={titleStyle}>{planetInfo.title}</h3>
            <p style={descriptionStyle}>{planetInfo.description}</p>
            <p style={descriptionStyle}>{planetInfo.distance} from Cannabium Prime</p>
          </div>
        )}
      </div>
    );
  }
  
  function GenesisPage() {
    const navigate = useNavigate();

    const glowingTextStyle = {
      position: 'fixed',
      bottom: '20px', 
      left: '20px', // Changed from 'left' to 'right'
    
      color: '#4CAF50', // This is the green color you seem to be using
      fontSize: '84px',
      textShadow: '0 0 10px #4CAF50, 0 0 20px #4CAF50, 0 0 30px #4CAF50, 0 0 40px #4CAF50'
    };
    
    
    const floatingButtonStyle = {
      position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '10px 20px',
  background: 'linear-gradient(45deg, #4CAF50, #5e35b1)',
  color: '#FFFFFF',
  borderRadius: '20px',
  cursor: 'pointer',
  animation: 'glowing 1500ms infinite',
  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      zIndex: 9999,
    };
    const glowingPurpleButtonStyle = {
      position: 'fixed',
      bottom: '20px',  // Position it above the Create Planet button
      right: '200px',
      padding: '10px 20px',
      background: '#9c27b0', // Purple color
      color: '#FFFFFF',
      borderRadius: '20px',
      cursor: 'pointer',
      background: 'linear-gradient(45deg, #8e24aa, #4CAF50)',
      animation: 'glowing 1500ms infinite',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
      textShadow: '0 0 10px #9c27b0, 0 0 20px #9c27b0, 0 0 30px #9c27b0, 0 0 40px #9c27b0'  // Purple glow
    };


    const floatingButtonStyle2 = {
      position: 'fixed',
  bottom: '20px',
  right: '380px',
  padding: '10px 20px',
  background: 'linear-gradient(45deg, #4CAF50, #5e35b1)',
  color: '#FFFFFF',
  borderRadius: '20px',
  cursor: 'pointer',
  animation: 'glowing 1500ms infinite',
      zIndex: 9999,
    };

    const floatingButtonStyle3 = {
      position: 'fixed',
  bottom: '20px',
  right: '600px',
  background: 'linear-gradient(45deg, #5e35b1, #4CAF50)',
  padding: '10px 20px',
  color: '#FFFFFF',
  borderRadius: '20px',
  cursor: 'pointer',
  animation: 'glowing 1500ms infinite',
      zIndex: 9999,
    };

    const floatingButtonStyle4 = {
      position: 'fixed',
  bottom: '20px',
  right: '530px',
  background: 'linear-gradient(45deg, #5e35b1, #4CAF50)',
  padding: '10px 20px',
  color: '#FFFFFF',
  borderRadius: '20px',
  cursor: 'pointer',
  animation: 'glowing 1500ms infinite',
      zIndex: 9999,
    };

    const floatingButtonStyle5 = {
      position: 'fixed',
  bottom: '20px',
  right: '900px',
  background: 'linear-gradient(45deg, #5e35b1, #4CAF50)',
  padding: '10px 20px',
  color: '#FFFFFF',
  borderRadius: '20px',
  cursor: 'pointer',
  animation: 'glowing 1500ms infinite',
      zIndex: 9999,
    };

    const floatingButtonStyle6 = {
      position: 'fixed',
  bottom: '20px',
  right: '730px',
  background: 'linear-gradient(45deg, #5e35b1, #4CAF50)',
  padding: '10px 20px',
  color: '#FFFFFF',
  borderRadius: '20px',
  cursor: 'pointer',
  animation: 'glowing 1500ms infinite',
      zIndex: 9999,
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
  
  
  
  