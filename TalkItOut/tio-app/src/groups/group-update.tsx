import type React from "react";
import { useEffect, useState } from "react";
import api from "../api/api";
import type {
  ClientGetDto,
  GroupCreateDto,
  GroupGetDto,
  OptionType,
  Response,
} from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { YStack, SizableText, Button, Input, Text, Form } from "tamagui";
import ReactSelect from "react-select";
import { useAsync } from "react-use";
import Option from "../components/multi-select";

const GroupUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [groupData, setGroupData] = useState<GroupCreateDto>({
    userId: 1,
    groupName: "",
    clientIds: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optionSelected, setOptionSelected] = useState<OptionType[] | null>(
    null
  );

  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      try {
        const response = await api.get<GroupGetDto>(`/groups/${id}`);
        if (response.status === 200) {
          const { userId, groupName, clientIds } = response.data;
          setGroupData({
            userId: userId,
            groupName: groupName,
            clientIds: clientIds,
          });
          console.log(response);
        } else {
          setError("Failed to load group.");
        }
      } catch (err) {
        setError("An error occurred while loading the group.");
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [id]);

  const { value: clients } = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>("/clients");
    return response.data;
  });

  const clientOptions = clients?.data?.map((client) => ({
    label: `${client.firstName} ${client.lastName}`,
    value: `${client.id.toString()}`,
  }));

  const handleChange =
    (field: keyof GroupCreateDto) => (value: string | number) => {
      setGroupData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    };

  const handleOptionSelected = (selected: OptionType[] | null) => {
    setOptionSelected(selected);
    const clientIds = selected
      ? selected.map((option) => Number(option.value))
      : [];
    setGroupData((prevData) => ({
      ...prevData,
      clientIds: clientIds,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/groups/${id}`, groupData);
      if (response.status === 200) {
        navigate("/groups/listing");
      } else {
        console.log(response);
        setError("Failed to update group. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating the group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      padding={20}
      background="$darkBackground"
      minHeight="100vh"
      width="100vw"
    >
      <YStack
        width="100%"
        maxWidth={400}
        padding={30}
        borderRadius={15}
        backgroundColor="$darkPrimary"
        alignItems="center"
        justifyContent="center"
      >
        <SizableText size={30} marginBottom={20} color="#e6f2ff">
          Update Group
        </SizableText>

        {error && (
          <Text color="red" marginBottom={15}>
            {error}
          </Text>
        )}

        <Form onSubmit={handleSubmit} gap={20} width="100%">
          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Group Name
            </SizableText>
            <Input
              size={46}
              flex={1}
              padding={4}
              value={groupData.groupName}
              onChangeText={(text) => handleChange("groupName")(text)}
              placeholder="Group Name"
              placeholderTextColor="gray"
              color="black"
              borderRadius={2}
            />
          </YStack>

          <YStack gap={10}>
            <SizableText size={18} color="#e6f2ff">
              Add Clients
            </SizableText>
            <ReactSelect
              options={clientOptions}
              isMulti={true}
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                Option,
              }}
              onChange={(selected) =>
                handleOptionSelected(selected as OptionType[] | null)
              }
              value={optionSelected}
            />
          </YStack>

          <Button
            width={150}
            alignSelf="center"
            size={30}
            padding={12}
            disabled={loading}
            style={{ overflow: "hidden" }}
            onPress={handleSubmit}
            borderRadius={4}
            marginTop={20}
          >
            <Text fontSize={18}>
              {loading ? "Updating..." : "Update Group"}
            </Text>
          </Button>
        </Form>
      </YStack>
    </YStack>
  );
};

export default GroupUpdate;
