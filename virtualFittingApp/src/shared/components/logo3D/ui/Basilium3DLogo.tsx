import { Center, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Basilium3DLogoModel() {
  const { scene } = useGLTF("/BasiliumLogo.gltf");

  return <primitive object={scene} scale={[2, 2, 2]} />;
}

function CameraSetting() {
  const { camera } = useThree();
  return useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0.25, 0.9, 0.6), 0.009);
    camera.lookAt(0, 0, 0);
  });
}

function Model() {
  return (
    <group>
      <Center top>
        <Basilium3DLogoModel />
      </Center>
      <PerspectiveCamera makeDefault position={[0, 0, 0]} />
      <CameraSetting />
    </group>
  );
}

function Basilium3DLogo() {
  return (
    <Canvas
      shadows
      camera={{ position: [0.005, 0.05, 0.05], fov: 0.001, near: 2, far: 3 }}
    >
      <pointLight position={[100, 100, 5]} />
      <Model />
    </Canvas>
  );
}

export { Basilium3DLogo };
