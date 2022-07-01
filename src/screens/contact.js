import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Modal,
  ImageBackground,
  StyleSheet, PermissionsAndroid, ActivityIndicator, Image, Text,
  View, Keyboard,
  TextInput, RefreshControl, TouchableOpacity, Share, DeviceEventEmitter, SafeAreaView, Dimensions
} from 'react-native';
import Card from '../components/card';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
import messaging from "@react-native-firebase/messaging";
import ModalChatContact from '../components/modalChatContact';
import ModalVideoCall from '../components/modalVideoinvitation';
import ModalAudioCall from '../components/modalAudioinvitation';
import ModalChatInvitation from '../components/modalChatInvitation';
import ModalChatCodeGen from '../components/modalChatCodeGen';
import ModalChatCodeReceived from '../components/modalChatCodeReceveid';
import ModalChatRequestAccept from '../components/modalChatRequestAccept';
import { SectionGrid } from 'react-native-super-grid';
import Avatar from '../components/avatar';
import { sync } from '../assets/loginsignupIcons';
import { SvgXml } from 'react-native-svg';
import admob, { BannerAd } from '@react-native-firebase/admob';
import Icon from 'react-native-vector-icons/Ionicons';
import Contacts from 'react-native-contacts';
import AsyncStorageHelper from '../lib/AsyncStorageHelper'
import { firebase } from '@react-native-firebase/functions';
import Swiper from 'react-native-swiper'
// const adUnitId = __DEV__ ? "ca-app-pub-8577795871405921~3929184022" : "ca-app-pub-8577795871405921~3929184022";
const adUnitId = __DEV__ ? "ca-app-pub-8577795871405921/7203667321" : "ca-app-pub-8577795871405921/7203667321";

const usersCollection = firestore().collection('users');
const roomsCollection = firestore().collection('rooms');
let fcmUnsubscribe = null;
const { width, height } = Dimensions.get('window')

const contact = ({ navigation, route }) => {
  const { comeFromNotification, user, users, contacts, setModalChatContact, notifications, setNotifications,
    setModalVideoInvitation, setModalAudioInvitation, setTeamChatContacts,
    myUnreadMessages, redirectToContacts, setRedirectToContacts, teamChatContacts, teamChatNotifications
  } = useContext(AppContext)

  const [modalChatInvitation, setModalChatInvitation] = useState(false);
  const [modalChatCodeGen, setModalChatCodeGen] = useState(false);
  const [modalChatCodeReceveid, setModalChatCodeReceived] = useState(false);
  const [roomRef, setRoomRef] = useState(null);
  const [code, setCode] = useState(null);
  const [videoroomref, setVideoroomref] = useState(null);
  const [audioroomref, setAudioroomref] = useState(null);
  const [target, setTarget] = useState(null);
  const [targetvideo, setTargetvideo] = useState(null);
  const [targetaudio, setTargetaudio] = useState(null);
  const [search, setSearch] = useState("");
  const nativeAdRef = useRef();
  const [desiredChat, setDesiredChat] = useState(desiredChat);

  const [mainArray, setmainArray] = useState(users);
  const [showArray, setshowArray] = useState([])
  const [contactList, setcontactList] = useState(contacts)
  const [totalPage, settotalPage] = useState(0);
  const [perPageRecord, setperPageRecord] = useState(10);
  const [currentPage, setcurrentPage] = useState(0);
  const [showLoaderPageing, setshowLoaderPageing] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [seKeyword, setKeyword] = useState(false);
  const [searchlist, setsearchList] = useState([])
  const [ContactStatus, setContactStatus] = useState(false);

  // ADD by TARACHAND
  const [modalVisible2, setModalVisible2] = useState(false);
  const [submitttCode, setSubmitCode] = useState(null)
  const [notificationcode, setNotificationcode] = useState("6")
  const [ClearNotification, setClearNotification] = useState(false)
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [durationset, setDuration] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [updateSoonModal, setUpdateSoonModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const response = await AsyncStorageHelper.getData("tutorial");
      if (response == null) {
        setShowTutorial(true)
      }
    }
    fetchData();
  }, [])
  useEffect(() => {
    if (teamChatNotifications.length > 0) {
      let lastTempNotif = teamChatNotifications[0];
      setNotificationcode(lastTempNotif.codeConfirmation)
      switch (lastTempNotif.type) {
        case "code":
          setTarget(lastTempNotif);
          setModalVisible2(true);
          setDuration(lastTempNotif.duration)
          break;
      }
    }
  }, [teamChatNotifications])

  // useEffect(() => {
  //   if (ClearNotification == true) {
  //     gotoClearChatNotification();
  //   }
  // }, [ClearNotification])

  // const gotoClearChatNotification = () => {
  //   if (teamChatNotifications.length > 0) {
  //     // setNotificationcode(lastTempNotif.codeConfirmation)
  //     setTeamChatContacts([]);
  //   }
  // }

  const submitCode = async () => {
    if (submitttCode == null || submitttCode == "") {
      alert("Enter your code.")
    } else if (submitttCode != notificationcode) {
      alert("User password and enter password do not match.")
    } else {
      setLoadingSubmit(true);
      if (target && target.id) {
        const docRef = await roomsCollection.add({
          participants: [user.id, target.id],
          temporary: true,
          audio: {
            answer: "",
            from: "",
            offer: "",
            step: "",
            type: "leave"
          },
          video: {
            answer: "",
            from: "",
            offer: "",
            step: "",
            type: "leave"
          }
        });
        let batch = firestore().batch();
        const userRef = usersCollection.doc(user.id);
        batch.update(userRef, {
          groups:
            firestore.FieldValue.arrayUnion(`/rooms/${docRef.id}`),
          teamChatContact:
            firestore.FieldValue.arrayUnion({ contactId: target.id, duration: durationset, startTime: Number(firestore.Timestamp.now().toMillis()) }),
          teamChatNotification:
            firestore.FieldValue.arrayRemove(teamChatNotifications[0])
        })

        const targetRef = usersCollection.doc(target.id);
        targetRef.update({
          teamChatContact:
            firestore.FieldValue.arrayUnion({ type: "temporary room", roomRef: docRef.id, contactId: user.id, duration: durationset, startTime: Number(firestore.Timestamp.now().toMillis()) })
        })

        firebase.functions().httpsCallable('onNewQuiteResponse')({
          senderId: user.id,
          senderName: user.name,
          receiverId: target.id,
          desiredChat: "Temchat",
          roomRef: docRef.id
        })

        batch.commit()
          .then(() => console.log('submitted successfully ...'))
          .then(() => {
            setLoadingSubmit(false);
            setModalVisible2(false);
            navigation.navigate('temporary', { roomRef: docRef.id, remotePeerName: target.name, remotePeerId: target.id })
            setClearNotification(true)
          })
      }

    }

  }

  // ADD by TARACHAND

  const navigateTo = async (routeName, target) => {
    let roomRef;
    let groupsOfRemotePeer = target.groups;
    let sharedGroups = user.groups.filter(group => groupsOfRemotePeer.includes(group));
    console.log("user.groups : ", user.groups);
    console.log("target.groups : ", target.groups);
    console.log("sharedGroups : ", sharedGroups);
    if (sharedGroups.length == 1) {
      roomRef = sharedGroups[0].split('/')[2];
    }
    else {
      // navigation.navigate(routeName, { roomRef, remotePeerName: target.name, remotePeerId: target.id, remotePic: target.picture, type: 'caller' })
      sharedGroups.forEach(group => group.split('/')[2]);
      const querySnapshot = await roomsCollection.where(firebase.firestore.FieldPath.documentId(), "in", sharedGroups).get();
      let doc = querySnapshot.filter(documentSnapshot => documentSnapshot.participants.length === 2)[0];
      roomRef = doc.id;

    }
    navigation.navigate(routeName, { roomRef, remotePeerName: target.name, remotePeerId: target.id, remotePic: target.picture, type: 'caller' })
  }

  const sendInvitation = (routeName, id, name) => {
    // console.log('-----sendInvitation:' + routeName, id, name)
    setTarget({ id, name });
    setDesiredChat(routeName);
    setModalChatInvitation(true);
    // console.log(";;;;;;;");
  }
  const [data, setData] = useState("");



  useEffect(() => {
    // console.log(users, "users>>>>>>>>>>>>>>>>>");

    let subscription = DeviceEventEmitter.addListener("GotoHomePage", (event) => { gotoReloade() })
    AsyncStorageHelper.getData("Contact_Status").then((responseData) => {
      if (responseData) {
        setContactStatus(true)
      }
    })
    if (users !== [] && users.length > 0 && ContactStatus !== true) {
      getFirstTimedata(users);
    }
    else if (ContactStatus == true) {
      let arrUserAndContact = [...users, ...contacts]
      getFirstTimedata(arrUserAndContact);
    } else {
    }

    return () => {
      subscription.remove();

    }
  }, [users])

  const gotoReloade = () => {
    AsyncStorageHelper.getData("Contact_Status").then((responseData) => {
      if (responseData) {
        setContactStatus(true)
      }
    })
    if (users !== [] && users.length > 0 && ContactStatus !== true) {
      getFirstTimedata(users);
    }
    else if (ContactStatus == true) {
      let arrUserAndContact = [...users, ...contacts]
      getFirstTimedata(arrUserAndContact);
    } else {
    }

    if (totalPage !== 0) {
      onScroll();
    }
    if (!showArray[0] && isRefreshing) {
      onScroll();
    }
    // console.log("oooo");
    // console.log(users, "sssssssssssssssssssss>>>>>>>>>>>>>>>>>");
    setshowArray(users)
    navigation.navigate('bottom')
  }

  const getFirstTimedata = async (contactlist) => {
    getContractHistory(contactlist)
  }
  useEffect(() => {
    if (totalPage !== 0) {
      onScroll();
    }
  }, [totalPage])

  useEffect(() => {
    if (!showArray[0] && isRefreshing) {
      onScroll();
    }
  }, [showArray])

  const processNotifation = (state, remoteMessage, fromBackground) => {
    var val = remoteMessage.data.senderId;
    let data = remoteMessage.data;
    let type = data.msgType;
    switch (type) {
      case "new invitation":
        if (user.id !== data.senderId) {
          setTarget({ id: data.senderId, name: data.senderName });
          setDesiredChat(data.desiredChat);
          setModalChatContact(true);
        } else {
          console.log("new invitation_second>>>>>>>>>>>>>>>>>>>>>");
        }
        break;
      case "invitation accepted":
        if (user.id !== data.senderId && data.roomRef == "NotConfirmRequest") {
          setTarget({ id: data.senderId, name: data.senderName, pic: data.senderPicture });
          setDesiredChat(data.desiredChat);
          setRoomRef(data.roomRef);
          setCode(data.code);
          setModalChatCodeReceived(true);
        }
        else if (user.id !== data.senderId && data.roomRef != "NotConfirmRequest") {
          setTarget({ id: data.senderId, name: data.senderName, pic: data.senderPicture });
          setDesiredChat(data.desiredChat);
          setRoomRef(data.roomRef);
          navigation.navigate(data.desiredChat, { roomRef: data.roomRef, remotePeerName: data.senderName, remotePeerId: data.senderId, remotePic: data.senderPicture, type: 'caller' })
        }
        break;
    }
  }

  useEffect(() => {
    fcmUnsubscribe = messaging().onMessage(async (remoteMessage) => {
      processNotifation("On Message", remoteMessage, true);
    })
    if (comeFromNotification != null) {
      processNotifation(comeFromNotification.state, comeFromNotification.remoteMessage, comeFromNotification.fromBackground);
    }
    return fcmUnsubscribe;
  }, [])


  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("background state notification on contact screen", remoteMessage.data)
      processNotifation("background state", remoteMessage, true);
    })

    messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log("Quit state notification on contact screen", remoteMessage.data)
          processNotifation("quit state", remoteMessage, true);
        }
      })

  })

  // if not, so he was in another screen and we redirected him , we'll check that 
  // with the redirectToScreens page :
  useEffect(() => {
    if (redirectToContacts) {
      let data = route.params;
      setTarget(data.target);
      setDesiredChat(data.desiredChat);
      setModalChatCodeGen(true);
      setRedirectToContacts(false);
    }
  }, [redirectToContacts])

  // in case of new call arrived -  forground :
  useEffect(() => {
    if (notifications.length > 0) {
      let lastNotif = notifications[0];
      switch (lastNotif.type) {
        case "videocall invitation":
          setVideoroomref(lastNotif.roomRef);
          setModalVideoInvitation(true);
          setTargetvideo(lastNotif);
          break;
        case "voicecall invitation":
          setAudioroomref(lastNotif.roomRef);
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

  const onAdFailedToLoad = (data) => {
    if (data) {
      console.log(data);
    }
    else { }
  }

  const getContractHistory = (arrContactList) => {
    if (arrContactList.length > 0) {
      let ads = { isTemp: true }
      arrContactList.map((e, i) => {
        if ((i + 1) % 5 == 0) {
          arrContactList.splice(i, 0, ads);
        }
      });
      let totalPagec = Math.ceil((arrContactList.length) / perPageRecord);
      settotalPage(totalPagec);
      setmainArray(arrContactList)
      setshowLoaderPageing(false);
      setisRefreshing(false)
    }

  }
  const onScroll = () => {
    setisRefreshing(false)
    if (showLoaderPageing == false && currentPage < totalPage) {
      setshowLoaderPageing(true)
      let addItem = mainArray.length - currentPage * perPageRecord
      let mainArraycopy = [...mainArray]
      let newArray = [...showArray, ...mainArraycopy.splice(currentPage * perPageRecord, addItem > perPageRecord ? perPageRecord : addItem)];
      setshowArray(newArray)
      setcurrentPage(currentPage + 1)
      setTimeout(() => {
        setshowLoaderPageing(false)
      }, 50);

    }

  }
  const render_Activity_footer = () => {
    var footer_View = (
      <View style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', padding: 15 }}>
        <ActivityIndicator size="large" color={"blue"} />
      </View>
    );
    return footer_View;
  };
  const onRefresh = () => {
    setisRefreshing(true)
    setcurrentPage(0);
  }


  const renderGridItem = ({ item, index, rowIndex }) => {
    if (!item?.isTemp) {
      return (
        <Card
          key={item?.key}
          id={item?.id}
          block={item?.block}
          name={item?.id ? item?.name : item?.displayName}
          picture={item?.picture}
          unreadmsgs={myUnreadMessages[item?.id] && myUnreadMessages[item?.id] > 0 ? myUnreadMessages[item?.id] : 0}
          video={() => alert("Update you soon")}
          phone={() => alert("Update you soon")}
          // video={() => item.block == true ? sendInvitation('videocall', item?.key, item?.name) : navigateTo('videocall', item)}
          // phone={() => item.block == true ? sendInvitation('voicecall', item?.key, item?.name) : navigateTo('voicecall', item)}
          chat={() => item.block == true ? sendInvitation('chat', item?.key, item?.name) : navigateTo('chat', item)}
          blockuser={() => navigation.navigate('settheme', { targetId: item?.id, mobile: item?.mobile, name: item?.name, status: item?.status, picture: item?.picture })}
          Invited={() => gotoShareApp()}
          status={item.status}
          UserNameContact={item && item.givenName && item.givenName}

        />


      )
    } else {
      return (
        <View style={{ flex: 1, width: 180, height: 225, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', }}>
          <BannerAd
            unitId={adUnitId}
            size={`${Math.floor(width / 2) - 20}x225`}
            requestOptions={{
              requestNonPersonalizedAdsOnly: false,
            }}
            onAdFailedToLoad={onAdFailedToLoad}
          />
        </View>
      )
    }
  }



  const gotoShareApp = async () => {
    try {
      const result = await Share.share({
        title: 'Hichaty',
        message: 'We request you to all Hichaty users,share with your friends and family.https://hichaty.com/',
        url: 'https://hichaty.com/'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          console.log("result");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("dismissed>>>>>>>>>>>>.");
      }
    } catch (error) {
      alert(error.message);
    }
  };


  const serachArray = ({ item, index, rowIndex }) => {
    return (
      <Card
        key={item?.key}
        id={item?.id}
        block={item?.block}
        name={item?.id ? item?.name : item?.displayName}
        picture={item?.picture}
        unreadmsgs={myUnreadMessages[item?.id] && myUnreadMessages[item?.id] > 0 ? myUnreadMessages[item?.id] : 0}
        video={() => item.block ? sendInvitation('videocall', item?.key, item?.name) : navigateTo('videocall', item)}
        phone={() => item.block ? sendInvitation('voicecall', item?.key, item?.name) : navigateTo('voicecall', item)}
        chat={() => item.block ? sendInvitation('chat', item?.key, item?.name) : navigateTo('chat', item)}
        blockuser={() => navigation.navigate('settheme', { targetId: item?.id, mobile: item?.mobile, name: item?.name, status: item?.status, picture: item?.picture })}
      />

    )


  }

  const gosetting = () => {
    navigation.navigate('changetheme', { id: user && user.id })
  }
  const gotoSearch = (text) => {
    let lowercasedFilter = text.toLowerCase();
    let trucks = users
    let filteredData = trucks.length > 0 && trucks.filter(function (item) {
      return item.name !== undefined
    });
    let filteredDataall = filteredData.filter((item) => {
      return item?.name.includes(text)
    })
    if (!text || text === '') {
      Keyboard.dismiss()
      setsearchList([])
      setKeyword(false)
    }
    else {
      setsearchList(filteredDataall)
    }
  }

  const gotoContactList = () => {
    getContactList();
  }
  const getContactList = async () => {
    if (ContactStatus == true) {
      alert("Already sync your contacts.");

    } else {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      )
        .then(() => Contacts.getAll())
        .then(contacts => {
          setcontactList(contacts)
          setshowLoaderPageing(true)
          let arrUserAndContact = [...mainArray, ...contactList]
          setshowArray(arrUserAndContact)
          AsyncStorageHelper.setData("Contact_Status", "status")
          setTimeout(() => {
            setshowLoaderPageing(false)
          }, 1000);

        }).catch((error) => {
          alert("Contacts not sync please try again.");
        });

    }
  }

  const showKeywordsearch = () => {
    setKeyword(true)
  }
  const userFirstPositionInvitation = (UserId) => {
    var val = UserId;
    var index = mainArray.findIndex(function (item, i) {
      return item.id === val
    });
    let tempUsers = mainArray;
    var element = tempUsers[index];
    tempUsers.splice(index, 1);
    tempUsers.splice(0, 0, element);
    setshowArray(tempUsers)
  }
  const userFirstPositionCodeGen = (UserId) => {
    var val = UserId;
    var index = mainArray.findIndex(function (item, i) {
      return item.id === val
    });
    let tempUsers = mainArray;
    var element = tempUsers[index];
    tempUsers.splice(index, 1);
    tempUsers.splice(0, 0, element);
    setshowArray(tempUsers)
  }

  const slides = [
    {
      key: 1,
      title: '',
      text: '',
      image: require('../assets/tutorial/1.png'),
      backgroundColor: '#59b2ab',
    },
    {
      key: 2,
      title: '',
      text: '',
      image: require('../assets/tutorial/2.png'),
      backgroundColor: '#febe29',
    },
    {
      key: 3,
      title: '',
      text: '',
      image: require('../assets/tutorial/3.png'),
      backgroundColor: '#22bcb5',
    },
    {
      key: 4,
      title: '',
      text: '',
      image: require('../assets/tutorial/4.png'),
      backgroundColor: '#22bcb5',
    },
    {
      key: 5,
      title: '',
      text: '',
      image: require('../assets/tutorial/5.png'),
      backgroundColor: '#22bcb5',
    },
    {
      key: 6,
      title: '',
      text: '',
      image: require('../assets/tutorial/6.png'),
      backgroundColor: '#22bcb5',
    },
    {
      key: 7,
      title: '',
      text: '',
      image: require('../assets/tutorial/7.png'),
      backgroundColor: '#22bcb5',
    },
    {
      key: 8,
      title: '',
      text: '',
      image: require('../assets/tutorial/8.png'),
      backgroundColor: '#22bcb5',
    }
  ];

  const nextHandle = (item) => {
    if (item == slides.length - 1) {
      setTimeout(() => {
        finishHandle();
      }, 4000);
    }
    console.log("item : ", item)
    // setActiveIndex(activeIndex + 1)
  }

  const finishHandle = () => {
    setShowTutorial(false);
    AsyncStorageHelper.setData("tutorial", false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={showTutorial}
        backdrops={true}
      >
        <Swiper style={styles.wrapper} autoplay={true} showsPagination={false} autoplayTimeout={5} loop={false} onIndexChanged={(item) => nextHandle(item)}>
          {
            slides.map((item, index) => {
              return (
                <ImageBackground key={index} style={[styles.slide, index > 5 ? { justifyContent: 'flex-end' } : null]} source={item.image}>
                  {
                    index + 1 == slides.length ? (
                      <TouchableOpacity onPress={() => finishHandle()} style={{ alignSelf: 'flex-end', marginRight: 15, marginBottom: 15 }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Finish</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => finishHandle()} style={{ alignSelf: 'flex-end', marginRight: 15, marginTop: 10, marginBottom: 10 }}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Skip</Text>
                      </TouchableOpacity>
                    )
                  }
                </ImageBackground>
              )
            })
          }
        </Swiper>
      </Modal>
      <View style={styles.container1} >
        <Avatar setting={() => { gosetting() }} />
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000" />
          {seKeyword == true ?
            <TextInput
              style={styles.input}
              placeholder="Search List"
              onChangeText={gotoSearch}
              underlineColorAndroid="transparent"
            />
            :
            <TextInput
              style={styles.input}
              placeholder="Search"
              underlineColorAndroid="transparent"
              onFocus={() => { showKeywordsearch() }}
            />
          }
        </View>
        <TouchableOpacity onPress={() => { gotoContactList() }} >
          <SvgXml xml={sync} style={styles.icon1} />
        </TouchableOpacity>

      </View>
      <View style={[styles.content, { marginBottom: 20 }]}>
        {showArray?.length > 0 && seKeyword == false ?
          <SectionGrid
            itemDimension={150}
            sections={[{ data: showArray }]}
            style={{ flex: 1, width: "100%", height: "100%" }}
            renderItem={renderGridItem}
            showsVerticalScrollIndicator={false}
            onEndReached={onScroll}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => showLoaderPageing && render_Activity_footer()}
            extraData={[{ data: showArray }]}
          // refreshControl={
          //   <RefreshControl
          //     tintColor={"blue"}
          //     refreshing={isRefreshing}
          //     onRefresh={() => onRefresh()}
          //   />
          // }
          />
          : searchlist?.length > 0 && seKeyword == true ?
            <SectionGrid
              itemDimension={150}
              sections={[{ data: searchlist }]}
              style={{ flex: 1, width: "100%", height: "100%" }}
              renderItem={serachArray}
              showsVerticalScrollIndicator={false}
              extraData={[{ data: searchlist }]}

            />
            :
            // <View style={{ flex: 1, position: 'absolute', zIndex: 1, alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%" }}>
            //   <ActivityIndicator size="large" color="blue" />
            //   {/* <Image style={{ width: 35, height: 35 ,resizeMode: "contain" }}
            //     source={require("../assets/loadingbar.gif")} /> */}
            // </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%", position: 'absolute', zIndex: 1 }}>
              <Image style={{ width: 50, height: 50, resizeMode: "contain" }}
                source={require("../assets/loadingbar.gif")} />
            </View>

        }

      </View>
      {/* <Modal
        animationType={'slide'}
        transparent={true}
        visible={updateSoonModal}>
        <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent:'center' }}>
          <View style={styles.modal}>
            <Text style={styles.modalheading}>Update you soon</Text>
          </View>
        </View>
      </Modal> */}

      {target && <ModalChatInvitation target={target} setVisible={setModalChatInvitation} visible={modalChatInvitation} desiredChat={desiredChat} positonItem={(selectUserid) => { userFirstPositionInvitation(selectUserid) }} />}
      {target && <ModalChatCodeGen target={target} setVisible={setModalChatCodeGen} visible={modalChatCodeGen} desiredChat={desiredChat} positonItem1={(selectUserid) => { userFirstPositionCodeGen(selectUserid) }} />}
      {target && <ModalChatCodeReceived target={target} setVisible={setModalChatCodeReceived} visible={modalChatCodeReceveid} navigate={navigation.navigate} desiredChat={desiredChat} code={code} roomRef={roomRef} />}
      {target && <ModalChatContact target={target} navigate={navigation.navigate} desiredChat={desiredChat} actualRouteName={"Contacts"} changeModal={setModalChatCodeGen} />}
      {targetvideo && <ModalVideoCall roomRef={videoroomref} remotePeerName={targetvideo.name} remotePeerId={targetvideo.id} remotePic={targetvideo.picture} navigation={navigation} />}
      {targetaudio && <ModalAudioCall roomRef={audioroomref} remotePeerName={targetaudio.name} remotePeerId={targetaudio.id} remotePic={targetaudio.picture} navigation={navigation} />}

      {/* Add By TaraChand */}

      {target && <ModalChatRequestAccept target={target} setVisible={setModalVisible2} visible={modalVisible2} submitttCode={submitttCode} setSubmitCode={setSubmitCode} submitCode={submitCode} notificationcode={notificationcode} loadingSubmit={loadingSubmit} />}

      {/* Add By Tarachand */}
    </SafeAreaView>
  );
};

export default contact;

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    resizeMode: 'cover',
    // width: '100%', height: '90%'
  },
  text: {
    color: '#333',
    marginTop: 92,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container1: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },

  icon1: {
    marginRight: 12,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 4,
    marginHorizontal: 10,
    paddingHorizontal: 2,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
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
    borderRadius: 10,
    paddingTop: 10,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  modal1: {
    display: 'flex',
    position: 'absolute',
    flex: 1,
    padding: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    width: '70%',
    alignContent: 'center',
    marginVertical: 160,
    borderRadius: 10,
    paddingTop: 20,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  modaltext: {
    textAlign: 'center',
    width: '90%',
    marginVertical: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  modaltextRequest: {
    textAlign: 'center',
    width: '90%',
    marginVertical: 10,
    fontSize: 15,
  },
  buttonset: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    flex: 1,
  },
  buttonno: {
    alignItems: 'center',
    backgroundColor: '#FB5051',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#FB5051',
    borderWidth: 2,
    width: '48%',
    marginTop: 15,
    marginRight: 5,
    borderRadius: 5,
  },
  buttonyes: {
    alignItems: 'center',
    backgroundColor: '#38D744',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#38D744',
    borderWidth: 2,
    width: '48%',
    marginTop: 15,
    marginLeft: 5,
    borderRadius: 5,
  },
  buttontext: {
    color: 'white',
    fontSize: 16,
  },
  buttondone: {
    alignItems: 'center',
    backgroundColor: '#38D744',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#38D744',
    borderWidth: 2,
    width: '100%',
    marginTop: 15,
    borderRadius: 5,
  },

  borderStyleBase: {
    width: 45,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: 'black',
  },

});
