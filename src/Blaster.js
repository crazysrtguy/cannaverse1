import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import './ProceduralUniverse.css';
import SideNav from './SideNav';


const Blaster = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const laserSoundRef = useRef(new Audio('/blaster.mp3'));

  const lasers = useRef([]); // Store all active lasers
  const shootLaserRef = useRef(null);
  const planets = []; // Store all planets
  const aliens = useRef([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(120); 
  const [gameOver, setGameOver] = useState(false);
  const explosionSoundRef = useRef(new Audio('/explode.mp3'));

  const explosionVertexShader = `
  attribute float size;
  attribute float customTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const explosionFragmentShader = `
  uniform float time;
  varying vec2 vUv;
  void main() {
    float intensity = 1.0 - distance(vUv, vec2(0.5, 0.5));
    gl_FragColor = vec4(0.0, 1.0, 0.0, intensity) * max(sin(time), 0.2);
  }
`;

<audio ref={explosionSoundRef} autoPlay preload="auto">
  <source src="/explode.mp3" type="audio/mpeg" />
</audio>

  const explodePlanet = (planet) => {
    const explosionParticles = 2500;
    const explosionGeometry = new THREE.BufferGeometry();
    const positions = [];
    const velocities = []; // Store velocities for each particle
    const sizes = [];
    const customTimes = [];
    for (let i = 0; i < explosionParticles; i++) {
        const direction = new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize().multiplyScalar(Math.random() * 350);
        positions.push(planet.position.x, planet.position.y, planet.position.z);
        velocities.push(direction.x, direction.y, direction.z); // Store velocity direction
        sizes.push(10);
        customTimes.push(Math.random());
    }
    explosionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    explosionGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3)); // Set velocity attribute
    explosionGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    explosionGeometry.setAttribute('customTime', new THREE.Float32BufferAttribute(customTimes, 1));
  
    const explosionMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 }
        },
        vertexShader: explosionVertexShader,
        fragmentShader: explosionFragmentShader,
        transparent: true,
        depthWrite: false
    });
    const explosion = new THREE.Points(explosionGeometry, explosionMaterial);
    explosion.userData.update = function() {
        // Move particles based on their velocities
        const positionAttribute = explosion.geometry.attributes.position;
        const velocityAttribute = explosion.geometry.attributes.velocity;
        for (let i = 0; i < positionAttribute.count; i++) {
            positionAttribute.setXYZ(i, 
                positionAttribute.getX(i) + velocityAttribute.getX(i),
                positionAttribute.getY(i) + velocityAttribute.getY(i),
                positionAttribute.getZ(i) + velocityAttribute.getZ(i)
            );
        }
        positionAttribute.needsUpdate = true;
        explosionMaterial.uniforms.time.value += .01;

        
    };
    sceneRef.current.add(explosion); // <-- Modify this line
    explosionSoundRef.current.volume = 1; // Set the volume to maximum (1.0)
    explosionSoundRef.current.onerror = (e) => {
      console.error("Error loading explosion sound:", e);
    };
    
    setTimeout(() => {
      sceneRef.current.remove(explosion); // <-- Modify this line
    }, 2000);
  
    sceneRef.current.remove(planet); // <-- Modify this line

    setScore(prevScore => prevScore + 1);
  
};

  useEffect(() => {
    // Start the timer
    const timerInterval = setInterval(() => {
      setTimer(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timerInterval); // Stop the timer when it reaches 0
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval); // Clear the timer when the component is unmounted
  }, []);

  const endGame = () => {
    planets.forEach(planet => {
        // Explode the planet without adding to the score
        const explosionParticles = 2500;
        const explosionGeometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = []; // Store velocities for each particle
        const sizes = [];
        const customTimes = [];
        for (let i = 0; i < explosionParticles; i++) {
            const direction = new THREE.Vector3(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize().multiplyScalar(Math.random() * 350);
            positions.push(planet.position.x, planet.position.y, planet.position.z);
            velocities.push(direction.x, direction.y, direction.z); // Store velocity direction
            sizes.push(10);
            customTimes.push(Math.random());
        }
        explosionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        explosionGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3)); // Set velocity attribute
        explosionGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
        explosionGeometry.setAttribute('customTime', new THREE.Float32BufferAttribute(customTimes, 1));
    
        const explosionMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 1.0 }
            },
            vertexShader: explosionVertexShader,
            fragmentShader: explosionFragmentShader,
            transparent: true,
            depthWrite: false
        });
        const explosion = new THREE.Points(explosionGeometry, explosionMaterial);
        explosion.userData.update = function() {
            // Move particles based on their velocities
            const positionAttribute = explosion.geometry.attributes.position;
            const velocityAttribute = explosion.geometry.attributes.velocity;
            for (let i = 0; i < positionAttribute.count; i++) {
                positionAttribute.setXYZ(i, 
                    positionAttribute.getX(i) + velocityAttribute.getX(i),
                    positionAttribute.getY(i) + velocityAttribute.getY(i),
                    positionAttribute.getZ(i) + velocityAttribute.getZ(i)
                );
            }
            positionAttribute.needsUpdate = true;
            explosionMaterial.uniforms.time.value += .01;
        };
        sceneRef.current.add(explosion);
explosionSoundRef.current.volume = 1.0; // Set the volume to maximum (1.0)
explosionSoundRef.current.onerror = (e) => {
  console.error("Error loading explosion sound:", e);
};

        setTimeout(() => {
            sceneRef.current.remove(explosion);
        }, 100);
    
        sceneRef.current.remove(planet);
    });
    setGameOver(true);
};


  const restartGame = () => {
    window.location.reload();
    setScore(0);
    setTimer(120);
    setGameOver(false);
    // TODO: Reinitialize the game (e.g., recreate planets, reset game state, etc.)
  };


  useEffect(() => {
    const scene = sceneRef.current = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(105, window.innerWidth / window.innerHeight, 0.1, 15000);
    camera.position.z = 12000; // Set camera initial position
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
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

    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1).normalize();
    scene.add(directionalLight);

    for (let i = 0; i < 3000; i++) {
      const size = Math.random() * 700 + 2;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        map: textures[Math.floor(Math.random() * textures.length)],
        shininess: 80,
      });

      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = 10000 * (2.0 * Math.random() - 1.0);
      planet.position.y = 10000 * (2.0 * Math.random() - 1.0);
      planet.position.z = 200000 * (2.0 * Math.random() - 1.0);
      planet.rotation.x = Math.random() * Math.PI;
      planet.rotation.y = Math.random() * Math.PI;
      planet.rotation.z = Math.random() * Math.PI;
      
      scene.add(planet);
      planets.push(planet);
    }
<audio ref={laserSoundRef} autoPlay={false} preload="auto">
  <source src="/blaster.mp3" type="audio/mpeg" />
</audio>;



    
    const shootLaser = (event) => {
      const rect = mountRef.current.getBoundingClientRect();
      const mouse = {
        x: ((event.clientX - rect.left) / window.innerWidth) * 2 - 1,
        y: -((event.clientY - rect.top) / window.innerHeight) * 2 + 1,
      };

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const laserDirection = raycaster.ray.direction;

      const laserMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const laserGeometry = new THREE.CylinderGeometry(1.1, 10.1, 10);
      const laser = new THREE.Mesh(laserGeometry, laserMaterial);
      laser.position.copy(camera.position);
      laser.lookAt(laserDirection.x * 1000, laserDirection.y * 1000, laserDirection.z * 1000);
      laser.velocity = laserDirection.clone().multiplyScalar(150);
      laserSoundRef.current.play();

      scene.add(laser);
      lasers.current.push(laser);

      setTimeout(() => {
        scene.remove(laser);
        lasers.current = lasers.current.filter(l => l !== laser);
      }, 7000);
    };
    
    shootLaserRef.current = shootLaser;
    window.addEventListener('click', (e) => shootLaserRef.current(e));

    

    const animate = () => {
      requestAnimationFrame(animate);
      scene.traverse(child => {
        if (child.userData.update) {
            child.userData.update();
        }
    });

      planets.forEach(planet => {
        planet.rotation.y += 0.01; // Rotate the planets
        planet.position.z -= -15;   // Move planets towards the camera
      });

      lasers.current.forEach(laser => {
        laser.position.add(laser.velocity);

        planets.forEach((planet, index) => {
          if (laser.position.distanceTo(planet.position) < planet.geometry.parameters.radius) {
            explodePlanet(planet);
            planets.splice(index, 1);
          }
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', shootLaser);
      mountRef.current.removeChild(renderer.domElement);
    };

  }, []);

  

  return (
    <div>
      <div ref={mountRef}></div>
  
      {/* Conditional rendering based on the game state */}
      {!gameOver ? (
        // Display the ongoing game score and timer
        <div className="score-box">
          Score: {score}
          <br />
          Time Left: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
        </div>
      ) : (
        // Display the end game screen with final score and restart button
        <div className="end-game">
          Final Score: {score}
          <br />
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
  
      {/* Footer links */}
      <div className="footer">
        <a href="/">Home</a>
       
      </div>
      <SideNav />

    </div>
  );
      }  
export default Blaster;