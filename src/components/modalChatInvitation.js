import React, { useContext, useState } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import AppContext from '../context/AppContext';
import { firebase } from '@react-native-firebase/functions';
const usersCollection = firestore().collection('users');
import firestore from '@react-native-firebase/firestore';

const ModalChatInvitation = (props) => {

  const { target, visible, setVisible, desiredChat, positonItem } = props;
  const [loading, setLoading] = useState(false);
  const [loadingno, setLoadingNo] = useState(false);
  const { user } = useContext(AppContext);
  const onPress = async () => {
    // console.log('sending invitation... by ', user.id)
    setLoading(true);
    firebase.functions().httpsCallable('onNewInvitation')({
      senderId: user.id,
      receiverId: target.id,
      desiredChat: desiredChat,
    }).then(response => {
      setVisible(false);
      positonItem(target.id)
      usersCollection.doc(target.id).update({
        notification: firebase.firestore.FieldValue.arrayUnion(user.id),
      });
      setLoading(false);
    }).catch(error => {
      console.log("error in invitation : ", error)
      setLoading(false);
    });
  }
  const gotoRequestCancel = async () => {
    setLoading(false);
    setLoadingNo(true);
    usersCollection.doc(target.id).update({
      notification: firestore.FieldValue.arrayRemove(user.id)
    })
    setTimeout(() => {
      setLoadingNo(false);
      setVisible(false)
    }, 50);


  }

  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      backdrops={true}
    >

      <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
        <View style={styles.modal}>
          <Text style={styles.modaltext}>
            Confirm you want to sent a chat request to {target.name}.
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.buttonno}
              onPress={() => { gotoRequestCancel() }}>
              {!loadingno ? <Text style={styles.buttontext}>No</Text> : <ActivityIndicator size="small" color="white" />}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonyes}
              onPress={() => onPress()}>
              {!loading ? <Text style={styles.buttontext}>Yes</Text> : <ActivityIndicator size="small" color="white" />}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

  );
};

export default ModalChatInvitation;


const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    position: 'absolute',
    flex: 1,
    padding: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    width: '70%',
    alignContent: 'center',
    marginVertical: 200,
    borderRadius: 10,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  modaltext: {
    textAlign: 'center',
    width: '90%',
    marginVertical: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonno: {
    alignItems: 'center',
    backgroundColor: '#FB5051',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#FB5051',
    borderWidth: 2,
    width: '48%',
    marginTop: 15,
    marginRight: 5,
    borderRadius: 5,
  },
  buttonyes: {
    alignItems: 'center',
    backgroundColor: '#38D744',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#38D744',
    borderWidth: 2,
    width: '48%',
    marginTop: 15,
    marginLeft: 5,
    borderRadius: 5,
  },
  buttontext: {
    color: 'white',
    fontSize: 16,
  }
});






