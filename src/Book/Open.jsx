import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "./Experience";
import { UI } from "./UI";
import './Open.css'; // Make sure this CSS file contains appropriate styles
import SideNav from '../SideNav';

function Open() {
  return (
    <>
      <Loader />
      <SideNav />
      <UI />
      <div className="canvas-container"> {/* Add a container for the canvas */}
        <Canvas shadows camera={{ position: [-0.5, 10, -4], fov: 3 }}>
          <group position-z={0}>
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </group>
        </Canvas>
      </div>
    </>
  );
}

export default Open;
