/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'; // Remplace 'vite' par 'vitest/config'
import vue from '@vitejs/plugin-vue';
import appParameters from './app-parameters.json';

interface AppParameters {
  [key: string]: {
    API_URL: string;
    BASE_URL: string;
    VERSION: string;
    EXPORTS_PATH: string;
  };
}

const parameters: AppParameters = appParameters;

const mode = process.env.NODE_ENV || 'local';
const params = parameters[mode] || parameters['local'];

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.API_URL': JSON.stringify(params.API_URL)
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    deps: {
      inline: ['@vue']
    }
  }
});
