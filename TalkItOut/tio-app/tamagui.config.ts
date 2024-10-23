import {createTamagui, createTokens} from '@tamagui/core';

export default createTamagui({
  tokens: createTokens({
    size: {
      sm: 38,
      md: 46,
      lg: 60,
    },
    space: {
      sm: 15,
      md: 20,
      lg: 25,
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
    },
    color: {
      blue: '#AAAAAA',
    },
    zIndex: {
      low: 1,
    },
  }),
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: '$primary',
          color: 'white',
          padding: 12,
          borderRadius: 8,
        },
        secondary: {
          backgroundColor: '$secondary',
          color: 'white',
          padding: 12,
          borderRadius: 8,
        },
      },
    },
  },
  themes: {
    light: {
      background: '#fff',
      color: '#000',
    },
    space: {
      sm: 15,
      md: 20,
      lg: 25,
    },
    radius: {
      sm: 4,
      md: 8,
      lg: 12,
    },
    color: {
      blue: "#AAAAAA",
    },
    zIndex: {
      low: 1,
    },
  }),
  components: {
    Button: {
      variants: {
        primary: {
          backgroundColor: "$primary",
          color: "white",
          padding: 12,
          borderRadius: 8,
        },
        secondary: {
          backgroundColor: "$secondary",
          color: "white",
          padding: 12,
          borderRadius: 8,
        },
      },
    },
  },
  themes: {
    light: {
      background: "#fff",
      color: "#000",
    },
    dark: {
      background: "#000",
      color: "#fff",
    },
  },
});
