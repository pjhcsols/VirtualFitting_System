import { withProviders } from "./app/providers";
import Routing from "./app/providers/with-router";
import "./App.css";

const App = () => {
  return <Routing />;
};

export default withProviders(App);