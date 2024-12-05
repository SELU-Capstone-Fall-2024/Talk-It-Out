import {createTamagui, createTokens, styled, Text} from '@tamagui/core';
import {Input} from 'tamagui';

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
    dark: {
      background: '#000',
      color: '#fff',
    },
  },
});

export const ButtonText = styled(Text, {
  name: 'ButtonText',
  color: '$color',
  fontFamily: '$body',
  fontSize: '$md',
  lineHeight: '$md',
  userSelect: 'none',
});
export const InputText = styled(Input, {
  backgroundColor: '$background',
  color: '$color',
  borderWidth: 1,
  borderColor: '$borderColor',
  borderRadius: 8,
  padding: '$2',
  fontSize: 16,
});
