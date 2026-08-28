import { defineConfig } from "vite";
// import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
export default defineConfig({
  base: "/manufex/",

  build: {
    outDir: "build", // default is "dist"
  },
  plugins: [
    // basicSsl(),
    react(),
    svgr(),

    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      strategies: "generateSW",
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
      },
      devOptions: {
        enabled: true,
      },
      manifestFilename: "manifest.webmanifest",
      manifest: {
        name: "MANUFEX",
        short_name: "MANUFEX",
        description: "Industrial Manufacturing Website",
        theme_color: "#252b42",
        background_color: "#f2f5fe",
        display: "standalone",
        orientation: "portrait",
        start_url: "/manufex/",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    port: 5175,
    allowedHosts: ["7e8e-117-219-252-217.ngrok-free.app", "127.0.0.1"],
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@store": path.resolve(__dirname, "src/store"),
      "@services": path.resolve(__dirname, "src/services"),
      "@api": path.resolve(__dirname, "src/services/api"),
      "@endPoints": path.resolve(__dirname, "src/services/endPoints"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@inputs": path.resolve(__dirname, "src/shared/inputs"),
      "@buttons": path.resolve(__dirname, "src/shared/buttons"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@views": path.resolve(__dirname, "src/views"),
      "@filters": path.resolve(__dirname, "src/shared/filters"),
      "@formValidations": path.resolve(__dirname, "src/utils/formValidations"),
      "@socket": path.resolve(__dirname, "src/sockets/SocketContext.jsx"),
    },
  },
});
