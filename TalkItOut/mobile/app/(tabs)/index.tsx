import {Button, Pressable, Text, View} from 'react-native';
import {useState, useEffect} from 'react';
import api from '../api/api';
import {ClientGetDto, Response} from '../types';
import {ClientModal} from './modal';
import {YStack} from 'tamagui';

export default function Index() {
  const [isLoading, setLoading] = useState(true);
  const [clients, setClients] = useState<ClientGetDto[] | null>([]);

  const getClients = async () => {
    try {
      const response = await api.get<Response<ClientGetDto[]>>('/clients');
      setClients(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <YStack style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{fontSize: 30}}>Clients</Text>
        {clients && (
          <>
            {clients.map((client) => {
              return (
                <Text>
                  <ClientModal client={client} key={client.id} />
                </Text>
              );
            })}
          </>
        )}
      </YStack>
    </View>
  );
}
