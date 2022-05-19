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
} from 'react-native';
import Header from '../components/headervideocall';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar} from 'react-native-elements';
import {SvgXml} from 'react-native-svg';
import {user, mobile} from '../assets/loginsignupIcons';
import {settings} from '../assets/changethemeicons';
import { video, videocallwhite } from '../assets/chaticons';

import firestore from '@react-native-firebase/firestore';
const roomsCollection = firestore().collection('rooms');
const usersCollection = firestore().collection('users');

import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription} from 'react-native-webrtc';
import AppContext from '../context/AppContext';
const configuration = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    }, {
      urls: 'stun:stun1.l.google.com:19302',
    }, {
      urls: 'stun:stun2.l.google.com:19302',
    }
  ]
  }

const Videocall = ({ navigation, route }) => {

  const { roomRef, remotePeerName, remotePeerId, type } = route.params;
  const [ colour, setColour ] = useState(['#F2853E', '#F77E52', '#FD7668']);
  const [ localStream, setLocalStream ] = useState();
  const [ remoteStream, setRemoteStream ] = useState();
  const [ cachedLocalPC, setCachedLocalPC ] = useState();
  const [ muted, setMuted ] = useState();
  const [ localPC, setLocalPC ] = useState(new RTCPeerConnection(configuration));
  const { user, notifications } = useContext(AppContext);
  const [ targetId, setTargetId ] = useState(remotePeerId);
  const [ invitation, setInvitation ] = useState(false);


  const onBackPress = () => {
    if (cachedLocalPC) {
      cachedLocalPC.removeStream(localStream);
      cachedLocalPC.close();
    }
    setLocalStream();
    setRemoteStream();
    setCachedLocalPC();
    roomsCollection.doc(roomRef).collection(user.id).onSnapshot(snapshot => {
      if(!snapshot.empty){
        snapshot.forEach( doc => doc.delete() )
      }
    })
    navigation.goBack('contact')
  }
  
  const startLocalStream = async() => {
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();
    const facing = isFront ? 'front': 'environment';
    const videoSourceId = devices.find( device => device.kind === 'videoinput' && device.facing === facing );
    const facingMode = isFront ? 'user': 'enviroment';
    const constraints  = {
      audio : true,
      video : {
        mandatory: {
          minHeight: 300,
          minWidth: 500,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
    return newStream;
  };

  const sendInvitationVideo = (id, roomRef) => {
    console.log(id)
    usersCollection.doc(id).update({
      notification: firestore.FieldValue.arrayUnion({ type: "videocall invitation", id: user.id, name: user.name , roomRef})
    })
  }

  const startCall = async (id) => {
    console.log( 'savedStream ', localStream )
    let localStream = await startLocalStream();
    console.log( 'returned Stream', localStream )
    localPC.addStream(localStream);
    localPC.onaddstream = (e) => {
      console.log( 'remote Stream', localStream )
      localStream && e.stream !== localStream ? setRemoteStream(e.stream) : null ;
    } 
    const roomRef = roomsCollection.doc(id);

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    const videoOffer = { offer, from: user.id }
    await roomRef.update({ video: videoOffer })

    roomRef.onSnapshot( async snapshot => {
      const data = snapshot.data().video ;
      if( !localPC.currentRemoteDescription && data.answer ){
        console.log('Set remote description', data.answer);
        const answer = new RTCSessionDescription(data.answer);
        await localPC.setRemoteDescription(answer);
      }
    });
    sendInvitationVideo(remotePeerId, roomRef.id);
  }

  useEffect(() => {
    roomRef && type === 'caller' ? ( async () => await startCall(roomRef) )() : null ;
  },[])

  useEffect( () => {
    roomRef && type === 'callee' ? ( async () => await joinVideoCall(roomRef) )() : null ;
  },[])

  const joinVideoCall = async (id) => {

    let localStream = await startLocalStream();
    localPC.addStream(localStream);
    localPC.onaddstream = (e) => {
      localStream && e.stream !== localStream ? setRemoteStream(e.stream) : null ;
    } 
    const roomRef = roomsCollection.doc(id);
    const roomSnapshot = await roomRef.get();

    const offer = roomSnapshot.data().video.offer;
    await localPC.setRemoteDescription(offer);
    setTargetId(roomSnapshot.data().video.from);

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    const videoAnswer = { answer, from: user.id }
    await roomRef.update({ video: videoAnswer })
  }

  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  }; 

  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  useEffect( () => {

    if(localPC && user && user.id && targetId && roomRef ){
      console.log(roomRef, user.id)
      const romRef = roomsCollection.doc(roomRef);

      localPC.onicecandidate = event => {
          if (event.candidate) {
              const json = event.candidate.toJSON();
              romRef.collection(user.id).add(json);
          }
      }

      romRef.collection(targetId).onSnapshot(snapshot => {
        if(!snapshot.empty){
          snapshot.docChanges().forEach(change => {
            if (change.type === "added") {
                const candidate = new RTCIceCandidate(change.doc.data());
                try{
                  ( async () => await localPC.addIceCandidate(candidate) )() ;
                }catch(e){
                  console.log(e)
                }
                
            }
          });
        }
      })
      setCachedLocalPC(localPC)
    }
    
  },[])

  const deleteNotification = (notif) => {
    usersCollection.doc(user.id).update({
      notification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  useEffect( () => {
    if(notifications.length > 0){
      console.log('notifications', notifications)
      let lastNotif = notifications[0];
      switch(lastNotif.type){
        case "videocall response":
          ( async () => await roomsCollection.doc(roomRef).update({ video: "" }) )();
          ( async () => await usersCollection.doc(user.id).update({ candidate: "" }) )();
          navigation.goBack();
          break;  
      }
      deleteNotification(lastNotif);
    }
  },[notifications])

 

  return (
    <View style={styles.container}>
      <Header
        back={() => onBackPress()}
        voicecall={() => navigation.navigate('voicecall')}
        videocall={() => navigation.navigate('videocall')}
      />
      <Text style={styles1.heading} >Call Screen</Text>
      <Text style={styles1.heading} >Room : {roomRef}</Text>
      { !!localStream && (
        <View style={styles1.toggleButtons}>
          <Button title='Switch camera' onPress={switchCamera} />
          <Button title={`${muted ? 'Unmute' : 'Mute'} stream`} onPress={toggleMute} disabled={!remoteStream} />
        </View>
      )}
      
      <View style={{ display: 'flex', flex: 1, padding: 10 }} >
      { !!localStream && 
        <View style={styles1.rtcview}>
          <RTCView style={styles1.rtc} streamURL={localStream && localStream.toURL()} />
        </View>
      }
      { !!remoteStream && 
        <View style={styles1.rtcview}>
          <RTCView style={styles1.rtc} streamURL={remoteStream && remoteStream.toURL()} />
        </View>
      }
      </View>
    </View>
  )
};

export default Videocall;

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


const styles1 = StyleSheet.create({
  heading: {
    alignSelf: 'center',
    fontSize: 30,
  },
  rtcview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    margin: 5,
  },
  rtc: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  toggleButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  callButtons: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    margin: 5,
  }
});