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
    const y = 1 + Math.sin(clock.elapsedTime) * 0.05;
    camera.position.set(-0.25, y, 0.25);
    camera.lookAt(0, 0, 0);
  });
}

type CameraSettingType = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
};

function Basilium3DLogo() {
  const cameraSetting: CameraSettingType = {
    fov: 85, // FOv ( 시야각 )
    aspect: window.innerWidth / window.innerHeight, // 종횡비 ( 가로 / 세로 )
    near: 0.1, // 카메라의 시점이 시작되는 지점
    far: 1000, // 카메라의 시점이 끝나는 지점
  };
  return (
    <Canvas
      shadows
      style={{ height: "50vh" }}
      camera={{
        fov: cameraSetting.fov,
        aspect: cameraSetting.aspect,
        near: cameraSetting.near,
        far: cameraSetting.far,
      }}
    >
      <Model />
    </Canvas>
  );
}

function Model() {
  return (
    <group>
      <Center top>
        <Basilium3DLogoModel />
      </Center>
      <pointLight position={[10, 10, 10]} intensity={1} color={0xffffff} />
      <PerspectiveCamera makeDefault position={[0, 0.0, 0.1]} />
      <CameraSetting />
    </group>
  );
}

export { Basilium3DLogo };
