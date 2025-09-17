import { Center, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useState } from "react";

function Basilium3DLogoModel() {
  const { scene } = useGLTF("/animations/BasiliumLogo.glb");

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
  near: number;
  far: number;
};

function Basilium3DLogo() {
  const [contextLost, setContextLost] = useState(false);

  const cameraSetting: CameraSettingType = {
    fov: 85,
    near: 0.1,
    far: 1000,
  };
  return (
    <div style={{ position: "relative", height: "50vh", width: "100%" }}>
      {contextLost && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 1,
          }}
        >
        </div>
      )}
      <Canvas
        shadows
        style={{ height: "100%" }}
        camera={{
          fov: cameraSetting.fov,
          near: cameraSetting.near,
          far: cameraSetting.far,
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            console.error("WebGL context lost!", event);
            setContextLost(true);
          });
          gl.domElement.addEventListener("webglcontextrestored", () => {
            console.log("WebGL context restored.");
            setContextLost(false);
          });
        }}
      >
        <Model />
      </Canvas>
    </div>
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
