import React, { useRef, useEffect, useState } from 'react'; // Import useState
import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { CatmullRomCurve3 } from 'three';
import { VideoTexture } from 'three'; // Import VideoTexture
import SideNav from './SideNav';
import Hud from './HUD'; // Import the Hud component



const SpaceRace = () => {
  const containerRef = useRef();
  const lettersRef = useRef('WELCOME TO CANNAVERSE'.split(''));
  const letterSpacing = 0.02;
  const [animationStarted, setAnimationStarted] = useState(false); // Initialize state
  const [showButton, setShowButton] = useState(true); // State to show/hide the button
  const videoRef = useRef(null);
  const video2Ref = useRef(null);
  const textMeshes = useRef([]);
  const progressRef = useRef(0);
  const [speed, setSpeed] = useState(0); // State for speed
  const [altitude, setAltitude] = useState(0); // State for altitude
const [gpsLocation, setGpsLocation] = useState("Lat: 0, Long: 0");
const [prevTime, setPrevTime] = useState(performance.now());
const [prevPosition, setPrevPosition] = useState(new THREE.Vector3());
const cameraRef = useRef(null);


const updateHudData = () => {
const time = performance.now();
const deltaTime = (time - prevTime) / 1000; // Convert to seconds

// Calculate speed based on camera movement
const distance = cameraRef.current.position.distanceTo(prevPosition);
const speed = distance / deltaTime;

// Update state with speed and altitude
setSpeed(speed.toFixed(2)); // Round speed to two decimal places
setAltitude(cameraRef.current.position.y.toFixed(2)); // Assuming altitude is the y-coordinate

// Update GPS coordinates with current X and Z positions
const latitude = cameraRef.current.position.x.toFixed(1); // X position as latitude
const longitude = cameraRef.current.position.z.toFixed(1); // Z position as longitude
setGpsLocation(`Lat: ${latitude}, Long: ${longitude}`);

setPrevTime(time);
setPrevPosition(cameraRef.current.position.clone());

};


  const startAnimation = () => {
    setAnimationStarted(true);
    setShowButton(false);

    if (videoRef.current) {
      videoRef.current.play();
    }
   if (video2Ref.current) { // Check if video2 exists using video2Ref
    video2Ref.current.play();
  }
};

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 25, 188000);
    camera.position.setZ(25000);
    cameraRef.current = camera; // Assign the camera to the cameraRef

    const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new FlyControls(camera, renderer.domElement);
    controls.movementSpeed = 500;
    controls.rollSpeed = Math.PI / 200;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const textureLoader = new THREE.TextureLoader();

    const video = document.createElement('video');
    video.src = '/spacebg.mp4'; // Replace with your video URL
    video.autoplay = false;
    video.loop = true;
    video.muted = false; // You might want to mute it if you don't want audio
    video.crossOrigin = 'anonymous';
    videoRef.current = video;

   
    const videoTexture = new VideoTexture(video);
    
    videoTexture.minFilter = THREE.LinearFilter;
    
    scene.background = videoTexture;

    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.21 });
    const starsVertices = [];

    for (let i = 0; i < 5000; i++) {
      const x = (Math.random() - 0.5) * 80000;
      const y = (Math.random() - 0.5) * 80000;
      const z = (Math.random() - 0.5) * 80000;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    const planetTextures = [
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
    
    const galaxyPlanets = [];  // Array to store the galaxy planets
    
    const numberOfPlanets = 100;  // Adjust as needed

        for (let i = 0; i < numberOfPlanets; i++) {
            const randomTexture = planetTextures[Math.floor(Math.random() * planetTextures.length)];
            const planetMaterial = new THREE.MeshBasicMaterial({ map: randomTexture });  // Use a random texture
        
            const planetRadius = Math.random() * 1500 + 100;  // Random radius between 100 and 1100
            const planetGeometry = new THREE.SphereGeometry(planetRadius, 32, 32);
            const galaxyPlanet = new THREE.Mesh(planetGeometry, planetMaterial);
        
            galaxyPlanet.position.set(
                (Math.random() - 0.5) * 50000,  // Random x position between -10,000 and 10,000
                (Math.random() - 0.5) * 50000,  // Random y position
                (Math.random() - 0.5) * 50000  // Random z position behind the main planet
            );
        
            scene.add(galaxyPlanet);
            galaxyPlanets.push(galaxyPlanet);
        }


    const loader = new FontLoader();
    const textTexture = textureLoader.load('/mj.png');

    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
      const letters = lettersRef.current;

      letters.forEach((letter, index) => {
        const textGeometry = new TextGeometry(letter, {
          font: font,
          size: 3200,
          height: 50,
          curveSegments: 20,
          bevelEnabled: true,
          bevelThickness: 150,
          bevelSize: 20,
          bevelOffset: 5,
          bevelSegments: 8
        });

        const textMaterial = new THREE.MeshPhongMaterial({
          color: 0x00ff00,
          emissive: 0x072534,
          side: THREE.DoubleSide,
          shininess: 80,
          map: textTexture,
          specular: 0x009900,
          reflectivity: 0.8,
        });

        const letterMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMeshes.current.push(letterMesh);
        scene.add(letterMesh);

        const points = [];
        const segments = 1000;
        const radius = 30000;
        const elevationFactor = 3000;

        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * 2 * Math.PI;
          const x = radius * Math.cos(theta);
          const z = radius * Math.sin(theta);
          const y = elevationFactor * Math.sin(2 * theta);
          points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new CatmullRomCurve3(points);
        const animate = () => {
          requestAnimationFrame(animate);
          updateHudData();

          controls.update(1 / 60);
          renderer.render(scene, camera);

          progressRef.current -= 0.000055; // Decrease progress to move text backward
          if (progressRef.current < 0) progressRef.current = 1; // Reset progress to 1 when it reaches 0
        
          textMeshes.current.forEach((letterMesh, index) => {
            const position = curve.getPoint(progressRef.current + index * letterSpacing);
            letterMesh.position.set(position.x, position.y, position.z);
          });
        };

        animate();
    }, [animationStarted]);

   
      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      window.addEventListener('resize', handleResize);
    });
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {showButton && ( // Render the button conditionally based on showButton state
            <button
                onClick={startAnimation}
                style={{
                    position: 'absolute',
                    top: '50%',  // Keep it centered vertically
                    left: '50%',
                    transform: 'translate(-50%, -50%)',  // Center it horizontally
                    zIndex: 1, // Ensure the button appears on top of the scene
                }}
            >
                Start Animation
            </button>
        )}
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}></div>
        <div className="hud-container">
        <Hud speed={speed} altitude={altitude} gpsLocation={gpsLocation} />
        </div>
        <SideNav className="side-nav" />
    </div>
);
              }
export default SpaceRace;
