import React, { useState } from 'react';
import {View, Text, Button} from 'react-native';
import { YStack } from 'tamagui';
import api from './api/api';
import { SessionGetDto,Response } from './types';
import { Link } from 'expo-router';

type Props = {

}

const NewScreen = (props: Props) => {
  const [dividend, setDividend] = useState(0)
  const [divisor, setDivisor] = useState(0);

  const submitSession = async () => {
    try {
      const response = await api.post<Response<SessionGetDto>>('/sessions', {
        sessionCreateDto: {
          userId: 1,
          durationMinutes: 30,
          startTime: new Date().setDate(1),
          endTime: new Date().setDate(29),
          groupId: 1,
          clientId: 1
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <YStack>

    <View>
      <Button title='+' onPress={() => {
        setDividend(dividend + 1); 
        setDivisor(divisor + 1)}}
        color='green'
        >
      </Button>
    </View>
    <View style={{alignItems: 'center'}}><Text>{dividend} / {divisor}</Text></View>
    <View>
      <Button title='-' color='red' onPress={() => setDivisor(divisor + 1)}></Button>
    </View>
    <Link href={'/(tabs)'}>
    <View>
      <Button title='Submit Session' onPress={submitSession}></Button>
    </View></Link>
    </YStack>

  );
};

export default NewScreen;
