import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import path from 'path';
import GlobalsPolyfills from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  base: './',
  resolve: {
    dedupe: ['buffer', 'bn.js', 'keccak', 'ethers'],
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react()],
  publicDir: './res',
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()] as any,
      output: {
        manualChunks: {
          mui: ['@mui/material'],
        },
      },
    },
    target: ['esnext'],
  },
  esbuild: {
    jsxFactory: 'jsx',
    jsxInject: `import {jsx} from '@emotion/react'`,
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      treeShaking: true,

      // Enable esbuild polyfill plugins
      plugins: [
        GlobalsPolyfills({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ] as any,
    },
  },
});
