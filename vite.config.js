import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: keep this base in sync with your repo name
export default defineConfig({
  base: "/draggable-dashboard/",
  plugins: [react()]
});
