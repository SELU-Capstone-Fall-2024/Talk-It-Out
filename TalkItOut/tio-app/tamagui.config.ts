import { createTamagui } from '@tamagui/core';

const config = createTamagui({
  themes: {
    light: {
      background: '#fff',
      color: '#000',
    },
    dark: {
      background: '#000',
      color: '#fff',
    },
  },
  // You can define other options like fonts, spacing, etc.
});

export default config;
