import { Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function StarBackground() {
  const stars = useRef<THREE.Points>(null);

  useFrame(() => {
    if (stars.current) {
      stars.current.rotation.x = stars.current.rotation.y += 0.00015;
    }
  });

  return <Stars ref={stars} />;
}

export { StarBackground };
