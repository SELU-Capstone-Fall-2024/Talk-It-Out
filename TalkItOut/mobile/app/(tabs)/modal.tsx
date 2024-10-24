import React, {useEffect, useState} from 'react';
import {View, Pressable, Modal, Button, Text, StyleSheet} from 'react-native';
import {ClientGetDto, OptionItemDto, Response} from '../types';
import api from '../api/api';
import { Link } from 'expo-router';

type Props = {
  client: ClientGetDto;
};

export const ClientModal = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [options, setOptions] = useState<OptionItemDto[] | null>([]);

  // const getOptions = async () => {
  //   try {
  //     const response = await api.get<Response<OptionItemDto[]>>(
  //       `/goals/options/${props.client.id}`
  //     );
  //     setOptions(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getOptions();
  // }, []);

  return (
    <View style={styles.container} key={props.client.id}>
      <Pressable onPress={() => setModalVisible(true)}>
        <Text style={styles.pressableText}>{props.client.firstName}</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {props.client.firstName} {props.client.lastName}
          </Text>
          <Link href={'/counter'}>
            <View style={styles.buttonContainer}>
              <Button
                title="Start Session"
                onPress={() => {
                  setModalVisible(false);

                }}
              />
            </View>
          </Link>
          <Text style={{marginBottom: 10}}>Current Goal</Text>
          <Text>{props.client.goals.at(0)?.information}</Text>

          {selectedValue ? (
            <Text style={{marginTop: 20}}>You selected: {selectedValue}</Text>
          ) : null}

          <Pressable
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableText: {
    fontSize: 18,
    color: 'blue',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  closeButton: {
    marginTop: 15,
  },
  closeButtonText: {
    color: 'red',
    fontWeight: 'bold',
  },
});
