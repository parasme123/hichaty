import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  TextInput,
} from 'react-native';
import Header from '../components/headergroupchat';
import Card from '../components/creategroupchatcard';
import { SvgXml } from 'react-native-svg';
import { addimage } from '../assets/chaticons';
import { SectionGrid } from 'react-native-super-grid';
import AppContext from '../context/AppContext';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
const usersCollection = firestore().collection('users');

const Images = [
  { image: require('../assets/user2.jpg') },
  { image: require('../assets/bg.jpg') },
];

const Addmember = (props) => {
  const { navigation } = props;
  const { roomRef, groupParticipants } = props.route.params;
  const { user, users } = useContext(AppContext);
  const [groupMember, setGroupMember] = useState([])
  const [select, setSelect] = useState({});
  const [selectedItems, setSelectedItems] = useState([])
  const [doneProcess, setDoneProcess] = useState(false);

  useEffect(() => {
    let array = [];
    if (select !== {}) {
      Object.entries(select).forEach(([key, value]) => {
        value ? array.push(key) : null
      })
    }
    setSelectedItems(array)
  }, [select])

  useEffect(() => {
    const groupMemberfilter = users.filter(data => !groupParticipants.includes(data.id))
    setGroupMember(groupMemberfilter);
  }, [])

  const onPressDone = async () => {
    setDoneProcess(true)
    if (selectedItems.length == 0) {
      alert("Please select users.")
      setDoneProcess(false)
      return false
    } if (selectedItems.length > 0) {
      selectedItems.forEach(async element => {
        await usersCollection.doc(element).update({
          teamChatNotification: firestore.FieldValue.arrayUnion({ type: "groupChat", id: user.id, name: user.name, roomRef: `/rooms/${roomRef}` })
        })

        firebase.functions().httpsCallable('onNewGroupInvitation')({
          senderId: user.id,
          senderName: user.name,
          receiverId: element,
          desiredChat: "GroupChat",
        })

      });
      setDoneProcess(false)
      navigation.navigate('Group')
    }
  }

  return (
    <View style={styles.container}>
      <Header
        comment="Add Member"
        back={() => navigation.goBack()}
        done={() => onPressDone()}
        doneProcess={doneProcess}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionGrid
            itemDimension={150}
            sections={[
              {
                data: groupMember,
              },
            ]}
            style={styles.gridView}
            renderItem={({ item, section, index }) => (
              <Card
                number={item.key}
                name={item.name}
                select={select}
                setSelect={setSelect}
                image={Images[0].image}
                avatar={item.avatar}
                block={item.key}
                video={() => navigation.navigate('videocall')}
                phone={() => navigation.navigate('voicecall')}
                chat={() => navigation.navigate('chat')}
                blockuser={() => navigation.navigate('settheme')}
              />
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Addmember;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  content: {
    width: '100%',
  },
  setcard: {
    display: 'flex',
    marginVertical: 1,
  },
  sethead: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '94%',
    paddingBottom: 5,
  },
  input: {
    paddingLeft: 5,
    width: 170,
    backgroundColor: '#fff',
    color: '#424242',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
  },
  input1: {
    width: 80,
    backgroundColor: '#fff',
    color: '#424242',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    height: 40,
    textAlign: 'center',
    paddingTop: 10,
  },
  icon: {
    marginLeft: 15,
    // padding: 20,
    // borderWidth: 1,
    // borderRadius: 20,
  },
});
