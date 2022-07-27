
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  volume,
  silent,
  mute,
  keypad,
  video,
  videocallwhite,
  mutevideo,
  unmutevideo
} from '../assets/chaticons';
import { SvgXml } from 'react-native-svg';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';

const roomsCollection = firestore().collection('rooms');
const usersCollection = firestore().collection('users');
const historyCollection = firestore().collection('history');

import { RTCPeerConnection, RTCView, mediaDevices, RTCIceCandidate, RTCSessionDescription } from 'react-native-webrtc';
import AppContext from '../context/AppContext';
const configuration = {
  ice_servers: [
    {
      "url": "stun:global.stun.twilio.com:3478?transport=udp",
      "urls": "stun:global.stun.twilio.com:3478?transport=udp"
    },
    {
      "username": "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
      "credential": "tE2DajzSJwnsSbc123",
      "url": "turn:global.turn.twilio.com:3478?transport=udp",
      "urls": "turn:global.turn.twilio.com:3478?transport=udp"
    },
    {
      "username": "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
      "credential": "tE2DajzSJwnsSbc123",
      "url": "turn:global.turn.twilio.com:3478?transport=tcp",
      "urls": "turn:global.turn.twilio.com:3478?transport=tcp"
    },
    {
      "username": "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
      "credential": "tE2DajzSJwnsSbc123",
      "url": "turn:global.turn.twilio.com:443?transport=tcp",
      "urls": "turn:global.turn.twilio.com:443?transport=tcp"
    }
  ],
}

const Videocall = ({ navigation, route }) => {

  const [colour, setColour] = useState(['#F2853E', '#F77E52', '#FD7668']);
  const { roomRef, remotePeerName, remotePic, remotePeerId, type } = route.params;
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [isMuted, setIsMuted] = useState();
  const [localPC, setLocalPC] = useState(new RTCPeerConnection(configuration));
  const { user, notifications, setNotifications } = useContext(AppContext);
  const [targetId, setTargetId] = useState(remotePeerId);
  const [startTime, setStartTime] = useState(new Date());
  const [unsubscribeAnswer, setUnsubscribeAnswer] = useState();
  const [unsubscribeIceCandidates, setUnsubscribeIceCandidates] = useState();
  const [remoteDescription, setRemoteDescription] = useState(null);

  //on press back
  const onBackPress = async () => {

    if (localPC) {
      await localPC.removeStream(localStream);
      await localPC.close();
    }
    setLocalStream();
    setRemoteStream();
    setLocalPC();

    roomsCollection.doc(roomRef).collection(user.id).get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            doc.exists ? doc.ref.delete() : null
          })
        }
      }).catch(e => console.log(e, 'from candidates collection'));

    roomsCollection.doc(roomRef).update({ video: "" })
    const data =
    {
      date: firestore.Timestamp.now(),
      duration: (new Date() - startTime) / 1000,
      type: 'video'
    }

    if (remoteStream) {
      historyCollection.doc(roomRef)
        .set({ [`${user.id}`]: firestore.FieldValue.arrayUnion(data), chat: 0, room: roomRef }, { merge: true })

        // .set({ [`${user.id}`]: firestore.FieldValue.arrayUnion(data) }, {merge: true})
        .catch(e => console.log(e, 'from history'));
    }

    if (remoteStream) {
      usersCollection.doc(remotePeerId).update({
        notification: firestore.FieldValue.arrayUnion({ type: "videocall terminated", id: user.id, name: user.name })
      })
    }
    else {
      usersCollection.doc(remotePeerId).update({
        notification: firestore.FieldValue.arrayUnion({ type: "videocall terminated before answering", id: user.id, name: user.name })
      })
    }

    navigation.navigate('bottom');
  }

  // register peer connection listeners
  const registerPeerConnectionListeners = (peerConnection) => {
    peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(
        `ICE gathering state changed: ${peerConnection.iceGatheringState} for ${user.id}`);
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerConnection.connectionState} for ${user.id}`);
    });

    peerConnection.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerConnection.signalingState} for ${user.id}`);
    });

    peerConnection.addEventListener('iceconnectionstatechange ', () => {
      console.log(
        `ICE connection state change: ${peerConnection.iceConnectionState} for ${user.id}`);
    });
  }

  // get local stream
  const startLocalStream = async () => {
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();
    const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find(device => device.kind === 'videoinput' && device.facing === facing);

    const facingMode = isFront ? 'user' : 'enviroment';
    const constraints = {
      audio: true,
      video: {
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

  // send invitation
  const sendInvitationVideo = (id, roomRef) => {
    firebase.functions().httpsCallable('onNewVideoCall')({
      senderId: user.id,
      senderName: user.name,
      receiverId: id,
      senderPicture: user.picture,
      roomRef: roomRef,
    })
  }

  // set offer and send invitation
  const startCall = async (id) => {
    console.log("localPC", localPC)
    registerPeerConnectionListeners(localPC);
    let localStream = await startLocalStream();
    localPC.addStream(localStream);

    localPC.onaddstream = (e) => {
      localStream && e.stream !== localStream ? setRemoteStream(e.stream) : null;
    }

    const roomRef = roomsCollection.doc(id);

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    const videoOffer = { offer, from: user.id }
    await roomRef.update({ video: videoOffer })

    sendInvitationVideo(remotePeerId, roomRef.id);

    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data().video;
      if (!localPC.currentRemoteDescription && data.answer) {
        const answer = new RTCSessionDescription(data.answer);
        await localPC.setRemoteDescription(answer);
        setRemoteDescription(true);
      }
    });


  }

  useEffect(() => {
    roomRef && type === 'caller' ? (async () => await startCall(roomRef))() : null;
  }, [])

  useEffect(() => {
    roomRef && type !== 'caller' ? (async () => await joinVideoCall(roomRef))() : null;
  }, [])

  // join video call and send answer
  const joinVideoCall = async (id) => {

    registerPeerConnectionListeners(localPC);
    let localStream = await startLocalStream();
    localPC.addStream(localStream);
    localPC.onaddstream = (e) => {
      localStream && e.stream !== localStream ? setRemoteStream(e.stream) : null;
    }

    const roomRef = roomsCollection.doc(id);
    const roomSnapshot = await roomRef.get();

    const offer = roomSnapshot.data().video.offer;
    await localPC.setRemoteDescription(offer);
    setRemoteDescription(true);

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    const videoAnswer = { answer, from: user.id }
    await roomRef.update({ video: videoAnswer })

  }

  // switch camera
  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };

  // toggle mute
  const toggleMute = () => {
    // if (!remoteStream) {
    //   return;
    // }
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };

  // gather ice candidates
  useEffect(() => {
    if (localPC && user && user.id && targetId && roomRef) {
      const romRef = roomsCollection.doc(roomRef);

      localPC.onicecandidate = event => {
        if (event.candidate) {
          const json = event.candidate.toJSON();
          romRef.collection(user.id).add(json);
        }
      }

      if (remoteDescription) {
        romRef.collection(targetId).onSnapshot(snapshot => {
          if (!snapshot.empty) {
            snapshot.docChanges().forEach(change => {
              if (change.type === "added") {
                const candidate = new RTCIceCandidate(change.doc.data());
                // if (user.id === "BoFZRrLLR9hYYKZYUpVu") {
                //   console.log('candidate', candidate)
                // }
                localPC.addIceCandidate(candidate)
                  .then(e => console.log('candidate added succefully ', e))
                  .catch(e => console.log(e))
              }
            });
          }
        })
      }
      setCachedLocalPC(localPC)
    }
  }, [remoteDescription])

  useEffect(() => {
    if (remoteStream) {
      setStartTime(new Date());
    }
  }, [remoteStream])

  // delete Notif
  const deleteNotification = (notif) => {
    usersCollection.doc(user.id).update({
      notification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  //listen to user response :
  useEffect(() => {
    usersCollection
      .doc(user.id)
      .onSnapshot(documentSnapshot => {
        setNotifications([...documentSnapshot.data().notification])
      })
  }, [])

  // leave is user reject the video call
  useEffect(() => {
    if (notifications.length > 0) {
      let lastNotif = notifications[0];
      switch (lastNotif.type) {
        case "videocall response":
          (async () => await roomsCollection.doc(roomRef).update({ video: "" }))();
          navigation.canGoBack() ? navigation.goBack() : navigation.navigate('bottom');
          break;
        case "voicecall terminated":
          (async () => await onBackPress())();
          break;
      }
      deleteNotification(lastNotif);
    }
  }, [notifications])

  return (
    <View style={styles.container}>
      {!!localStream ?
        <View style={styles.input}>
          <RTCView style={{ flex: 1, width: '100%', height: '100%' }} zOrder={1} streamURL={localStream && localStream.toURL()} />
        </View>
        :
        null
      }
      {!!remoteStream ?
        <View style={styles.inputremote} >
          <RTCView style={{ flex: 1, height: '100%', width: '100%' }} zOrder={0} streamURL={remoteStream && remoteStream.toURL()} objectFit={'cover'} />
        </View>
        :
        <Image source={{ uri: remotePic }} style={{ width: null, flex: 1 }} />
      }
      {!!remoteStream ?
        <View style={styles.topset}>
          <View style={styles.topshadow}>
            <Text style={styles.time}>00:12</Text>
          </View>
        </View>
        : null
      }
      <View style={styles.avatar}>
        <View style={styles.shadow}>
          <View style={styles.icon}>
            {!isMuted ?
              <TouchableOpacity title={`Mute stream`} onPress={toggleMute} disabled={!remoteStream}>
                <SvgXml xml={volume} />
              </TouchableOpacity>
              :
              <TouchableOpacity title={`Unmute stream`} onPress={toggleMute} disabled={!remoteStream}>
                <SvgXml xml={silent} />
              </TouchableOpacity>
            }
            <TouchableOpacity>
              <SvgXml xml={unmutevideo} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.buttonaccept}
            onPress={() => onBackPress()}>
            <Text style={styles.accepttext}>End Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
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
    fontSize: 25,
    marginTop: 10,
  },
  topset: {
    position: 'absolute',
    // backgroundColor: 'red',
    top: 20,
    width: '100%',
    alignItems: 'center',
    height: 70,
  },
  topshadow: {
    backgroundColor: '#000000aa',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    height: 70,
  },
  time: {
    color: 'white',
    fontSize: 32,
    paddingTop: 18,
  },
  callername: {
    color: 'white',
    fontSize: 19,
    marginTop: 10,
  },
  avatar: {
    // backgroundColor: '#2F91C9',
    // opacity:0.4,
    padding: 0,
    height: '35%',
    alignItems: 'center',
    paddingBottom: '4%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  shadow: {
    backgroundColor: '#000000aa',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    // height: '35%',
  },
  avatar1: {
    marginTop: '18%',
  },
  inputremote: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    width: '80%',
    zIndex: 1,
    height: 160,
    position: 'absolute',
    // backgroundColor: 'grey',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 10,
    alignSelf: 'center',
    bottom: 175,
  },
  buttonaccept: {
    alignItems: 'center',
    backgroundColor: '#FB5051',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: 'white',
    borderWidth: 2,
    width: '76%',
    marginVertical: 25,
    borderRadius: 5,
  },
  accepttext: {
    color: 'white',
    fontSize: 17,
  },
  icon: {
    marginTop: 25,
    flexDirection: 'row',
    width: '65%',
    justifyContent: 'space-between',
  },
});
