import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import AppContext from '../context/AppContext';
const usersCollection = firestore().collection('users');
import firestore from '@react-native-firebase/firestore';

const ModalChatContact = (props) => {

  /*if the modal was handled from the contatcs screen , we'll use
    the changeModal to switch from ModalChatContact to ModalChatCodeGen
    Otherwise we'll set setRedirectToContacts to know the modal was handled from another screen.
  */
  const { target, navigate, desiredChat, actualRouteName, changeModal } = props;
  const { user, modalChatContact, setModalChatContact, setRedirectToContacts } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [loadingno, setLoadingNo] = useState(false);

  const onPress = () => {
    setLoading(true);
    setModalChatContact(false);
    if (actualRouteName !== "Contacts") {
      setRedirectToContacts(true);
      navigate("Contacts", { target, desiredChat });
    } else {
      changeModal(true);
    }
    setTimeout(() => {
      setLoading(false);
    }, 50);
  }
  const gotoRequestCancel = async () => {
    setLoadingNo(true);
    usersCollection.doc(target.id).update({
      notification: firestore.FieldValue.arrayRemove(user.id)
    })
    setTimeout(() => {
      setLoadingNo(false);
      setModalChatContact(false);
    }, 50);


  }
  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={modalChatContact}>
      <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
        <View style={styles.modal}>
          <Text style={styles.modaltext}>
            {user.name} you received chat request from {target.name}.
              </Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={styles.buttonno}
              onPress={() => { gotoRequestCancel() }}>

              {/* onPress={() => {  }}> */}
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

export default ModalChatContact;

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
