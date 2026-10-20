import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: "knowledge-ui",
      cssFileName: "knowledge-ui",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "lucide-react", /^pdfjs-dist(?:\/|$)/],
    },
  },
});
