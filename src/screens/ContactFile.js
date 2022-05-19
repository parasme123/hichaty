import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  StyleSheet, PermissionsAndroid, ActivityIndicator, FlatList, Text,
  View, Keyboard,
  ScrollView, TextInput, RefreshControl, TouchableOpacity, DeviceEventEmitter
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
import { SectionGrid } from 'react-native-super-grid';
import Avatar from '../components/avatar';
import { sync } from '../assets/loginsignupIcons';
import { SvgXml } from 'react-native-svg';
import admob, { BannerAd } from '@react-native-firebase/admob';
import Icon from 'react-native-vector-icons/Ionicons';

const adUnitId = __DEV__ ? "ca-app-pub-8577795871405921/7203667321" : 'ca-app-pub-8577795871405921/7203667321';
const usersCollection = firestore().collection('users');
const roomsCollection = firestore().collection('rooms');
let fcmUnsubscribe = null;

const ContactFile = ({ navigation, route }) => {
  const { user, users, setUsers, setModalChatContact, notifications, setNotifications,
    setModalVideoInvitation, setModalAudioInvitation,
    myUnreadMessages, redirectToContacts, setRedirectToContacts,
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

  let startpage = 0
  // const {  setBlockedUsers } = useContext(AppContext);
  const nativeAdRef = useRef();
  const [desiredChat, setDesiredChat] = useState(desiredChat);

  const [mainArray, setmainArray] = useState(users);
  const [showArray, setshowArray] = useState([])
  const [totalPage, settotalPage] = useState(0);
  const [perPageRecord, setperPageRecord] = useState(10);
  const [currentPage, setcurrentPage] = useState(0);
  const [showLoaderPageing, setshowLoaderPageing] = useState(false);
  const [isRefreshing, setisRefreshing] = useState(false);
  const [seKeyword, setKeyword] = useState(false);
  const [SearchData, setSearchData] = useState(users)



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

  const sendInvitation = (routeName, id, name) => {
    console.log('-----sendInvitation:' + routeName, id, name)
    setTarget({ id, name });
    setDesiredChat(routeName);
    setModalChatInvitation(true);
  }
  useEffect(() => {
    console.log(users, 'users>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    setTimeout(() => {
      getContractHistory()
    }, 1500);
  }, [])

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

  useEffect(() => {
    fcmUnsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new Message arrived to Contacts screen -- > : " + JSON.stringify(remoteMessage));
      // setReceiverId()
      var val = remoteMessage.data.senderId;
      console.log(val, 'val>>>>>>>>>>>>>>>>>>>>>>');
      // var index = users.findIndex(function (item, i) {
      //   return item.id === val
      // });

      // let tempUsers = users;
      // var element = tempUsers[index];
      // tempUsers.splice(index, 1);
      // tempUsers.splice(0, 0, element);
      // // console.log("-------------------> : " + index);
      // // console.log("--------------NEW Data-----> : " + JSON.stringify(tempUsers));
      // setShowUsers(tempUsers)


      let data = remoteMessage.data;
      let type = data.msgType;
      console.log('data>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> :' + data)
      console.log('type>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> :' + type)
      switch (type) {
        case "new invitation":
          setTarget({ id: data.senderId, name: data.senderName });
          setDesiredChat(data.desiredChat);
          setModalChatContact(true);
          break;
        case "invitation accepted":
          setTarget({ id: data.senderId, name: data.senderName, pic: data.senderPicture });
          setDesiredChat(data.desiredChat);
          setRoomRef(data.roomRef);
          setCode(data.code);
          setModalChatCodeReceived(true);
          break;
      }
    })
    return fcmUnsubscribe;
  }, [users])




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
          console.log("from constacts", "voicecall");
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
      console.log("---loaded" + data);

    } else {
      console.log("---loaded");

    }
  }

  const getContractHistory = () => {
    let ads = { isTemp: true }
    mainArray.map((e, i) => {
      if ((i + 1) % 5 == 0) {
        mainArray.splice(i, 0, ads);
      }
    });
    console.log(mainArray.length, "mainArray.length");
    console.log(mainArray, "mainArray");

    let totalPagec = Math.ceil((mainArray.length) / perPageRecord);
    console.log("PPPPPPPPPPPPPPPPPPPPPPPPPPP", totalPagec);
    settotalPage(totalPagec);
    // mainArray.push(mainArray);
    setmainArray(mainArray)
    setshowLoaderPageing(false);
    setisRefreshing(false)


  }
  const onScroll = () => {
    console.log(totalPage, "---here----- bottom", currentPage);
    console.log(showLoaderPageing == false, "showLoaderPageing == false");
    console.log(currentPage < totalPage, "currentPage < totalPage");
    setisRefreshing(false)
    if (showLoaderPageing == false && currentPage < totalPage) {
      setshowLoaderPageing(true)
      console.log("scroll test>>>>>>>>>>>>>>>>");

      let addItem = mainArray.length - currentPage * perPageRecord
      let mainArraycopy = [...mainArray]
      let newArray = [...showArray, ...mainArraycopy.splice(currentPage * perPageRecord, addItem > perPageRecord ? perPageRecord : addItem)];
      setshowArray(newArray)
      setcurrentPage(currentPage + 1)
      setTimeout(() => {
        setshowLoaderPageing(false)
      }, 400);

    }
  }
  const render_Activity_footer = () => {
    // console.log("yes")
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
    // setshowArray([]);
    // if (!showArray[0] && isRefreshing) {
    //   onScroll();
    // }
    // if (totalPage != 0) {
    //   onScroll();
    // }
    // getContractHistory()
  }


  const renderGridItem = ({ item, index, rowIndex }) => {

    if (!item?.isTemp) {
      return (
        <View style={{ flex: 1, backgroundColor: 'blue' }}>
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
        </View>


      )
    } else {
      return (
        <View style={{ flex: 1, width: 180, height: 225, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', }}>
          <BannerAd
            unitId={adUnitId}
            size={"180x225"}
            requestOptions={{
              requestNonPersonalizedAdsOnly: false,
            }}
            onAdFailedToLoad={onAdFailedToLoad}

          />
        </View>
      )
    }
  }






  const serachArray = ({ item, index, rowIndex }) => {
    return (
      <View style={{ flex: 1, backgroundColor: 'red' }}>
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
      </View>

    )


  }





  const gosetting = () => {
    navigation.navigate('changetheme', { id: user && user.id })
  }
  const gotoSearch = (search1) => {
    if (search1.length > 0) {
      setshowArray([])
      let showSecond = []
      let lowercasedFilter = search1.toLowerCase();
      console.log(lowercasedFilter, 'lowercasedFilter');
      showSecond = SearchData.filter((item) => {
        if (item && item.name && (item.name.toLowerCase()).startsWith(lowercasedFilter)) {
          if (item.name) {
            showSecond.push(item)
            setSearchData(showSecond)
            console.log("item", item);
          }
        } else {
          console.log("kkk");
        }

      })

    } else {
      console.log(search1, "search11111");
      setSearchData([])
      setKeyword(false)
      setcurrentPage(0)

    }


  }

  const gotoContactList = () => {
    navigation.navigate('ContactList')
  }



  const showKeywordsearch = () => {
    setKeyword(true)
    console.log("kkk>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  }

  return (

    <View style={styles.container}>

      <View style={styles.container1} >
        <Avatar setting={() => { gosetting() }} />
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000" />
          {seKeyword == true ?
            <TextInput
              style={styles.input}
              placeholder="Search"
              onChangeText={(value) => {
                setSearch(value)
                gotoSearch(value)
              }}
              underlineColorAndroid="transparent"
              value={search}
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
        {showArray.length > 0 && seKeyword == false ?
          <SectionGrid
            itemDimension={150}
            sections={[{ data: showArray }]}
            style={{ flex: 1, width: "100%", height: "100%" }}
            renderItem={renderGridItem}
            extraData={showArray}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            onEndReached={onScroll}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => showLoaderPageing == true && render_Activity_footer()}
          // refreshControl={
          //   <RefreshControl
          //     tintColor={"blue"}
          //     refreshing={isRefreshing}
          //     onRefresh={() => onRefresh()}
          //   />
          // }
          />
          : SearchData.length > 0 && seKeyword == true ?
            <SectionGrid
              itemDimension={150}
              sections={[{ data: SearchData }]}
              style={{ flex: 1, width: "100%", height: "100%" }}
              renderItem={serachArray}
              showsVerticalScrollIndicator={false}

            />
            :
            <View style={{ flex: 1, position: 'absolute', zIndex: 1, alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%" }}>
              <ActivityIndicator size="large" color="blue" />
            </View>
        }

      </View>

      {target && <ModalChatInvitation target={target} setVisible={setModalChatInvitation} visible={modalChatInvitation} desiredChat={desiredChat} />}
      {target && <ModalChatCodeGen target={target} setVisible={setModalChatCodeGen} visible={modalChatCodeGen} desiredChat={desiredChat} />}
      {target && <ModalChatCodeReceived target={target} setVisible={setModalChatCodeReceived} visible={modalChatCodeReceveid} navigate={navigation.navigate} desiredChat={desiredChat} code={code} roomRef={roomRef} />}
      {target && <ModalChatContact target={target} navigate={navigation.navigate} desiredChat={desiredChat} actualRouteName={"Contacts"} changeModal={setModalChatCodeGen} />}
      {targetvideo && <ModalVideoCall roomRef={videoroomref} remotePeerName={targetvideo.name} remotePeerId={targetvideo.id} remotePic={targetvideo.picture} navigation={navigation} />}
      {targetaudio && <ModalAudioCall roomRef={audioroomref} remotePeerName={targetaudio.name} remotePeerId={targetaudio.id} remotePic={targetaudio.picture} navigation={navigation} />}

    </View>
  );
};

export default ContactFile;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container1: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center', justifyContent: 'center'
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
    borderWidth: 1,
    marginTop: 7,
    marginBottom: 7,
    borderRadius: 4,
    height: 36,
    marginHorizontal: 10,
    paddingHorizontal: 2,
    width: '100%'
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
