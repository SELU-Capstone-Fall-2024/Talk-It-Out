import { createTamagui, createTokens, View, styled, Text } from '@tamagui/core';

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
})
const ButtonFrame = styled(View, {
  name: 'Button',
  alignItems: 'center',
  flexDirection: 'row',
  backgroundColor: '$background', // #ccc
  hoverStyle: {
    backgroundColor: '$backgroundHover', // #ddd
  },
  pressStyle: {
    backgroundColor: '$backgroundPress', // #bbb
  },
  height: '$md', // 46
  borderRadius: '$md', // 8
  paddingHorizontal: '$sm', // 25
})
export const ButtonText = styled(Text, {
  name: 'ButtonText',
  color: '$color',
  fontFamily: '$body',
  fontSize: '$md',
  lineHeight: '$md',
  userSelect: 'none',
})
  

