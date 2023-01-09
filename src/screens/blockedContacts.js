import React, {useContext, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView
} from 'react-native';
import {SectionGrid} from 'react-native-super-grid';
import Header from '../components/header';
import Card from '../components/cardblocked';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
import messaging from "@react-native-firebase/messaging";
import ModalChatContact from '../components/modalChatContact';
import ModalVideoCall from '../components/modalVideoinvitation';
import ModalAudioCall from '../components/modalAudioinvitation';
import ModalChatInvitation from '../components/modalChatInvitation';
import ModalChatCodeGen from '../components/modalChatCodeGen';
import ModalChatCodeReceived from '../components/modalChatCodeReceveid';
import log_message from '../lib/log';
const usersCollection = firestore().collection('users');
const roomsCollection = firestore().collection('rooms');
let fcmUnsubscribe = null;

const BlockedContacts = ({ navigation, route }) => {
  
  const [ modalChatInvitation, setModalChatInvitation ] = useState(false);
  const [ modalChatCodeGen, setModalChatCodeGen ] = useState(false);
  const [ modalChatCodeReceveid, setModalChatCodeReceived ] = useState(false);
  const [ roomRef, setRoomRef ] = useState(null);
  const [ code, setCode ] = useState(null);
  const [ videoroomref, setVideoroomref ] = useState(null);
  const [ audioroomref, setAudioroomref ] = useState(null);
  const [ target, setTarget ] = useState(null);
  const [ targetvideo, setTargetvideo ] = useState(null);
  const [ targetaudio, setTargetaudio ] = useState(null);
  const [ bool, setBool ] = useState(false);
  const { user, users, setModalChatContact, notifications, setNotifications,
          modalVideoInvitation, setModalVideoInvitation, blockedUsers,
          modalAudioInvitation, setModalAudioInvitation, 
          myUnreadMessages, redirectToContacts, setRedirectToContacts
        } = useContext(AppContext)
  const [ setup, setSetup] = useState('in progress');
  const [ desiredChat, setDesiredChat ] = useState(desiredChat);
  const [ Vtype, setVType ] = useState(null);
  const [ id, setId ] = useState(null);
  
  const navigateTo = ( routeName, target ) => {
    let roomRef;
    roomsCollection
      .where("participants", "in", [[user.id, target.key],[target.key, user.id]] )
      .get()
      .then( querySnapshot => {
        querySnapshot.forEach( documentSnapshot => {
          //log_message(user.id, 'roomRef', documentSnapshot.id);
          roomRef = documentSnapshot.id;
          // console.log(roomRef);
        })
      }).then( () => {
        navigation.navigate( routeName, { roomRef , remotePeerName: target.name, remotePeerId: target.id, remotePic: target.picture, type: 'caller' })
      })
  }
  
  const sendInvitation = (routeName, id, name) => {
    setTarget({id, name});
    setDesiredChat(routeName);
    setModalChatInvitation(true);
  }


  /* listen to FCM notifications, and don't forgot to pass the route name as prop 
    to modalchatcontact to check actualRouteName: 
  */
  // if user was in is in contacts screen : 

  useEffect( () => {
    // console.log(blockedUsers.map(user => user.id))
    fcmUnsubscribe = messaging().onMessage( async (remoteMessage) => {
      log_message("A new Message arrived to Contacts screen ", remoteMessage.data);
      let data = remoteMessage.data; 
      let type = data.msgType;
      switch(type){
        case "new invitation":
          setTarget({ id: data.senderId, name: data.senderName });
          setDesiredChat(data.desiredChat);
          setModalChatContact(true);
          break;
        case "invitation accepted":
          setTarget({ id: data.senderId, name: data.senderName, pic: data.senderPicture });
          setDesiredChat(data.desiredChat);
          setRoomRef(data.roomRef);
          setCode(data.code);
          setModalChatCodeReceived(true);
          break;
      }
    })
    return fcmUnsubscribe;
  },[])

  // if not, so he was in another screen and we redirected him , we'll check that 
  // with the redirectToScreens page :
  useEffect( () => {
    if(redirectToContacts){
      let data = route.params;
      setTarget(data.target);
      setDesiredChat(data.desiredChat);
      setModalChatCodeGen(true);
      setRedirectToContacts(false);
    }
  },[redirectToContacts])

  // in case of new call arrived -  forground :
  useEffect( () => {
    if(notifications.length > 0){
      let lastNotif = notifications[0];
      switch(lastNotif.type){   
        case "videocall invitation":
          setVideoroomref(lastNotif.roomRef);
          setModalVideoInvitation(true);
          setTargetvideo(lastNotif);
          break;
        case "voicecall invitation":
          // console.log("from constacts", "voicecall");
          setAudioroomref(lastNotif.roomRef);
          setModalAudioInvitation(true);
          setTargetaudio(lastNotif);
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


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>

    
    <View style={styles.container}>
      <Header gosetting={() => navigation.navigate('changetheme', {id:user && user.id})} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
            <SectionGrid
                itemDimension={150}
                sections={[
                {
                    data: blockedUsers,
                },
                ]}
                style={styles.gridView}
                renderItem={({item, section, index}) => (
                  <Card
                  number={item.key}
                  id={item.id}
                  block={item.block}
                  name={item.name}
                  picture={item.picture}
                  unreadmsgs = { myUnreadMessages[item.id] && myUnreadMessages[item.id] > 0 ? myUnreadMessages[item.id] : 0 }
                  video={() => item.block ? sendInvitation('videocall', item.key, item.name) : navigateTo('videocall', item)}
                  phone={() => item.block ? sendInvitation('voicecall', item.key, item.name) : navigateTo('voicecall', item)}
                  chat={ () => item.block ? sendInvitation('chat', item.key, item.name) : navigateTo('chat', item)}
                  blockuser={() => navigation.navigate('settheme', { targetId: item.id, mobile: item.mobile, name: item.name , status:item.status, picture: item.picture})}
                />
                )}
            />
        </View>
        </ScrollView>
      
    </View>
    
</SafeAreaView>
  );
};

export default BlockedContacts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    height: '100%',
    width: '100%',
  },
  setcard: {
    display: 'flex',
    marginVertical: 1,
  },
  content: {
    flex: 1, 
    height: '100%',
    width: '100%',
  },
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
  modal1: {
    display: 'flex',
    position: 'absolute',
    flex: 1,
    padding: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    width: '70%',
    alignContent: 'center',
    marginVertical: 160,
    borderRadius: 10,
    paddingTop: 20,
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
  modaltextRequest: {
    textAlign: 'center',
    width: '90%',
    marginVertical: 10,
    fontSize: 15,
  },
  buttonset: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flex: 1,
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

  borderStyleBase: {
    width: 45,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: 'black',
  },

});
