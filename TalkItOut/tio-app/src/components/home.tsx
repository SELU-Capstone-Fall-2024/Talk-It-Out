import {YStack, H1, ButtonFrame} from "tamagui";

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
      <H1 >Upcoming Sessions</H1>
      <ButtonFrame backgroundColor="#aaa">
        Session 1
      </ButtonFrame>
    </YStack>

  );
};



export default Home;
