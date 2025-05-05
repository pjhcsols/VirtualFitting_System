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
    camera.position.lerp(new THREE.Vector3(0.0, 0.5, 0.0), 0.01);
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

function BasiliumNoAnimationLogo() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 0.0001, near: 2, far: 10 }}
    >
      <Model />
    </Canvas>
  );
}

export { BasiliumNoAnimationLogo };
