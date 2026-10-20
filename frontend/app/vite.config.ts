import { defineConfig } from "vite";

export default defineConfig({
  root: new URL(".", import.meta.url).pathname,
  base: "/",
  server: { fs: { allow: [new URL("..", import.meta.url).pathname] } },
  build: { outDir: "../app-dist", emptyOutDir: true },
});
