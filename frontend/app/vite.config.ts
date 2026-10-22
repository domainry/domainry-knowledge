import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import type { Plugin } from "vite";

const excalidrawFontsDirectory = fileURLToPath(new URL("../node_modules/@excalidraw/excalidraw/dist/prod/fonts/", import.meta.url));

function filesBelow(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

function excalidrawFontAssets(): Plugin {
  return {
    name: "excalidraw-font-assets",
    buildStart() {
      for (const sourcePath of filesBelow(excalidrawFontsDirectory)) {
        const relativePath = relative(excalidrawFontsDirectory, sourcePath).split(sep).join("/");
        this.emitFile({ type: "asset", fileName: `fonts/${relativePath}`, source: readFileSync(sourcePath) });
      }
    },
  };
}

export default defineConfig({
  root: new URL(".", import.meta.url).pathname,
  base: "/",
  plugins: [excalidrawFontAssets()],
  server: { fs: { allow: [new URL("..", import.meta.url).pathname] } },
  build: { outDir: "../app-dist", emptyOutDir: true },
});
