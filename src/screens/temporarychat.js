import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  Modal,
  Keyboard,
  Dimensions,
  SafeAreaView, Platform, Linking
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { more } from '../assets/cardicons';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { document, camera, gallery, contactuser } from '../assets/chaticons';
import AppContext from '../context/AppContext';

import Header from '../components/headerback';
import firestore from '@react-native-firebase/firestore';
const messagesCollection = firestore().collection('messages');
const usersCollection = firestore().collection('users');
const windowWidth = Dimensions.get('screen').width;
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { dateDiff } from '../lib/helpers';
import CameraController from '../lib/CameraController';
import storage from '@react-native-firebase/storage';
import { Icon } from 'native-base';

const Temporary = ({ navigation, route }) => {

  const [secondes, setSecondes] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [hours, setHours] = useState(null);
  const { roomRef, remotePeerName, remotePeerId } = route.params;
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState(null);
  const { user, users, teamChatContacts } = useContext(AppContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [teamChatDetails, setTeamChatDetails] = useState(null);
  const [timesUp, setTimesUp] = useState(false);
  const [EmojyData, setEmojyData] = useState(false);
  const [TimeDataAll, setTimeDataAll] = useState();
  const [TimeDuracation, setTimeDuracation] = useState();
  const [contactId, setcontactId] = useState();
  const flatListRef = useRef();
  const [Keyboardword, setKeyboardword] = useState(false);
  const [shortHeight, setshortHeight] = useState(0);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

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

  useEffect(() => {
    getMessages();
  }, [])



  // useEffect(() => {
  //   console.log("yessssss");
  //   const teamChatDetails = teamChatContacts.filter(contact => contact.contactId === remotePeerId);
  //   console.log(teamChatDetails, "teamChatDetailsteamChatDetails");
  //   if (teamChatDetails.length > 0) {
  //     setTeamChatDetails(teamChatDetails[0]);
  //     let { duration, startTime } = teamChatDetails[0];
  //     console.log(duration, "duration");
  //     console.log(startTime, "startTime");
  //     duration = duration.split("h:");
  //     startTime = startTime.split(":");
  //     let str = duration;
  //     console.log(str, "str");
  //     let document;
  //     document = str[1].slice(0, -3);
  //     str[1] = document;
  //     str[2] = "00"
  //     console.log("strrrr>>>>>>>>>>>>>>>>>>>>>", str)
  //     // console.log(document, "documentdocumentdocument");
  //     console.log(startTime, "startTimedddddddd");
  //     const duration_Secondes = Number(str[0]) * 3600 + Number(str[1]) * 60 + Number(str[2]);
  //     console.log(duration_Secondes, "duration_Secondes");
  //     const durationLeft = duration_Secondes - calculateTimeLeft(startTime);
  //     console.log(durationLeft, "durationLeft");

  //     if (durationLeft < 0) {
  //       setModalVisible(true);
  //       usersCollection.doc(user.id).update({
  //         teamChatContact: firestore.FieldValue.arrayRemove(teamChatDetails[0]),
  //         groups: firestore.FieldValue.arrayRemove(roomRef)
  //       })
  //       setTimeout(() => navigation.navigate('bottom'), 1000)
  //     }
  //     let secondes = durationLeft % 60;
  //     let minutes = ((durationLeft - secondes) / 60) % 60;
  //     let hours = (((durationLeft - secondes) / 60) - minutes) / 60;
  //     const arr = [secondes, minutes, hours];
  //     console.log('s', secondes)
  //     console.log('m', minutes)
  //     console.log('h', hours)
  //     setHours(hours);
  //     setMinutes(minutes);
  //     setSecondes(secondes);
  //   }
  // }, [teamChatContacts])

  // const calculateTimeLeft = (startTime) => {
  //   const actualTime = String(firestore.Timestamp.now().toDate()).split(' ')[4].split(":");
  //   let actualTime_Secondes = Number(actualTime[0]) * 3600 + Number(actualTime[1]) * 60 + Number(actualTime[2]);
  //   let startTime_Secondes = Number(startTime[0]) * 3600 + Number(startTime[1]) * 60 + Number(startTime[2]);
  //   return actualTime_Secondes - startTime_Secondes;
  // }

  const removeTempChatOnTimeUp = () => {
    const chatWithData = users.filter(data => data.id == remotePeerId);
    const currentChatData = chatWithData[0].teamChatContact.filter(data => data.contactId == user.id);

    const teamChatDetails = teamChatContacts.filter(contact => contact.contactId === remotePeerId);
    usersCollection.doc(user.id).update({
      teamChatContact: firestore.FieldValue.arrayRemove(teamChatDetails[0]),
      groups: firestore.FieldValue.arrayRemove(roomRef)
    })
    usersCollection.doc(remotePeerId).update({
      teamChatContact: firestore.FieldValue.arrayRemove(currentChatData[0]),
      groups: firestore.FieldValue.arrayRemove(roomRef)
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



    const teamChatDetails = teamChatContacts.filter(contact => contact.contactId === remotePeerId);
    // console.log("teamChatDetailsteamChatDetails", teamChatContacts);
    if (teamChatDetails.length > 0) {
      // console.log("yessssss");
      setTeamChatDetails(teamChatDetails[0]);
      let { duration, startTime, contactId } = teamChatDetails[0];
      setcontactId(contactId)
      setTimeDataAll(startTime)

      const durationLeft = calculateTimeLeft(startTime, duration);
      const setDataTime = formatTimeCounteDown(durationLeft)
      setTimeDuracation(setDataTime)

      if (durationLeft < 0 || durationLeft == undefined || durationLeft == NaN) {
        setModalVisible(true);
        removeTempChatOnTimeUp();
        setTimeout(() => navigation.navigate('bottom'), 1000)
      }
      let secondes = durationLeft % 60;
      let minutes = ((durationLeft - secondes) / 60) % 60;
      let hours = (((durationLeft - secondes) / 60) - minutes) / 60;
      const arr = [secondes, minutes, hours];
      console.log('s', secondes)
      console.log('m', minutes)
      console.log('h', hours)
      setHours(hours);
      setMinutes(minutes);
      setSecondes(secondes);
      if (hours == NaN || minutes == NaN || secondes == NaN) {
        console.log("all time NAN");
        setModalVisible(true);
        removeTempChatOnTimeUp();
        setTimeout(() => navigation.navigate('bottom'), 1000)
      }

    }
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
  const formatTimeCounteDown = (timer) => {
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)
    if (timer == NaN) {
      return ` ${"00"}h:${"00"}min`
    } else {
      return ` ${getHours}h:${getMinutes}min`

    }
  }
  const calculateTimeLeft = (startTime, duration) => {
    const actualTime = Number(firestore.Timestamp.now().toMillis());
    let totalTime = dateDiff(startTime, actualTime);
    let totalDurationHours = duration.split("h:")[0];
    let totalDurationMinutes = duration.split("h:")[1].slice(0, -3);
    let totalDuration = (totalDurationHours * 60 * 60) + (totalDurationMinutes * 60);
    let remainingTime = totalDuration - totalTime;
    // console.warn("remainingTime : ", remainingTime);
    return remainingTime;
    // const actualTime = Number(firestore.Timestamp.now().toMillis());
    // let actualTime_Secondes = actualTime;
    // let startTime_Secondes = Number(startTime);
    // let total = (duration_Secondes * 1000) + startTime_Secondes
    // if (Number(total - actualTime_Secondes) > 0) {
    //   return Number(total - actualTime_Secondes)
    // }
  }
  useEffect(() => {
    const Countdown = () => {
      // console.log(secondes, minutes, hours, "secondes, minutes, hours")
      if (secondes > 0) {
        setSecondes(secondes - 1)
        // perSecondHit()
      }
      else if (secondes === 0) {
        if (minutes > 0) {
          setMinutes(minutes - 1);
          setSecondes(59);
          // perSecondHit()
        } else {
          if (hours > 0) {
            setHours(hours - 1);
            setMinutes(59);
            setSecondes(59)
            // perSecondHit()
          }
          else {
            setModalVisible(true);
            setTimesUp(true);
            removeTempChatOnTimeUp();
            clearTimeout(Countdown, 1000);
            setTimeout(() => navigation.navigate('bottom'), 1000)
          }
        }
      }
    }
    if (minutes !== null && hours !== null) {
      setTimeout(Countdown, 1000);
    }

  }, [secondes])


  const perSecondHit = () => {
    var teamChatContactForMe = [];
    usersCollection.doc(user.id).get().then(async querySnapshot => {
      teamChatContactForMe = await querySnapshot.data().teamChatContact.filter((chat) => {
        return chat.contactId !== contactId;
      })

    }).then(() => {
      usersCollection.doc(user.id).update({
        teamChatContact: [...teamChatContactForMe, {
          contactId: contactId,
          duration: TimeDuracation,
          startTime: TimeDataAll
        }]

      })

    })

    var teamChatContactForMe1 = [];
    usersCollection.doc(contactId).get().then(async querySnapshot => {
      teamChatContactForMe1 = await querySnapshot.data().teamChatContact.filter((chat) => {
        return chat.contactId !== user.id;
      })

    })
      .then(() => {
        usersCollection.doc(contactId).update({
          teamChatContact: [...teamChatContactForMe1, {
            contactId: user.id,
            duration: TimeDuracation,
            startTime: TimeDataAll
          }]

        })

      })

  }

  useEffect(() => {
    // console.log(roomRef);
    if (timesUp) {
      usersCollection.doc(user.id).update({
        teamChatContact: firestore.FieldValue.arrayRemove(teamChatDetails),
        groups: firestore.FieldValue.arrayRemove(roomRef)
      })
    }
  }, [timesUp])

  const postMessage = (emoji) => {
    setEmojyData(false)
    const data = {
      [`message ${messages.length + 1} `]:
      {
        createdAt: firestore.Timestamp.now(),
        read: true,
        room: roomRef,
        text: emoji ? emoji : textMessage,
        userId: user.id
      }
    }
    messagesCollection.doc(roomRef).set(data, { merge: true });
    setTextMessage(null);
  }


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

  const gotoattachmentFile = () => {
    setEmojyData(false)
    CameraController.attachmentFile((response) => {
      if (response.path) {
        (async () => await uploadImage(response))();
      }
    });
  }

  const gotoattachmentImages = () => {
    setEmojyData(false)
    CameraController.open((response) => {
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
    console.log('uploadUri', uploadUri)
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

      <View style={styles.container}>
        <Header
          comment="Quite Mode"
          typetime="timer"
          timeLeft={{ secondes, minutes, hours }}
          back={() => navigation.goBack()}
        />
        {user && !!messages && messages.length > 0 &&
          <FlatList
            ref={flatListRef}
            // onContentSizeChange={() => flatListRef?.current?.scrollToEnd()} // scroll end  
            showsVerticalScrollIndicator={false}
            inverted={true}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
            extraData={messages}
            style={styles.list}
            data={messages}
            keyExtractor={(item) => {
              return item.id;
            }}
            renderItem={(message) => {
              // console.log('item', message.item);
              const item = message.item;
              let inMessage = item.userId !== user.id;
              let itemStyle = inMessage ? styles.itemIn : styles.itemOut;
              return (
                <View>
                  <View
                    style={
                      inMessage ? styles.nameanddate : styles.nameanddateright
                    }>
                    <Text style={inMessage ? styles.nameleft : styles.name}>
                      {item.userId === user.id ? user.name : remotePeerName}
                    </Text>
                    <Text style={inMessage ? styles.timeleft : styles.time}>
                      {/* {item && item.createdAt && item.createdAt.split(' ')[4]} */}
                    </Text>
                  </View>
                  <View
                    style={
                      inMessage
                        ? [styles.item, itemStyle]
                        : [styles.itemright, itemStyle]
                    }>
                    <View style={[styles.balloon]}>
                      {/* Add by Tarachand */}
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
                      {/* Add by Tarachand */}

                      {/* <Text style={styles.textmessage}>{item.text}</Text> */}
                    </View>
                  </View>
                </View>
              );
            }}
          />
        }
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible}>
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={styles.modal}>
              <Text style={styles.modalheading}>Time's up</Text>
            </View>
          </View>
        </Modal>
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
              justifyContent: 'center'
            }}>
              <Image style={{ height: 400, width: '100%', resizeMode: "cover" }}
                source={{ uri: imageUrl }} />
            </View>
          </View>
        </Modal>


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
              placeholder="Write a message..."
              underlineColorAndroid="transparent"
              onChange={(event) => setTextMessage(event.nativeEvent.text)}
              value={textMessage}
              onFocus={() => { setEmojyData(false) }}
            />
            {/* <SvgXml xml={more} style={styles.more}/> */}

            <TouchableOpacity onPress={() => EmojyData == true ? gotoEmojyDismiss() : gotoSendEmojy()} style={{ padding: 10, marginHorizontal: 5, }}>
              <Image style={{ height: 20, width: 20, resizeMode: "contain" }}
                source={require("../assets/emojy.png")} />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => { gotoattachmentFile() }} style={{ padding: 10, }}>
              <Image style={{ height: 20, width: 20, resizeMode: "contain" }}
                source={require("../assets/attachment.png")} />
            </TouchableOpacity> */}
            <View style={{ flexDirection: 'row' }}>
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
                      {/* <SvgXml xml={camera} /> */}
                      <SvgXml xml={gallery} onPress={() => { gotoattachmentImages() }} />
                      <SvgXml xml={document} onPress={() => { gotoattachmentFile() }} />
                      {/* <SvgXml xml={contactuser} /> */}
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

export default Temporary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingBottom: 60,
  },
  ictext: {
    flexDirection: 'row',
    width: 140,
    justifyContent: 'space-around'
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
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
    maxWidth: windowWidth - 150,
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
    color: '#000',
  },
  name: {
    alignSelf: 'flex-end',
    fontSize: 17,
    marginRight: 4,
    paddingTop: 4,
    color: '#000',
  },
  nameleft: {
    alignSelf: 'flex-start',
    fontSize: 17,
    marginLeft: 4,
    color: '#000',
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#164664',
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingBottom: 5,
    paddingTop: 7,
    paddingHorizontal: 8
  },
  textmessage: {
    color: 'white',
    fontSize: 16,
  },
  itemright: {
    marginVertical: 14,
    flex: 1,
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
    // display: 'flex',
    flexDirection: 'row',
    alignSelf:'flex-start',
    maxWidth: windowWidth - 150,
  },
  nameanddateright: {
    flexDirection:'row',
    alignSelf:'flex-end',
    maxWidth: windowWidth - 150,
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
    borderRadius: 15,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  modaltext: {
    textAlign: 'center',
    width: '70%',
    marginBottom: 15,
  },
  modalheading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 45,
    borderRadius: 5,
    marginTop: 3,
    paddingLeft: 5,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#53A8CB',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#53A8CB',
    borderWidth: 2,
    width: '100%',
    marginTop: 15,
    borderRadius: 5,
  },
  buttontext: {
    color: 'white',
    fontSize: 16,
  },
});
