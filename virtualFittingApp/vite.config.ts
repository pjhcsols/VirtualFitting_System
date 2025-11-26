import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

// alias path added
export default defineConfig({
  plugins: [react(), tsconfigPaths(), tailwindcss(), svgr()],
});
