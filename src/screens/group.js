import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, SafeAreaView } from 'react-native';
import Header from '../components/header';
import Card from '../components/groupcard';
import { SectionGrid } from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import { SvgXml } from 'react-native-svg';
import { groupicon } from '../assets/tabicons';
import firestore from '@react-native-firebase/firestore';
import ModalChatContact from '../components/modalChatContact';
import ModalVideoCall from '../components/modalVideoinvitation';
import ModalAudioCall from '../components/modalAudioinvitation';
import messaging from '@react-native-firebase/messaging';
import { useIsFocused } from '@react-navigation/native';

const roomsCollection = firestore().collection('rooms');
const usersCollection = firestore().collection('users');
let fcmUnsubscribe = null;

const group = (props) => {
  const { navigation } = props;
  const focused = useIsFocused();
  const [groups, setGroups] = useState([]);
  const { user, rooms, notifications, setModalChatContact, setNotifications,
    modalVideoInvitation, setModalVideoInvitation,
    modalAudioInvitation, setModalAudioInvitation,
  } = useContext(AppContext);
  const [target, setTarget] = useState(null);
  const [targetvideo, setTargetvideo] = useState(null);
  const [targetaudio, setTargetaudio] = useState(null);
  const [videoroomref, setVideoroomref] = useState(null);
  const [audioroomref, setAudioroomref] = useState(null);
  const [desiredChat, setDesiredChat] = useState();

  /* listen to FCM notifications, and don't forgot to pass the route name as prop 
    to modalchatcontact to check actualRouteName: 
  */
  // if user was in is in contacts screen : 

  useEffect(() => {
    fcmUnsubscribe = messaging().onMessage(async (remoteMessage) => {
      log_message("A new Message arrived to Group screen ", remoteMessage.data);
      let data = remoteMessage.data;
      let type = data.msgType;
      switch (type) {
        case "new invitation":
          setTarget({ id: data.senderId, name: data.senderName });
          setDesiredChat(data.desiredChat);
          setModalChatContact(true);
          break;
      }
    })
    return fcmUnsubscribe;
  }, [])

  // in case of new call arrived -  forground :
  useEffect(() => {
    if (notifications.length > 0) {
      let lastNotif = notifications[0];
      switch (lastNotif.type) {
        case "videocall invitation":
          setVideoroomref(lastNotif.roomRef)
          setModalVideoInvitation(true);
          setTargetvideo(lastNotif);
          break;
        case "voicecall invitation":
          console.log("from group", "voicecall")
          setAudioroomref(lastNotif.roomRef)
          setModalAudioInvitation(true);
          setTargetaudio(lastNotif);
          break;
      }
      setNotifications([]);
      deleteNotification(lastNotif);
    }
  }, [notifications])

  const deleteNotification = (notif) => {
    usersCollection.doc(user.id).update({
      notification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  // check groups: 
  useEffect(() => {
    let groups = [];
    if (rooms.length > 0) {
      const getId_Of_Rooms = () => {
        return rooms.map(room => room && room.split('/')[2])
      }
      let roomsDetails = getId_Of_Rooms();
      roomsCollection.where(firestore.FieldPath.documentId(), "in", roomsDetails)
        .onSnapshot(quertySnapshot => {
          quertySnapshot.forEach(documentSnapshot => {
            if (documentSnapshot.exists && documentSnapshot.data().name && documentSnapshot.data().admin) {
              groups && groups.push({ key: documentSnapshot.id, data: documentSnapshot.data() })
            }
          })
          setGroups(groups)
          groups = null;
        })
    }
  }, [focused])

  return (
    <SafeAreaView style={styles.container}>
      <Header
        gosetting={() => navigation.navigate('changetheme')}
        creategroup={() => navigation.navigate('creategroupchat')}
        group="1"
      />
      {groups && groups.length > 0 ?
        // <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionGrid
            itemDimension={150}
            sections={[
              {
                data: groups,
              },
            ]}
            style={styles.gridView}
            // renderItem={renderGridItem}
            renderItem={({ item, section, index }) => (
              <Card
                number={item.key}
                data={item.data}
                chat={() => navigation.navigate('groupchat', { roomRef: item.key, BackHandel: false })}
              // blockuser={() => navigation.navigate('settheme')}
              />
            )}

          />
        </View>
        // </ScrollView>
        :
        <View style={styles.container2}>
          <SvgXml
            xml={groupicon}
            style={styles.icon}
          />
        </View>
      }
      {target && <ModalChatContact target={target} navigate={navigation.navigate} desiredChat={desiredChat} actualRouteName={"Group"} />}
      {targetvideo && <ModalVideoCall roomRef={videoroomref} remotePeerName={targetvideo.name} remotePeerId={targetvideo.id} remotePic={targetvideo.picture} navigation={navigation} />}
      {targetaudio && <ModalAudioCall roomRef={audioroomref} remotePeerName={targetaudio.name} remotePeerId={targetaudio.id} remotePic={targetaudio.picture} navigation={navigation} />}

    </SafeAreaView>
  );
};

export default group;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container1: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  container2: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center', justifyContent: 'center'
  },
  content: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  setcard: {
    display: 'flex',
    marginVertical: 1,
  },
  icon: {
    height: '60%',
    width: '60%'
  }
});
