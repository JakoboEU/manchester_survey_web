// vite.config.js for live repo (YOUR_GITHUB_USERNAME.github.io)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/",           // root, because it'll be pickthepark.org/
    build: {
        outDir: "docs",    // or "dist" + a GitHub Action, if you prefer
    },
});
