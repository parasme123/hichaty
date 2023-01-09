import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
const usersCollection = firestore().collection('users');
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import { createNewRoom } from '../lib/helpers';
import AppContext from '../context/AppContext';

const ModalChatCodeReceived = (props) => {
  const { target, visible, setVisible, desiredChat, code, roomRef, navigate, } = props;
  // console.log(props, "props>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  const [codeenter, setCodeenter] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AppContext);

  const onPress = () => {
    let { name, id, pic } = target;
    if (codeenter.length == 0 || codeenter.trim() == '') {
      alert("Enter your password.")
    } else if (code != codeenter) {
      alert("User password and enter password do not match.")
    } else {
      setLoading(true);
      // console.log("desiredChat>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", desiredChat, { roomRef: roomRef, remotePeerName: name, remotePeerId: id, remotePic: pic, type: 'caller' });
      // console.log('sending ....');
      createNewRoom(user.id, target.id)
        .then(roomRef => {
          firebase.functions().httpsCallable('onNewResponse')({
            senderId: user.id,
            receiverId: target.id,
            desiredChat: desiredChat,
            roomRef: roomRef,
            code: code,
          });
          setLoading(false);
          setVisible(false);
          navigate(desiredChat, { roomRef: roomRef, remotePeerName: name, remotePeerId: id, remotePic: pic, type: 'caller' })
          // console.log("desiredChat>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", desiredChat, { roomRef: roomRef, remotePeerName: name, remotePeerId: id, remotePic: pic, type: 'caller' });
        })
  

    }



    // setVisible(false);
    // navigate(desiredChat, { roomRef: roomRef, remotePeerName: name, remotePeerId: id, remotePic: pic, type: 'caller' })
    // console.log("desiredChat>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", desiredChat, { roomRef: roomRef, remotePeerName: name, remotePeerId: id, remotePic: pic, type: 'caller' });
    // // gotoSetEvent()

  }


  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}>
      <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
        <View style={styles.modal}>
          <Text style={styles.modaltext}>Request Accepted by and generated password for you,</Text>
          <Text style={styles.modaltext}>enter password and enjoy messenger services on HiChaty</Text>
          <Text style={styles.modaltext}>Password</Text>
          <Text style={styles.modaltext}>{code}</Text>
          <OTPInputView
            style={{ width: '90%', height: 50 }}
            pinCount={4}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(codeenter) => {
              setCodeenter(codeenter);
              // console.log(`Code is ${code}, you are good to go!`);
            }}
          />
          <TouchableOpacity
            style={styles.buttondone}
            onPress={() => onPress()
            }>
            {!loading ? <Text style={styles.buttontext}>Done</Text> : <ActivityIndicator size="small" color="white" />}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  );
};

export default ModalChatCodeReceived;


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
  },

  modaltext2: {
    textAlign: 'center',
    width: '87%',
    marginBottom: 5,
    marginTop: 6,
    fontSize: 16,
    lineHeight: 20,
    // fontWeight: 'bold',
  },
  underlineStyleBase: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: 'black',
  },

  underlineStyleHighLighted: {
    borderColor: 'black',
  },
  buttondone: {
    alignItems: 'center',
    backgroundColor: '#38D744',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#38D744',
    borderWidth: 2,
    width: '100%',
    marginTop: 15,
    borderRadius: 5,
  },
});






