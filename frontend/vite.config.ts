import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'
//import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:8000',
  //       changeOrigin: true,
  //       secure: false, // bỏ nếu dùng HTTPS có chứng chỉ hợp lệ
  //     },
  //   },
  // },
});
