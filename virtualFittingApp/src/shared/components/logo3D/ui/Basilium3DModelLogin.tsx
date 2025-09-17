import { Center, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";   
import * as THREE from "three";

function Basilium3DLogoModel() {
  const { scene } = useGLTF("/animations/BasiliumLogo.gltf");

  return <primitive object={scene} scale={[2, 2, 2]} />;
}

function CameraSetting() {
  const three = useThree();
  if (!three || !three.camera) return null;
  const { camera } = three;
  return useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const amplitude = 0.15;
    const frequency = 0.2;
    
    camera.position.y =
      amplitude * (5 + Math.sin(2 * Math.PI * frequency * time));
    camera.position.x = -0.2;
    camera.position.z = 0.4;

    camera.position.lerp(new THREE.Vector3(-0.5, 0.5, 0.5), 0.01);
    camera.lookAt(0, 0, 0);
  });
}

function Model() {
  return (
    <group>
      <Center top>
        <Basilium3DLogoModel />
      </Center>
      <PerspectiveCamera makeDefault position={[0, 0.5, 0.2]} />
      <CameraSetting />
    </group>
  );
}

function Basilium3DModelLogin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn("WebGL context lost!", event);
    };

    const handleContextRestored = () => {
      console.info("WebGL context restored successfully at " + new Date().toLocaleTimeString());
    };

    canvas.addEventListener("webglcontextlost", handleContextLost, false);
    canvas.addEventListener("webglcontextrestored", handleContextRestored, false);

    return () => {
      canvas.removeEventListener("webglcontextlost", handleContextLost, false);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored, false);
    };
  }, []);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
      ref={canvasRef}
    >
      <Model />
    </Canvas>
  );
}

export { Basilium3DModelLogin };
