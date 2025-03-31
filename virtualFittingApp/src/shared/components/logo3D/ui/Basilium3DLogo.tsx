import { Center, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Basilium3DLogoModel() {
  const { scene } = useGLTF("/BasiliumLogo.gltf");

  return <primitive object={scene} scale={[1.3, 1.3, 1.3]} />;
}

function CameraSetting() {
  const { camera } = useThree();
  return useFrame(() => {
    camera.position.lerp(new THREE.Vector3(0.0, 1, 0.0), 0.009);
    camera.lookAt(0, 0, 0);
  });
}

function Model() {
  return (
    <group>
      <Center top>
        <Basilium3DLogoModel />
      </Center>
      <PerspectiveCamera makeDefault position={[0, 0.0, 0.1]} />
      <CameraSetting />
    </group>
  );
}

function Basilium3DLogo() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 0.001, near: 2, far: 3 }}
    >
      <pointLight position={[50, 50, 50]} />
      <Model />
    </Canvas>
  );
}

export { Basilium3DLogo };
