import React, { useCallback, useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Platform, TextInput, FlatList, Button, Dimensions, Keyboard, DeviceEventEmitter, SafeAreaView, Linking, Modal } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { more, block, clear, del1 } from '../assets/cardicons';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/chatheader';
import { Avatar } from 'react-native-elements';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { document, camera, gallery, contactuser, mute } from '../assets/chaticons';
import firestore from '@react-native-firebase/firestore';
import AppContext from '../context/AppContext';
import { firebase } from '@react-native-firebase/functions';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalChatContact from '../components/modalChatContact';
import ModalVideoCall from '../components/modalVideoinvitation';
import ModalAudioCall from '../components/modalAudioinvitation';
import messaging from '@react-native-firebase/messaging';
const windowWidth = Dimensions.get('screen').width;
const usersCollection = firestore().collection('users');
const messagesCollection = firestore().collection('messages');
const historyCollection = firestore().collection('history');
import storage from '@react-native-firebase/storage';
import { Icon } from 'native-base';

let fcmUnsubscribe = null;
let getMessages = null;
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { alert } from '../assets/tabicons';
import CameraController from '../lib/CameraController';

const Chat = ({ navigation, route }) => {

  const { roomRef, remotePeerName, remotePeerId, remotePic, tokens } = route.params;
  const [messages, setMessages] = useState([])
  const [textMessage, setTextMessage] = useState(null);
  const { user, myUnreadMessages, setMyUnreadMessages, notifications, setModalChatContact,
    setNotifications, setModalVideoInvitation, setModalAudioInvitation,
  } = useContext(AppContext);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [target, setTarget] = useState(null);
  const [targetvideo, setTargetvideo] = useState(null);
  const [targetaudio, setTargetaudio] = useState(null);
  const [videoroomref, setVideoroomref] = useState(null);
  const [audioroomref, setAudioroomref] = useState(null);
  const [desiredChat, setDesiredChat] = useState();
  const [EmojyData, setEmojyData] = useState(false);
  const [EmojyIcon, setEmojyIcon] = useState(null);
  const [startTime, setStartTime] = useState(new Date());
  const [Keyboardword, setKeyboardword] = useState(false);
  const [shortHeight, setshortHeight] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const flatListRef = useRef();

  const changeMapToObject = (key, value) => {
    if (value.read === false && value.userId === remotePeerId) {
      setUnreadMessages({ ...unreadMessages, [key]: { ...value, read: true } });
    }
    return { id: key, ...value, };
  }


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow.bind(this),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide.bind(this),
    );

    getMessages =
      messagesCollection
        .doc(roomRef)
        .onSnapshot((documentSnapshot) => {
          //console.log("i'm here, chat");
          AsyncStorage.setItem("@unreadMessages", JSON.stringify({ ...myUnreadMessages, [remotePeerId]: 0 }))
            .then(() => setMyUnreadMessages({ ...myUnreadMessages, [remotePeerId]: 0 }));

          if (documentSnapshot.exists) {
            let msgs = documentSnapshot.data()
            msgs = [...Object.entries(msgs).map(([key, value]) => changeMapToObject(key, value))];
            setMessages(msgs.sort((a, b) => a.createdAt < b.createdAt));
            setStartTime(new Date());

          }
        })
    return getMessages;
  }, [])
  const _keyboardDidShow = (e) => {
    // setStatedata({ shortHeight: Platform.OS == 'android' ? 0 : e.endCoordinates.height });
    setKeyboardword(true)
    setshortHeight(Platform.OS == 'android' ? 0 : e.endCoordinates.height)
  }

  const _keyboardDidHide = (e) => {
    // setStatedata({ shortHeight: 0 });
    setKeyboardword(false)
    setshortHeight(0)

  }
  useFocusEffect(
    useCallback(() => {
      //console.log(Object.keys(unreadMessages).length , 'hola');
      if (Object.keys(unreadMessages).length !== 0) {
        let data;
        const ref = messagesCollection.doc(roomRef);
        messagesCollection.doc(roomRef).update({ ...unreadMessages }).catch(e => console.log("Error", e))
      }
    }, [unreadMessages])
  )

  const postMessage = (emoji) => {
    let messagetext = emoji ? emoji : textMessage
    console.log(messagetext);
    setEmojyData(false)
    const data = {
      [`message ${messages.length + 1}`]:
      {
        createdAt: firestore.Timestamp.now(),
        read: false,
        room: roomRef,
        text: messagetext,
        userId: user.id
      }
    }
    messagesCollection.doc(roomRef).set(data, { merge: true });
    // console.log({
    //   tokens: tokens,
    //   senderId: user.id,
    //   receiverId: remotePeerId,
    //   message: messagetext,
    //   roomRef: roomRef,
    // })
    firebase.functions().httpsCallable('onNewMessage')({
      senderId: user.id,
      senderName: user.name,
      receiverId: remotePeerId,
      message: messagetext,
      roomRef: roomRef,

    })
    setTextMessage(null);
    const historydata =
    {
      date: firestore.Timestamp.now(),
      // duration: (new Date() - startTime) / 1000,
      duration: 0,
      type: 'chat'
    }
    if (messagetext.length > 0) {
      historyCollection.doc(roomRef)
        .set({ [`${user.id}`]: firestore.FieldValue.arrayUnion(historydata), chat: 0, room: roomRef }, { merge: true })
        .catch(e => console.log(e, 'from history'));
    }
  }

  // useEffect(() => {
  // console.log('unreadMessages', unreadMessages);
  // console.log('myUnreadMessages', myUnreadMessages);
  // }, [unreadMessages])

  var _menu = null;
  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const hideMenu = () => {
    _menu.hide();
  };

  const showMenu = () => {
    _menu.show();
    setEmojyData(false)

  };

  const navigateTo = (routeName) => {
    navigation.navigate(routeName, { roomRef, remotePeerName, remotePeerId, remotePic, type: 'caller' })
  }

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
  const gotoSendEmojy = () => {
    Keyboard.dismiss()
    setEmojyData(true)
  }
  const gotoEmojyDismiss = () => {
    Keyboard.dismiss()
    setEmojyData(false)
  }
  const SendEmojy = (emoji) => {
    Keyboard.dismiss()
    if (emoji.length > 0) {
      postMessage(emoji)
      setEmojyData(false)
    }
  }

  const gotoHomePage = () => {
    DeviceEventEmitter.emit('GotoHomePage', {});
    // setTimeout(() => {
    //   navigation.navigate('bottom')

    // }, 200);
  }
  // console.log(JSON.stringify(navigation.canGoBack()), "remotePic");
  const gotoattachmentFile = () => {
    setEmojyData(false)
    CameraController.attachmentFile((response) => {
      console.log("file response : ", response);
      if (response.path) {
        (async () => await uploadImage(response))();
      }
    });
  }

  const uploadImage = async (photo) => {
    let filetype = "";
    if (photo.mime.includes("image")) {
      filetype = "imageFirebaseUser"
    } else {
      filetype = "FileFirebaseUser"
    }
    // let finalImageUrl = roomRef + "-" + filetype + "-" + firestore.Timestamp.now()
    let photoUri = photo.path;
    const filename = filetype + "-" + photoUri.substring(photoUri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri;
    // console.log('uploadUri', uploadUri)
    const task = storage()
      .ref(`Chat-Images/${filename}`)
      .putFile(uploadUri);
    // set progress state
    task.on('state_changed',
      snapshot => {
        // setTransferred(
        //   Math.round(snapshot.bytesTransferred / snapshot.totalBytes)
        // );
      },
      error => {
        console.log('error', error);
        setError({ message: 'Something went wrong, please try again ' })
      },
      () => {
        console.log('ref', task.snapshot.ref.path);
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('URL', url);
          setTextMessage(url);
          postMessage(url);
        })
      }
    );
    try {
      await task;
    } catch (e) {
      console.error(e);
    }
    // setPicture(`Profile-Images/${filename}`);
    // setAvatar(`Profile-Images/${filename}`);
    // setPhoto(null);
    // setModalVisible0(false)
  }

  const handleOpenLinkInBrowser = (url) => {
    Linking.openURL(url);
  }

  const handleOpenLinkInModal = (url) => {
    setImageUrl(url)
    setImageModalVisible(true);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => setImageModalVisible(false)} style={{ alignSelf: 'flex-end', marginBottom: 20, padding: 5, paddingHorizontal: 20 }}>
            <Text style={{ color: 'white', fontSize: 30 }}>X</Text>
          </TouchableOpacity>
          <View style={{
            // display: 'flex',
            // position: 'absolute',
            flex: 1,
            padding: 15,
            // paddingVertical: 10,
            // backgroundColor: 'white',
            width: '100%',
            alignContent: 'center',
            // marginVertical: 200,
            borderRadius: 15,
            paddingTop: 10,
            // alignSelf: 'center',
            alignItems: 'center',
            justifyContent:'center'
          }}>
            <Image style={{ height: 400, width: '100%', resizeMode: "cover" }}
              source={{ uri: imageUrl }} />
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <Header
          // back={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('bottom')}
          back={() => navigation.canGoBack() ? gotoHomePage() : navigation.navigate('bottom')}
          voicecall={() => navigateTo('voicecall')}
          videocall={() => navigateTo('videocall')}
          remotePic={remotePic}
          roomRef={roomRef}
          setMessages={setMessages}
        />
        {user && !!messages && messages.length > 0 ?
          <FlatList
            ref={flatListRef}
            // onContentSizeChange={() => setTimeout(() => flatListRef?.current?.scrollToEnd(), 200)} // scroll end  
            // contentContainerStyle={{flex:1}}
            showsVerticalScrollIndicator={false}
            inverted={true}
            style={styles.list}
            data={messages}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
            keyExtractor={(item) => {
              return item.id;
            }}
            // keyExtractor={(item, index) => index.toString()}
            extraData={messages}
            renderItem={(message) => {
              if (message && message.item) {
                const item = message.item;
                let inMessage = item.userId !== user.id;
                let read = item.read;
                let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
                return (
                  <View>
                    <View style={inMessage ? styles.row : styles.reverse}>
                      <Avatar
                        rounded
                        containerStyle={inMessage ? styles.avatar1 : styles.avatar2}
                        source={!inMessage ? user.picture ? { uri: user.picture } : require("../assets/appicon.png") : remotePic ? { uri: remotePic } : require("../assets/appicon.png")}
                        size={30}
                      />
                      <LinearGradient
                        colors={
                          inMessage
                            ? ['#3591C3', '#52A4DF', '#6AB4F7']
                            : !read ? ['rgba(242, 133, 62, 0.6)', 'rgba(247, 126, 82, 0.6)'] : ['#F2853E', '#F77E52', '#FD7668']
                        }
                        style={
                          inMessage
                            ? [styles.item, itemStyle]
                            : [styles.itemright, itemStyle]
                        }>
                        <View
                          style={
                            inMessage ? styles.nameanddate : styles.nameanddateright
                          }>
                          <Text style={inMessage ? styles.nameleft : styles.name}>
                            {item.userId === user.id ? user.name : remotePeerName}
                          </Text>
                          <Text style={inMessage ? styles.timeleft : styles.time}>
                            {item.createdAt.toDate().toString().split(' ')[4].substring(0, 5)}
                          </Text>
                        </View>
                        <View style={[styles.balloon]}>
                          {
                            item.text?.includes("imageFirebaseUser") ? (
                              <TouchableOpacity onPress={() => handleOpenLinkInModal(item.text)}>
                                <Image style={{ height: 200, width: 200, resizeMode: "cover" }}
                                  source={{ uri: item.text }} />
                              </TouchableOpacity>
                            ) : item.text?.includes("FileFirebaseUser") ? (
                              <TouchableOpacity onPress={() => handleOpenLinkInBrowser(item.text)}>
                                <Icon style={{ fontSize: 100, color: 'white' }}
                                  name="download" />
                              </TouchableOpacity>
                            ) : (
                              <Text style={styles.textmessage}>{item.text}</Text>
                            )
                          }

                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                );
              }
            }
            }
          />
          : <View style={{ flex: 1 }} />
        }
        {
          EmojyData &&
          <View style={{ height: "40%", marginBottom: 60, width: windowWidth }}>
            < EmojiSelector
              category={Categories.emotion}
              onEmojiSelected={emoji => SendEmojy(emoji)}
              showSearchBar={true}
              columns={12}
            />
          </View>


        }
        <View style={[styles.footer, { marginBottom: shortHeight }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Type here..."
              underlineColorAndroid="transparent"
              value={textMessage}
              onChange={(event) => setTextMessage(event.nativeEvent.text)}
              onFocus={() => { setEmojyData(false) }}
            />
            <TouchableOpacity onPress={() => EmojyData == true ? gotoEmojyDismiss() : gotoSendEmojy()} style={{ padding: 10, marginHorizontal: 5, }}>
              <Image style={{ height: 20, width: 20, resizeMode: "contain" }}
                source={require("../assets/emojy.png")} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { gotoattachmentFile() }} style={{ padding: 10, }}>
              <Image style={{ height: 20, width: 20, resizeMode: "contain" }}
                source={require("../assets/attachment.png")} />
            </TouchableOpacity>
            {/* <View style={{ flexDirection: 'row' }}>
              <Menu
                ref={setMenuRef}
                style={{ borderRadius: 15 }}
                button={
                  <View style={styles.subtext}>
                    <SvgXml xml={more} onPress={showMenu} />
                  </View>
                }>
                <View style={{ borderRadius: 12 }}>
                  <MenuItem onPress={hideMenu} style={{ borderRadius: 12 }}>
                    <View style={styles.ictext}>
                      <SvgXml xml={camera} />
                      <SvgXml xml={gallery} />
                      <SvgXml xml={document} />
                      <SvgXml xml={contactuser} />
                    </View>
                  </MenuItem>
                </View>
              </Menu>

            </View> */}
            <TouchableOpacity style={styles.btnSend} onPress={() => textMessage == null ? null : postMessage()}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        {target && <ModalChatContact target={target} navigate={navigation.navigate} desiredChat={desiredChat} actualRouteName={"Group"} />}
        {targetvideo && <ModalVideoCall roomRef={videoroomref} remotePeerName={targetvideo.name} remotePeerId={targetvideo.id} remotePic={targetvideo.picture} navigation={navigation} />}
        {targetaudio && <ModalAudioCall roomRef={audioroomref} remotePeerName={targetaudio.name} remotePeerId={targetaudio.id} remotePic={targetaudio.picture} navigation={navigation} />}
      </View >
    </SafeAreaView >

  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    // paddingBottom: 10,
  },
  list: {
    // flex:1,
    paddingHorizontal: 17,
    // backgroundColor:'red'
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    flexDirection: 'row',
    height: 60,
    width: '100%',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    width: 80,
    height: 40,
    paddingRight: 10,
    paddingLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    fontSize: 17,
  },
  inputContainer: {
    borderColor: 'black',
    borderWidth: 1,
    height: 48,
    width: '100%',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
    fontSize: 16,
  },
  more: {
    marginRight: 5,
  },
  balloon: {
    display: 'flex',
    alignItems: 'flex-end',
    maxWidth: 250,
    paddingBottom: 7,
    paddingHorizontal: 6,
  },
  itemIn: {
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
  },
  time: {
    alignSelf: 'flex-end',
    fontSize: 12,
    marginRight: 8,
    marginBottom: 2,
    color: '#fff',
  },
  timeleft: {
    alignSelf: 'flex-start',
    marginTop: 5,
    fontSize: 12,
    marginLeft: 8,
    color: '#fff',
  },
  name: {
    alignSelf: 'flex-end',
    fontSize: 17,
    marginRight: 4,
    paddingTop: 4,
    color: '#fff',
  },
  nameleft: {
    alignSelf: 'flex-start',
    fontSize: 17,
    marginLeft: 4,
    color: '#fff',
  },
  item: {
    marginVertical: 10,
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: '#164664',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingBottom: 5,
    paddingTop: 9,
    paddingHorizontal: 8
  },
  textmessage: {
    color: 'white',
    fontSize: 16,
  },
  itemright: {
    marginVertical: 10,
    flexDirection: 'column',
    backgroundColor: '#47525D',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingBottom: 5,
    paddingTop: 7,
    paddingHorizontal: 8
  },
  send: {
    fontSize: 16,
    color: '#24516D',
    fontWeight: 'bold',
  },
  nameanddate: {
    display: 'flex',
    flexDirection: 'row',
  },
  nameanddateright: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  avatar1: {
    marginTop: 15,
    marginRight: 10
  },
  avatar2: {
    marginTop: 15,
    marginLeft: 10
  },
  row: {
    flexDirection: 'row'
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
  ictext: {
    flexDirection: 'row',
    width: 140,
    justifyContent: 'space-around'
  },
});
