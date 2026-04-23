import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

const reactAppEnv = Object.fromEntries(
  Object.entries(process.env)
    .filter(([key]) => key.startsWith('REACT_APP_'))
    .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
)

export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    ...reactAppEnv,
  },
  optimizeDeps: {
    include: ['moment', 'moment/locale/zh-tw', 'moment/locale/zh-cn'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'moment'],
    alias: [{ find: /^moment$/, replacement: 'moment/moment.js' }],
  },
  server: {
    port: 3000,
  },
})
