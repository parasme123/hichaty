import React, { useState, useEffect, useContext, useRef } from 'react';
import { StatusBar, Text, PermissionsAndroid, Alert, LogBox } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Contacts from 'react-native-contacts';
LogBox.ignoreAllLogs();
import AsyncStorage from '@react-native-async-storage/async-storage';
import Bottom from './src/screens/bottom';
import Login from './src/screens/login';
import Register from './src/screens/register';
import Changetheme from './src/screens/changetheme';
import Settheme from './src/screens/settheme'
import Settings from './src/screens/settings'
import Account from './src/screens/account'
import Privacyset from './src/screens/privacyandsecurity'
import Contactus from './src/screens/contactus';
import BlockedContacts from './src/screens/blockedContacts';
import About from './src/screens/about'
import Terms from './src/screens/termsconditions'
import Temporary from './src/screens/temporarychat';
import Chat from './src/screens/chat';
import Acceptcall from './src/screens/acceptcall';
import Videocall from './src/screens/videocall';
import Voicecall from './src/screens/voicecall';
import Creategroupchat from './src/screens/creategroupchat';
import Addmember from './src/screens/addmember';
import Updatedgroup from './src/screens/updatedgroup';
import Groupchat from './src/screens/groupchat';
import Groupvoicecall from './src/screens/groupvoicecall';
import Acceptgroupcall from './src/screens/acceptgroupcall';
import AcceptVideocall from './src/screens/acceptvideocall';
import AcceptVoicecall from './src/screens/acceptvoicecall';
import AppContext from './src/context/AppContext';
import Loading from './src/screens/loading';
import Permissions from './src/screens/permissions';
import Updateaccount from './src/screens/updateAccount';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import historyItem from './src/screens/historyitem';
import { linking } from './src/lib/linking';
import presenceDetection from './src/lib/presenceDetection';
import log_message from './src/lib/log';
import { saveTokeToDatabase } from './src/lib/helpers';
import Uploadphoto from './src/screens/uploadphoto';
import { Linking } from 'react-native';
import ContactList from './src/screens/ContactList'
import ContactFile from './src/screens/ContactFile'
import PrivacyPolicy from './src/screens/PrivacyPolicy'

import AsyncStorageHelper from './src/lib/AsyncStorageHelper'

const Stack = createStackNavigator();
const usersCollection = firestore().collection('users');
const onlineCollection = firestore().collection('online');
var authUnsubscribe = null;
var fcmUnsubscribe = null;

const App = () => {

  const navigationRef = useRef();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([])
  const [contacts, setContacts] = useState(null)
  const [permissions, setPermissions] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [teamChatNotifications, setTeamChatNotifications] = useState([]);
  const [teamChatContacts, setTeamChatContacts] = useState([]);
  const [modalChatContact, setModalChatContact] = useState(false);
  const [modalVideoInvitation, setModalVideoInvitation] = useState(false);
  const [modalAudioInvitation, setModalAudioInvitation] = useState(false);
  const [colour, setColour] = useState(['#3C95CA', '#54A6E2', '#70B9FD']);
  const [uri, setUri] = useState("gs://enjoeemsg-a1169.appspot.com/Profile-Images/");
  const [myUnreadMessages, setMyUnreadMessages] = useState({});
  const [initialRouteName, setInitialRouteName] = useState(null);
  const [initialParams, setInitialParams] = useState({});
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [comeFromNotification, setComeFromNotification] = useState(null)

  /*
   This variable serves the purpose of redirecting the user to contatcs screen
    when accpeting a new invitation (chat/video/call);
  */
  const [redirectToContacts, setRedirectToContacts] = useState(false);


  /* callback of auth state change listener:
  */
  const onAuthStateChanged = async (user) => {
    if (user) {
      await usersCollection
        .where('mobile', '==', user.phoneNumber)
        .limit(1)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            setUser({ id: documentSnapshot.id, uid: auth().currentUser.uid, ...documentSnapshot.data() })
          })
        })
        .catch((error) => {
          log_message("Error while updating state auth", error)
        })
    }
    setTimeout(() => {
      if (initializing) setInitializing(false);  // setInitialing to false, to switc off splach screen
    }, 2000);
  }
  useEffect(() => {
    getContacts();
  }, [])
  const getContacts = async () => {
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
        setContacts(contacts)
        AsyncStorageHelper.setData("Contact_Data", contacts)

      })
  }

  /* set listener for changes in auth :
  */
  useEffect(() => {
    authUnsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return authUnsubscribe;
  }, [])

  /* set intinial route for for normal flow of navigation, 
  */
  useEffect(() => {
    // console.log(users, '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<users>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

    setInitialRouteName(user ? (permissions ? "bottom" : "bottom") : "login");
  }, [user, permissions])


  /* this part :
      - set a listener for presence detection via presenceDetection method.
      - set a listener for received notifications via FCM.
  */

  useEffect(() => {
    if (user) {
      presenceDetection(user);

      let jsonValue;
      AsyncStorage.getItem('@unreadMessages')
        .then(res => {
          jsonValue = !JSON.parse(res) ? {} : JSON.parse(res);
          setMyUnreadMessages(jsonValue);
        });

      messaging().getToken().then(token => { return saveTokeToDatabase(user.id, token) });
      messaging().onTokenRefresh(token => { saveTokeToDatabase(user.id, token) })

      fcmUnsubscribe = messaging().onMessage(async (remoteMessage) => {
        log_message("A new Message arrived", remoteMessage.data);
        let type = remoteMessage.data.msgType;
        switch (type) {
          case "chat":
            let senderId = remoteMessage.data.senderId;
            jsonValue[senderId] = !jsonValue[senderId] ? 1 : ++jsonValue[senderId];
            await AsyncStorage.setItem("@unreadMessages", JSON.stringify(jsonValue))
            setMyUnreadMessages(jsonValue);
            break;
          case "acceptvideocall":
            let videoData = remoteMessage.data;
            let videotype = "videocall invitation";
            let videoid = videoData.senderId;
            let videoname = videoData.senderName;
            let videopicture = videoData.senderPicture;
            setNotifications([...notifications, { type: videotype, id: videoid, name: videoname, picture: videopicture, roomRef: videoData.roomRef }])
            break;
          case "acceptvoicecall":
            let audioData = remoteMessage.data;
            let audiotype = "voicecall invitation";
            let audioid = audioData.senderId;
            let audioname = audioData.senderName;
            let audiopicture = audioData.senderPicture;
            setNotifications([...notifications, { type: audiotype, id: audioid, name: audioname, picture: audiopicture, roomRef: audioData.roomRef }])
            break;
        }
      })

      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log("a notification caused app to openfrom bachground state", remoteMessage.data)
        processNotifation("background state", remoteMessage, true);
      })

      messaging()
        .getInitialNotification()
        .then(remoteMessage => {
          if (remoteMessage) {
            console.log("a notification caused app from quit state", remoteMessage.data)
            processNotifation("quit state", remoteMessage, true);
          }
        })

      return fcmUnsubscribe;
    }
  }, [user])

  const forwardToChat = async (type, route, params) => {
    switch (type) {
      case "background state":
        navigationRef.current?.navigate(route, params);
        break;
      case "quit state":
        setInitialRouteName(route);
        setInitialParams(params);
        break;
    }
    setInitializing(false);
  }

  const processNotifation = (state, remoteMessage, fromBackground) => {
    setComeFromNotification({ state, remoteMessage, fromBackground });
    if (remoteMessage) {
      if (fromBackground && remoteMessage.data.msgType) {
        switch (remoteMessage.data.msgType) {
          case "chat":
          case "temporary":
            forwardToChat(state, remoteMessage.data.msgType, {
              roomRef: remoteMessage.data.roomRef,
              remotePeerName: remoteMessage.data.senderName,
              remotePeerId: remoteMessage.data.senderId,
              msgType: remoteMessage.data.msgType
            })
            return;
          case "Temchat":
            forwardToChat(state, "bottom", {
              initialParams: remoteMessage.data.msgType
            })
            return;
        }
      }
    }
  }

  /* Check permissions for Camera anD Microphone
  */
  useEffect(() => {
    (async () => {
      const getPermissions = async () => {
        const Camera = await PermissionsAndroid.check("android.permission.CAMERA");
        const audio = await PermissionsAndroid.check("android.permission.RECORD_AUDIO");
        return Boolean(Camera && audio)
      }
      setPermissions(await getPermissions())
    }
    )()
  }, [permissions])

  /* Simple screen while loading app
  */
  if (initializing) {
    return (

      <Loading />
    )
  }

  /* App ready ---> let's go !
  */
  return (
    <AppContext.Provider
      value={{
        comeFromNotification, user, permissions, users, notifications, modalVideoInvitation, teamChatNotifications,
        teamChatContacts, acceptedRequests, modalChatContact, uri, modalAudioInvitation, rooms,
        colour, redirectToContacts, blockedUsers, history, myUnreadMessages, contacts,
        setRedirectToContacts, setMyUnreadMessages, setColour, setHistory, setBlockedUsers,
        setModalAudioInvitation, setModalVideoInvitation, setModalChatContact, setUser, setUsers,
        setNotifications, setTeamChatNotifications, setTeamChatContacts, setAcceptedRequests, setRooms, setContacts
      }}>
      <NavigationContainer
        linking={
          {
            prefixes: ['hichaty://'],
            async getInitialURL() {
              // Check if app was opened from a deep link
              const url = await Linking.getInitialURL();
              if (url != null) {
                log_message("App opened via a deep link", "Video or audio Call");
                return url;
              }
            }
          }
        }
        ref={navigationRef} >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
          initialRouteName={initialRouteName}
        >
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="permissions" component={Permissions} />
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="changetheme" component={Changetheme} />
          <Stack.Screen name="settheme" component={Settheme} />
          <Stack.Screen name="settings" component={Settings} />
          <Stack.Screen name="accounts" component={Account} />
          <Stack.Screen name="privacy" component={Privacyset} />
          <Stack.Screen name="contactus" component={Contactus} />
          <Stack.Screen name="terms" component={Terms} />
          <Stack.Screen name="about" component={About} />
          <Stack.Screen name="temporary" component={Temporary} initialParams={initialParams} />
          <Stack.Screen name="chat" component={Chat} initialParams={initialParams} />
          <Stack.Screen name="voicecall" component={Voicecall} />
          <Stack.Screen name="videocall" component={Videocall} />
          <Stack.Screen name="historyitem" component={historyItem} />
          {/* <Stack.Screen name="acceptvideocall" component={Acceptvideocall} /> */}
          <Stack.Screen name="acceptcall" component={Acceptcall} />
          <Stack.Screen name="creategroupchat" component={Creategroupchat} />
          <Stack.Screen name="updatedgroup" component={Updatedgroup} />
          <Stack.Screen name="addmember" component={Addmember} />
          <Stack.Screen name="groupchat" component={Groupchat} />
          <Stack.Screen name="groupcall" component={Groupvoicecall} />
          <Stack.Screen name="acceptgroupcall" component={Acceptgroupcall} />
          <Stack.Screen name="acceptvideocall" component={AcceptVideocall} initialParams={initialParams} />
          <Stack.Screen name="acceptvoicecall" component={AcceptVoicecall} initialParams={initialParams} />
          <Stack.Screen name="bottom" component={Bottom} initialParams={initialParams} />
          <Stack.Screen name="updateaccount" component={Updateaccount} />
          <Stack.Screen name="uploadphoto" component={Uploadphoto} />
          <Stack.Screen name="blockedcontacts" component={BlockedContacts} />
          <Stack.Screen name="ContactList" component={ContactList} />
          <Stack.Screen name="ContactFile" component={ContactFile} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
  );
}
export default App;

