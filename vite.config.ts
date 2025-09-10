import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// mark the function async so we can use await
export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
  const plugins = [
    react(),
    runtimeErrorOverlay(),
  ];

  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const { cartographer } = await import("@replit/vite-plugin-cartographer");
    plugins.push(cartographer());
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true,
    },
    define: {
      // Expose environment variables to the client
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL || 'http://98.130.134.68:8081'),
    },
    server: {
      proxy:
        mode === "development"
          ? {
              "/api": {
                target: "http://98.130.134.68:8081",
                changeOrigin: true,
              },
              "/logs/download": {
                target: "http://98.130.134.68:8081",
                changeOrigin: true,
                secure: false,
              },
            }
          : {},
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
