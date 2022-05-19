import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView
} from 'react-native';
import TimePicker from '../components/timePicker';
import Header from '../components/header';
import OtpInputs from 'react-native-otp-inputs';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import Card from '../components/temchatcard';
import { SvgXml } from 'react-native-svg';
import { loading } from '../assets/tabicons';
import { sync } from '../assets/loginsignupIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from '../components/avatar'

// import { Image } from 'native-base';
import { SectionGrid } from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import ModalChatContact from '../components/modalChatContact';
import firestore from '@react-native-firebase/firestore';

const usersCollection = firestore().collection('users');
const roomsCollection = firestore().collection('rooms');

const temchat = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [selectedHours, setSelectedHours] = useState(0);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [codeReceveid, setCodeReceveid] = useState(false);
  const [setup, setSetup] = useState('in progress');
  const { user, users, notifications, teamChatNotifications, setTeamChatContacts, teamChatContacts, teamChatContact, modalChatContact, setModalChatContact } = useContext(AppContext);
  const [roomRef, setRoomRef] = useState(null)
  const [code, setCode] = useState(null)
  const [notificationcode, setNotificationcode] = useState("6")
  const [target, setTarget] = useState(null);
  const [targetContact, setTargetContact] = useState(null);
  const [desiredChat, setDesiredChat] = useState();
  const [searchlist, setsearchList] = useState()
  const [userlist, setuserList] = useState(users)
  const [loadingg, setLoadingg] = useState(false);
  const [loadinggenerate, setLoadingGenerate] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitttCode, setSubmitCode] = useState(null)
  const [durationset, setDuration] = useState(0)
  const [ClearNotification, setClearNotification] = useState(false)




  const checkTeamChatContacts = (target) => {
    // console.log(target, "targettargettarget");
    // console.log('team', teamChatContacts);
    // console.log('roomRef', roomRef)
    if (teamChatContacts.filter(teamchatContact => teamchatContact.contactId === target.id).length > 0) {
      let roomRef;
      roomsCollection
        .where("temporary", "==", true)
        .where("participants", "in", [[user.id, target.key], [target.key, user.id]])
        .get()
        .then(querySnapshot => {
          console.log(querySnapshot.size)
          querySnapshot.forEach(documentSnapshot => {
            roomRef = documentSnapshot.id
          })
        })
        .then(() => {
          navigation.navigate('temporary', { roomRef, remotePeerName: target.name, remotePeerId: target.id })
        })
    } else {
      setModalVisible(true);
      setTarget(target);
    }
  }

  const shareCode = (id, code) => {
    // console.log("code", code);
    if (code == null || code == "") {
      alert("Please enter your code and share.")
    } else {
      setLoadingShare(true)
      // console.log('-----shareCode:' + id);
      let StartEndTime = selectedHours + "h" + ":" + selectedMinutes + "min"
      // console.log({ type: "code", id: user.id, name: user.name, codeConfirmation: code, duration: StartEndTime }, "ddddddddddddddddddddd>>>>>>>>>>>>>>>>>>>>>>>>>");
      usersCollection.doc(id).update({
        teamChatNotification: firestore.FieldValue.arrayUnion({ type: "code", id: user.id, name: user.name, codeConfirmation: code, duration: StartEndTime })
      })
      setTimeout(() => {
        setLoadingShare(false)
        setModalVisible1(false);
      }, 200);
    }
  }

  const submitCode = async () => {
    // console.log(submitttCode, "submitttCode>>>>>>>>>>>>>>");
    // console.log(notificationcode, "notificationcode>>>>>>>>>>>>>>");

    if (submitttCode == null || submitttCode == "") {
      alert("Enter your code.")
    } else if (submitttCode != notificationcode) {
      alert("User password and enter password do not match.")
    } else {
      setLoadingSubmit(true)
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
            // firestore.FieldValue.arrayUnion({ contactId: target.id, duration: durationset, startTime: String(firestore.Timestamp.now().toDate()).split(' ')[4] })
            firestore.FieldValue.arrayUnion({ contactId: target.id, duration: durationset, startTime: Number(firestore.Timestamp.now().toMillis()) })


        })

        const targetRef = usersCollection.doc(target.id);
        targetRef.update({
          teamChatContact:
            // firestore.FieldValue.arrayUnion({ type: "temporary room", roomRef: docRef.id, contactId: user.id, duration: durationset, startTime: String(firestore.Timestamp.now().toDate()).split(' ')[4] })
            firestore.FieldValue.arrayUnion({ type: "temporary room", roomRef: docRef.id, contactId: user.id, duration: durationset, startTime: Number(firestore.Timestamp.now().toMillis()) })

        })
          .then(() => {

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



  useEffect(() => {
    if (teamChatNotifications.length > 0) {
      // console.log('notifications', teamChatNotifications)
      let lastTempNotif = teamChatNotifications[0];
      setNotificationcode(lastTempNotif.codeConfirmation)
      // console.log(lastTempNotif,"lastTempNotif>>>>>>>>>>>>>>>>>>>>>>>>>>")
      switch (lastTempNotif.type) {
        case "code":
          // console.log('i\'m here', lastTempNotif.type)
          setTarget(lastTempNotif);
          setCodeReceveid(true);
          setDuration(lastTempNotif.duration)
          // setSelectedHours(lastTempNotif.duration.selectedHours);
          // setSelectedMinutes(lastTempNotif.duration.selectedMinutes);
          break;
        // case "temporary room":
        //   setTarget(lastTempNotif);
        //   setRoomRef(lastTempNotif.roomRef);
        //   setDuration(lastTempNotif.duration)
        //   setSetup('done');
        //   break;
      }
      // setTeamChatContacts([]);
      // setTimeout(() => {
      //   // deleteTeamChatNotification(lastTempNotif);
      // }, 50000);
    }
  }, [teamChatNotifications])

  const deleteTeamChatNotification = (notif) => {
    usersCollection.doc(user.id).update({
      teamChatNotification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  useEffect(() => {
    // console.log('teamChatContacts --------->', teamChatContacts)
    if (teamChatContacts.length > 0) {
      // console.log('notifications', teamChatContacts)
      let lastTempNotif = teamChatContacts[0];
      setNotificationcode(lastTempNotif.codeConfirmation)
      // console.log(lastTempNotif)
      switch (lastTempNotif.type) {
        case "temporary room":
          setTarget(lastTempNotif);
          setRoomRef(lastTempNotif.roomRef);
          setDuration(lastTempNotif.duration)
          setSetup('done');
          break;
      }
      // setTeamChatContacts([]);
      // setTimeout(() => {
      //   deleteTeamChatNotification1(lastTempNotif);
      // }, 50000);
    }
  }, [teamChatContacts])

  const deleteTeamChatNotification1 = (notif) => {
    usersCollection.doc(user.id).update({
      teamChatContact: firestore.FieldValue.arrayRemove(notif)
    })
  }

  useEffect(() => {
    if (notifications.length > 0) {
      // console.log('notifications', notifications)
      let lastNotif = notifications[0];
      switch (lastNotif.type) {
        case "invitation":
          setDesiredChat(lastNotif.routeName)
          setTargetContact(lastNotif)
          setModalChatContact(true);
          break;
      }
      deleteNotification(lastNotif);
    }
  }, [notifications])

  const deleteNotification = (notif) => {
    usersCollection.doc(user.id).update({
      notification: firestore.FieldValue.arrayRemove(notif)
    })
  }

  useEffect(() => {
    if (codeReceveid) {
      setModalVisible2(true);
    }
  }, [codeReceveid])

  useEffect(() => {
    if (setup == 'done') {
      navigation.navigate('temporary', { roomRef, remotePeerName: target.name, remotePeerId: target.id })
      //   const userRef = usersCollection.doc(user.id);
      //   userRef.update({
      //     teamChatContact:
      //       firestore.FieldValue.arrayUnion({ contactId: target.id, duration: durationset, startTime: String(firestore.Timestamp.now().toDate()).split(' ')[4] })
      //   })
      //     .then(() => {
      //       navigation.navigate('temporary', { roomRef, remotePeerName: target.name, remotePeerId: target.id })
      //     })
      gotoClearChatNotification();
    }
    if (ClearNotification == true) {
      gotoClearChatNotification();
    }
  }, [setup, ClearNotification])
  const gotoClearChatNotification = () => {
    if (teamChatNotifications.length > 0) {
      let lastTempNotif = teamChatNotifications[0];
      setNotificationcode(lastTempNotif.codeConfirmation)
      setTeamChatContacts([]);
      deleteTeamChatNotification(lastTempNotif);
    }
  }


  const changemodel1 = () => {
    // console.log(selectedHours, "selectedHours");
    // console.log(selectedMinutes, "selectedMinutes");
    if (selectedHours == "undefined" || selectedHours == 0 || selectedMinutes == "undefined" || selectedMinutes.length == 0) {
      alert("Please select time...")
    } else {
      setLoadingGenerate(true);
      setModalVisible(false);
      setTimeout(() => {
        setLoadingGenerate(false);
        setModalVisible1(true);
      }, 300);
    }

  };
  const gotoCancel = () => {
    setLoadingg(true);
    setSelectedHours(0)
    setSelectedMinutes(0)
    setTimeout(() => {
      setLoadingg(false);
      setModalVisible(false);
    }, 200);

  }
  const searchString = (text) => {
    let lowercasedFilter = text.toLowerCase();
    let trucks = userlist
    let filteredData = trucks.length > 0 && trucks.filter(function (item) {
      return item?.name !== undefined
    });
    let filteredDataall = filteredData.length > 0 && filteredData.filter(function (item) {
      return item?.name.includes(text)
    })
    if (!text || text == '') {
      setsearchList([])
    } else {
      setsearchList(filteredDataall)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      {/* <Header gosetting={() => navigation.navigate('changetheme')} 
        creategroup={() => navigation.navigate('creategroupchat')}
        group="1"
      /> */}
      <View style={styles.headerContainer} >
        <Avatar setting={() => navigation.navigate('changetheme')} />
        <View style={styles.searchSection}>
          <Icon style={styles.searchIcon} name="ios-search" size={20} color="#000" />
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={searchString}
            underlineColorAndroid="transparent"
          />
        </View>
        <SvgXml
          xml={navigation.group == '1' ? groupicon : sync}
          onPress={() => { navigation.navigate('creategroupchat') }}
          style={navigation.group == '1' ? styles.icon : styles.icon1}
        />
      </View>
      <ScrollView style={{ width: "100%", height: "100%", flex: 1 }} contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {searchlist?.length > 0 ? (
            <SectionGrid
              itemDimension={150}
              sections={[
                {
                  data: searchlist,
                },
              ]}
              style={styles.gridView}
              renderItem={({ item, section, index }) => (
                <Card
                  number={item.key}
                  name={item.name}
                  picture={item.picture}
                  modal={() => checkTeamChatContacts(item)}
                  status={item.status}

                />
              )}
            />
          ) : (
            <View style={{ flex: 1, width: "100%", height: "100%", alignItems: 'center', justifyContent: 'center', }}>
              <SvgXml
                xml={loading}
              // style={{  alignItems: 'center', justifyContent: 'center', }}
              />
            </View>

          )}
        </View>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible}
        >
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={styles.modal}>
              <Text style={styles.modalheading}>Welcome to Tem. Chat</Text>
              <Text style={styles.modaltext}>
                Select your duration for Tem. chat
              </Text>
              <Text>{selectedHours}h: {selectedMinutes}min</Text>
              <View style={styles.sectionStyle}>
                <TimePicker selectedUnit="hours" selectedValue={selectedHours} onValueChange={setSelectedHours} startValue={0} endValue={12} />
                <TimePicker selectedUnit="minutes" selectedValue={selectedMinutes} onValueChange={setSelectedMinutes} startValue={0} endValue={59} />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => changemodel1()}>
                {/* <Text style={styles.buttontext}>Generate Pin</Text> */}
                {!loadinggenerate ? <Text style={styles.buttontext}>Generate Pin</Text> : <ActivityIndicator size="small" color="white" />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button1}
                onPress={() => gotoCancel()}>
                {!loadingg ? <Text style={styles.buttontext}>Cancel</Text> : <ActivityIndicator size="small" color="white" />}
                {/* <Text style={styles.buttontext}>Cancel</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => changemodel1()}>
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={styles.modal}>
              <Text style={styles.modaltext1}>Create Pin</Text>
              <Text style={styles.modaltext1}>
                Please Create pin and share with {target && target.name} enjoy Messenger
                services on HiChaty
              </Text>
              <OTPInputView
                style={{ width: '90%', height: 50 }}
                pinCount={4}
                autoFocusOnLoad={false}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={(code) => {
                  setCode(code);
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />
              <TouchableOpacity
                style={styles.buttondone}
                onPress={() => shareCode(target.id, code)}>
                {!loadingShare ? <Text style={styles.buttontext}>Share</Text> : <ActivityIndicator size="small" color="white" />}
                {/* <Text style={styles.buttontext}>Share</Text> */}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={modalVisible2}>
          <View style={{ flex: 1, backgroundColor: '#000000aa' }}>
            <View style={styles.modal}>
              <Text style={styles.modaltext2}>Hello</Text>
              <Text style={styles.modaltext2}>{user && user.name}</Text>
              <Text style={styles.modaltext2}>
                Please enter pin as shared by {target && target.name} for Tem. Chat. Enjoy
                Messenger services on HiChaty
              </Text>
              <Text style={styles.codeText}>{notificationcode}</Text>

              <OTPInputView
                style={{ width: '90%', height: 50, marginTop: 10 }}
                pinCount={4}
                autoFocusOnLoad={false}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={(code) => {
                  setSubmitCode(code);
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />

              <TouchableOpacity
                style={styles.buttondone}
                onPress={() => submitCode()}>
                {!loadingSubmit ? <Text style={styles.buttontext}>Submit</Text> : <ActivityIndicator size="small" color="white" />}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default temchat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    width: '100%',
    height: "100%"
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
  modaltext1: {
    textAlign: 'center',
    width: '82%',
    marginBottom: 18,
    fontSize: 16,
    lineHeight: 20,
    // fontWeight: 'bold',
  },
  modaltext2: {
    textAlign: 'center',
    width: '83%',
    // marginBottom: 18,
    fontSize: 15,
    lineHeight: 20,
    // fontWeight: 'bold',
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
  button1: {
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: 'red',
    borderWidth: 2,
    width: '100%',
    marginTop: 15,
    borderRadius: 5,
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
  buttontext: {
    color: 'white',
    fontSize: 16,
  },
  borderStyleBase: {
    width: 40,
    height: 45,
  },

  borderStyleHighLighted: {
    borderColor: 'black',
  },

  underlineStyleBase: {
    width: 40,
    height: 45,
    borderWidth: 1,
    borderColor: 'black',
  },

  underlineStyleHighLighted: {
    borderColor: 'black',
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems:'center',
  },
  icon: {
    marginRight: 11,
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
  codeText: {
    textAlign: 'center',
    width: '90%',
    marginVertical: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
