import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// PLUGINS=tailwind,react adds the plugins of the app where we found this; the growth happens without any plugin.
const enabled = (process.env.PLUGINS ?? '').split(',');

export default defineConfig({
  plugins: [enabled.includes('tailwind') && tailwindcss(), enabled.includes('react') && react()].filter(Boolean),
});
