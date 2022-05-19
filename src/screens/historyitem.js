import React, { useContext, useState, useEffect } from 'react';
import {StyleSheet, View, Image, Text, ScrollView, FlatList, Dimensions } from 'react-native';
import Header from '../components/headerHistory';
import Card from '../components/historycard';
import {SectionGrid} from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import ModalChatContact from '../components/modalChatContact';
import ModalVideoCall from '../components/modalVideoinvitation';
import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('users');
const historyCollection = firestore().collection('history');

const historyItem = ({ navigation, route }) => {

  const { user, users, notifications, modalChatContact, setModalChatContact, modalVideoInvitation, setModalVideoInvitation } = useContext(AppContext);
  const [ targetContact, setTargetContact ] = useState(null);
  const [ targetvideo, setTargetvideo ] = useState(null);
  const [ videoroomref, setVideoroomref ] = useState(null);
  const [ desiredChat, setDesiredChat ] = useState();
  const { roomRef, id, picture, name } = route.params;
  const [ historyCalls, setHistoryCalls ] = useState([])
  
  const deleteNotification = (notif) => {
    usersCollection.doc(user.id).update({
      notification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  useEffect( () => {
      console.log(route.params, 'YEAH');
      const unsubscribeHistory = historyCollection.doc(roomRef)
        .onSnapshot( documentSnapshot => {
              if( documentSnapshot.data() && documentSnapshot.data()[id]){
                documentSnapshot.data()[id].forEach( item => {
                  let data = { key: item.date.toDate().toString().split(' ')[4], ...item,  date: item.date.toDate().toString().split(' ')[4] };
                  console.log(data);
                  setHistoryCalls([ ...historyCalls, data] );
                })
              }
      })

      return unsubscribeHistory;
  },[])


  useEffect( () => {
    if(notifications.length > 0){
      console.log('notifications', notifications)
      let lastNotif = notifications[0];
      switch(lastNotif.type){
        case "invitation":
          setDesiredChat(lastNotif.routeName);
          setTargetContact(lastNotif)
          setModalChatContact(true);
          break;
        case "videocall invitation":
          console.log('invitation',lastNotif.type )
          setVideoroomref(lastNotif.roomRef)
          setModalVideoInvitation(true);
          setTargetvideo(lastNotif);
        break; 
      }
      deleteNotification(lastNotif);
    }
  },[notifications])

  
  return (
    <View style={styles.container}>
      <Header back={() => navigation.goBack()} />
      <View style={styles.imageContainer}>
        <Image source={{ uri: picture }} style={styles.image}/>
        <Text style={styles.username}>{name}</Text>
        
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionGrid
            itemDimension={Dimensions.get('window').width}
            sections={[
              {
                data: historyCalls,
              },
            ]}
            style={styles.gridView}
            renderItem={({item, section, index}) => (
              <Card
                number={item.key}
                date={item.date}
                duration={item.duration}
                type={item.type}
              />
            )}
          />
        </View>
      </ScrollView>
      { !!targetContact && <ModalChatContact desiredChat={desiredChat} modalVisible={modalChatContact} user={user} target={targetContact} navigate={navigation.navigate} routeName={route.name}/> }
      { !!targetvideo &&
          <ModalVideoCall roomRef={videoroomref} remotePeerName={targetvideo.name} remotePeerId={targetvideo.id} visible={modalVideoInvitation} remotePic={targetvideo.picture} setVisible={setModalVideoInvitation} navigation={navigation} />
        }
    </View>
  );
};

export default historyItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  username :{
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
