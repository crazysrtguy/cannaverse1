import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import './LensFlare.css'
import SideNav from './SideNav';
import HUD from './HUD';


const LensflaresScene = () => {
  const containerRef = useRef(null);
  const [camera, setCamera] = useState(null);
  const [scene, setScene] = useState(null);
  const [renderer, setRenderer] = useState(null);
  const [controls, setControls] = useState(null);
  const [planets, setPlanets] = useState([]);
  const mountRef = useRef(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [isPopupVisible, setPopupVisible] = React.useState(false);
  const [speed, setSpeed] = useState(0); // State for speed
    const [altitude, setAltitude] = useState(0); // State for altitude
const [gpsLocation, setGpsLocation] = useState("Lat: 0, Long: 0");
const [prevTime, setPrevTime] = useState(performance.now());
const [prevPosition, setPrevPosition] = useState(new THREE.Vector3());


const updateHudData = () => {
  const time = performance.now();
  const deltaTime = (time - prevTime) / 1000; // Convert to seconds

  // Calculate speed based on camera movement
  const distance = camera.position.distanceTo(prevPosition);
  const speed = distance / deltaTime;

  // Update state with speed and altitude
  setSpeed(speed.toFixed(2)); // Round speed to two decimal places
  setAltitude(camera.position.y.toFixed(2)); // Assuming altitude is the y-coordinate

  // Update GPS coordinates with current X and Z positions
  const latitude = camera.position.x.toFixed(1); // X position as latitude
  const longitude = camera.position.z.toFixed(1); // Z position as longitude
  setGpsLocation(`Lat: ${latitude}, Long: ${longitude}`);

  setPrevTime(time);
setPrevPosition(camera.position.clone());

};

  const generatePlanetNames = () => {
    const cannabisTerms = ["Cann", "Sativa", "Indica", "Hemp", "Ruderal", "Kief", "Terp", "CBD", "THC", "Trich"];
    const cryptoTerms = ["Crypto", "Block", "Chain", "Coin", "Token", "Ledger", "Byte", "Satoshi", "Ether", "Hash"];
    const spaceTerms = ["Nebula", "Pulsar", "Comet", "Meteor", "Galaxy", "Star", "Void", "Quasar", "BlackHole", "Astro"];
  
    const cannabisName = cannabisTerms[Math.floor(Math.random() * cannabisTerms.length)];
    const cryptoName = cryptoTerms[Math.floor(Math.random() * cryptoTerms.length)];
    const spaceName = spaceTerms[Math.floor(Math.random() * spaceTerms.length)];
  
    return `${cannabisName}${cryptoName}${spaceName}`;
  };

  const generatePlanetDetail = () => {
    const potencies = [ "The cannabis found here boasts an incredibly high potency,",
    "The local cannabis strain has a mild potency, ideal for casual users,",
    "Experienced users often seek the extremely potent strains found on this planet,",
    "The cannabis here has a balanced potency, making it perfect for medicinal applications,",
    "Much to the surprise of visitors, the strains here exhibit variable potencies,",
    "A notable characteristic of the cannabis here is its consistent moderate potency,",
    "For those looking for a gentle experience, this planet's low potency strains are ideal,",
    "Crafted through eons of evolution, the ultra-potent strains here are sought by many,",
    "The potency here is perfectly tuned to match the preferences of its native inhabitants,",
    "Novices be warned! The potency of strains here can be overwhelming to the uninitiated,"
  ]; 
    const flavors = [ "with flavors reminiscent of fresh berries and citrus.",
    "with a subtle hint of pine and earthy undertones.",
    "and has a taste profile dominated by tropical fruits.",
    "with a spicy kick and a touch of sweetness.",
    "showcasing a delicate blend of mint and chocolate overtones.",
    "with a zesty lemon twist that lingers on the palate.",
    "expressing rich notes of coffee and caramel.",
    "and a distinct flavor profile marked by blueberry and mango.",
    "with a strong peppermint backdrop undercut by hints of vanilla.",
    "and a robust flavor that melds cherry with a touch of lavender."
  ];  
    const aromas = ["Its aroma fills the air with a pungent skunky scent,",
    "You'd be greeted by a sweet floral fragrance upon setting foot here,",
    "The scent is unmistakably woody with hints of lemon,",
    "It's impossible to miss the strong diesel aroma prevalent here,",
    "A medley of fruit and spice defines the aroma that wafts through the atmosphere,",
    "The refreshing scent of eucalyptus is dominant, often reminding visitors of a spa,",
    "The subtle musky aroma can be quite enchanting to the first-time traveler,",
    "Its aromatic profile is a blend of citrus and spice, unique to this locale,",
    "For many, the rich chocolatey aroma is the planet's main allure,",
    "The air is always thick with a resinous scent that's hard to pin down."
  ];
    const cryptos = ["Moreover, the primary crypto mined here is Bitcoin,",
    "This planet is rich in Ethereum mines,",
    "Interestingly, the natives here prefer mining Litecoin,",
    "A unique feature is its abundant reserves of Cardano,",
    "The underground vaults are chock-full of Ripple,",
    "Stellar has been the choice of crypto for mining here for generations,",
    "Deep beneath the surface lies hidden caches of Dogecoin,",
    "Recent explorations have revealed significant deposits of Polkadot,",
    "This planet could very well be the hub of Chainlink mining in the galaxy,",
    "Despite its remote location, miners flock here in droves for its Binance Coin reserves,"
  ];
    const quantities = ["with an estimated reserve of over a million coins ready for extraction.",
    "and it's believed that only 10% of its potential has been tapped so far.",
    "but scarcity has made mining a challenging endeavor.",
    "with vast mines spread across its terrain, promising a rich haul.",
    "however, the volatile landscape makes large-scale mining operations tricky.",
    "and state-of-the-art facilities ensure efficient extraction of the crypto.",
    "but hostile natives often pose challenges to external miners.",
    "and the underground tunnels are a testament to its rich crypto history.",
    "with automated bots handling the bulk of mining operations.",
    "where daily extraction rates have shattered all previous records."
  ];
  
    const potency = potencies[Math.floor(Math.random() * potencies.length)];
    const flavor = flavors[Math.floor(Math.random() * flavors.length)];
    const aroma = aromas[Math.floor(Math.random() * aromas.length)];
    const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
    const quantity = quantities[Math.floor(Math.random() * quantities.length)];
  
    return `${potency} ${flavor} ${aroma} ${crypto} ${quantity}`;
  };

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();

    // Load lens flare textures
    const textureFlare0 = textureLoader.load('/lensflare0_alpha.png');
    const textureFlare3 = textureLoader.load('/lensflare0_alpha.png');
   
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 9000);
    camera.position.z = 55;
    setCamera(camera);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    scene.fog = new THREE.Fog(scene.background, 3500, 15000);
    setScene(scene);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, .5);  // white color, 0.5 intensity
    scene.add(ambientLight);
    // Lights setup
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.15);
    dirLight.position.set(0, -1, 0).normalize();
    dirLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(dirLight);

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
    const vertices = [];

    for (let i = 0; i < 10000; i++) {
      const x = 8000 * (2.0 * Math.random() - 1.0);
      const y = 8000 * (2.0 * Math.random() - 1.0);
      const z = 8000 * (2.0 * Math.random() - 1.0);
      vertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    function addLight(h, s, l, x, y, z) {
      const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
      light.color.setHSL(h, s, l);
      light.position.set(x, y, z);
      scene.add(light);

      const lensflare = new Lensflare();
      lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
      lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
      lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
      light.add(lensflare);
    }

    addLight(0.55, 0.9, 0.5, 8000, 0, -4000);
addLight(1.08, 0.8, 0.5, 0, 3000, -8000);
addLight(0.995, 7.7, 0.9, 8000, 12000, -16000);
addLight(0.15, 0.9, 0.1, -12000, 0, -8000);
addLight(0.55, 0.9, 0.5, -8000, 0, 4000);
addLight(1.08, 0.8, 0.5, 0, -3000, 8000);



    const textures = [
      textureLoader.load('/leaf.png'), 
      textureLoader.load('/crypto1.png'),
      textureLoader.load('/crypto2.png'),
      textureLoader.load('/crypto3.png'),
      textureLoader.load('/crypto4.png'),
      textureLoader.load('/crypto5.png'),
      textureLoader.load('/crypto6.png'),
      textureLoader.load('/crypto7.png'),
      textureLoader.load('/crypto8.png'),
      textureLoader.load('/crypto9.png'),
      textureLoader.load('/shroom.png'),
      textureLoader.load('/shroom2.png'),
      textureLoader.load('/crypto11.png'),
      textureLoader.load('/crypto12.png'),
      textureLoader.load('/leaf.png'),
      textureLoader.load('/leaf2.png'),
      textureLoader.load('/leaf3.png'),
      textureLoader.load('/leaf5.png'),
      textureLoader.load('/leaf6.png'),
      textureLoader.load('/leaf7.png'),
      textureLoader.load('/leaf8.png'),
      textureLoader.load('/leaf12.png'),
      textureLoader.load('/mj.png'),
      textureLoader.load('/crypto20.png'),
      textureLoader.load('/crypto21.png'),
      textureLoader.load('/crypto22.png'),
      textureLoader.load('/crypto20.png'),
      textureLoader.load('/crypto23.png'),
      textureLoader.load('/crypto24.png'),

      textureLoader.load('/crypto16.png'),
      textureLoader.load('/crypto15.png'),
      textureLoader.load('/crypto14.png'),
      textureLoader.load('/crypto13.png'),
     
      textureLoader.load('/crypto17.png'),
      textureLoader.load('/crypto18.png'),
      textureLoader.load('/crypto19.png'),
      textureLoader.load('/crypto25.png'),
      textureLoader.load('/crypto26.png'),
      textureLoader.load('/crypto27.png'),
      textureLoader.load('/crypto28.png'),
      textureLoader.load('/crypto29.png'),
      textureLoader.load('/crypto30.png'),
      textureLoader.load('/crypto31.png'),
      textureLoader.load('/crypto32.png'),
      textureLoader.load('/crypto33.png'),
      textureLoader.load('/crypto34.png'),
      textureLoader.load('/crypto35.png'),
      textureLoader.load('/crypto36.png'),
      textureLoader.load('/crypto37.png'),
      textureLoader.load('/crypto38.png'),
      textureLoader.load('/crypto39.png'),
      textureLoader.load('/crypto40.png'),
      textureLoader.load('/crypto41.png'),
      textureLoader.load('/crypto42.png'),
      textureLoader.load('/crypto43.png'),
      textureLoader.load('/crypto44.png'),
      textureLoader.load('/crypto45.png'),
      textureLoader.load('/1.jpg'),
      textureLoader.load('/2.jpg'),
      textureLoader.load('/3.jpg'),
      textureLoader.load('/4.jpg'),
      textureLoader.load('/5.jpg'),
      textureLoader.load('/6.jpg'),
      textureLoader.load('/7.jpg'),
      textureLoader.load('/moon.png'),
      textureLoader.load('/Planet.png'),
      textureLoader.load('/weed1.png'),
      textureLoader.load('/weed2.png'),
      textureLoader.load('/weed3.png'),
      textureLoader.load('/weed4.png'),  
     
    ];


    const planetCount = 8000;
    for (let i = 0; i < planetCount; i++) {
      const size = Math.random() * 400 + 2;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        map: textures[Math.floor(Math.random() * textures.length)],  
        shininess: 80,
    });
      const planet = new THREE.Mesh(geometry, material);

      planet.position.x = 18000 * (2.0 * Math.random() - 1.0);
      planet.position.y = 18000 * (2.0 * Math.random() - 1.0);
      planet.position.z = 18000 * (2.0 * Math.random() - 1.0);
      planet.rotation.x = Math.random() * Math.PI;
      planet.rotation.y = Math.random() * Math.PI;
      planet.rotation.z = Math.random() * Math.PI;
      
      const planetData = {
        name: generatePlanetNames(),
        description: generatePlanetDetail(),
        size: planet.geometry.parameters.radius,
        temperature: (Math.random() * 600 - 300).toFixed(2),
        atmosphere: [ 'Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Methane',
        'Indica Haze', 'Sativa Mist', 'Hybrid Clouds', 'Kush Vapor',
        'Terpene Whiffs', 'CBD Breeze', 'THC Vapors', 'Trichome Air',
        'Linalool Aroma', 'Myrcene Essence', 'Limolene Mist', 'Caryophyllene Scent',
        'Pinene Fragrance', 'Cannabinoid Mist', 'Resinous Air', 'Hybrid Haze',
      ][Math.floor(Math.random() * 10)],
        moons: Math.floor(Math.random() * 10),
        
      };
      
      planet.userData = planetData;
      planet.matrixAutoUpdate = true; 
      planet.updateMatrix();
      scene.add(planet);
planets.push(planet);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    setRenderer(renderer);



    
    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 500;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;
    setControls(controls);

    

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    return () => {
      if (renderer && renderer.domElement && containerRef.current) {
          containerRef.current.removeChild(renderer.domElement); 
      }
  };
}, []);

useEffect(() => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onDocumentMouseDown = (event) => {
    event.preventDefault();
    

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      setSelectedPlanet(selected.userData);
      console.log('Clicked on a planet:', selected.userData);
    }
  };

  window.addEventListener('mousedown', onDocumentMouseDown);

  return () => {
    window.removeEventListener('mousedown', onDocumentMouseDown);
  };
}, [camera, planets]);

useEffect(() => {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onDocumentMouseDown = (event) => {
      event.preventDefault();

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(planets);

      if (intersects.length > 0) {
          const selected = intersects[0].object;
          setSelectedPlanet(selected.userData);
      }
  }

}, [camera, planets]);


useEffect(() => {
  if (controls && camera && scene && renderer) {
    const clock = new THREE.Clock();
    const planetsRotationSpeed = 0.31;

    const animate = () => {
      requestAnimationFrame(animate);

      const delta = clock.getDelta();

      planets.forEach(planet => {
        planet.rotation.x += planetsRotationSpeed * delta;
        planet.rotation.y += planetsRotationSpeed * delta;
        planet.rotation.z += planetsRotationSpeed * delta;
      });

      if (controls) {
        controls.update(delta);
      }
      updateHudData();

      if (renderer && camera && scene) {
        renderer.render(scene, camera);
      }
    };

    animate();

    
    
  }
}, [controls, camera, scene, renderer]);


  const closePopup = () => setPopupVisible(false);


  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      {selectedPlanet && (
        <div className="planet-popup">
          <h2>{selectedPlanet.name}</h2>
          <p>{selectedPlanet.description}</p>
          <p><strong>Size:</strong> {selectedPlanet.size}</p>
          <p><strong>Temperature:</strong> {selectedPlanet.temperature}</p>
          <p><strong>Atmosphere:</strong> {selectedPlanet.atmosphere}</p>
          <p><strong>Moons:</strong> {selectedPlanet.moons}</p>
          <button onClick={() => setSelectedPlanet(null)}>Close</button>
        </div>
      )}
      <div className="footer">
      <a href="/">Home</a>
       

      </div>
      <SideNav />
      <HUD speed={speed} altitude={altitude} gpsLocation={gpsLocation} />

    </div>
  );
      } 

export default LensflaresScene;