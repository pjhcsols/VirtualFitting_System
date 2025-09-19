import { useRive } from "@rive-app/react-canvas";

function BasiliumSVGLogo() {
  const { RiveComponent } = useRive({
    src: "/rive/BasiliumSVGLogo.riv",
    stateMachines: "BasiliumMachine",
    autoplay: true,
  });
  return <RiveComponent />;
}

export { BasiliumSVGLogo };
