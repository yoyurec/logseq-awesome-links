import { defineConfig } from 'vite';

const name = 'awesomeLinks';

export default defineConfig({
  base: '',
  build: {
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: `assets/${name}.js`,
        chunkFileNames: `assets/chunks/${name}.js`,
        assetFileNames: `assets/${name}.[ext]`,
      }
    }
  }
});
