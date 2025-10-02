import { useRive } from "@rive-app/react-canvas";

function PopLogo() {
  const { RiveComponent } = useRive({
    src: "/rive/BasiliumPopLogo.riv",
    stateMachines: "Moving",
    autoplay: true,
  });
  return <RiveComponent />;
}

export { PopLogo };
