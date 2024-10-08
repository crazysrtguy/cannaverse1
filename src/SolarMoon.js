import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GUI } from "lil-gui";

const SolarMoon = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    let camera, scene, renderer, controls, drag;
    let material, terrain, water;

    const gui = new GUI();

    const init = () => {
      // Set up camera, scene, renderer
      camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(-10, 8, -2.2);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x201919);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      mountRef.current.appendChild(renderer.domElement);

      // Add environment map
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load('./textures/equirectangular/pedestrian_overpass_1k.hdr', (environmentMap) => {
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = environmentMap;
        scene.environment = environmentMap;
      });

      // Add terrain and water
      addTerrainAndWater();

      // Add lights
      const directionalLight = new THREE.DirectionalLight("#ffffff", 2);
      directionalLight.position.set(6.25, 3, 4);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.set(1024, 1024);
      scene.add(directionalLight);

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.maxPolarAngle = Math.PI * 0.45;
      controls.enableDamping = true;

      window.addEventListener("resize", onWindowResize);

      animate();
    };

    const addTerrainAndWater = () => {
      // Material for terrain
      material = new THREE.MeshStandardMaterial({ color: "#85d534" });

      // Geometry for terrain
      const geometry = new THREE.PlaneGeometry(10, 10, 500, 500);
      geometry.rotateX(-Math.PI * 0.5);

      terrain = new THREE.Mesh(geometry, material);
      terrain.receiveShadow = true;
      terrain.castShadow = true;
      scene.add(terrain);

      // Water setup
      water = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10, 1, 1),
        new THREE.MeshPhysicalMaterial({
          transmission: 1,
          roughness: 0.5,
          ior: 1.333,
          color: "#4db2ff",
        })
      );
      water.rotation.x = -Math.PI * 0.5;
      water.position.y = -0.1;
      scene.add(water);

      // GUI controls
      const terrainGui = gui.addFolder("🏔️ terrain");
      terrainGui.add(material, "roughness", 0, 1, 0.01);
      const waterGui = gui.addFolder("💧 water");
      waterGui.add(water.material, "roughness", 0, 1, 0.01);
      waterGui.add(water.material, "ior").min(1).max(2).step(0.001);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    init();

    return () => {
      gui.destroy();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default SolarMoon;
