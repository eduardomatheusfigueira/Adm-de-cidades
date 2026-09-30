import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.csv'],
  // O worker do MapLibre v6 é um módulo ES (import/export)
  worker: { format: 'es' },
  build: {
    rollupOptions: {
      // lucide-react marca seus módulos com "use client" (diretiva de React Server Components),
      // que não se aplica aqui; o Rollup a descarta e avisa a cada build.
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && /use client/.test(warning.message)) return
        warn(warning)
      }
    }
  }
})
