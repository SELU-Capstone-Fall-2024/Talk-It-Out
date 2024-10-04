import {Stack} from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
// import {StatusBar} from 'expo-status-bar';
// import {useColorScheme, Text} from 'react-native';
// import {Paragraph, Spacer, TamaguiProvider, Theme, YStack} from 'tamagui';
// import {useFonts} from 'expo-font';
// import config from '@/tamagui.config';
// import {Stack} from 'expo-router';
// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
//     InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
//   });
//   if (!loaded) {
//     return null;
//   }
//   return (
//     <TamaguiProvider config={config}>
//       <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
//         <YStack
//           f={1}
//           jc="center"
//           ai="center"
//           backgroundColor={'$backgroundSoft'}
//         >
//           <Paragraph color="$color" jc="center">
//             {colorScheme}
//             <Stack>
//               <Stack.Screen name="(tabs)" />
//             </Stack>
//           </Paragraph>
//           <StatusBar style="auto" />
//         </YStack>
//       </Theme>
//     </TamaguiProvider>
//   );
// }
