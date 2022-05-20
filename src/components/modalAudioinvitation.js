import React, {useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Button,
  TouchableOpacity,
  Modal
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from 'react-native-elements';
import {SvgXml} from 'react-native-svg';
import { microphone } from '../assets/chaticons';
import firestore from '@react-native-firebase/firestore';
import SoundPlayer from 'react-native-sound-player';
import AppContext from '../context/AppContext';
import { useIsFocused } from '@react-navigation/native';

const usersCollection = firestore().collection('users');
let _onFinishedPlayingSubscription = null;

const ModalAudiocall = (props) => {

  const { roomRef, remotePeerName, remotePeerId,remotePic, navigation } = props;
  const [ colour, setColour ] = useState(['#F2853E', '#F77E52', '#FD7668']);
  const { user, modalAudioInvitation, setModalAudioInvitation, notifications, setNotifications } = useContext(AppContext);
  const focused = useIsFocused();

  const onClickAccept = () => {
    SoundPlayer.stop();
    setModalAudioInvitation(false)
    navigation.navigate('voicecall', { roomRef, remotePeerName, remotePeerId, remotePic, type: 'callee' })
  }

  const onClickReject = () => {
    SoundPlayer.stop();
    usersCollection.doc(remotePeerId).update({
      notification: firestore.FieldValue.arrayUnion({ type: "voicecall response", id: user.id, name: user.name })
    })
    setModalAudioInvitation(false);
  }

  useEffect( () => {
    if(notifications.length > 0){
      let lastNotif = notifications[0];
      switch(lastNotif.type){   
        case "voicecall terminated before answering":
          SoundPlayer.stop();
          setModalAudioInvitation(false);
          break; 
      }
      setNotifications([]);
      deleteNotification(lastNotif);
    }
  },[notifications])

  const deleteNotification = (notif) => {
    usersCollection.doc(user.id).update({
      notification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  useEffect( () => {
    if(focused && modalAudioInvitation ){
      _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
        // console.log('finished playing', success);
        onClickReject();
      })
      try {
        // play the file tone.mp3
        SoundPlayer.playSoundFile('call', 'mp3')
      } catch (e) {
          // console.log(`cannot play the sound file`, e)
      }
      return _onFinishedPlayingSubscription.remove();
    }
  },[modalAudioInvitation])

  return (
        <Modal
            animationType={'slide'}
            transparent={true}
            visible={modalAudioInvitation}
        >
            <LinearGradient colors={colour} style={styles.avatar}>
            <Avatar
                rounded
                containerStyle={styles.avatar1}
                source={{uri: 'https://i.stack.imgur.com/uoVWQ.png'}}
                size={200}
            />
            <View style={styles.input}>
                <Text style={styles.callertext}>{ remotePeerName } </Text>
                
                <SvgXml xml={microphone} style={{marginTop:15}}/>
            </View>
            <View style={styles.bottom}>
            <TouchableOpacity
                style={styles.buttonaccept}
                onPress={() => onClickAccept() }>
                <Text style={styles.accepttext}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.buttonaccept}
                onPress={() => onClickReject() }>
                <Text style={styles.declinetext}>Decline</Text>
            </TouchableOpacity>
            </View>
            </LinearGradient>
        </Modal>
  )
};

export default ModalAudiocall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'white',
  },
  callertext: {
    color: 'white',
    fontSize: 19,
    marginTop: 10,
  },
  avatar: {
    backgroundColor: '#2F91C9',
    padding: 10,
    height: '100%',
    alignItems: 'center',
    paddingBottom: '4%',
  },
  avatar1: {
    marginTop: '25%',
  },
  input: {
    width: '90%',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 12,
  },
  buttonaccept: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: 'white',
    borderWidth: 2,
    width: '70%',
    marginTop: 35,
    borderRadius:4
  },
  accepttext: {
    color: 'green',
    fontSize: 17,
  },
  declinetext: {
    color: 'red',
    fontSize: 17,
  },
  bottom:{
    width:'100%',
    alignSelf:'center',
    alignItems:'center',
    bottom:'8%',
    position:'absolute'
  }
});
