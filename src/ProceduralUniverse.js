import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import './ProceduralUniverse.css';
import SideNav from './SideNav';


const generatePlanetNames = () => {
  const cannabisTerms = [
    "Canna", "Sativa", "Indica", "Hemp", "Ruderal", 
    "Kief", "Terpene", "CBD", "THC", "Trichome",
    "Linalool", "Myrcene", "Limolene", "Caryophyllene", "Pinene",
    "Chlorophyll", "Flavonoid", "Cannabinoid", "Resin", "Hybrid",
  ];
    const cryptoTerms = [
      "Cryptocurrency", "BlockChain", "Coinage", "Tokenize", "Ledger",
      "ByteCoin", "Satoshi", "Etherium", "HashGraph", "Decentralize",
      "SmartContract", "DistributedLedger", "DigitalAsset", "Mining",
      "CryptoKey", "Transaction", "Fork", "Wallet", "Security", "Exchange",
    ];  
    const spaceTerms = [
      "Nebula", "Pulsar", "Comet", "Meteor", "Galaxy", 
      "Star", "Void", "Quasar", "BlackHole", "AstroNova",
      "Celestial", "Cosmic", "Orbit", "Astronaut", "Supernova",
      "Stellar", "Cosmos", "Aurora", "Interstellar", "Nebulosity",
    ];
  const planetNames = new Set();

  while (planetNames.size < 50) {
    const cannabisName = cannabisTerms[Math.floor(Math.random() * cannabisTerms.length)];
    const cryptoName = cryptoTerms[Math.floor(Math.random() * cryptoTerms.length)];
    const spaceName = spaceTerms[Math.floor(Math.random() * spaceTerms.length)];

    const planetName = `${cannabisName}${cryptoName}${spaceName}`;
    planetNames.add(planetName);
  }

  return Array.from(planetNames);
}

const potencies = [
  "The cannabis found here boasts an incredibly high potency,",
  "The local cannabis strain has a mild potency, ideal for casual users,",
  "Experienced users often seek the extremely potent strains found on this planet,",
  "The cannabis here has a balanced potency, making it perfect for medicinal applications,",
  "Much to the surprise of visitors, the strains here exhibit variable potencies,",
  "A notable characteristic of the cannabis here is its consistent moderate potency,",
  "For those looking for a gentle experience, this planet's low potency strains are ideal,",
  "Crafted through eons of evolution, the ultra-potent strains here are sought by many,",
  "The potency here is perfectly tuned to match the preferences of its native inhabitants,",
  "Novices be warned! The potency of strains here can be overwhelming to the uninitiated,",
  "The intoxicating potency of the local cannabis varieties is a well-kept secret among travelers,",
  "With potencies ranging from delicate to mind-bending, this planet caters to all preferences,",
  "Legend has it that the strains on this planet possess mythical levels of potency,",
  "Intriguingly, the potency of cannabis here is influenced by the unique cosmic radiation,",
  "Discover strains with celestial levels of potency that ignite creativity and relaxation,",
  "The spectrum of potencies on this planet parallels the vibrant hues of its nebulae,",
  "Harvested under celestial alignments, the strains here are known for their cosmic potency,",
  "Enthusiasts from across galaxies gather here to experience the diverse potencies available,",
  "The locals attribute their cosmic perspective to the out-of-this-world potency of their strains,",
  "A tapestry of potencies unfolds as you traverse the lush landscapes of this cannabis-rich world,",
];

const flavors = [
  "with flavors reminiscent of fresh berries and citrus.",
  "with a subtle hint of pine and earthy undertones.",
  "and has a taste profile dominated by tropical fruits.",
  "with a spicy kick and a touch of sweetness.",
  "showcasing a delicate blend of mint and chocolate overtones.",
  "with a zesty lemon twist that lingers on the palate.",
  "expressing rich notes of coffee and caramel.",
  "and a distinct flavor profile marked by blueberry and mango.",
  "with a strong peppermint backdrop undercut by hints of vanilla.",
  "and a robust flavor that melds cherry with a touch of lavender.",
  "A symphony of flavors unfolds with each inhale, revealing layers of honey and spice.",
  "Savor the interplay of earthy undertones and a burst of tropical fruits with every puff.",
  "The taste journey begins with a burst of citrus, followed by a soothing herbal finish.",
  "Envelop your senses in a cloud of creamy vanilla and a whisper of toasted almond.",
  "A medley of exotic spices dances on the palate, creating a harmonious blend of sensations.",
  "Embark on a taste adventure as vibrant notes of passion fruit intertwine with hints of clove.",
  "Hints of caramelized sugar and a dash of cinnamon evoke memories of freshly baked treats.",
  "Indulge in the luxurious fusion of dark chocolate and velvety blackberries on your tongue.",
  "Explore a flavor symposium where juicy peach meets a refreshing burst of cool mint.",
  "An unexpected fusion of wild berries and lavender leaves an enchanting impression.",
];


const aromas = [
  "Its aroma fills the air with a pungent skunky scent,",
  "You'd be greeted by a sweet floral fragrance upon setting foot here,",
  "The scent is unmistakably woody with hints of lemon,",
  "It's impossible to miss the strong diesel aroma prevalent here,",
  "A medley of fruit and spice defines the aroma that wafts through the atmosphere,",
  "The refreshing scent of eucalyptus is dominant, often reminding visitors of a spa,",
  "The subtle musky aroma can be quite enchanting to the first-time traveler,",
  "Its aromatic profile is a blend of citrus and spice, unique to this locale,",
  "For many, the rich chocolatey aroma is the planet's main allure,",
  "The air is always thick with a resinous scent that's hard to pin down.",
  "Inhale the intoxicating aroma of freshly harvested herbs, reminiscent of an alpine meadow.",
  "A symphony of lavender and pine dances on the breeze, evoking tranquility and calm.",
  "Embark on a fragrant journey with notes of earth and a subtle whisper of morning dew.",
  "The air carries whispers of citrus blossoms and a touch of peppery warmth.",
  "Breathe in the delicate scent of jasmine that mingles with the invigorating aroma of mint.",
  "Experience a delightful blend of cedarwood and rosemary that lingers in the atmosphere.",
  "Savor the scent of wild berries and warm spices, like a freshly baked berry pie.",
  "Indulge your senses in the rich aroma of sandalwood, leaving a sense of tranquility in its wake.",
  "The air is infused with the essence of sweet vanilla and hints of sun-kissed tropical fruits.",
  "An earthy aroma intermingles with the enchanting fragrance of night-blooming flowers.",
];

const cryptos = [
  "Moreover, the primary crypto mined here is Bitcoin,",
  "This planet is rich in Ethereum mines,",
  "Interestingly, the natives here prefer mining Litecoin,",
  "A unique feature is its abundant reserves of Cardano,",
  "The underground vaults are chock-full of Ripple,",
  "Stellar has been the choice of crypto for mining here for generations,",
  "Deep beneath the surface lies hidden caches of Dogecoin,",
  "Recent explorations have revealed significant deposits of Polkadot,",
  "This planet could very well be the hub of Chainlink mining in the galaxy,",
  "Despite its remote location, miners flock here in droves for its Binance Coin reserves,",
  "Dive into a world where Bitcoin flows like rivers, creating a digital tapestry of wealth,",
  "Ethereum mines light up the subterranean landscape, a testament to innovation and growth,",
  "Litecoin mining rigs hum softly, echoing the planet's commitment to energy-efficient crypto,",
  "Cardano's blockchain intricately weaves through the planet's core, empowering its inhabitants,",
  "Ripple's presence is felt in every underground cavern, connecting worlds with seamless transfers,",
  "Stellar's luminescence illuminates the depths, fostering interstellar connections and transactions,",
  "Unearth hidden Dogecoin treasures, a reminder that playfulness is a valued currency in the cosmos,",
  "Polkadot's vibrant network spreads like constellations, bridging ecosystems across the universe,",
  "Chainlink's oracle nodes span galaxies, ensuring data integrity for a decentralized cosmos,",
  "Amidst the stars, Binance Coin mining thrives, a testament to the planet's financial prowess and vision,",
];


const quantities = [
  "with an estimated reserve of over a million coins ready for extraction.",
  "and it's believed that only 10% of its potential has been tapped so far.",
  "but scarcity has made mining a challenging endeavor.",
  "with vast mines spread across its terrain, promising a rich haul.",
  "however, the volatile landscape makes large-scale mining operations tricky.",
  "and state-of-the-art facilities ensure efficient extraction of the crypto.",
  "but hostile natives often pose challenges to external miners.",
  "and the underground tunnels are a testament to its rich crypto history.",
  "with automated bots handling the bulk of mining operations.",
  "where daily extraction rates have shattered all previous records.",
  "Uncover a treasure trove of coins, awaiting skilled miners to unearth their digital wealth,",
  "The planet's untapped potential serves as a canvas for pioneering miners to leave their mark,",
  "Rare and precious, mining here is a quest for the few who dare to unravel the secrets of scarcity,",
  "From vast plains to mountainous ranges, the landscape echoes with the promise of crypto riches,",
  "Navigating the unpredictable terrain, miners harness resilience to unlock the crypto's hidden value,",
  "Advanced extraction facilities hum with the energy of progress, a testament to crypto innovation,",
  "Despite challenges, determined miners push boundaries, securing crypto from the heart of adversity,",
  "The planet's subterranean labyrinth is a tribute to the evolution of crypto, etched in every tunnel,",
  "Automated bots tirelessly orchestrate the symphony of crypto extraction, a testament to efficiency,",
  "Witness the evolution of crypto mining, where unprecedented extraction rates redefine the universe's limits,",
];



const generatePlanetDetail = () => {
  const potency = potencies[Math.floor(Math.random() * potencies.length)];
  const flavor = flavors[Math.floor(Math.random() * flavors.length)];
  const aroma = aromas[Math.floor(Math.random() * aromas.length)];
  const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
  const quantity = quantities[Math.floor(Math.random() * quantities.length)];

  return `${potency} ${flavor} ${aroma} ${crypto} ${quantity}`;
};

// Example usage for 10 descriptions:
for (let i = 0; i < 50; i++) {
}


const ProceduralUniverse = () => {
  const [isLeftSide, setIsLeftSide] = useState(true);
  const [warpSpeed, setWarpSpeed] = useState(false);
  const [warpSpeedValue, setWarpSpeedValue] = useState(1);

  const mountRef = useRef(null);
  const [isPopupVisible, setPopupVisible] = React.useState(false);
  const [currentPlanetDetails, setCurrentPlanetDetails] = useState(null);
  const warpSpeedValueRef = useRef(warpSpeedValue);

  useEffect(() => {
    warpSpeedValueRef.current = warpSpeedValue;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    const textureLoader = new THREE.TextureLoader();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

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

    // Starry background
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
    const vertices = [];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      vertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const geometry = new THREE.SphereGeometry(10.5, 32, 32);
    const planetNames = generatePlanetNames();
    const planets = [];

    for (let i = 0; i < 50; i++) {
      const material = new THREE.MeshBasicMaterial({
        map: textures[Math.floor(Math.random() * textures.length)]
      });

      const planet = new THREE.Mesh(geometry, material);

      planet.name = planetNames[i];
      planet.description = generatePlanetDetail();
      planet.temperature = (Math.random() * 600 - 300).toFixed(2);
      planet.numOfMoons = Math.floor(Math.random() * 10);
      planet.atmosphere = ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Methane'][Math.floor(Math.random() * 4)];
      planet.surfaceGravity = (Math.random() * 20).toFixed(2);
      planet.orbitalPeriod = Math.floor(Math.random() * 365) + 1;
      planet.rotationPeriod = Math.floor(Math.random() * 24) + 1;
      planet.position.z = -(i * 105);
      planet.position.x = (Math.random() - 0.5) * 750;
      planet.position.y = (Math.random() - 0.5) * 350;
      planet.rotationSpeed = (Math.random() * -0.04) + 0.04;
      

      scene.add(planet);
      planets.push(planet);
    }

    camera.position.z = 800;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePlanetClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets);

      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;

        setCurrentPlanetDetails({
          name: clickedPlanet.name,
          description: clickedPlanet.description,
          temperature: clickedPlanet.temperature,
          numOfMoons: clickedPlanet.numOfMoons,
          atmosphere: clickedPlanet.atmosphere,
          surfaceGravity: clickedPlanet.surfaceGravity,
          orbitalPeriod: clickedPlanet.orbitalPeriod,
          rotationPeriod: clickedPlanet.rotationPeriod
        });
        setPopupVisible(true);
        setIsLeftSide(!isLeftSide); // Toggle the side

      }
    };

    window.addEventListener('click', handlePlanetClick);

    const animate = () => {
      requestAnimationFrame(animate);

      planets.forEach(planet => {
        const speedMultiplier = warpSpeed ? 8.05 * Number(warpSpeedValue) : 1.41 * Number(warpSpeedValue);
        planet.position.z += speedMultiplier;
        planet.rotation.y += planet.rotationSpeed;
    });
    


      if (planets[planets.length - 1].position.z > 850) {
        planets.forEach((planet, index) => {
          planet.position.z = -(index * 300);
          planet.material.map = textures[Math.floor(Math.random() * textures.length)];
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', handlePlanetClick);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [warpSpeedValue, warpSpeed]);  // <-- This is the change.

  const closePopup = () => setPopupVisible(false);


  return (
    <div>
      <button className="floating-btn" onClick={() => setWarpSpeed(!warpSpeed)}>
        {warpSpeed ? 'Normal Speed' : 'Warp Speed'}
      </button>

      <div ref={mountRef} onClick={closePopup}>
        {isPopupVisible && (
          <div className={`popup show-popup ${isLeftSide ? 'left-side' : 'right-side'}`}>
            <h3>{currentPlanetDetails.name}</h3>
            <p>Description: {currentPlanetDetails.description}</p>
            <p>Temperature: {currentPlanetDetails.temperature}°C</p>
            <p>Number of Moons: {currentPlanetDetails.numOfMoons}</p>
            <p>Atmosphere: {currentPlanetDetails.atmosphere}</p>
            <p>Surface Gravity: {currentPlanetDetails.surfaceGravity} m/s²</p>
            <p>Orbital Period: {currentPlanetDetails.orbitalPeriod} days</p>
            <p>Rotation Period: {currentPlanetDetails.rotationPeriod} hours</p>
          </div>
        )}
      </div>

      {/* Footer moved outside the popup */}
      <div className="footer">
          <a href="/">Home</a>
       
      </div>
      <SideNav />

    </div>
);
        }
export default ProceduralUniverse;
