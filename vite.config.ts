import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react(),
      svgr({
        include: "**/*.svg?react",
      }),
    ],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    define: {
      "process.env": process.env,
    },
    server: {
      host: "localhost",
      open: true,
      port: parseInt(env.VITE_REACT_PORT, 10),
    },
    esbuild: {
      drop: mode !== "development" ? ["console", "debugger"] : [],
    },
  };
});
