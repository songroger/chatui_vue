import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        proxy: {
          '/api': {
            target: 'http://144.202.3.231:8084', // Change to your API server
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
    },
    build: {
      assetsDir: 'assets'
    }
});
