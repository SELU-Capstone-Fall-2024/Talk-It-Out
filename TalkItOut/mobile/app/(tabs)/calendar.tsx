import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {SessionGetDto, Response} from '../types';
import api from '../api/api';

const CustomAgenda = () => {
  const [items, setItems] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [eventText, setEventText] = useState('');

  const [isLoading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionGetDto[] | null>([]);

  const getSessions = async () => {
    try {
      const response = await api.get<Response<SessionGetDto[]>>('/sessions');
      setSessions(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    // setItems(transformData(sessions));
  };

  useEffect(() => {
    getSessions();
  }, []);

  const loadItems = (day) => {
    setTimeout(() => {
      const newItems = {};
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = new Date(time).toISOString().split('T')[0];
        if (!newItems[strTime]) {
          newItems[strTime] = [];
        }
        newItems[strTime].push({
          name: 'Event for ' + strTime,
          height: Math.max(50, Math.floor(Math.random() * 150)),
        });
      }
      setItems(newItems);
    }, 1000);
  };

  console.log(items);
  console.log(transformData(sessions));

  // const addEvent = () => {
  //   if (!eventText) return;
  //   const newItems = {...items};
  //   if (!newItems[selectedDate]) {
  //     newItems[selectedDate] = [];
  //   }
  //   newItems[selectedDate].push({name: eventText});
  //   setItems(newItems);
  //   setEventText('');
  //   setModalVisible(false);
  // };

  return (
    <View style={styles.container}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={new Date().toISOString().split('T')[0]}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          // setModalVisible(true);
        }}
        renderItem={(item) => (
          <View style={styles.item}>
            <Text key={item.name}>{item.name}</Text>
          </View>
        )}
        markedDates={{'2024-10-24': {marked: true}}}
        theme={{
          agendaDayTextColor: 'blue',
          agendaDayNumColor: 'blue',
          agendaTodayColor: 'red',
        }}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text>Add Event for {selectedDate}</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            value={eventText}
            onChangeText={setEventText}
          />
          {/* <Button title="Add Event" onPress={addEvent} /> */}
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const transformData = (sessions) => {
  return sessions.reduce((acc, {startTime, clientName}) => {
    if (!acc[startTime]) {
      acc[startTime] = [];
    }
    acc[startTime].push({clientName});
    return acc;
  }, {});
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  item: {
    backgroundColor: 'lightgray',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    padding: 10,
  },
});

export default CustomAgenda;
