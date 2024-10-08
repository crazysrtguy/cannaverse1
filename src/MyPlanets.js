import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import './MyPlanets.css';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls';
import HUD from './HUD';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import SideNav from './SideNav';

function MyPlanets() {
    const sceneRef = useRef(null);
    const video1 = useRef(document.createElement('video'));
    const video2 = useRef(document.createElement('video'));
    const audioRef = useRef(null);
    const [showStartButton, setShowStartButton] = useState(true);
    const [showCrawl, setShowCrawl] = useState(false);
    const [speed, setSpeed] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [gpsLocation, setGpsLocation] = useState({ latitude: 0, longitude: 0 });
    const video3 = useRef(document.createElement('video'));
    const video4 = useRef(document.createElement('video'));
    const objModelRef = useRef(null);
    const [animateObj, setAnimateObj] = useState(false);
    const [objSpeed] = useState(1000);
    const [objRotationSpeed] = useState(0.005);
    const [objDirection] = useState(1);

    function handleUserInteraction() {
        console.log("handleUserInteraction called");
        setAnimateObj(true);
        setShowStartButton(false);
        setShowCrawl(true);
        video1.current.play();
        video2.current.play();
        video3.current.play();
        video4.current.play();
    
        if (audioRef.current && audioRef.current.paused) {
            try {
                audioRef.current.play().catch(error => {
                    console.error('Error playing audio:', error);
                });
            } catch (error) {
                console.error('Audio play failed:', error);
            }
        }
    }
    
    useEffect(() => {   
        const clock = new THREE.Clock();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 5, 30000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, depth: true, logarithmicDepthBuffer: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.domElement.style.zIndex = "0";

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        sceneRef.current.appendChild(renderer.domElement);
        
        const controls = new FlyControls(camera, renderer.domElement);
        controls.movementSpeed = 2500;
        controls.rollSpeed = Math.PI / 15;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        let prevTime = performance.now();
        let prevPosition = camera.position.clone();
        
        const updateHudData = () => {
            const time = performance.now();
            const deltaTime = (time - prevTime) / 1000;
            const distance = camera.position.distanceTo(prevPosition);
            const speed = distance / deltaTime;
          
            setSpeed(speed.toFixed(2));
            setAltitude(camera.position.y.toFixed(2));
          
            const latitude = camera.position.x.toFixed(1);
            const longitude = camera.position.z.toFixed(1);
            setGpsLocation(`Lat: ${latitude}, Long: ${longitude}`);
          
            prevTime = time;
            prevPosition = camera.position.clone();
        };
          
        const loader = new OBJLoader();

        loader.load('/StarWars.obj', (object) => {
            const holographicMaterial = new THREE.MeshBasicMaterial({
                color: 0x00aaff,
                transparent: true,
                opacity: 0.5,
                emissive: 0x00aaff,
                blending: THREE.AdditiveBlending,
            });

            object.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.material = holographicMaterial;
                }
            });
            object.scale.set(1000, 1000, 1000);

            objModelRef.current = object;
            objModelRef.current.position.set(0, 0, 30000);
            objModelRef.current.rotation.y = Math.PI / 2;
            scene.add(objModelRef.current);
        });

        const textureLoader = new THREE.TextureLoader();
        const planetTextures = [
            textureLoader.load('/leaf.png'), 
            textureLoader.load('/crypto1.png'),
            // ... [rest of the texture loads] ...
        ];
        
        const galaxyPlanets = [];
        
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 50000;
            const y = (Math.random() - 0.5) * 40000;
            const z = (Math.random() - 0.5) * 80000;
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.25 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        const moonTexture = new THREE.TextureLoader().load('/moon.png');
        const moonGeometry = new THREE.SphereGeometry(7000, 64, 64);
        const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.z = -35000;
        scene.add(moon);
        
        const planetTexture = new THREE.TextureLoader().load('/crypto11.png');
        const planetGeometry = new THREE.SphereGeometry(3000, 64, 64);
        const planetMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planet.position.set(12000, 0, 0);
        moon.add(planet);

        const numberOfPlanets = 100;

        for (let i = 0; i < numberOfPlanets; i++) {
            const randomTexture = planetTextures[Math.floor(Math.random() * planetTextures.length)];
            const planetMaterial = new THREE.MeshBasicMaterial({ map: randomTexture });
        
            const planetRadius = Math.random() * 1000 + 100;
            const planetGeometry = new THREE.SphereGeometry(planetRadius, 32, 32);
            const galaxyPlanet = new THREE.Mesh(planetGeometry, planetMaterial);
        
            galaxyPlanet.position.set(
                (Math.random() - 0.5) * 50000,
                (Math.random() - 0.5) * 50000,
                (Math.random() - 0.5) * 50000 + 5000
            );
        
            scene.add(galaxyPlanet);
            galaxyPlanets.push(galaxyPlanet);
        }

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize); // Add this line

        controls.addEventListener('start', handleUserInteraction);

        video3.current.src = '/ufo.mp4';
        video4.current.src = '/ufo.mp4';

        video3.current.muted = true;
        video4.current.muted = true;

        video3.current.load();
        video4.current.load();

        video3.current.loop = true;
        video4.current.loop = true;

        const videoTexture3 = new THREE.VideoTexture(video3.current);
        const videoTexture4 = new THREE.VideoTexture(video4.current);

        const videoMaterial3 = new THREE.MeshBasicMaterial({ map: videoTexture3 });
        const videoMaterial4 = new THREE.MeshBasicMaterial({ map: videoTexture4 });

        const videoGeometry2 = new THREE.PlaneGeometry(35000, 25800);

        const screen3 = new THREE.Mesh(videoGeometry2, videoMaterial3);
        const screen4 = new THREE.Mesh(videoGeometry2, videoMaterial4);

        screen3.rotation.y = Math.PI / 5.50;
        screen4.rotation.y = -Math.PI / 5.50;

        screen3.position.set(-12900, 0, 15000);
        screen4.position.set(12900, 0, 15000);

        scene.add(screen3);
        scene.add(screen4);
        video3.current.addEventListener('ended', handleVideoEnd);
        video4.current.addEventListener('ended', handleVideoEnd);

        video1.current.src = '/planet.mp4';
        video2.current.src = '/planet.mp4';

        video1.current.muted = true;
        video2.current.muted = true;

        video1.current.load();
        video2.current.load();

        video1.current.loop = true;
        video2.current.loop = true;

        const videoTexture1 = new THREE.VideoTexture(video1.current);
        const videoTexture2 = new THREE.VideoTexture(video2.current);

        const videoMaterial1 = new THREE.MeshBasicMaterial({ map: videoTexture1 });
        const videoMaterial2 = new THREE.MeshBasicMaterial({ map: videoTexture2 });

        const videoGeometry = new THREE.PlaneGeometry(35000, 25800);

        const screen1 = new THREE.Mesh(videoGeometry, videoMaterial1);
        const screen2 = new THREE.Mesh(videoGeometry, videoMaterial2);

        screen1.rotation.y = Math.PI / 5.50;
        screen2.rotation.y = -Math.PI / 5.50;

        screen1.position.set(-12900, 0, -65000);
        screen2.position.set(12900, 0, -65000);

        scene.add(screen1);
        scene.add(screen2);
        video1.current.addEventListener('ended', handleVideoEnd);
        video2.current.addEventListener('ended', handleVideoEnd);
       
        camera.position.z = 60000;

        function handleVideoEnd() {
            video1.current.removeEventListener('ended', handleVideoEnd);
            video2.current.removeEventListener('ended', handleVideoEnd);

            const duration = 8000;
            const startTime = Date.now();

            const initialScreen1Position = screen1.position.x;
            const initialScreen2Position = screen2.position.x;

            const targetScreen1Position = initialScreen1Position - 30000;
            const targetScreen2Position = initialScreen2Position + 30000;

            function animateScreens() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                screen1.position.x = initialScreen1Position + progress * (targetScreen1Position - initialScreen1Position);
                screen2.position.x = initialScreen2Position + progress * (targetScreen2Position - initialScreen2Position);

                if (progress < 1) {
                    requestAnimationFrame(animateScreens);
                }
            }

            animateScreens();
        }

        const animate = () => {
            requestAnimationFrame(animate);
            console.log("Animation frame called");

            const delta = clock.getDelta();

            if (objModelRef.current) {
                objModelRef.current.position.z -= -30;
                console.log("Manually moving OBJ. Current Z:", objModelRef.current.position.z);
            }
            planet.rotation.y += -0.05;
            moon.rotation.y += -0.007;
            updateHudData();

            controls.update(1/60);
            renderer.render(scene, camera);
        };
       
        animate();

        return () => {
            renderer.dispose();
            video1.current.pause();
            video2.current.pause();
            video1.current.removeEventListener('ended', handleVideoEnd);
            video2.current.removeEventListener('ended', handleVideoEnd);
            video3.current.pause();
            video4.current.pause();
            video3.current.removeEventListener('ended', handleVideoEnd);
            video4.current.removeEventListener('ended', handleVideoEnd);
            controls.removeEventListener('start', handleUserInteraction);
            controls.dispose();
            window.removeEventListener('resize', handleResize);

        };
    }, []);

    return (
<div ref={sceneRef} style={{ width: '100vw', height: '100vh' }}>
{showStartButton && (
                <button onClick={handleUserInteraction} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                    Start Experience
                </button>
            )}

            <audio ref={audioRef} src="StarWars.mp3" preload="auto"></audio>
            
            {showCrawl && (
                <div id="crawl-container">
                    <div id="crawl">
                        <div className="title">IN A FUTURE GALAXY NOT SO FAR AWAY</div>
                        <div className="subtitle">CannaVerse Awaits</div>
                        <div className="text">
                            <p>In the vast expanse of the digital universe, amidst galaxies of codes and chains, rises a force that redefines the cosmos: CannaVerse. Born from the visionary union of the ancient allure of cannabis and the cutting-edge Solana Chain, this realm is not just another constellation in the vast digital sky. It's a revolution.</p>

                            <p>Intrepid explorers from distant corners are drawn not merely to gaze at astral wonders but to shape them. They forge and curate planets, turning them into revered NFTs. These celestial bodies, echoing their creator's spirit, don't just float in space — they flourish, rewarding their architects with every rotation.</p>

                            <p>Yet, as the stars shimmer, deeper thrills await. Some visionaries don't just sculpt worlds; they design experiences — gravity-defying coasters that span galaxies, weaving between planets, offering rides that are more than thrills. They're legends. And those bold enough to craft these odysseys find fame and fortune as adventurers from all over flock to experience their genius.</p>

                            <p>On the horizon of this sprawling universe is an innovation that promises to redefine commerce. The 3D Cannabis Marketplace, a shimmering nexus of trade and wonder, prepares to open its gates. With the winds of federal legality blowing strong, this marketplace is poised to be the epicenter of the new age of trade.</p>

                            <p>But at the heart of CannaVerse, pulsing with life and light, is its community. A collective bound by creativity, driven by vision, and united in purpose. Here, every voice has power, every idea forms reality, and every decision is a step into the future. Together, they're not just witnessing a universe; they're writing its destiny.</p>

                            <p>This is the call of CannaVerse. A universe where dreams take form, where innovation meets imagination, and where the next chapter of the cosmic story awaits its heroes.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPlanets;