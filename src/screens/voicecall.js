
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
  unmute
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
  username: "dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269",
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
  date_updated: "Fri, 01 May 2020 01:42:57 +0000",
  account_sid: "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  ttl: "86400",
  date_created: "Fri, 01 May 2020 01:42:57 +0000",
  password: "tE2DajzSJwnsSbc123"
}

const Voicecall = ({ navigation, route }) => {

  const [colour, setColour] = useState(['#F2853E', '#F77E52', '#FD7668']);
  const { roomRef, remotePeerName, remotePic, remotePeerId, type } = route.params;
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  // const [isMuted, setIsMuted] = useState(false);
  // const [isMuted1, setIsMuted1] = useState(false);

  const [isSpeaker, setIsspeaker] = useState(false);
  const [isMuted, setIsMute] = useState(false);


  const [localPC, setLocalPC] = useState(new RTCPeerConnection(configuration));
  const { user, notifications, setNotifications } = useContext(AppContext);
  const [targetId, setTargetId] = useState(remotePeerId);
  const [startTime, setStartTime] = useState(new Date());
  const [unsubscribeAnswer, setUnsubscribeAnswer] = useState();
  const [unsubscribeIceCandidates, setUnsubscribeIceCandidates] = useState();
  const [remoteDescription, setRemoteDescription] = useState(null);


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

    roomsCollection.doc(roomRef).update({ audio: "" })
    const data =
    {
      date: firestore.Timestamp.now(),
      duration: (new Date() - startTime) / 1000,
      type: 'audio'
    }

    if (remoteStream) {
      historyCollection.doc(roomRef)
        // .set({ [`${user.id}`]: firestore.FieldValue.arrayUnion(data) }, { merge: true })
        .set({ [`${user.id}`]: firestore.FieldValue.arrayUnion(data), chat: 0, room: roomRef }, { merge: true })

        .catch(e => console.log(e, 'from history'));
    }

    if (remoteStream) {
      usersCollection.doc(remotePeerId).update({
        notification: firestore.FieldValue.arrayUnion({ type: "voicecall terminated", id: user.id, name: user.name })
      })
    }
    else {
      usersCollection.doc(remotePeerId).update({
        notification: firestore.FieldValue.arrayUnion({ type: "voicecall terminated before answering", id: user.id, name: user.name })
      })
    }
    navigation.navigate('bottom');
  }

  // register peer connection listeners
  const registerPeerConnectionListeners = (peerConnection) => {
    peerConnection.addEventListener('icegatheringstatechange', () => {
      console.log(`ICE gathering state changed: ${peerConnection.iceGatheringState} for ${user.id}`);
    });

    peerConnection.addEventListener('connectionstatechange', () => {
      console.log(`Connection state change: ${peerConnection.connectionState} for ${user.id}`);
    });

    peerConnection.addEventListener('signalingstatechange', () => {
      console.log(`Signaling state change: ${peerConnection.signalingState} for ${user.id}`);
    });

    peerConnection.addEventListener('iceconnectionstatechange ', () => {
      console.log(`ICE connection state change: ${peerConnection.iceConnectionState} for ${user.id}`);
    });
  }


  const startLocalStream = async () => {
    const devices = await mediaDevices.enumerateDevices();
    // console.log(devices, "devices");
    const audioSourceId = devices.find(device => device.kind === 'audioinput');
    // console.log(audioSourceId, "audioSourceId");
    const constraints = {
      audio: true,
      video: false
    }
    const newStream = await mediaDevices.getUserMedia(constraints);
    // console.log(newStream, "newStream");
    setLocalStream(newStream);
    return newStream;
  };

  const sendInvitationVoice = (id, roomRef) => {
    // console.log('sending voice request ...')
    firebase.functions().httpsCallable('onNewVoiceCall')({
      senderId: user.id,
      senderName: user.name,
      receiverId: id,
      senderPicture: user.picture,
      roomRef: roomRef,
    })
  }

  // set offer and send invitation
  const startCall = async (id) => {
    registerPeerConnectionListeners(localPC);
    let localStream = await startLocalStream();
    // console.log(localStream, "localStream");
    localPC.addStream(localStream);

    localPC.onaddstream = (e) => {
      localStream && e.stream !== localStream ? setRemoteStream(e.stream) : null;
    }

    const roomRef = roomsCollection.doc(id);

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    const voiceOffer = { offer, from: user.id }
    await roomRef.update({ audio: voiceOffer })

    // console.log('im here offering ...')
    sendInvitationVoice(remotePeerId, roomRef.id);

    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data().audio;
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
    roomRef && type !== 'caller' ? (async () => await joinVoiceCall(roomRef))() : null;
  }, [])

  const joinVoiceCall = async (id) => {
    registerPeerConnectionListeners(localPC);
    let localStream = await startLocalStream();
    localPC.addStream(localStream);
    localPC.onaddstream = (e) => {
      localStream && e.stream !== localStream ? setRemoteStream(e.stream) : null;
    }

    const roomRef = roomsCollection.doc(id);
    const roomSnapshot = await roomRef.get();

    const offer = roomSnapshot.data().audio.offer;
    await localPC.setRemoteDescription(offer);
    setRemoteDescription(true);

    const answer = await localPC.createAnswer();
    await localPC.setLocalDescription(answer);

    const voiceAnswer = { answer, from: user.id }
    await roomRef.update({ audio: voiceAnswer })

  }

  // toggle mute
  const toggleMute = () => {
    if (!remoteStream) {
      // console.log(remoteStream, "remoteStream");
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      // console.log(track, "trackmuted>>>>>>>>>>>>");
      track.muted = !track.muted;
      setIsMute(!track.muted);
      // console.log(!track.muted, "!track.muted");
    });
  };


  const togglespeaker = () => {
    if (!remoteStream) {
      // console.log(remoteStream, "remoteStream");
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      // console.log(track, "track_enabled>>>>>>>>>>>>");
      track._enabled = !track._enabled;
      // console.log(!track._enabled, "!track._enabled");
      setIsspeaker(!track._enabled);
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
                if (user.id === "BoFZRrLLR9hYYKZYUpVu") {
                  // console.log('candidate', candidate)
                }
                localPC.addIceCandidate(candidate)
                  .then(e => console.log('candidate added succefully ', user.id))
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

  // delete notif
  const deleteNotification = (notif) => {
    usersCollection.doc(user.id).update({
      notification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  //listen to user response :
  useEffect(() => {
    // console.log("new notif ...", isMuted);
    // console.log("remoteStreamremoteStream notif ...", remoteStream);

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
        case "voicecall response":
          (async () => await roomsCollection.doc(roomRef).update({ audio: "" }))();
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
      <Image source={{ uri: remotePic }} style={{ flex: 1, width: null }} />
      {localStream ?
        <View style={styles.inputremote}>
          <RTCView style={{ height: '0%', width: 0 }} streamURL={localStream && localStream.toURL()} />
        </View>
        :
        null
      }
      {remoteStream ?
        <View style={styles.inputremote} >
          <RTCView style={{ height: '0%', width: 0 }} streamURL={remoteStream && remoteStream.toURL()} />
        </View> :
        null
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
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

            {/* <View style={styles.icon}>
              {isMuted == false ?
                <TouchableOpacity title={`Mute stream`} onPress={toggleMute} disabled={!remoteStream}>
                  <SvgXml xml={unmute} />
                </TouchableOpacity>
                :
                <TouchableOpacity title={`Unmute stream`} onPress={toggleMute} disabled={!remoteStream}>
                  <SvgXml xml={mute} />
                </TouchableOpacity>
              }
            </View> */}

            <View style={styles.icon}>
              {isSpeaker == false ?
                <TouchableOpacity title={`Mute stream`} onPress={togglespeaker} disabled={!remoteStream}>
                  <SvgXml xml={silent} />
                </TouchableOpacity>
                :
                <TouchableOpacity title={`Unmute stream`} onPress={togglespeaker} disabled={!remoteStream}>
                  <SvgXml xml={volume} />
                </TouchableOpacity>
              }
            </View>
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

export default Voicecall;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    width: 0,
    height: 0,
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
    paddingHorizontal: 30,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
