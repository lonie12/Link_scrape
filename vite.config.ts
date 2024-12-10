import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        content: "src/content/content.script.tsx",
        contentMain: "src/content/content.main.tsx",
        // background: "src/background/background.ts",
      },
      output: {
        entryFileNames: "[name].js",
        manualChunks: {
          "iconsax-react": ["iconsax-react"],
        },
      },
    },
    outDir: "dist",
    minify: false,
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    // manifest: "vite-manifest.json",
  },
});
