import { useNavigate } from "react-router-dom";
import { Button, SizableText, Text, View, XStack } from "tamagui";

const ClientView = () => {
  const navigate = useNavigate();
  return (
    <View padding={10}>
      <XStack alignItems="center" justifyContent="space-between" width="100%">
        <SizableText size={30} marginBottom={20} color="black">
          *client name*
        </SizableText>

        <Button
          size={30}
          style={{ background: "#282e67" }}
          borderRadius={4}
          onPress={() => navigate("/clients/listing")}
        >
          <Text color={"white"}>Back</Text>
        </Button>
      </XStack>
    </View>
  );
};

export default ClientView;
