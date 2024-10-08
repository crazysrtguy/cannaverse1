import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap, Power1 } from 'gsap';
import SideNav from './SideNav';


const VideoCubes = () => {
        const mountRef = useRef(null);
        const videoRef = useRef(null);
        const [videoLoaded, setVideoLoaded] = useState(false);
        const [isPlaying, setIsPlaying] = useState(false);
        const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
      
    let scene, camera, renderer, cubeGrid;

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const animateCubes = () => {
    requestAnimationFrame(animateCubes);
  
    if (videoLoaded) {
      cubeGrid.children.forEach((mesh) => {
        mesh.material.map.needsUpdate = true;
      });
    }
  
    if (!initialAnimationComplete) {
      const cubesToAnimate = cubeGrid.children.slice(0, 5); // Adjust the number of cubes to animate
      let currentIndex = 0;
  
      const animateNextCube = () => {
        const mesh = cubesToAnimate[currentIndex];
        const duration = 1;
  
        gsap.to(mesh.position, {
          duration,
          x: mesh.position.x + 1000,
          ease: Power1.easeInOut,
          onComplete: () => {
            gsap.to(mesh.rotation, {
              duration,
              y: Math.PI * 2,
              ease: Power1.easeInOut,
              onComplete: () => {
                gsap.to(mesh.position, {
                  duration,
                  x: mesh.userData.originalX,
                  ease: Power1.easeInOut,
                  onComplete: () => {
                    currentIndex++;
                    if (currentIndex < cubesToAnimate.length) {
                      animateNextCube();
                    } else {
                      setInitialAnimationComplete(true);
                    }
                  },
                });
              },
            });
          },
        });
      };
  
      animateNextCube();
    } else {
      // Add more logic for other animations here if needed
    }
  
    renderer.render(scene, camera);
  };
  
  
  
  

  useEffect(() => {
    videoRef.current.onloadeddata = () => {
      setVideoLoaded(true);
    };
  }, []);

  useEffect(() => {
    // Setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Create a grid of cubes
    const gridX = 10;
    const gridY = 5;
    const videoWidth = 1280;
    const videoHeight = 720;
    const cubeSize = videoWidth / gridX;
    const spacing = 1.5; // Adjust spacing as needed

    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, 0.1);

    cubeGrid = new THREE.Group();

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const material = new THREE.MeshBasicMaterial({ map: new THREE.VideoTexture(videoRef.current) });

        const mesh = new THREE.Mesh(geometry, material);

        // Define offsets and repeats for UV mapping
        material.map.offset.x = i / gridX;
        material.map.offset.y = j / gridY;
        material.map.repeat.x = 1 / gridX;
        material.map.repeat.y = 1 / gridY;

        mesh.position.set(
          (i - gridX / 2) * (cubeSize + spacing),
          (j - gridY / 2) * (cubeSize + spacing),
          0
        );

        // Store original position as user data for each mesh
        mesh.userData = {
          originalX: mesh.position.x,
          originalY: mesh.position.y,
          originalZ: mesh.position.z,
        };

        cubeGrid.add(mesh);
      }
    }

    scene.add(cubeGrid);

    camera.position.z = 600;

    animateCubes(); // Start the cube animations
  }, [videoLoaded]);

  return (
    <>
      <div ref={mountRef} style={{ width: '100vw', height: '100vh' }}>
        <button onClick={handlePlayPause} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <SideNav /> 

      </div>
      <video ref={videoRef} src="/game2.mp4" autoPlay loop style={{ display: 'none' }} />
    </>
  );
};

export default VideoCubes;
