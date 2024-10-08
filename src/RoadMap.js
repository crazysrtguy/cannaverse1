import React, { useRef, useEffect, useState } from 'react'; // Import useState
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import './RoadMap.css';
import SideNav from './SideNav';


const RoadMap = () => {
  const mountRef = useRef(null);  // A reference to the DOM element where you'll mount the canvas

  const [planets,] = useState([]);



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
    if (!mountRef.current) return;
    

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(125, window.innerWidth / window.innerHeight, 0.1, 2500);
const cameraPivot = new THREE.Object3D();
    scene.add(cameraPivot);

let animatedObjects = [];  // This is now an array
const addVideoBillboard = (videoSrc, position) => {
    const video = document.createElement('video');
    video.src = videoSrc;
    video.loop = true;
    video.muted = true;
    video.play(); // Autoplay the video

    const videoTexture = new THREE.VideoTexture(video);
    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });

    const billboardGeometry = new THREE.PlaneGeometry(1000, 600); // Adjust the size of the billboard
    const billboard = new THREE.Mesh(billboardGeometry, videoMaterial);

    billboard.position.set(position.x, position.y, position.z);
    scene.add(billboard);
  };

  // Example positions for the video billboards
  addVideoBillboard('ufo.mp4', new THREE.Vector3(300, 150, -200));
  addVideoBillboard('spacebg2.mp4', new THREE.Vector3(-150, -30, 400));
  addVideoBillboard('ufo.mp4', new THREE.Vector3(100, 50, -200));
  addVideoBillboard('spacebg2.mp4', new THREE.Vector3(-350, 30, 400));

const textureLoader = new THREE.TextureLoader();


// Ambient light that softly illuminates every object in the scene equally.
const ambientLight = new THREE.AmbientLight(0xaaaaaa);
scene.add(ambientLight);

// Point light to highlight certain areas or objects.
const pointLight = new THREE.PointLight(0xffffff, 1, 500);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
mountRef.current.appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // For a smooth transition effect
controls.dampingFactor = 0.05;

const fbxLoader = new FBXLoader();

fbxLoader.load('./mjleaf.fbx', (originalObject) => {
    
    // Function to create a clone, apply material, scale, and position it
    const createAndAddObject = (xOffset, yOffset, zOffset) => {
        const clone = originalObject.clone();
        
        clone.traverse(child => {
            if (child.isMesh) {
                child.material = holographicMaterial;
            }
        });
        
        clone.scale.set(.31, 0.31, 0.31);
        clone.position.set(xOffset, yOffset, zOffset); // Adjusting position based on offsets
        
        scene.add(clone);
        animatedObjects.push(clone);  // Push clone into the array
    }

    // Function to generate random position
    const createRandomPosition = (min, max) => {
        return Math.random() * (max - min) + min;
    }

    const numberOfObjects = 158;  // Number of objects to be created
    const minPosition = -1805;   // Minimum position
    const maxPosition = 1845;    // Maximum position

    for(let i = 0; i < numberOfObjects; i++) {
        const randomX = createRandomPosition(minPosition, maxPosition);
        const randomY = createRandomPosition(minPosition, maxPosition); // If you want a different range for Y, modify these values
        const randomZ = createRandomPosition(minPosition, maxPosition); // If you want a different range for Z, modify these values

        createAndAddObject(randomX, randomY, randomZ);
    }
    
});


        let surfboard;  // This will hold the loaded surfboard model

const loadSurfboard = () => {
    fbxLoader.load('./mjleaf.fbx', (object) => {
        console.log("Surfboard loaded!"); // Add this
        object.traverse(child => {
            if (child.isMesh) {
                child.material = holographicMaterial;
            }
        });

        object.scale.set(0.11, 0.11, 0.11);  // Adjust scale as needed
        scene.add(object);
        surfboard = object;

    }, undefined, (error) => {
        console.error("Error loading surfboard:", error); // Add this error handler
    });
}
loadSurfboard();

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



const planetCount = 600;
for (let i = 0; i < planetCount; i++) {
  const size = Math.random() * 50 + 2;
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    map: textures[Math.floor(Math.random() * textures.length)],  
    shininess: 80,
});
  const planet = new THREE.Mesh(geometry, material);

  planet.position.x = 400 * (2.0 * Math.random() - 1.0);
  planet.position.y = 2000 * (2.0 * Math.random() - 1.0);
  planet.position.z = 2000 * (2.0 * Math.random() - 1.0);
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


const starGeometry = new THREE.BufferGeometry();
const starVertices = [];
for (let i = 0; i < 80000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.4 });
const starPoints = new THREE.Points(starGeometry, starMaterial);
scene.add(starPoints);

const climb = [
    new THREE.Vector3(0, 1005, 450),
    new THREE.Vector3(-380, -120, 220),
    new THREE.Vector3(110, 120, 150),
    new THREE.Vector3(0, -500, -100),  // A point below the loop
    new THREE.Vector3(500, -500, 0),   // A point to the right of the loop
    new THREE.Vector3(1000, -500, 0),  // A point to the left of the loop
    new THREE.Vector3(1500, -500, -100),    new THREE.Vector3(210, 1460, 350),
    new THREE.Vector3(-110, 560, -1250),
    
];

const drop = [
    new THREE.Vector3(500, -120, -900),
    new THREE.Vector3(-380, -120, 220),
    new THREE.Vector3(510, -260, 150),
    new THREE.Vector3(-1410, 360, -250),
    new THREE.Vector3(210, -1480, 350),
    new THREE.Vector3(-110, 560, -1420),
];

const loopTheLoop = [
    new THREE.Vector3(-380, -120, 220),
    new THREE.Vector3(1110, -260, 150),
    new THREE.Vector3(-1350, 360, -250),
    new THREE.Vector3(210, -1360, 350),
    new THREE.Vector3(-110, 560, -1650),
  
];

const turns = [
    new THREE.Vector3(-130, 410, -170),
  
];

const loop = [
    new THREE.Vector3(1110, -260, 150),
    new THREE.Vector3(100, 100, -300),
    new THREE.Vector3(200, 200, -400),
    new THREE.Vector3(300, 300, -500),
  
    // Second barrel roll
    new THREE.Vector3(400, 400, -600),
    new THREE.Vector3(500, 500, -700),
    new THREE.Vector3(600, 600, -800),
  
    // Third barrel roll
    new THREE.Vector3(700, 700, -900),
    new THREE.Vector3(800, 800, -1000),
    new THREE.Vector3(900, 900, -1100),    new THREE.Vector3(210, -1460, 350),
    new THREE.Vector3(-110, 560, -1150),


    
];

const barrelRoll = [
    new THREE.Vector3(-260, -50, -300),
   
];

const extendedCurvePoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(360, -260, 1150),
    new THREE.Vector3(-360, 360, -250),
    new THREE.Vector3(720, -1060, 1050),
    new THREE.Vector3(-720, 560, -1520),
    
    // ... Add as many points as you need to reach your desired length
];

const track = [].concat(
    [
        new THREE.Vector3(0, 0, 0),
        
    ],
    climb,
    drop,
    loopTheLoop,
    turns,
    loop,
    barrelRoll,
    extendedCurvePoints
);


    
    const repetitions = 1; // This value is just a placeholder and can be adjusted.
let finalTrack = [];
for (let i = 0; i < repetitions; i++) {
    finalTrack = finalTrack.concat(track);
}

const curve = new THREE.CatmullRomCurve3(finalTrack); 

const points = curve.getPoints(2000);



const sphereGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });

points.forEach((point, index) => {
    if (index % 20 === 0) { // example to space out milestones
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(point);
        scene.add(sphere);
    }
});


const holographicMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { type: "f", value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            float glow = sin(vUv.y * 10.0 + time) * 0.1 + 0.9;
            float interference = sin(vUv.y * 50.0 + time) * 0.05;
            gl_FragColor = vec4(0.1, 0.5, 1.0, 0.6) * glow + interference;
        }
    `,
    transparent: true,
    side: THREE.DoubleSide

    
});

const tubeGeometry = new THREE.TubeGeometry(curve, 5000, 10.5, 28, false);
const tubeMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        void main() {
            float rainbow = vUv.y;
            vec3 color;
            color.r = sin(3.14159 * rainbow + 0.0) * 0.5 + 0.5;
            color.g = sin(3.14159 * rainbow + 2.0) * 0.5 + 0.5;
            color.b = sin(3.14159 * rainbow + 4.0) * 0.5 + 0.5;
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    side: THREE.DoubleSide,
    wireframe: true
});

const trackTube = new THREE.Mesh(tubeGeometry, tubeMaterial, holographicMaterial);
scene.add(trackTube);

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    
}

let surfboardCurveIndex = 0;
const surfboardDelta = 0.0000128;  // Adjust this value to change surfboard speed


function animate() {
    requestAnimationFrame(animate);

    animatedObjects.forEach(object => {
        object.rotation.y += 0.011;  // Adjusts the rotation speed
    });

    if (controls) {
        holographicMaterial.uniforms.time.value += .05;
        controls.update();
    }

    if (surfboard) {
        let curvePoint = curve.getPointAt(surfboardCurveIndex);
        surfboard.position.set(curvePoint.x, curvePoint.y, curvePoint.z);
        
        // Attach the camera to the surfboard and set its position relative to the surfboard
        surfboard.add(camera);
        camera.position.set(0, 0, 0);  // Adjust these values for desired camera position
    
        surfboardCurveIndex += surfboardDelta;
    }

    if (surfboard) {
        let curvePoint = curve.getPointAt(surfboardCurveIndex);
        surfboard.position.set(curvePoint.x, curvePoint.y, curvePoint.z);
        surfboardCurveIndex += surfboardDelta;

        // When the end of the curve is reached, reset the index
        if (surfboardCurveIndex > 1) surfboardCurveIndex = 0;
    }
    
    renderer.render(scene, camera);
}


const segment = 1 / 8;

for (let i = 0; i <= 1; i += segment) {
    const spherePosition = curve.getPointAt(i);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.copy(spherePosition);
    scene.add(sphere);
}

animate();

return () => {
    while(scene.children.length > 0){ 
        const object = scene.children[0];
        scene.remove(object);

        if(object.geometry) object.geometry.dispose();
        if(object.material) object.material.dispose();
        // If the object contains a texture (like in a MeshBasicMaterial), dispose the texture as well.
        if(object.material && object.material.map) object.material.map.dispose();
    }
    renderer.dispose();
};

}, );
return (
    <div>
      <div ref={mountRef} className="threejs-canvas-container" style={{ width: '100%', height: '100vh' }}></div>
      <SideNav />

      <div className="footer">
        <a href="/">Home</a>
        
      </div>
    </div>
  );
}

export default RoadMap;