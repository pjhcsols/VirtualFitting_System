import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// alias path added
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
});
