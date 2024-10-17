import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        // popup: "src/popup/popup.main.ts",
        content: "src/content/content.main.ts",
        // background: "src/worker/worker.main.ts",
      },
      output: {
        entryFileNames: "[name].js",
        manualChunks: {
          "iconsax-react": ["iconsax-react"],
        },
      },
    },
    outDir: "dist",
  },
});
