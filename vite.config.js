// vite.config.js for live repo (YOUR_GITHUB_USERNAME.github.io)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    base: "/",
    build: {
        outDir: "docs",
    },
});
