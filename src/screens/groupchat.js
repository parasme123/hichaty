import React, { useState, useContext, useEffect, useRef } from 'react';
import { StyleSheet, Keyboard, Text, View, TouchableOpacity, SafeAreaView, Platform, Image, Dimensions, TextInput, FlatList, Button, StatusBar } from 'react-native';
import Avatar1 from '../components/avatarchat';
import { back } from '../assets/changethemeicons';
import { activegroup, group } from '../assets/tabicons';
import { bluechat, videocall, phonecall, exitgroup, bluechat1 } from '../assets/cardicons';
import { SvgXml } from 'react-native-svg';
import { more, block, clear, del1, chat } from '../assets/cardicons';
import { document, camera, gallery, contactuser } from '../assets/chaticons';
import LinearGradient from 'react-native-linear-gradient';
import { Avatar } from 'react-native-elements';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import firestore from '@react-native-firebase/firestore';
import AppContext from '../context/AppContext';
const messagesCollection = firestore().collection('messages');
const roomsCollection = firestore().collection('rooms');
import EmojiSelector, { Categories } from "react-native-emoji-selector";
const windowWidth = Dimensions.get('screen').width;

const Groupchat = ({ navigation, route }) => {

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

  var _menu1 = null;
  const setMenuRef1 = (ref1) => {
    _menu1 = ref1;
  };

  const hideMenu1 = () => {
    _menu1.hide();
  };

  const showMenu1 = () => {
    _menu1.show();
  };
  const flatListRef = useRef();
  const { roomRef, BackHandel } = route.params;
  const [messages, setMessages] = useState([])
  const [roomDetails, setRoomDetails] = useState([]);
  const [textMessage, setTextMessage] = useState(null);
  const { user, users } = useContext(AppContext);
  const [Keyboardword, setKeyboardword] = useState(false);
  const [shortHeight, setshortHeight] = useState(0);
  const [EmojyData, setEmojyData] = useState(false);

  const changeMapToObject = (key, value) => {
    return { id: key, ...value };
  }

  const getMessages = () => {
    messagesCollection
      .doc(roomRef)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists) {
          let msgs = documentSnapshot.data();
          setMessages([...Object.entries(msgs).map(([key, value]) => changeMapToObject(key, value))].sort((a, b) => a.createdAt < b.createdAt))
        }
      })
  }

  const getRoomDetails = () => {
    roomsCollection.doc(roomRef)
      .onSnapshot(documentSnapshot => {
        setRoomDetails({ ...documentSnapshot.data() })
      })
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

    getRoomDetails();
    getMessages();
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
  const gotoEmojyDismiss = () => {
    Keyboard.dismiss()
    setEmojyData(false)
  }
  const gotoSendEmojy = () => {
    Keyboard.dismiss()
    setEmojyData(true)
  }
  const SendEmojy = (emoji) => {
    Keyboard.dismiss()
    if (emoji.length > 0) {
      postMessage(emoji)
      setEmojyData(false)
    }
  }

  const postMessage = (emoji) => {
    let messagetext = emoji ? emoji : textMessage
    setEmojyData(false)
    const data = {
      [`message ${messages.length + 1}`]:
      {
        createdAt: firestore.FieldValue.serverTimestamp(),
        read: true,
        room: roomRef,
        text: messagetext,
        name: user.name,
        userId: user.id
      }
    }
    messagesCollection.doc(roomRef).set(data, { merge: true });
    setTextMessage(null);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar translucent={true} />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: StatusBar.currentHeight,
            backgroundColor: 'white',
            width: '100%',
          }}>
          <TouchableOpacity onPress={() => BackHandel == true ? navigation.navigate('Group') : navigation.goBack()}>
            <SvgXml
              xml={back}
              style={{ marginRight: 20, marginLeft: 9 }}
            />
          </TouchableOpacity>

          <Avatar1 />
          <Text numberOfLines={1} style={{ width: 40, marginLeft: 10, marginRight: 5, fontSize: 13 }}>{roomDetails.name ? roomDetails.name : "HiChaty"}</Text>
          <View style={styles.icons}>
            <View style={styles.users}>
              <SvgXml xml={activegroup} />
              <Text style={styles.text}>{roomDetails.participants && roomDetails.participants.length}</Text>
            </View>
            <TouchableOpacity style={styles.subtext}>
              <SvgXml xml={bluechat1} />
              <Text style={styles.texticonblue}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('groupcall')}
              style={styles.subtext}>
              <SvgXml
                xml={phonecall}
              />
              <Text style={styles.texticon}>Audio Call</Text>
            </TouchableOpacity>
            <View>
              <Menu
                ref={setMenuRef1}
                button={
                  <View style={styles.subtext}>
                    <SvgXml xml={more} onPress={showMenu1} />
                    <Text style={styles.texticon}>More</Text>
                  </View>
                }>
                <MenuItem onPress={hideMenu1}>
                  <View style={styles.ictext}>
                    <SvgXml xml={block} />
                    <Text style={styles.textred}> Block</Text>
                  </View>
                </MenuItem>
                <View style={{ borderBottomWidth: 1 }} />
                <MenuItem onPress={hideMenu1}>
                  <View style={styles.ictext}>
                    <SvgXml xml={del1} />
                    <Text style={styles.textred}> Delete</Text>
                  </View>
                </MenuItem>
                <View style={{ borderBottomWidth: 1 }} />
                <MenuItem onPress={hideMenu1}>
                  <View style={styles.ictext}>
                    <SvgXml xml={exitgroup} />
                    <Text style={styles.textred}> Exit Group</Text>
                  </View>
                </MenuItem>
              </Menu>
            </View>
          </View>
        </View>
        {messages && messages.length > 0 ?
          <FlatList
            showsVerticalScrollIndicator={false}
            inverted={true}
            style={styles.list}
            data={messages}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
            extraData={messages}
            ref={flatListRef}
            // onContentSizeChange={() => flatListRef?.current?.scrollToEnd()} // scroll end 
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={(message) => {
              console.log(item);
              const item = message.item;
              let inMessage = item.userId !== user.id;
              let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
              return (
                <View style={{ flex: 1 }}>
                  <View style={inMessage ? styles.row : styles.reverse}>
                    <Avatar
                      rounded
                      containerStyle={inMessage ? styles.avatar1 : styles.avatar2}
                      source={{ uri: 'https://i.stack.imgur.com/uoVWQ.png' }}
                      size={30}
                    />
                    <LinearGradient
                      colors={
                        inMessage
                          ? ['#F2853E', '#F77E52', '#FD7668']
                          : ['#3591C3', '#52A4DF', '#6AB4F7']
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
                          {item.name}
                        </Text>
                        <Text style={inMessage ? styles.timeleft : styles.time}>
                          {item.createdAt && String(item.createdAt.toDate()).split(' ')[4].substr(0, 5)}
                        </Text>
                      </View>
                      <View style={[styles.balloon]}>
                        <Text style={styles.textmessage}>{item.text}</Text>
                      </View>
                    </LinearGradient>
                  </View>
                </View>
              );
            }}
          />
          : <View style={{ flex: 1 }} />
        }
        {EmojyData &&
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
              onChange={event => setTextMessage(event.nativeEvent.text)}
              value={textMessage}
              onFocus={() => {setEmojyData(false)}}
            />
            <TouchableOpacity onPress={() => EmojyData == true ? gotoEmojyDismiss() : gotoSendEmojy()} style={{ padding: 10, marginHorizontal: 5, }}>
              <Image style={{ height: 20, width: 20, resizeMode: "contain" }}
                source={require("../assets/emojy.png")} />
            </TouchableOpacity>

            <View style={{ flexDirection: 'row' }}>
              <Menu
                ref={setMenuRef}
                style={{ borderRadius: 15 }}
                button={
                  <View style={styles.subtext}>
                    <SvgXml xml={more} onPress={showMenu} />
                  </View>
                }>
                <View>
                  <MenuItem onPress={hideMenu} style={{ borderRadius: 15 }}>
                    <View style={styles.ictext1}>
                      <SvgXml xml={camera} />
                      <SvgXml xml={gallery} />
                      <SvgXml xml={document} />
                      <SvgXml xml={contactuser} />
                    </View>
                  </MenuItem>
                </View>
              </Menu>
            </View>
            <TouchableOpacity style={styles.btnSend} onPress={() => textMessage == null ? null : postMessage()}>
              <Text style={styles.send}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Groupchat;

const styles = StyleSheet.create({
  icons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '61%',
    marginLeft: 3,
    marginRight: 8,
    flex: 1,
    flexGrow: 7
  },
  texticon: {
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
    fontSize: 11,
  },
  subtext: {
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
    fontSize: 11,
  },
  texticonblue: {
    fontSize: 12,
    textAlign: 'center',
    color: '#53A8CB',
    fontSize: 11,
  },
  textred: {
    color: 'red',
  },
  ictext: {
    // width: -10,
    flexDirection: 'row',
    alignContent: 'flex-start',
    alignSelf: 'flex-start',
    borderBottomColor: 'black',
  },
  users: {
    alignItems: 'center',
    backgroundColor: '#53A8CB',
    flexDirection: 'row',
    paddingHorizontal: 9,
    paddingVertical: 5,
    justifyContent: 'space-between',
    marginRight: 5,
    borderRadius: 6,
  },
  text: {
    fontSize: 12,
    marginLeft: 7,
    color: 'white',

  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 16,
  },
  textStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  ictext1: {
    flexDirection: 'row',
    width: 130,
    justifyContent: 'space-around',
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    // flexDirection: 'row',
    // height: 60,
    // paddingHorizontal: 10,
    // padding: 5,
    // marginBottom: 5,


    flexDirection: 'row',
    height: 60,
    width: '100%',
    paddingHorizontal: 10,
    padding: 5,

    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // flexDirection: 'row',
    // height: 60,
    // width: '100%',
    // paddingHorizontal: 10,
    // padding: 5,
    // marginBottom: 4
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
    marginRight: 8,
    marginBottom: 2,
    color: '#fff',
    fontSize: 11,
  },
  timeleft: {
    alignSelf: 'flex-start',
    marginTop: 5,
    marginLeft: 8,
    color: '#fff',
    fontSize: 11,
  },
  name: {
    alignSelf: 'flex-end',
    fontSize: 12,
    marginRight: 4,
    paddingTop: 4,
    color: '#fff',
  },
  nameleft: {
    alignSelf: 'flex-start',
    fontSize: 12,
    marginLeft: 4,
    marginTop: 4,
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
    paddingTop: 7,
    paddingHorizontal: 8,
  },
  textmessage: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'flex-end'
  },
  itemright: {
    marginVertical: 10,
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: '#47525D',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingBottom: 5,
    paddingTop: 7,
    paddingHorizontal: 8,
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
  avatar: {
    backgroundColor: '#2F91C9',
    padding: 10,
    height: '100%',
    alignItems: 'center',
    paddingBottom: '4%',
  },
  avatar1: {
    marginTop: 13,
    marginRight: 10,
  },
  avatar2: {
    marginTop: 13,
    marginLeft: 10,
  },
  row: {
    flexDirection: 'row',
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
});
