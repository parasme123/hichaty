import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity, Keyboard
} from 'react-native';
import AppContext from '../context/AppContext';
import { SvgXml } from 'react-native-svg';
import { createNewRoom } from '../lib/helpers';
import { success } from '../assets/cardicons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { firebase } from '@react-native-firebase/functions';
const usersCollection = firestore().collection('users');
import firestore from '@react-native-firebase/firestore';

const ModalChatCodeGen = (props) => {
  const { target, visible, setVisible, desiredChat, positonItem1 } = props;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AppContext);
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {

    // if (confirmation) {
    //   setLoading(true);
    //   console.log('sending ....');
    //   createNewRoom(user.id, target.id)
    //     .then(roomRef => {
    //       firebase.functions().httpsCallable('onNewResponse')({
    //         senderId: user.id,
    //         receiverId: target.id,
    //         desiredChat: desiredChat,
    //         roomRef: roomRef,
    //         code: code,
    //       });
    //       setLoading(false);
    //       setVisible(false);
    //       setConfirmation(false);
    //       positonItem1(target.id)

    //     })
    // }
  }, [confirmation]);

  const onPress = () => {
    if (code.length == 0 || code.trim() == '') {
      alert("Please generate your password.")
    } else {
      Keyboard.dismiss();
      setLoading(true);
      firebase.functions().httpsCallable('onNewResponse')({
        senderId: user.id,
        receiverId: target.id,
        desiredChat: desiredChat,
        roomRef: "NotConfirmRequest",
        code: code,
      });
    
      usersCollection.doc(target.id).update({
        confirmationCode: firebase.firestore.FieldValue.arrayUnion({ code: code, Id: user.id, }),
      })
      usersCollection.doc(target.id).update({
        acceptedRequest: firebase.firestore.FieldValue.arrayRemove(target.id)
      });
      setLoading(false);
      setVisible(false);
      setConfirmation(false);
      positonItem1(target.id)
    }
  }


  return (
    <Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}>
      <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
        <View style={styles.modal}>
          <SvgXml xml={success} />
          <Text style={styles.modaltext1}>Request Accepted</Text>
          <Text style={styles.modaltext}>
            Please generate password and Share with {target.name}. enjoy Messenger
                services on HiChaty
              </Text>
          <OTPInputView
            style={{ width: '90%', height: 50 }}
            pinCount={4}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(code) => {
              setCode(code);
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
          <TouchableOpacity
            style={styles.buttondone}
            onPress={() => onPress()}
          // onPress={() => setConfirmation(true)}
          >
            <Text style={styles.buttontext}>{!loading ? "Share" : "Sharng, Please wait for moment ... "}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

  );
};

export default ModalChatCodeGen;


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
  modaltext1: {
    textAlign: 'center',
    width: '83%',
    marginBottom: 18,
    fontSize: 16,
    lineHeight: 20,
    marginTop: 4,
    // fontWeight: 'bold',
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
  buttontext: {
    color: 'white',
    fontSize: 16,
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
});






