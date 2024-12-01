import { YStack, H1 } from "tamagui";

const Home: React.FC = () => {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      padding={20}
      background="$darkBackground"
      minHeight="100vh"
      width="100vw"
    >
      <H1>Home</H1>
    </YStack>
  );
};

export default Home;
