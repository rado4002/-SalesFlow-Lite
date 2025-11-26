
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],

  // 👇 ADD THIS SECTION
  server: {
    port: 5173,       // Force Vite to use 5173
    strictPort: true  // Throw error if 5173 is busy instead of switching
  }
})
