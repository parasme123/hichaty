import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, TextInput, Image, TouchableOpacity } from 'react-native';
import { Card, CardItem, Text } from 'native-base';
import image from '../assets/bg.jpg';
import {
  phonecall,
  phoneactive,
  videocall,
  videoactive,
  more,
  chat,
  block,
  del1,
  clear,
  lockicon,
  chatactive
} from '../assets/cardicons';
import { SvgXml } from 'react-native-svg';
import { pasword } from '../assets/loginsignupIcons';
import { history } from '../assets/tabicons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';

const historyCollection = firestore().collection('history');
const roomsCollection = firestore().collection('rooms');

const Cardset = (props) => {
  // console.log(props, "propspropsprops>>>>>");
  const { colour, user, navigate } = useContext(AppContext);
  const [lastVideo, setLastVideo] = useState(null);
  const [lastAudio, setLastAudio] = useState(null);
  const [lastChat, setLastChat] = useState(null);

  const [roomRef, setRoomRef] = useState(null);
  const [chatclick, setChatclick] = useState(false);
  const [audioclick, setAudioclick] = useState(false);
  const [videoclick, setVideoclick] = useState(false);


  var _menu = null;

  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const hideMenu = () => {
    _menu.hide();
  };

  const showMenu = () => {
    _menu.show();
  };

  useEffect(() => {
    //console.log(props.unreadmsgs);
  }, [])

  useEffect(() => {
    roomsCollection
      .where("participants", "in", [[user.id, props.number], [props.number, user.id]])
      .get()
      .then(querySnapshot => {
        //console.log('roomRef, her2', querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {

          //console.log('roomRef', documentSnapshot.id);
          setRoomRef(documentSnapshot.id);

        })
      })

  }, [])

  useEffect(() => {
    if (roomRef) {
      historyCollection.doc(roomRef)
        .onSnapshot(documentSnapshot => {
          //console.log('im here, holi')
          if (documentSnapshot.exists) {
            if (documentSnapshot.data() && documentSnapshot.data()[props.number]) {
              let data = documentSnapshot.data()[props.number];
              let lastCall = data && data[data.length - 1];
              //console.log(lastCall, 'yooooo')
              lastCall && lastCall.type === 'video' ?
                setLastVideo(lastCall&&lastCall.date.toDate().toString().split(' ')[4].substring(0, 5))
                : lastCall && lastCall.type === 'audio' ?
                  setLastAudio(lastCall&&lastCall.date.toDate().toString().split(' ')[4].substring(0, 5))
                  :
                  setLastChat(lastCall&&lastCall.date.toDate().toString().split(' ')[4].substring(0, 5))

            }
          }
        })
    }
  }, [roomRef])

  const navigateToChat = () => {
    props.navigate("chat", { roomRef, remotePeerName: props.name, remotePeerId: props.number, remotePic: props.picture })
  }
  const chatClick = () => {
    setChatclick(true)
    setAudioclick(false)
    setVideoclick(false)
  }
  const audioClick = () => {
    setChatclick(false)
    setAudioclick(true)
    setVideoclick(false)
  }
  const videoClick = () => {
    setChatclick(false)
    setAudioclick(false)
    setVideoclick(true)
  }
  return (
    <View>
      {props.name ? <View style={styles.card}>
        <View style={props.online ? styles.isOnline : styles.isOffline} />
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={props.block ? props.showmodal : null}>
          <Card>
            <CardItem cardBody >
              <Image
                // source={props.picture ? { uri: props.picture } : image}
                source={props.picture ? { uri: props.picture } : require("../assets/appicon.png")}
                style={styles.imagse} />
              {/* </View> */}
              {props.block ? (
                <View style={styles.shadow}>
                  <View style={styles.locktext}>
                    <SvgXml xml={lockicon} style={styles.lock} />
                    <Text style={styles.text}>Lock</Text>
                  </View>
                </View>
              ) : null}
              <View style={styles.opacity}>
                {/* <View></View> */}
                <Text numberOfLines={1} style={styles.heading} onPress={props.block ? null : props.blockuser}>{props.name}</Text>
                <Text numberOfLines={1} style={styles.subtext}>{props.status}</Text>
              </View>
              {/* </TouchableOpacity> */}
            </CardItem>

            <CardItem cardBody>
              <View style={styles.icons}>
                {/* <TouchableOpacity onPress={() => navigateToChat()}
                underlayColor={colour[0]} style={styles.icon} >
                <SvgXml xml={chat} />
              </TouchableOpacity> */}

                <TouchableOpacity
                  onPress={() => navigateToChat()}
                  onPressIn={() => { chatClick() }}
                  underlayColor={colour[0]} style={styles.icon} >
                  {chatclick ?
                    <SvgXml xml={chatactive} />
                    :
                    <SvgXml xml={chat} />
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={props.phone}
                  onPressIn={() => { audioClick() }}
                  underlayColor={colour[0]} style={styles.icon}>
                  {lastAudio ?
                    <View style={{ ...styles.unreadchat }}>
                      {audioclick ?
                        <SvgXml xml={phoneactive} />
                        :
                        <SvgXml xml={phonecall} />
                      }
                      <Text style={{ fontSize: 10 }} >{lastAudio}</Text>
                    </View>
                    :
                    audioclick ?
                      <SvgXml xml={phoneactive} style={{ width: '100%' }} />
                      :
                      <SvgXml xml={phonecall} style={{ width: '100%' }} />
                  }
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={props.video}
                  onPressIn={() => { videoClick() }}
                  underlayColor={colour[0]} style={styles.icon}>
                  {lastVideo ?
                    <View style={{ ...styles.unreadchat, }}>
                      {videoclick ?
                        <SvgXml xml={videoactive} />
                        :
                        <SvgXml xml={videocall} />
                      }
                      <Text style={{ fontSize: 10 }}>{lastVideo}</Text>
                    </View>
                    :
                    videoclick ?
                      <SvgXml xml={videoactive} style={{ width: '100%' }} />
                      :
                      <SvgXml xml={videocall} style={{ width: '100%' }} />

                  }
                </TouchableOpacity>
                <Menu
                  ref={setMenuRef}
                  button={<SvgXml xml={more} style={styles.icon} onPress={props.block ? null : showMenu} />}>
                  <MenuItem onPress={hideMenu}>
                    <View style={styles.ictext}>
                      <SvgXml xml={block} />
                      <Text style={styles.textred}>Block</Text>
                    </View>
                  </MenuItem>
                  <View style={{ borderBottomWidth: 1 }} />
                  <MenuItem onPress={hideMenu}>
                    <View style={styles.ictext}>
                      <SvgXml xml={clear} />
                      <Text style={styles.textred}>Clear</Text>
                    </View>
                  </MenuItem>
                  <View style={{ borderBottomWidth: 1 }} />
                  <MenuItem onPress={hideMenu}>
                    <View style={styles.ictext}>
                      <SvgXml xml={del1} />
                      <Text style={styles.textred}>Delete</Text>
                    </View>
                  </MenuItem>
                  <View style={{ borderBottomWidth: 1 }} />
                  <MenuItem onPress={() => props.navigate('historyitem', { roomRef, id: props.number, picture: props.picture, name: props.name })} >
                    <View style={styles.ictext}>
                      <SvgXml xml={history} />
                      <Text style={{ ...styles.textred, color: '#81d4f4' }}>All history</Text>
                    </View>
                  </MenuItem>
                </Menu>
              </View>
            </CardItem>
          </Card>
        </TouchableOpacity>
      </View>
        : null}
    </View>

  );
}

export default Cardset;

const styles = StyleSheet.create({
  card: {
    marginVertical: -2,
  },
  isOnline: {
    width: 20,
    height: 20,
    zIndex: 1,
    backgroundColor: 'green',
    position: 'absolute',
    top: 0,
    right: -2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  isOffline: {
    width: 20,
    height: 20,
    zIndex: 1,
    backgroundColor: 'gray',
    position: 'absolute',
    top: 0,
    right: -2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white'
  },
  unreadchat: {
    width: '90%',
    height: '90%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  overlay: {
    backgroundColor: 'black',
    position: 'absolute',
  },
  shadow: {
    backgroundColor: '#61615Faa',
    width: '100%',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    height: '100%',
  },
  imagse: {
    height: 180,
    width: null,
    flex: 1,
  },
  locktext: {
    position: 'absolute',
    left: '42%',
    top: '30%',
    alignContent: 'center',
    alignItems: 'center',
    color: 'white'
  },
  text: {
    color: 'white',
    fontSize: 15,
  },
  opacity: {
    backgroundColor: '#000000aa',
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    width: '100%',
    alignItems: 'center',
    opacity: 0.8,
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 45,
    width: '100%'
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '200%',
  },
  heading: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  subtext: {
    fontSize: 12,
    color: 'white',
    paddingBottom: 6,
    lineHeight: 14,
    width: '97%',
    textAlign: 'center'
  },
  textred: {
    color: 'red',
  },
  ictext: {
    flexDirection: 'row',
    borderBottomColor: 'black',
  },
});
