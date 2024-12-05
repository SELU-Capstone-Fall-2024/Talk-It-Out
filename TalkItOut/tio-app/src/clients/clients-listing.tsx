import type React from 'react';
import api from '../api/api';
import type {Response, ClientGetDto} from '../types';
import {useAsync} from 'react-use';
import {
  Button,
  Spinner,
  YStack,
  SizableText,
  Text,
  XStack,
  Input,
  View,
} from "tamagui";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../components/format-date";
import { useState } from "react";
import DeleteModal from "../components/delete-modal";

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<() => void>(() => {});

  const [searchTerm, setSearchTerm] = useState('');

  const {loading, value: clients} = useAsync(async () => {
    const response = await api.get<Response<ClientGetDto[]>>('/clients');
    return response.data;
  }, []);

  const filteredClients = clients?.data?.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const dob = formatDate(new Date(client.dateOfBirth)).toLowerCase();
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || dob.includes(search);
  });

  const displayedClients = filteredClients ?? clients?.data;

  const handleDeleteClient = (id: string) => {
    setDeleteAction(() => async () => {
      try {
        await api.delete(`/clients/${id}`);
        window.location.reload();
      } catch {
        alert("Failed to delete client. Please try again.");
      } finally {
        setIsModalOpen(false);
      }
    });
    setIsModalOpen(true);
  };

  return (
    <View padding={20}>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteAction}
      />
      <SizableText size={44} color="black" textAlign="left">
        Clients
      </SizableText>

      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginBottom={30}
        padding={10}
      >
        <Input
          placeholder="Search by Name or DOB..."
          placeholderTextColor="#b0b0b0"
          style={{
            padding: 10,
            width: 300,
            borderRadius: 8,
          }}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Button
          size={30}
          style={{background: '#282e67'}}
          borderRadius={4}
          onPress={() => navigate('/clients/create')}
        >
          <Text style={{color: 'white', fontSize: 18}}>Add A Client</Text>
        </Button>
      </XStack>

      {loading && <Spinner color="#e6f2ff" size="large" />}
      {clients?.hasErrors && (
        <SizableText size={25} color="#e6f2ff">
          Error loading clients.
        </SizableText>
      )}
      {clients && !loading && clients.data?.length === 0 && (
        <SizableText size={25} color="#e6f2ff">
          No clients found.
        </SizableText>
      )}

      {!loading && clients && (
        <YStack width="100%" padding={0} gap={10}>
          <XStack
            width="100%"
            padding={10}
            borderBottomWidth={2}
            borderColor="black"
            backgroundColor="#282e67"
            justifyContent="space-between"
            alignItems="center"
          >
            <YStack width="33%" alignItems="flex-start">
              <Text fontSize={18} color="white">
                Name
              </Text>
            </YStack>
            <YStack width="33%" alignItems="center">
              <Text fontSize={18} color="white">
                Date of Birth
              </Text>
            </YStack>
            <YStack width="33%" alignItems="flex-end">
              <Text fontSize={18} color="white">
                Actions
              </Text>
            </YStack>
          </XStack>

          {displayedClients?.map((client) => {
            const dateOfBirth = new Date(client.dateOfBirth);

            return (
              <XStack
                key={client.id}
                padding={10}
                borderWidth={1}
                borderColor="black"
                backgroundColor="white"
                width="100%"
              >
                <YStack width="33%" alignItems="flex-start">
                  <Text style={{color: 'black'}}>
                    {client.firstName} {client.lastName}
                  </Text>
                </YStack>

                <YStack width="33%" alignItems="center">
                  <Text style={{color: 'black'}}>
                    {formatDate(dateOfBirth)}
                  </Text>
                </YStack>

                <YStack width="33%" alignItems="flex-end">
                  <XStack gap={10}>
                    <Button
                      size={25}
                      style={{background: 'gray'}}
                      borderRadius={4}
                      onPress={() => navigate(`/clients/${client.id}/view`)}
                    >
                      <Text style={{color: 'white', fontSize: 16}}>View</Text>
                    </Button>
                    <Button
                      size={25}
                      style={{background: '#b32d00'}}
                      borderRadius={4}
                      onPress={() => handleDeleteClient(client.id.toString())}
                    >
                      <Text style={{color: 'white', fontSize: 16}}>Delete</Text>
                    </Button>
                  </XStack>
                </YStack>
              </XStack>
            );
          })}
        </YStack>
      )}
    </View>
  );
};

export default Clients;
