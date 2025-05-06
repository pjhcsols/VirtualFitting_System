import { useRive } from "@rive-app/react-canvas";

function PopLogo() {
  const { rive, RiveComponent } = useRive({
    src: "/rive/BasiliumPopLogo.riv",
    stateMachines: "Moving",
    autoplay: true,
  });
  return <RiveComponent />;
}

export { PopLogo };
