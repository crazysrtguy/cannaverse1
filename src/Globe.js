import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { ImprovedNoise } from 'three/addons/math/ImprovedNoise.js';
import HUD from './HUD'; // Import the HUD component
import SideNav from './SideNav';

const Globe = () => {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const rendererRef = useRef(null);
  const seed = useRef(Math.PI / 4); // Moved seed here
  const [speed, setSpeed] = useState(0); // State for speed
  const [altitude, setAltitude] = useState(0); // State for altitude
  const [gpsLocation, setGpsLocation] = useState("Lat: 0, Long: 0");
  const clock = new THREE.Clock();
  const worldWidth = 256, worldDepth = 256;
  const planets = useRef([]); // Track planets that can be destroyed

  // Laser variables
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const laserColor = 0xff0000; // Laser color (red)
  let scene; // Declare scene globally for access in functions

  const generateHeight = (width, height) => {
    const x = Math.sin(seed.current++) * 10000;
    const randomValue = x - Math.floor(x);

    const size = width * height, data = new Uint8Array(size);
    const perlin = new ImprovedNoise(), z = randomValue * 100; // Use randomValue here

    let quality = 1;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width, y = ~~(i / width);
        data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 2.75);
      }
      quality *= 5;
    }

    return data;
  };

  const generateTexture = (data, width, height) => {
    let context, image, imageData, shade;

    const vector3 = new THREE.Vector3(0, 0, 0);
    const sun = new THREE.Vector3(1, 1, 1);
    sun.normalize();

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0, 0, width, height);

    image = context.getImageData(0, 0, canvas.width, canvas.height);
    imageData = image.data;

    for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
      vector3.x = data[j - 2] - data[j + 2];
      vector3.y = 2;
      vector3.z = data[j - width * 2] - data[j + width * 2];
      vector3.normalize();

      shade = vector3.dot(sun);

      imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007);
      imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007);
      imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007);
    }

    context.putImageData(image, 0, 0);

    // Scaled 4x
    const canvasScaled = document.createElement('canvas');
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext('2d');
    context.scale(4, 4);
    context.drawImage(canvas, 0, 0);

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
    imageData = image.data;

    for (let i = 0, l = imageData.length; i < l; i += 4) {
      const v = ~~(Math.random() * 5);
      imageData[i] += v;
      imageData[i + 1] += v;
      imageData[i + 2] += v;
    }

    context.putImageData(image, 0, 0);

    return canvasScaled;
  };

  const shootLaser = () => {
    raycaster.setFromCamera({ x: 0, y: 0 }, cameraRef.current); // Firing straight forward
  
    const intersects = raycaster.intersectObjects(planets.current);
  
    if (intersects.length > 0) {
      const hitObject = intersects[0].object;
      console.log('Laser hit an object:', hitObject);
  
      const laserMaterial = new THREE.LineBasicMaterial({ color: laserColor });
      const laserGeometry = new THREE.BufferGeometry().setFromPoints([
        cameraRef.current.position,
        intersects[0].point,
      ]);
      const laserBeam = new THREE.Line(laserGeometry, laserMaterial);
      scene.add(laserBeam);
  
      setTimeout(() => {
        scene.remove(laserBeam);
      }, 500);
  
      const explosionMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const explosionGeometry = new THREE.SphereGeometry(50, 16, 16);
      const explosion = new THREE.Mesh(explosionGeometry, explosionMaterial);
      explosion.position.copy(intersects[0].point);
      scene.add(explosion);
  
      setTimeout(() => {
        scene.remove(explosion);
      }, 500);
  
      scene.remove(hitObject);
    } else {
      console.log('Laser missed');
    }
  };
  
  useEffect(() => {
    const container = containerRef.current;

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 70000);
    cameraRef.current = camera;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xefd1b5);
    scene.fog = new THREE.FogExp2(0xefd1b5, 0.00025);

    const data = generateHeight(worldWidth, worldDepth);
    camera.position.set(100, 1200, -800);
    camera.lookAt(-100, 1210, -800);

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const planetTextures = [
      '/crypto15.png',
      '/crypto16.png',
      '/crypto17.png',
      '/crypto18.png',
      '/crypto19.png',
    ];

    for (let i = 1; i < 20; i++) {
      const texture = new THREE.TextureLoader().load(planetTextures[Math.floor(Math.random() * planetTextures.length)]);
    
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const size = Math.random() * 500 + 1500;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
    
      const planet = new THREE.Mesh(geometry, material);
    
      // Increase the range for x, y, z positions
      planet.position.x = (Math.random() - 0.5) * 20000;  // Increase this value for more separation on x-axis
      planet.position.y = Math.random() * 8000 + 4000;   // Increase this value for more separation on y-axis
      planet.position.z = (Math.random() - 0.5) * 20000;  // Increase this value for more separation on z-axis
    
      scene.add(planet);
      planets.current.push(planet);
    }
    
    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 250;
    controls.lookSpeed = 0.1;
    controlsRef.current = controls;

    const geometry = new THREE.PlaneGeometry(15000, 15000, worldWidth - 1, worldDepth - 1);
    geometry.rotateX(-Math.PI / 2);
    const vertices = geometry.attributes.position.array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10;
    }

    const texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth));
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
    scene.add(mesh);

    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      controls.update(delta);

      setSpeed(controls.movementSpeed.toFixed(2));
      setAltitude(camera.position.y.toFixed(2));

      setGpsLocation(`Lat: ${(camera.position.x / 100).toFixed(2)}, Long: ${(camera.position.z / 100).toFixed(2)}`);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handling
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize);

    // Cleanup
    return () => {
      container.removeChild(renderer.domElement);
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <>
      <SideNav />
      <div ref={containerRef} />
      <HUD speed={speed} altitude={altitude} gpsLocation={gpsLocation} shootLaser={shootLaser} />
    </>
  );
};

export default Globe;
