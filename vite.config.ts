import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { NgmiPolyfill } from "vite-plugin-ngmi-polyfill";

export default defineConfig({
  resolve: {
    alias: {
      stream: 'stream-browserify',
    },
  },
  plugins: [vue()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
  },
  envPrefix: ["VITE_", "TAURI_"],
  optimizeDeps: {
    esbuildOptions: {
        define: {
            global: 'globalThis',
        },
    },
  },
  build: {
    target: ["es2021", "chrome100", "safari13"],
    minify: "esbuild",
    sourcemap: !!process.env.TAURI_DEBUG,
    rollupOptions: {
      plugins: [ nodePolyfills() ]
    }
  },
  define: {
    'process.env': {}
  }
});
