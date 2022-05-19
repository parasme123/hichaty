import React, { useContext, useState, useEffect } from 'react';
import { Container } from 'native-base';
import { StyleSheet, View, Text, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { Icon } from 'native-base';
import Header from '../components/header';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
import ModalChatContact from '../components/modalChatContact';
import ModalVideoCall from '../components/modalVideoinvitation';
import ModalAudioCall from '../components/modalAudioinvitation';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { SvgXml } from 'react-native-svg';
import { backblue } from '../assets/changethemeicons';
import AsyncStorageHelper from '../lib/AsyncStorageHelper';

const usersCollection = firestore().collection('users');
let fcmUnsubscribe = null;

const settings = (props) => {
  const { navigation } = props;
  const { user, notifications, setModalChatContact, setNotifications,
    setModalVideoInvitation, setModalAudioInvitation,
  } = useContext(AppContext);
  const [target, setTarget] = useState(null);
  const [targetvideo, setTargetvideo] = useState(null);
  const [targetaudio, setTargetaudio] = useState(null);
  const [videoroomref, setVideoroomref] = useState(null);
  const [audioroomref, setAudioroomref] = useState(null);
  const [desiredChat, setDesiredChat] = useState(null);

  /* listen to FCM notifications, and don't forgot to pass the route name as prop 
  to modalchatcontact to check actualRouteName: 
  */
  // if user was in is in contacts screen : 

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

  const signOutUser = async () => {
    showAlertLogout()
  }
  const showAlertLogout = async () => {
    Alert.alert(
      "Hichaty",
      "Are you sure you want to Logout?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => { LogoutMain() },
          style: "cancel",
        },
      ],
      {
        cancelable: true,

      }
    );
  }

  const LogoutMain = async () => {
    try {
      await auth().signOut();
      AsyncStorageHelper.removeItemValue("Contact_Data")
      AsyncStorageHelper.removeItemValue("Contact_Status")
      navigation.reset({
        routes: [{ name: "login" }],
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>

    <Container style={styles.container}>
      <View style={styles.icons}>
        <TouchableOpacity style={{ padding: 8, }} onPress={() => navigation.goBack()}>
          <SvgXml
            xml={backblue}
          />
        </TouchableOpacity>

        <Text style={[styles.inputfield, { marginLeft: 5 }]}>Settings</Text>

      </View>
      {/* <Header comment="Settings" gosetting={() => navigation.navigate('changetheme', { id: user && user.id })} /> */}
      <View style={styles.content}>

        <TouchableOpacity onPress={() => navigation.navigate('accounts')}>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Accounts</Text>
            <Icon name="caret-forward" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <View style={styles.sectionStyle}>
          <Text style={styles.inputfield}>Notifications</Text>
          <Icon name="caret-forward" style={styles.icon} />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('privacy')}>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Privacy & Security</Text>
            <Icon name="caret-forward" style={styles.icon} />
          </View>
        </TouchableOpacity>
        <View style={styles.sectionStyle}>
          <Text style={styles.inputfield}>Invite</Text>
          <Icon name="caret-forward" style={styles.icon} />
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('terms')}>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Terms & Conditions</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Privacy Policy</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('contactus')}>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>Contact us</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('about')}>
          <View style={styles.sectionStyle}>
            <Text style={styles.inputfield}>About</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => { signOutUser() }} style={styles.buttondel}>
        <Text style={styles.buttontext}>logout</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.buttondel}>
        <Text style={styles.buttontext}>Delete Accoount</Text>
      </TouchableOpacity> */}
      { target && <ModalChatContact target={target} navigate={navigation.navigate} desiredChat={desiredChat} actualRouteName={"Group"} />}
      { targetvideo && <ModalVideoCall roomRef={videoroomref} remotePeerName={targetvideo.name} remotePeerId={targetvideo.id} remotePic={targetvideo.picture} navigation={navigation} />}
      { targetaudio && <ModalAudioCall roomRef={audioroomref} remotePeerName={targetaudio.name} remotePeerId={targetaudio.id} remotePic={targetaudio.picture} navigation={navigation} />}
    </Container>
    </SafeAreaView>

  );
};

export default settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  icons: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  buttondel: {
    alignItems: 'center',
    backgroundColor: '#FB5051',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderColor: '#FB5051',
    borderWidth: 2,
    width: '94%',
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 5
  },
  content: {
    width: '94%',
    alignContent: 'center',
    alignSelf: 'center',
  },
  buttontext: {
    color: 'white',
    fontSize: 16,
  },
  inputfield: {
    fontSize: 15,
    flex: 1,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    height: 48,
    borderRadius: 5,
    marginTop: 3,
    paddingHorizontal: 5,
  },
  icon: {
    fontSize: 15,
  },
});
