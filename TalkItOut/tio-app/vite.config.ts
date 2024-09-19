import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tamaguiPlugin } from '@tamagui/vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    tamaguiPlugin({
      components: ['tamagui'],
      config: './tamagui.config.ts', // path to your Tamagui config file
      useReactNativeWebLite: false, // set to true if you want a lighter build for web
    }),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
  },
});
