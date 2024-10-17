import {useState} from 'react';
import {View, Pressable, Modal, Button, Text, StyleSheet} from 'react-native';
import {ClientGetDto} from '../types';

type Props = {
  client: ClientGetDto;
};

export const ClientModal = (props: Props) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
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

          <View style={styles.buttonContainer}>
            <Button
              title="Start Session"
              onPress={() => {
                setModalVisible(false);
              }}
            />
          </View>

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
