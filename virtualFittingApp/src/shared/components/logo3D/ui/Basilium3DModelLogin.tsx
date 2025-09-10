import { Center, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function Basilium3DLogoModel() {
  const { scene } = useGLTF("/animations/BasiliumLogo.gltf");

  return <primitive object={scene} scale={[2, 2, 2]} />;
}

function CameraSetting() {
  const { camera } = useThree();
  return useFrame(({ clock }) => {
    // 시간 기반으로 카메라 Y 위치를 변경
    const time = clock.getElapsedTime(); // 경과된 시간
    const amplitude = 0.15; // 위아래 움직임의 크기
    const frequency = 0.2; // 초당 움직임 주기 (1Hz = 1초)

    // Y 위치를 sin 함수로 설정
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
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 0], fov: 0.0001, near: 2, far: 10 }}
    >
      <Model />
    </Canvas>
  );
}

export { Basilium3DModelLogin };
