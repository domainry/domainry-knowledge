import { defineConfig } from "vite";

export default defineConfig({
  root: new URL(".", import.meta.url).pathname,
  server: { fs: { allow: [new URL("..", import.meta.url).pathname] } },
});
