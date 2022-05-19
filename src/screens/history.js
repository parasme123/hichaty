import React, { useContext, useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, AppState, SafeAreaView } from 'react-native';
import Header from '../components/headerHistory';
import Card from '../components/historyCard2';
import { SectionGrid } from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import ModalChatContact from '../components/modalChatContact';
import ModalVideoCall from '../components/modalVideoinvitation';
import ModalAudioCall from '../components/modalAudioinvitation';
import messaging from '@react-native-firebase/messaging';
const historyCollection = firestore().collection('history');

const usersCollection = firestore().collection('users');
const roomsCollection = firestore().collection('rooms');
let fcmUnsubscribe = null;
import { firebase } from '@react-native-firebase/functions';
import firestore from '@react-native-firebase/firestore';



const history = ({ navigation, route }) => {

  const { user, users, notifications, setModalChatContact, history, setNotifications,
    modalVideoInvitation, setModalVideoInvitation,
    modalAudioInvitation, setModalAudioInvitation,
  } = useContext(AppContext);
  const [userFriends, setUserFriends] = useState([]);
  const [historyCalls, setHistoryCalls] = useState([])

  const [target, setTarget] = useState(null);
  const [targetvideo, setTargetvideo] = useState(null);
  const [targetaudio, setTargetaudio] = useState(null);
  const [videoroomref, setVideoroomref] = useState(null);
  const [audioroomref, setAudioroomref] = useState(null);
  const [desiredChat, setDesiredChat] = useState();
  const [appState, setAppState] = useState(AppState.currentState);


  const navigateTo = async (routeName, target) => {
    let roomRef;
    let groupsOfRemotePeer = target.groups;
    let sharedGroups = user.groups.filter(group => groupsOfRemotePeer.includes(group));
    if (sharedGroups.length == 1) {
      roomRef = sharedGroups[0].split('/')[2];
    }
    else {
      sharedGroups.forEach(group => group.split('/')[2]);
      const querySnapshot = await roomsCollection.where(firebase.firestore.FieldPath.documentId(), "in", sharedGroups).get();
      let doc = querySnapshot.filter(documentSnapshot => documentSnapshot.participants.length === 2)[0];
      roomRef = doc.id;
    }
    navigation.navigate(routeName, { roomRef, remotePeerName: target.name, remotePeerId: target.id, remotePic: target.picture, type: 'caller' })
  }

  /* listen to FCM notifications, and don't forgot to pass the route name as prop 
    to modalchatcontact to check actualRouteName: 
  */
  // if user was in is in contacts screen : 

  useEffect(() => {
    fcmUnsubscribe = messaging().onMessage(async (remoteMessage) => {
      log_message("A new Message arrived to Contacts screen ", remoteMessage.data);
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


  // // set friends to know what cards to handle :
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (user.groups.length > 0) {
        let userRooms = user.groups.map(room => room.split("/")[2]);
        let historyCalls = [];


        historyCollection.onSnapshot(
          querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
              if (userRooms.includes(documentSnapshot.id)) {

                var data = Object.keys(documentSnapshot.data())
                console.log(data[0], "datadatadata.data()");
                console.log(data[2], "datadatadata.data()");
                let histoy = []

                // if(data[0] == "chat"){
                var dataaa = data.filter(item => item !== "chat")
                var dataaa1 = dataaa.filter(item => item !== "room")
                console.log(dataaa1, "dataaa1");

                // }
                // histoy[0] = data[0]
                // histoy[1] = data[1]
                // histoy[2] = data[2]
                // histoy[3] = data[3]

                var histoy1 = dataaa1.filter(item => item !== user.id)
                console.log(histoy1, "histoy1");
                console.log(histoy, "histoy");

                // var dataaa = data.filter(item => item !== room || item !== chat)
                // console.log(dataaa, "documentSnapshot.data()");
                // var peerId = Object.keys(documentSnapshot.data()).filter(id => id !== user.id)[0];

                // let peerId = Object.keys(documentSnapshot.data()).filter(id => id !== user.id)[0];
                // console.log(peerId, "peerId>>>>>>>>>>>>");
                let peerDetails = []
                peerDetails = users.filter(element => element.id !== undefined)
                console.log(peerDetails, "peerDetailspeerDetailspeerDetailspeerDetails");
                peerDetails = peerDetails.filter(element => element && element.id == histoy1)[0];
                console.log("historydata", peerDetails);
                if (peerDetails != undefined) {
                  historyCalls.push(peerDetails);
                }


              }
            })
            // console.log(historyCalls, "historyCallshistoryCallshistoryCalls");
            let peerDetails11 = historyCalls.length > 0 && historyCalls.filter(element => element.id !== undefined)
            // console.log(peerDetails11, "peerDetails11");
            let dupChars = peerDetails11.length > 0 && peerDetails11.filter((item, index) => {
              return peerDetails11
              // return peerDetails11.indexOf(item && item.id) === index;
            });
            console.log(dupChars, "dupChars");

            const filteredArr = dupChars.length > 0 && dupChars.reduce((acc, current) => {
              const x = acc.find(item => item.id === current.id);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            console.log(filteredArr, "filteredArr");

            setUserFriends(filteredArr);
          }
        )
      }
    });
    return unsubscribe;

  }, [users])



  const renderGridItem = ({ item, index, rowIndex }) => {
    // console.log(JSON.stringify(item), "item>>>>");
    return (
      <Card
        number={item?.key}
        name={item?.name}
        picture={item?.picture}
        navigate={navigation.navigate}
        video={() => navigateTo('videocall', item)}
        phone={() => navigateTo('voicecall', item)}
        chat={() => navigateTo('chat', item)}
        blockuser={() => navigation.navigate('settheme', { targetId: item.id, mobile: item.mobile, name: item.name, status: item.status, picture: item.picture })}
        status={item.status}

      />

    )
  }
  // console.log(userFriends, "userFriends>>>>>>>>>>>>>>>>>>>>>>");
  return (
    <SafeAreaView style={styles.container}>
      <Header back={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionGrid
            itemDimension={150}
            sections={[{ data: userFriends ? userFriends : [] }]}
            style={styles.gridView}
            renderItem={renderGridItem}

          // renderItem={({item, section, index}) => (
          // <Card 
          //     number={item.key} 
          //     name={item.name} 
          //     picture={item.picture}
          //     navigate={navigation.navigate}
          //     video={() => navigateTo('videocall', item)}
          //     phone={() => navigateTo('voicecall', item)}
          //     chat={ () => navigateTo('chat', item)}
          //     blockuser={() => navigation.navigate('settheme', { targetId: item.id, mobile: item.mobile, name: item.name , status:item.status, picture: item.picture})}        
          // />
          // )}
          />

        </View>
      </ScrollView>
      { target && <ModalChatContact target={target} navigate={navigation.navigate} desiredChat={desiredChat} actualRouteName={"Group"} />}
      { targetvideo && <ModalVideoCall roomRef={videoroomref} remotePeerName={targetvideo.name} remotePeerId={targetvideo.id} remotePic={targetvideo.picture} navigation={navigation} />}
      { targetaudio && <ModalAudioCall roomRef={audioroomref} remotePeerName={targetaudio.name} remotePeerId={targetaudio.id} remotePic={targetaudio.picture} navigation={navigation} />}

    </SafeAreaView>
  );
};

export default history;

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
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: 195,
    width: '95%',
    marginTop: 10,
  },
  image: {
    flex: 1,
    height: '100%',
    width: '100%'
  },
  username: {
    height: 50,
    width: '100%',
    textAlignVertical: 'center',
    paddingLeft: 10,
    color: 'white',
    left: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'rgba(34, 36, 37, 0.8)',
  }
});
