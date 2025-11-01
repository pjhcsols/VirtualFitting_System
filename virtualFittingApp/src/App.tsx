import { withProviders } from "./app/providers";
import Routing from "./app/providers/with-router";
import "./App.css";

const App = () => {
  return <Routing />;
};

document.addEventListener('contextmenu', (event) => {
  const target = event.target as HTMLElement;

  // <img> 태그에 대해서만 기본 동작을 막습니다.
  if (target.tagName === 'IMG') {
    event.preventDefault();
  }
});

export default withProviders(App);