import React, { useEffect, useState, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Cont from './contact';
import Group from './group';
import hist from './history';
import Temchat from './temchat';
import {
  history,
  activecontact,
  tempchat,
  activegroup,
  group,
  activehistory,
  activetempchat,
} from '../assets/tabicons';
import { user as user_ } from '../assets/loginsignupIcons';
import { SvgXml } from 'react-native-svg';
import { Text, StyleSheet, View, DeviceEventEmitter, Platform } from 'react-native';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
const usersCollection = firestore().collection('users');
const messageCollection = firestore().collection('messages');

const Tab = createBottomTabNavigator();

export default function Bottom() {
  const [loading, setLoading] = useState(false);
  const { user, users, setUser, setUsers, setHistory, setNotifications, setTeamChatNotifications, blockedUsers,
    setTeamChatContacts, setAcceptedRequests, setRooms, setBlockedUsers } = useContext(AppContext);

  useEffect(() => {
    if (user) {
      const usersubscribe = usersCollection.doc(user.id).onSnapshot(documentSnapshot => {
        setUser({ id: documentSnapshot.id, ...documentSnapshot.data() })
      })
      return usersubscribe;
    }
  }, [])


  useEffect(() => {
    let subscription11 = DeviceEventEmitter.addListener("GotoHomePage", (event) => { gotoReloadeetss() })
    const friends = user && user.friends;
    const blockedUsersFromDatabase = user && user.blockedUsers;
    if(user == null){
      return;
    }
    const getContacts = usersCollection.onSnapshot(
      querySnapshot => {
        const users = [];
        const blockedUsers = [];
        querySnapshot.forEach(documentSnapshot => {
          let block = true;
          if (friends.length > 0) {
            block = !friends.includes(documentSnapshot.id);
          }
          if (documentSnapshot.id !== user.id && blockedUsersFromDatabase.length > 0 && blockedUsersFromDatabase.includes(documentSnapshot.id)) {
            blockedUsers.push({ ...documentSnapshot.data(), key: documentSnapshot.id, id: documentSnapshot.id, block: true })
          } else {
            documentSnapshot.id !== user.id ?
              users.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                id: documentSnapshot.id,
                block: block
              })
              :
              null
          }
        })
        setUsers(users);
        setBlockedUsers(blockedUsers);
      }
    )

    return () => {
      getContacts;
      subscription11.remove();

    }
  }, [user]);

  useEffect(() => {
    user ? usersCollection.doc(user.id)
      .onSnapshot(documentSnapshot => {
        setNotifications([...documentSnapshot.data().notification])
        setAcceptedRequests([...documentSnapshot.data().acceptedRequest])
        setRooms([...documentSnapshot.data().groups])
        setTeamChatNotifications([...documentSnapshot.data().teamChatNotification])
        setTeamChatContacts([...documentSnapshot.data().teamChatContact])
        setHistory([...documentSnapshot.data().history])
      })
      :
      null
  }, [user])


  const gotoReloadeetss = () => {
    // console.log("lllllllllllllllllllllllllll");
    const friends = user && user.friends;
    const blockedUsersFromDatabase = user && user.blockedUsers;

    const getContacts = usersCollection.onSnapshot(
      querySnapshot => {
        const users = [];
        const blockedUsers = [];
        querySnapshot.forEach(documentSnapshot => {
          let block = true;
          if (friends.length > 0) {
            block = !friends.includes(documentSnapshot.id);
          }
          if (documentSnapshot.id !== user.id && blockedUsersFromDatabase.length > 0 && blockedUsersFromDatabase.includes(documentSnapshot.id)) {
            // console.log('blockedUser', documentSnapshot.id);
            blockedUsers.push({ ...documentSnapshot.data(), key: documentSnapshot.id, id: documentSnapshot.id, block: true })
          } else {
            // console.log('-----documentSnapshot.id !== user.id: ' + JSON.stringify(documentSnapshot.id !== user.id));
            // console.log('-----documentSnapshot.id ' + JSON.stringify(documentSnapshot.id));
            // console.log('--------------- user.id: ' + JSON.stringify(user.id));

            documentSnapshot.id !== user.id ?
              users.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
                id: documentSnapshot.id,
                block: block
              })
              :
              null
          }
        })
        setUsers(users);
        // console.log(users, ">:user list     hhhh   hhh   hjhh>>>>>>>>>>>>>>>>>>");
        setBlockedUsers(blockedUsers);
        // setLoading(false);
        // console.log('-----userData: ' + JSON.stringify(users));

      }
    )
    // console.log("kkkkk");
    return getContacts;
  }

  // if (loading) {
  //   // console.log(users, "usersusersusersusersusersusersusersusers>>>>>>>>>>>>>>>>>>");
  //   return <View style={{ flex: 1, position: 'absolute', zIndex: 1, alignItems: 'center', justifyContent: 'center', width: "100%", height: "100%" }}>
  //     <ActivityIndicator size="large" color="blue" />
  //   </View>
  // }

  return (
    <Tab.Navigator
      tabBarOptions={{
        style: {
          // flex:1,
          flexDirection:'row',
          // height:Platform.OS=="ios"?0: 57,
          // paddingVertical: 28,
          // paddingHorizontal: 2.2,
          borderTopColor: '#184564',
          borderTopWidth: 0.7,
          // marginBottom: 5
        },
      }}
    >
      <Tab.Screen
        name="Contacts"
        options={{
          tabBarLabel: ({ tintColor, focused }) => (
            <View style={[styles.notSelected, focused ? styles.selected : null]}>
              <SvgXml xml={focused ? activecontact : user_} style={styles.icon} />
              <Text style={focused ? styles.selectedtext : styles.unselectedtext}>Contacts</Text>
            </View>
          ),
        }}
        component={Cont}
      />
      <Tab.Screen
        name="History"
        options={{
          tabBarLabel: ({ tintColor, focused }) => (
            <View style={[styles.notSelected, focused ? styles.selected : null]}>
              <SvgXml xml={focused ? activehistory : history} style={styles.icon} />
              <Text style={focused ? styles.selectedtext : styles.unselectedtext}>History</Text>
            </View>
          ),
        }}
        component={hist}
      />
      <Tab.Screen
        name="Group"
        options={{
          tabBarLabel: ({ tintColor, focused }) => (
            <View style={[styles.notSelected, focused ? styles.selected : null]}>
              <SvgXml xml={focused ? activegroup : group} style={styles.icon} />
              <Text style={focused ? styles.selectedtext : styles.unselectedtext}>Group</Text>
            </View>
          ),
        }}
        component={Group}
      />
      <Tab.Screen
        name="Temchat"
        options={{
          tabBarLabel: ({ tintColor, focused }) => (
            <View style={[styles.notSelected, focused ? styles.selected : null]}>
              <SvgXml xml={focused ? activetempchat : tempchat} style={styles.icon} />
              <Text style={focused ? styles.selectedtext : styles.unselectedtext}>Tem. Chat</Text>
            </View>
          ),
        }}
        component={Temchat}
      />
      {/* <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: ({tintColor, focused}) => (
            <View style={focused ? styles.selected : null}>
              <SvgXml xml={focused ? activecontact : alert} style={styles.icon}/>
              <Text style={focused ? styles.selectedtext : styles.unselectedtext}>Alert</Text>
            </View>
          ),
        }}
        component={Changetheme}
      /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  selected: {
    backgroundColor: '#184564',
  },
  notSelected: {
    flex:1,
    textAlign: 'center',
    width:'100%',
  },
  unselectedtext: {
    color: '#184564',
    textAlign: 'center',
    fontSize: 12,
    paddingBottom: 10
  },
  selectedtext: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 3
  },
  icon: {
    alignSelf: 'center'
  }
});
