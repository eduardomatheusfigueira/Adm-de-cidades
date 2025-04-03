import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.csv'],
  server: {
    fs: {
      // Permitir acesso a arquivos fora do diretório raiz
      allow: ['..']
    }
  }
})
