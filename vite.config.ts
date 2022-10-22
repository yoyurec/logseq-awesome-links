import { defineConfig } from 'vite';
import logseqDevPlugin from "vite-plugin-logseq";

const name = 'awesomeLinks';

export default defineConfig({
  plugins: [logseqDevPlugin()],
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
